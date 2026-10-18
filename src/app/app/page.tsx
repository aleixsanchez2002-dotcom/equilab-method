import { getI18n } from "@/lib/i18n/server";
import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProgressChart } from "@/components/app/progress-chart";
import { RoutineLog, type DiaCliente, type SemanaCliente, } from "@/components/app/routine-log";
import { SessionHistory } from "@/components/app/session-history";
import { PlanPicker } from "@/components/app/plan-picker";
import { WeightTracker } from "@/components/app/weight-tracker";
import { historialDeSesiones, pesosSemanales, seriesDeProgreso, type SerieRegistrada, } from "@/lib/progreso";
import { lunesDeLaSemana, semanaDelBloque } from "@/lib/semana";
import { slug } from "@/lib/slug";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Overline } from "@/components/ui/overline";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import { tieneAccesoVigente, type Plan, type Profile, type Subscription, } from "@/lib/supabase/types";
import { cerrarSesion } from "./actions";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Tu entrenamiento — Equilab Method")
    };
}
type Serie = {
    peso: string;
    reps: string;
    rir: string;
    descanso: string;
};
type EjercicioDia = {
    id: string;
    position: number;
    exercise_id: string;
    technique_note: string | null;
    series: Serie[];
    exercises: {
        name: string;
        category: string;
        video_url: string | null;
    } | null;
};
/** Foto por convención: public/media/ejercicios/<slug-del-nombre>.jpg|png|webp */
function fotoDeEjercicio(nombre: string): string | null {
    const base = slug(nombre);
    for (const ext of ["jpg", "jpeg", "png", "webp"]) {
        const rel = `/media/ejercicios/${base}.${ext}`;
        if (fs.existsSync(path.join(process.cwd(), "public", rel)))
            return rel;
    }
    return null;
}
type DiaRutina = {
    id: string;
    week: number;
    position: number;
    focus: string;
    duration_note: string | null;
    routine_exercises: EjercicioDia[];
};
type Rutina = {
    id: string;
    title: string;
    weeks: number | null;
    type: "semi" | "personalizada";
    explanation: string | null;
    started_on: string | null;
};
function diasRestantes(sub: Subscription): number | null {
    if (!sub.current_period_end)
        return null;
    const ms = new Date(sub.current_period_end).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 86400000));
}
export default async function AppPage({ searchParams, }: {
    searchParams: Promise<{
        cuestionario?: string;
        contrasena?: string;
    }>;
}) {
    const { t, home } = await getI18n();
    if (!supabaseConfigurado) {
        return (<main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-6 px-6 text-center">
        <Logo size="md"/>
        <p className="text-[15px] leading-relaxed text-sand-500">{t("El backend a\u00FAn no est\u00E1 conectado. Sigue los pasos de")}{" "}
          <code className="rounded-xs border border-edge bg-ink-900 px-2 py-0.5 text-[13px] text-cognac-400">
            supabase/README.md
          </code>{" "}{t("y vuelve a cargar esta p\u00E1gina.")}</p>
      </main>);
    }
    const supabase = await createSupabaseServer();
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user)
        redirect("/acceso");
    const [{ data: perfil }, { data: suscripcion }, { data: planes }, { data: respuesta }] = await Promise.all([
        supabase
            .from("profiles")
            .select("id, full_name, role")
            .eq("id", user.id)
            .single<Profile>(),
        supabase
            .from("subscriptions")
            .select("plan_code, status, current_period_end, cancel_at_period_end")
            .eq("user_id", user.id)
            .maybeSingle<Subscription>(),
        supabase
            .from("plans")
            .select("code, name, price_cents")
            .order("price_cents")
            .returns<Plan[]>(),
        supabase
            .from("questionnaire_responses")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle<{
            id: string;
        }>(),
    ]);
    const { cuestionario, contrasena } = await searchParams;
    // Los precios vienen de la tabla `plans` para no duplicarlos en la interfaz
    const preciosCents = Object.fromEntries((planes ?? []).map((p) => [p.code, p.price_cents]));
    const nombre = perfil?.full_name?.split(" ")[0] || "jinete";
    const esEquipo = perfil?.role === "coach" || perfil?.role === "admin";
    const accesoVigente = tieneAccesoVigente(suscripcion ?? null);
    // La rutina publicada más reciente (la RLS ya exige acceso vigente,
    // pero comprobamos también aquí para elegir qué pantalla enseñar).
    let rutina: Rutina | null = null;
    let dias: DiaRutina[] = [];
    if (accesoVigente) {
        const { data: r } = await supabase
            .from("routines")
            .select("id, title, weeks, type, explanation, started_on")
            .eq("user_id", user.id)
            .eq("status", "publicada")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle<Rutina>();
        rutina = r ?? null;
        if (rutina) {
            const { data: d } = await supabase
                .from("routine_days")
                .select("id, week, position, focus, duration_note, routine_exercises(id, position, exercise_id, technique_note, series, exercises(name, category, video_url))")
                .eq("routine_id", rutina.id)
                .returns<DiaRutina[]>();
            dias = (d ?? [])
                .slice()
                .sort((a, b) => a.week - b.week || a.position - b.position)
                .map((dia) => ({
                ...dia,
                routine_exercises: dia.routine_exercises
                    .slice()
                    .sort((a, b) => a.position - b.position),
            }));
        }
    }
    // Última sesión registrada de cada ejercicio, para el «última: 100 × 3».
    const ultimaPorEjercicio = new Map<string, SerieRegistrada[]>();
    if (rutina && dias.length > 0) {
        const ids = dias.flatMap((d) => d.routine_exercises.map((e) => e.id));
        const { data: logs } = await supabase
            .from("workout_logs")
            .select("routine_exercise_id, series, performed_on")
            .eq("user_id", user.id)
            .in("routine_exercise_id", ids)
            .order("performed_on", { ascending: false })
            .returns<{
            routine_exercise_id: string;
            series: SerieRegistrada[];
        }[]>();
        for (const log of logs ?? []) {
            if (!ultimaPorEjercicio.has(log.routine_exercise_id)) {
                ultimaPorEjercicio.set(log.routine_exercise_id, log.series);
            }
        }
    }
    // Progresión de fuerza (módulo compartido con el panel del equipo)
    const seriesProgreso = accesoVigente
        ? await seriesDeProgreso(supabase, user.id)
        : [];
    // Peso corporal semanal (se pide cada lunes)
    const lunesActual = lunesDeLaSemana(new Date());
    const puntosPeso = accesoVigente ? await pesosSemanales(supabase, user.id) : [];
    const pesoEstaSemana = puntosPeso.find((p) => p.fecha === lunesActual)?.kg ?? null;
    // Historial de sesiones anteriores (solo lectura, módulo compartido)
    const sesionesHistorial = accesoVigente
        ? await historialDeSesiones(supabase, user.id)
        : [];
    // Forma que consume el componente de registro, agrupada por semanas.
    // Se descartan las series prescritas vacías (rutinas antiguas) y los
    // ejercicios que se quedan sin ninguna.
    const comoDiaCliente = (dia: DiaRutina): DiaCliente => ({
        id: dia.id,
        position: dia.position,
        focus: dia.focus,
        duration_note: dia.duration_note,
        ejercicios: dia.routine_exercises
            .map((ej) => ({
            id: ej.id,
            exercise_id: ej.exercise_id,
            nombre: ej.exercises?.name ?? "Ejercicio",
            nota: ej.technique_note,
            foto: fotoDeEjercicio(ej.exercises?.name ?? ""),
            video: ej.exercises?.video_url ?? null,
            series: ej.series
                .map((s) => ({ ...s, rir: s.rir ?? "" }))
                .filter((s) => (s.peso + s.reps + s.rir + s.descanso).trim() !== ""),
            ultima: ultimaPorEjercicio
                .get(ej.id)
                ?.map((s) => ({ ...s, rir: s.rir ?? "" })) ?? null,
        }))
            .filter((ej) => ej.series.length > 0),
    });
    const porSemana = new Map<number, DiaRutina[]>();
    for (const dia of dias) {
        const lista = porSemana.get(dia.week) ?? [];
        lista.push(dia);
        porSemana.set(dia.week, lista);
    }
    const semanasCliente: SemanaCliente[] = [...porSemana.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([week, diasDeLaSemana]) => ({
        week,
        dias: diasDeLaSemana.map(comoDiaCliente),
    }))
        .filter((s) => s.dias.length > 0);
    const semanaActual = semanaDelBloque(rutina?.started_on ?? null, semanasCliente.length);
    return (<div className="min-h-dvh bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-edge bg-ink-950/95">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href={home} aria-label={t("Equilab Method \u2014 ir a la portada")} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400">
            <Logo size="sm"/>
          </Link>
          <div className="flex items-center gap-3">
            {esEquipo && (<Link href="/admin">
                <Button variant="outline" size="sm" tabIndex={-1}>{t("Panel del equipo")}</Button>
              </Link>)}
            <Link href="/app/cuenta">
              <Button variant="ghost" size="sm" tabIndex={-1}>{t("Cuenta")}</Button>
            </Link>
            <form action={cerrarSesion}>
              <Button variant="ghost" size="sm" type="submit">{t("Salir")}</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Overline accent>{t("Tu entrenamiento")}</Overline>
        <h1 className="mt-4 font-display text-4xl font-medium text-sand-50">{t("Hola, ")}{nombre}.
        </h1>

        {/* ————— Sin acceso: elegir plan ————— */}
        {!accesoVigente && (<PlanPicker planActual={suscripcion?.plan_code ?? null} preciosCents={preciosCents} titulo={suscripcion
                ? t("Reactiva tu plan y sigue donde lo dejaste.") : t("Elige cu\u00E1nto equipo quieres detr\u00E1s.")} entradilla={suscripcion
                ? t("Tu rutina, tus registros y tu progreso siguen guardados. Al reactivar, lo recuperas todo.") : t("Los dos planes entrenan el mismo m\u00E9todo. La diferencia est\u00E1 en cu\u00E1nto nos metemos nosotros.")}/>)}

        {contrasena === "cambiada" && (<p role="status" className="mt-6 max-w-xl rounded-xs border border-cognac-500/40 bg-ink-800 px-4 py-3 text-[13px] leading-relaxed text-sand-300">{t("Contrase\u00F1a cambiada. Ya puedes usarla la pr\u00F3xima vez que entres.")}</p>)}

        {cuestionario === "gracias" && (<p role="status" className="mt-6 max-w-xl rounded-xs border border-cognac-500/40 bg-ink-800 px-4 py-3 text-[13px] leading-relaxed text-sand-300">{t("Cuestionario recibido. El equipo prepara tu rutina y la ver\u00E1s aqu\u00ED en cuanto est\u00E9 publicada.")}</p>)}

        {/* ————— Con acceso pero sin cuestionario: el primer paso ————— */}
        {accesoVigente && !rutina && !respuesta && (<Card elevated className="mt-8 max-w-xl p-8">
            <Overline accent>{t("Primer paso")}</Overline>
            <p className="mt-3 font-display text-2xl text-sand-50">{t("Cu\u00E9ntanos c\u00F3mo montas")}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-sand-500">{t("Cinco minutos de cuestionario: tu disciplina, tu material, tus molestias y qu\u00E9 te corrigen encima del caballo. Con eso construimos tu rutina.")}</p>
            <div className="mt-6">
              <Link href="/app/cuestionario">
                <Button size="lg" tabIndex={-1}>{t("Empezar cuestionario")}</Button>
              </Link>
            </div>
          </Card>)}

        {/* ————— Cuestionario enviado, rutina en revisión ————— */}
        {accesoVigente && !rutina && respuesta && (<Card elevated className="mt-8 max-w-xl p-8">
            <Overline accent>{t("Tu rutina")}</Overline>
            <p className="mt-3 font-display text-2xl text-sand-50">{t("El equipo est\u00E1 preparando tu rutina")}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-sand-500">{t("Tenemos tu cuestionario. En cuanto tu rutina est\u00E9 revisada y publicada aparecer\u00E1 aqu\u00ED, d\u00EDa a d\u00EDa y serie a serie.")}</p>
          </Card>)}

        {/* ————— Acceso a la información del bloque (vive en su página) ————— */}
        {rutina?.explanation && (<Link href="/app/bloque" className="group mt-10 flex max-w-2xl items-center justify-between gap-6 rounded-sm border border-edge bg-ink-900 px-6 py-5 transition-colors duration-200 hover:border-cognac-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400">
            <span className="min-w-0">
              <Overline accent>{t("Informaci\u00F3n de este bloque")}</Overline>
              <span className="mt-2 block font-display text-[17px] text-sand-100">{t("Por qu\u00E9 entrenas as\u00ED")}</span>
            </span>
            <span aria-hidden="true" className="shrink-0 font-display text-xl text-sand-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-cognac-400">
              →
            </span>
          </Link>)}

        {/* ————— La rutina, día a día y serie a serie ————— */}
        {rutina && (<section className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <Overline accent>{t("Tu rutina")}</Overline>
                <h2 className="mt-2 font-display text-3xl font-medium text-sand-50">
                  {t(rutina.title)}
                </h2>
              </div>
              <span className="text-[13px] text-sand-600">
                {semanasCliente[0]?.dias.length ?? 0}{t(" d\u00EDas / semana \u00B7")}{" "}
                {semanasCliente.length === 1
                ? "1 semana"
                : t("semana {0} de {1}", { "0": semanaActual, "1": semanasCliente.length })}
              </span>
            </div>

            <RoutineLog semanas={semanasCliente} semanaActual={semanaActual}/>
          </section>)}

        {/* ————— Tu progreso: fuerza + peso corporal + historial ————— */}
        {accesoVigente && (<section className="mt-12">
            <Overline accent>{t("Tu progreso")}</Overline>

            <h2 className="mt-2 font-display text-3xl font-medium text-sand-50">{t("Tus cargas, sesi\u00F3n a sesi\u00F3n")}</h2>
            <p className="mt-2 text-[13px] text-sand-600">{t("Seg\u00FAn tus sesiones registradas.")}</p>
            <ProgressChart series={seriesProgreso}/>

            <h2 className="mt-12 font-display text-3xl font-medium text-sand-50">{t("Tu peso corporal")}</h2>
            <p className="mt-2 text-[13px] text-sand-600">{t("Un dato a la semana, cada lunes.")}</p>
            <WeightTracker puntos={puntosPeso} pesoEstaSemana={pesoEstaSemana}/>

            {sesionesHistorial.length > 0 && (<>
                <h3 className="mt-12 font-display text-xl font-medium text-sand-50">{t("Sesiones anteriores")}</h3>
                <SessionHistory sesiones={sesionesHistorial}/>
              </>)}
          </section>)}

        {/* ————— Estado de suscripción (resumen) ————— */}
        {suscripcion && accesoVigente && (<p className="mt-10 text-[12.5px] text-sand-600">
            Plan {suscripcion.plan_code === "premium" ? "Premium" : t("B\u00E1sico")} ·{" "}
            {diasRestantes(suscripcion)}{t(" d\u00EDas de acceso restantes.")}</p>)}
      </main>
    </div>);
}
