import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Overline } from "@/components/ui/overline";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("Página no encontrada — Equilab Method") };
}

/** Página 404 con la identidad de Equilab, en el idioma del visitante. */
export default async function NotFound() {
  const { t, home } = await getI18n();
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-6 py-16">
      <Link href={home} aria-label={t("Equilab Method — volver a la portada")} className="self-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400">
        <Logo size="sm" />
      </Link>
      <Overline accent>{t("Error 404")}</Overline>
      <h1 className="font-display text-4xl leading-[1.05] text-sand-50 sm:text-5xl">{t("Esta página no existe.")}</h1>
      <p className="max-w-md text-base leading-relaxed text-sand-500">{t("Puede que el enlace esté mal escrito o que la página se haya movido.")}</p>
      <div className="flex flex-wrap gap-3">
        <Link href={home} className="inline-flex min-h-12 items-center rounded-lg bg-cognac-500 px-6 text-sm font-semibold text-ink-950 transition-colors duration-150 hover:bg-cognac-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400">{t("Volver a la portada")}</Link>
        <Link href="/acceso" className="inline-flex min-h-12 items-center rounded-lg border border-edge-control px-6 text-sm font-semibold text-sand-100 transition-colors duration-150 hover:bg-sand-100/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400">{t("Iniciar sesión")}</Link>
      </div>
    </main>
  );
}
