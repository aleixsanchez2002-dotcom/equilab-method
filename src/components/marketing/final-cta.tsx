import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
export async function FinalCta() {
    const { t } = await getI18n();
    return (<section className="bg-cognac-500 py-20 text-ink-950 sm:py-28">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 sm:px-10 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.18em]">{t("Tu siguiente paso empieza aqu\u00ED")}</p><h2 className="section-heading max-w-3xl font-display">{t("LA PISTA TE ESPERA.")}<br />{t("PREP\u00C1RATE PARA ELLA.")}</h2><p className="mt-6 max-w-lg text-base leading-relaxed">{t("Cu\u00E9ntanos c\u00F3mo montas y empieza a construir tu base fuera de la silla. Sin permanencia.")}</p></div>
        <Link href="/acceso" className="inline-flex min-h-14 shrink-0 items-center gap-8 rounded-lg bg-ink-950 px-7 text-[13px] font-semibold uppercase tracking-wider text-sand-50 transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-950">{t("Empezar ahora ")}<span aria-hidden="true">↗</span></Link>
      </Reveal>
    </section>);
}
