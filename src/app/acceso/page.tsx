import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Logo } from "@/components/brand/logo";
import { getI18n } from "@/lib/i18n/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("Acceso — Equilab Method"), description: t("Inicia sesión o crea tu cuenta en Equilab Method.") };
}

export default async function AccesoPage() {
  const { t, home } = await getI18n();
  if (supabaseConfigurado) {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/app");
  }
  return (
    <div className="min-h-dvh bg-ink-950 pb-20">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 sm:px-10">
        <Link href={home} aria-label={t("Equilab Method — volver a la portada")}><Logo size="sm" /></Link>
        <Link href={home} className="text-xs font-medium uppercase tracking-widest text-sand-300 hover:text-cognac-400">{t("← Volver")}</Link>
      </header>
      <main className="mx-auto grid max-w-7xl gap-6 px-4 pt-2 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pt-6">
        <section className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-cognac-500 p-7 text-ink-950 sm:p-10 lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Equilab / {t("Tu entrenamiento")}</p>
            <h1 className="mt-8 max-w-lg font-display text-[clamp(2.2rem,4.8vw,4.4rem)] leading-[1.02]">{t("TU ENTRENO.")}<br />{t("TU ESPACIO.")}</h1>
            <p className="mt-6 max-w-sm text-base leading-relaxed">{t("Tu rutina, tus sesiones y tu evolución. Menos improvisar, más saber cuál es el siguiente paso.")}</p>
          </div>
          <div className="mt-10 hidden rounded-2xl bg-ink-950 p-7 text-sand-100 lg:block">
            <div className="flex items-center justify-between gap-4 border-b border-edge pb-5"><span className="text-xs uppercase tracking-widest text-cognac-400">{t("DENTRO DE EQUILAB")}</span><span aria-hidden="true" className="text-cognac-400">↗</span></div>
            <ol className="mt-2">{[
              ["01", "Tu rutina", "Un plan revisado por el equipo."],
              ["02", "Tus sesiones", "Registra lo que haces, serie a serie."],
              ["03", "Tu progreso", "Vuelve a tus registros y sigue tu evolución."],
            ].map(([index,title,detail]) => <li key={index} className="flex gap-4 py-5"><span className="pt-1 text-xs text-cognac-400">{index}</span><div><p className="font-semibold">{t(title)}</p><p className="mt-1 text-sm leading-relaxed text-sand-500">{t(detail)}</p></div></li>)}</ol>
          </div>
          <p className="mt-9 text-xs font-medium uppercase tracking-widest">{t("Diseñado para tu vida fuera de la silla.")}</p>
        </section>
        <section aria-label={t("Acceso a tu cuenta")} className="flex items-center justify-center rounded-3xl border border-edge bg-ink-900 px-6 py-9 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <AuthCard />
            <p className="mt-8 text-xs leading-relaxed text-sand-600">{t("Al continuar aceptas los")}{" "}<a href="#" className="underline underline-offset-2 hover:text-sand-300">{t("términos del servicio")}</a>{" "}{t("y la")}{" "}<a href="#" className="underline underline-offset-2 hover:text-sand-300">{t("política de privacidad")}</a>.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
