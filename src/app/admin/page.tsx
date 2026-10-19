import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ClientDirectory, type ClienteResumen, type EstadoCliente, } from "@/components/admin/client-directory";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Overline } from "@/components/ui/overline";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import { tieneAccesoVigente, type Profile, type Subscription, } from "@/lib/supabase/types";
import { cerrarSesion } from "../app/actions";
export const metadata: Metadata = {
    title: "Panel del equipo — Equilab Method",
};
type ClienteRow = {
    id: string;
    full_name: string;
    email: string;
    email_confirmed_at: string | null;
};
type SubRow = Subscription & {
    user_id: string;
};
type RutinaRow = {
    id: string;
    user_id: string;
    title: string;
    status: "borrador" | "publicada" | "archivada";
    coach_id: string | null;
    created_at: string;
};
type ActividadRow = {
    user_id: string;
    last_session: string | null;
    total_sessions: number;
};
/** Días sin entrenar a partir de los cuales conviene dar un toque. */
const DIAS_INACTIVO = 10;
function diasDesde(fechaISO: string | null): number | null {
    if (!fechaISO)
        return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = new Date(`${fechaISO}T00:00:00`);
    return Math.max(0, Math.round((hoy.getTime() - fecha.getTime()) / 86400000));
}
function diasRestantes(sub: Subscription): number | null {
    if (!sub.current_period_end)
        return null;
    const ms = new Date(sub.current_period_end).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 86400000));
}
export default async function AdminPage({ searchParams, }: {
    searchParams: Promise<{
        creada?: string;
    }>;
}) {
    const { t } = await getI18n();
    if (!supabaseConfigurado)
        redirect("/app");
    const supabase = await createSupabaseServer();
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user)
        redirect("/acceso");
    const { data: perfil } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", user.id)
        .single<Profile>();
    if (perfil?.role !== "coach" && perfil?.role !== "admin")
        redirect("/app");
    const { creada } = await searchParams;
    const [{ data: clientes }, { data: subs }, { data: rutinas }, { data: actividad }] = await Promise.all([
        supabase
            .from("profiles")
            .select("id, full_name, email, email_confirmed_at")
            .eq("role", "cliente")
            .order("created_at", { ascending: false })
            .returns<ClienteRow[]>(),
        supabase
            .from("subscriptions")
            .select("user_id, plan_code, status, current_period_end, cancel_at_period_end")
            .returns<SubRow[]>(),
        supabase
            .from("routines")
            .select("id, user_id, title, status, coach_id, created_at")
            .neq("status", "archivada")
            .order("created_at", { ascending: false })
            .returns<RutinaRow[]>(),
        // Vista agregada: una fila por cliente, aunque tenga cientos de sesiones
        supabase
            .from("client_activity")
            .select("user_id, last_session, total_sessions")
            .returns<ActividadRow[]>(),
    ]);
    const subPorUsuario = new Map((subs ?? []).map((s) => [s.user_id, s]));
    const actividadPorUsuario = new Map((actividad ?? []).map((a) => [a.user_id, a]));
    // Las rutinas llegan de más nueva a más antigua: la primera de cada tipo
    // que aparece por cliente es la vigente.
    const publicadaPorUsuario = new Map<string, RutinaRow>();
    const borradorPorUsuario = new Map<string, RutinaRow>();
    for (const r of rutinas ?? []) {
        const destino = r.status === "publicada" ? publicadaPorUsuario : borradorPorUsuario;
        if (!destino.has(r.user_id))
            destino.set(r.user_id, r);
    }
    const resumenes: ClienteResumen[] = (clientes ?? []).map((c) => {
        const sub = subPorUsuario.get(c.id) ?? null;
        const acceso = tieneAccesoVigente(sub);
        const publicada = publicadaPorUsuario.get(c.id) ?? null;
        const borrador = borradorPorUsuario.get(c.id) ?? null;
        const act = actividadPorUsuario.get(c.id) ?? null;
        const diasSinEntrenar = diasDesde(act?.last_session ?? null);
        // Un cliente cae en el primer cajón que le corresponde: el orden marca
        // qué es más urgente para el equipo.
        let estado: EstadoCliente;
        // Sin confirmar el email no pueden ni entrar: no son clientes todavía.
        if (!c.email_confirmed_at)
            estado = "sin-confirmar";
        else if (!acceso)
            estado = "sin-acceso";
        else if (borrador)
            estado = "revisar";
        else if (!publicada)
            estado = "crear";
        else if (diasSinEntrenar === null || diasSinEntrenar >= DIAS_INACTIVO)
            estado = "inactivo";
        else
            estado = "al-dia";
        return {
            id: c.id,
            nombre: c.full_name,
            email: c.email,
            estado,
            plan: acceso && sub ? sub.plan_code : null,
            diasRestantes: acceso && sub ? diasRestantes(sub) : null,
            rutina: publicada ? { id: publicada.id, title: publicada.title } : null,
            borrador: borrador
                ? {
                    id: borrador.id,
                    title: borrador.title,
                    delMotor: borrador.coach_id === null,
                }
                : null,
            ultimaSesion: act?.last_session ?? null,
            diasSinEntrenar,
        };
    });
    const cuenta = (e: EstadoCliente) => resumenes.filter((r) => r.estado === e).length;
    const kpis = [
        {
            valor: resumenes.filter((r) => r.estado !== "sin-confirmar").length,
            etiqueta: "Clientes",
        },
        {
            valor: resumenes.filter((r) => r.estado !== "sin-acceso" && r.estado !== "sin-confirmar").length,
            etiqueta: "Con acceso activo",
        },
        { valor: cuenta("revisar") + cuenta("crear"), etiqueta: "Te esperan" },
        { valor: cuenta("inactivo"), etiqueta: "Sin entrenar" },
    ];
    return (<div className="min-h-dvh bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-edge bg-ink-950/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" aria-label={t("Equilab Method \u2014 ir a la portada")} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400">
            <Logo size="sm"/>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/app">
              <Button variant="outline" size="sm" tabIndex={-1}>{t("\u00C1rea de cliente")}</Button>
            </Link>
            <form action={cerrarSesion}>
              <Button variant="ghost" size="sm" type="submit">{t("Salir")}</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <Overline accent>{t("Panel del equipo")}</Overline>
        <h1 className="mt-4 font-display text-4xl font-medium text-sand-50">{t("Hola, ")}{perfil.full_name.split(" ")[0]}.
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sand-500">{t("Busca un cliente para preparar su rutina, o filtra por rutinas pendientes para empezar por lo que necesita revisi\u00F3n.")}</p>

        <Link href="/admin/cuestionario" className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-edge-strong px-4 text-sm text-cognac-300">{t("Ver cuestionario inicial")} →</Link>

        {creada && (<p role="status" className="mt-6 max-w-xl rounded-xs border border-cognac-500/40 bg-ink-800 px-4 py-3 text-[13px] text-sand-300">{t("Rutina guardada")}{creada === "publicada"
                ? " y publicada: el cliente ya puede verla."
                : " como borrador."}
          </p>)}

        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-edge bg-edge sm:grid-cols-4">
          {kpis.map(({ valor, etiqueta }) => (<div key={t(etiqueta)} className="bg-ink-900 px-5 py-4">
              <span className="block font-display text-3xl font-light text-sand-50">
                {valor}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-sand-600">
                {t(etiqueta)}
              </span>
            </div>))}
        </div>

        {resumenes.length === 0 ? (<Card elevated className="mt-10 max-w-xl p-8">
            <p className="font-display text-xl text-sand-50">{t("A\u00FAn no hay clientes")}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-sand-500">{t("Para probar el circuito completo, crea una cuenta de prueba: cierra sesi\u00F3n (o abre una ventana de inc\u00F3gnito), reg\u00EDstrate en /acceso con otro email, y aparecer\u00E1 aqu\u00ED como cliente.")}</p>
          </Card>) : (<section className="mt-10">
            <Overline>{t("Clientes")}</Overline>
            <ClientDirectory clientes={resumenes}/>
          </section>)}

        <p className="mt-12 text-[12px] leading-relaxed text-sand-600">{t("La activaci\u00F3n de planes se gestiona manualmente. Cuando conectemos los pagos, las suscripciones se crear\u00E1n, renovar\u00E1n y caducar\u00E1n solas.")}</p>
      </main>
    </div>);
}
