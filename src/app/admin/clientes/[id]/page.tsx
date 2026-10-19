import { QuestionnaireAnswers } from "@/components/admin/questionnaire-answers";
import type { PreguntaCuestionario } from "@/lib/questionnaire";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChartSvg, ProgressChart } from "@/components/app/progress-chart";
import { SessionHistory } from "@/components/app/session-history";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Overline } from "@/components/ui/overline";
import {
  historialDeSesiones,
  pesosSemanales,
  seriesDeProgreso,
} from "@/lib/progreso";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  tieneAccesoVigente,
  type Profile,
  type Subscription,
} from "@/lib/supabase/types";
import { archivarRutina, concederAcceso, publicarRutina, retirarAcceso } from "../../actions";

export const metadata: Metadata = {
  title: "Ficha de cliente — Equilab Method",
};

type ClienteRow = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
};
type RutinaRow = {
  id: string;
  title: string;
  status: "borrador" | "publicada" | "archivada";
  type: "semi" | "personalizada";
  weeks: number | null;
  coach_id: string | null;
  created_at: string;
};
type RespuestaRow = {
  answers: Record<string, string | string[]>;
  created_at: string;
  questionnaire_templates: { questions: PreguntaCuestionario[] } | null;
};

const formatoFecha = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function diasRestantes(sub: Subscription): number | null {
  if (!sub.current_period_end) return null;
  const ms = new Date(sub.current_period_end).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export default async function FichaClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!supabaseConfigurado) redirect("/app");

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/acceso");

  const { data: perfil } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single<Profile>();
  if (perfil?.role !== "coach" && perfil?.role !== "admin") redirect("/app");

  const { id } = await params;

  const [{ data: cliente }, { data: sub }, { data: rutinas }, { data: respuesta }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, created_at")
        .eq("id", id)
        .maybeSingle<ClienteRow>(),
      supabase
        .from("subscriptions")
        .select("plan_code, status, current_period_end, cancel_at_period_end")
        .eq("user_id", id)
        .maybeSingle<Subscription>(),
      supabase
        .from("routines")
        .select("id, title, status, type, weeks, coach_id, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .returns<RutinaRow[]>(),
      supabase
        .from("questionnaire_responses")
        .select("answers, created_at, questionnaire_templates(questions)")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<RespuestaRow>(),
    ]);

  if (!cliente) redirect("/admin");

  const [seriesProgreso, sesiones, puntosPeso] = await Promise.all([
    seriesDeProgreso(supabase, id),
    historialDeSesiones(supabase, id),
    pesosSemanales(supabase, id),
  ]);

  const acceso = tieneAccesoVigente(sub ?? null);
  const nombreCorto = cliente.full_name.split(" ")[0] || "cliente";
  const ultimoPeso = puntosPeso[puntosPeso.length - 1];


  return (
    <div className="min-h-dvh bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-edge bg-ink-950/95">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo size="sm" />
          <Link href="/admin">
            <Button variant="ghost" size="sm" tabIndex={-1}>
              ← Volver al panel
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Overline accent>Ficha de cliente</Overline>
        <h1 className="mt-4 font-display text-4xl font-medium text-sand-50">
          {cliente.full_name || "Sin nombre"}
        </h1>
        <p className="mt-2 text-[13px] text-sand-600">
          {cliente.email} · alta el {formatoFecha.format(new Date(cliente.created_at))}
        </p>

        {/* ————— Acceso y plan ————— */}
        <Card className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 p-6">
          <div>
            <Overline>Acceso</Overline>
            <p className="mt-2 flex items-baseline gap-3">
              {acceso && sub ? (
                <>
                  <span className="rounded-xs bg-cognac-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-950">
                    {sub.plan_code}
                  </span>
                  <span className="text-[14px] text-sand-300">
                    {diasRestantes(sub)} días restantes
                  </span>
                </>
              ) : (
                <span className="rounded-xs border border-edge-strong px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sand-500">
                  Sin acceso
                </span>
              )}
            </p>
          </div>

          <div className="ml-auto flex flex-wrap gap-2">
            {acceso ? (
              <form action={retirarAcceso}>
                <input type="hidden" name="userId" value={cliente.id} />
                <Button variant="ghost" size="sm" type="submit">
                  Retirar acceso
                </Button>
              </form>
            ) : (
              <>
                <form action={concederAcceso}>
                  <input type="hidden" name="userId" value={cliente.id} />
                  <input type="hidden" name="planCode" value="basico" />
                  <Button variant="outline" size="sm" type="submit">
                    Acceso Básico 30 d
                  </Button>
                </form>
                <form action={concederAcceso}>
                  <input type="hidden" name="userId" value={cliente.id} />
                  <input type="hidden" name="planCode" value="premium" />
                  <Button variant="outline" size="sm" type="submit">
                    Acceso Premium 30 d
                  </Button>
                </form>
              </>
            )}
            <Link href={`/admin/rutinas/nueva?cliente=${cliente.id}`}>
              <Button size="sm" tabIndex={-1}>
                Nueva rutina
              </Button>
            </Link>
          </div>
        </Card>

        {/* ————— Sus rutinas ————— */}
        <section className="mt-10">
          <Overline>Rutinas</Overline>
          {(rutinas ?? []).length === 0 ? (
            <p className="mt-4 text-[14px] text-sand-500">
              Todavía no tiene ninguna rutina.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-sm border border-edge">
              {(rutinas ?? []).map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-edge bg-ink-900 px-5 py-4 last:border-b-0"
                >
                  <span className="font-display italic text-cognac-400">
                    {r.type === "personalizada" ? "P" : "S"}
                  </span>
                  <Link
                    href={`/admin/rutinas/${r.id}`}
                    className="text-[14px] text-sand-300 underline-offset-2 hover:text-sand-100 hover:underline"
                  >
                    {r.title}
                  </Link>
                  {r.coach_id === null && r.status === "borrador" && (
                    <span className="rounded-xs border border-cognac-500/50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-cognac-400">
                      Propuesta del motor
                    </span>
                  )}
                  <span
                    className={
                      r.status === "publicada"
                        ? "rounded-xs bg-cognac-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink-950"
                        : "rounded-xs border border-edge-strong px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-sand-500"
                    }
                  >
                    {r.status}
                  </span>
                  <span className="text-[12px] text-sand-600">
                    {formatoFecha.format(new Date(r.created_at))}
                  </span>

                  <span className="ml-auto flex flex-wrap gap-2">
                    <Link href={`/admin/rutinas/${r.id}`}>
                      <Button variant="outline" size="sm" tabIndex={-1}>
                        Modificar
                      </Button>
                    </Link>
                    {r.status === "borrador" && (
                      <form action={publicarRutina}>
                        <input type="hidden" name="rutinaId" value={r.id} />
                        <Button variant="outline" size="sm" type="submit">
                          Publicar
                        </Button>
                      </form>
                    )}
                    {r.status !== "archivada" && (
                      <form action={archivarRutina}>
                        <input type="hidden" name="rutinaId" value={r.id} />
                        <Button variant="ghost" size="sm" type="submit">
                          Archivar
                        </Button>
                      </form>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ————— Su progreso ————— */}
        <section className="mt-12">
          <Overline accent>Progreso de {nombreCorto}</Overline>
          <h2 className="mt-2 font-display text-2xl font-medium text-sand-50">
            Cargas, sesión a sesión
          </h2>
          <ProgressChart series={seriesProgreso} />

          <h2 className="mt-10 font-display text-2xl font-medium text-sand-50">
            Peso corporal
          </h2>
          {puntosPeso.length > 0 ? (
            <Card className="mt-4 max-w-2xl p-6 sm:p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-light text-sand-50 tabular-nums">
                  {ultimoPeso.kg.toLocaleString("es-ES", {
                    maximumFractionDigits: 1,
                  })}{" "}
                  kg
                </span>
                <span className="text-[12px] uppercase tracking-[0.14em] text-sand-600">
                  último registro
                </span>
              </div>
              <ChartSvg puntos={puntosPeso} />
              <p className="mt-3 text-[12px] text-sand-600">
                {puntosPeso.length} registro{puntosPeso.length === 1 ? "" : "s"} semanal
                {puntosPeso.length === 1 ? "" : "es"}.
              </p>
            </Card>
          ) : (
            <p className="mt-4 text-[14px] text-sand-500">
              Aún no ha registrado su peso.
            </p>
          )}

          <h2 className="mt-10 font-display text-2xl font-medium text-sand-50">
            Sesiones registradas
          </h2>
          {sesiones.length > 0 ? (
            <SessionHistory sesiones={sesiones} />
          ) : (
            <p className="mt-4 text-[14px] text-sand-500">
              Aún no ha registrado ninguna sesión.
            </p>
          )}
        </section>

        {/* ————— Su cuestionario ————— */}
        <section className="mt-12">
          <Overline>Cuestionario inicial</Overline>
          {respuesta ? (
            <Card className="mt-4 p-6 sm:p-8">
              <p className="text-[12px] text-sand-600">
                Respondido el {formatoFecha.format(new Date(respuesta.created_at))}
              </p>
              <QuestionnaireAnswers preguntas={respuesta.questionnaire_templates?.questions ?? []} respuestas={respuesta.answers}/>
            </Card>
          ) : (
            <p className="mt-4 text-[14px] text-sand-500">
              Todavía no ha rellenado el cuestionario.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
