import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
/** Cierre: toda la banda es el enlace y una sola palabra es el botón. */
export async function FinalCta() {
    const { t } = await getI18n();
    return (<Link href="/acceso/registro" className="group relative flex min-h-[46svh] flex-col justify-between overflow-hidden bg-navy px-[var(--gutter)] pt-6 pb-4 text-paper focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-paper hover:bg-paper hover:text-navy sm:min-h-[60svh] sm:pt-8 sm:pb-5">
      <span className="sr-only">{t("Crear mi cuenta")}</span>
      <span aria-hidden="true" className="flex justify-end">
        <svg viewBox="0 0 48 48" aria-hidden="true" className="size-8 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 sm:size-12">
          <path d="M10 38 38 10M15 10h23v23" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
        </svg>
      </span>
      <span className="giant-word block font-display font-black">{t("Entrena")}</span>
    </Link>);
}
