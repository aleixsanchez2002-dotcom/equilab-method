import Link from "next/link";
import { redirect } from "next/navigation";
import { getI18n } from "@/lib/i18n/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";

type Rutina = { id: string; title: string; status: string };

export default async function MiRutinaPage({ searchParams }: {
  searchParams: Promise<{ guardada?: string }>;
}) {
  const { t } = await getI18n();
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/acceso");
  const { data: perfil, error: perfilError } = await supabase.from("profiles")
    .select("role").eq("id", user.id).single<{ role: string }>();
  if (perfilError) throw new Error("No se pudo cargar el perfil.");
  if (!perfil || !["coach", "admin"].includes(perfil.role)) redirect("/app");
  const { data: rutinas, error } = await supabase.from("routines")
    .select("id, title, status").eq("user_id", user.id)
    .neq("status", "archivada").order("created_at", { ascending: false }).returns<Rutina[]>();
  if (error) throw new Error("No se pudieron cargar tus rutinas.");
  const { guardada } = await searchParams;
  const publicada = rutinas?.find(r => r.status === "publicada");
  return <div className="min-h-dvh bg-ink-950">
    <header className="border-b border-edge"><div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-3 px-5">
      <Logo size="sm"/><Link href="/admin" className="inline-flex min-h-11 items-center text-sm text-sand-300">{t("← Volver al panel")}</Link>
    </div></header>
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
      <Overline accent>{t("Mi entrenamiento")}</Overline>
      <h1 className="mt-4 font-display text-4xl text-sand-50">{t("Organizar mi rutina")}</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand-500">{t("Crea tu rutina con el editor del equipo. Publícala para entrenar, guardar tus sesiones y seguir tu progreso, sin contratar un plan.")}</p>
      {guardada && <p role="status" className="mt-6 rounded-lg border border-cognac-500/40 p-4 text-sm text-sand-100">{t(guardada === "publicada" ? "Tu rutina está publicada. Ya puedes empezar a entrenar." : "Borrador guardado. Puedes seguir editándolo antes de publicarlo.")}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/admin/rutinas/nueva?cliente=${user.id}`}><Button tabIndex={-1}>{t("Crear mi rutina")}</Button></Link>
        {publicada && <Link href="/app?vista=rutina"><Button variant="outline" tabIndex={-1}>{t("Entrenar ahora")}</Button></Link>}
        <Link href="/app?vista=progreso"><Button variant="ghost" tabIndex={-1}>{t("Ver mi progreso")}</Button></Link>
      </div>
      <div className="mt-8 space-y-3">
        {!rutinas?.length && <p className="rounded-xl border border-edge bg-ink-900 p-6 text-sand-300">{t("Todavía no tienes una rutina propia. Crea la primera cuando quieras.")}</p>}
        {rutinas?.map(r => <article key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-edge bg-ink-900 p-5">
          <div><p className="text-xs uppercase tracking-wider text-cognac-300">{t(r.status === "publicada" ? "Publicada" : "Borrador")}</p><h2 className="mt-2 font-display text-xl text-sand-50">{r.title}</h2></div>
          <Link href={`/admin/rutinas/${r.id}`} className="inline-flex min-h-11 items-center text-sm text-cognac-300 underline underline-offset-4">{t("Editar rutina")} →</Link>
        </article>)}
      </div>
    </main>
  </div>;
}
