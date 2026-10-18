import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Link from "next/link";
import { BitMark } from "@/components/brand/logo";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return { title: t("Página no encontrada — Equilab Method") };
}
/** Página 404: mismo tablero que la portada, con salida clara. */
export default async function NotFound() {
    const { t, home } = await getI18n();
    return (<main className="marketing flex min-h-dvh flex-col gap-2 bg-paper p-2">
      <Link href={home} aria-label={t("Equilab Method — inicio")} className="press flex size-14 items-center justify-center bg-night text-paper hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
        <BitMark className="w-9"/>
      </Link>
      <section aria-labelledby="no-encontrada" className="flex flex-1 flex-col justify-between gap-12 bg-linen p-6 sm:p-10">
        <p className="text-step-lead font-bold text-night">404</p>
        <div>
          <h1 id="no-encontrada" className="font-display text-[clamp(3.5rem,13vw,10rem)] leading-[0.9] tracking-[-0.05em] text-night">
            {t("Fuera de pista")}
          </h1>
          <p className="mt-6 max-w-[40ch] font-serif text-step-body text-night">
            {t("La página que buscas no existe o ha cambiado de sitio.")}
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            <Link href={home} className="press inline-flex items-center gap-3 bg-night px-6 py-4 text-[16px] font-semibold text-paper hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
              {t("Volver a la portada")}
            </Link>
            <Link href="/acceso" className="press inline-flex items-center bg-paper px-6 py-4 text-[16px] font-semibold text-night hover:bg-linen-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
              {t("Iniciar sesión")}
            </Link>
          </div>
        </div>
      </section>
    </main>);
}
