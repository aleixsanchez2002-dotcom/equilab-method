import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { PLAN_PRICES } from "@/lib/plans";
import { ImageSlot } from "@/components/media/image-slot";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
export async function Hero() {
    const { t } = await getI18n();
    return (<section className="relative overflow-hidden bg-ink-950 pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid items-center gap-10 pb-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pb-16">
          <div className="animate-rise py-6 lg:py-12">
            <div aria-hidden="true" className="hero-rule mb-7"/>
            <Overline accent>{t("Preparaci\u00F3n f\u00EDsica para jinetes")}</Overline>
            <h1 className="mt-6 font-display text-[clamp(3rem,6.5vw,6rem)] leading-[0.98] text-sand-50">{t("ENTRENA")}<br />{t("FUERA.")}<br />
              <span className="text-cognac-400">{t("MONTA")}<br className="hidden lg:block"/>{t(" MEJOR.")}</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-sand-500 sm:text-lg">{t("Fuerza, movilidad y control corporal para tu vida en la pista. Un entrenamiento que empieza en ti y se siente en cada tranco.")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/acceso"><Button size="lg" tabIndex={-1}>{t("Empezar mi entrenamiento ")}<span aria-hidden="true">↗</span></Button></Link>
              <a href="#metodo"><Button variant="outline" size="lg" tabIndex={-1}>{t("El m\u00E9todo")}</Button></a>
            </div>
            <p className="mt-6 text-[13px] text-sand-500">{t("Desde {0} €/mes ", { "0": PLAN_PRICES.basico / 100 })}<span aria-hidden="true" className="mx-2 text-cognac-400">/</span>{t(" Sin permanencia")}</p>
          </div>
          <figure className="animate-rise relative min-w-0">
            <div className="hero-photo overflow-hidden rounded-2xl">
              <ImageSlot src="/media/hero.jpg" alt={t("Giovanni Torrens a caballo en una competici\u00F3n de doma cl\u00E1sica")} spec="Fotografía de Giovanni en pista" aspect="4 / 5" sizes="(min-width: 1024px) 45vw, 90vw" priority/>
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
              <span className="mb-3 inline-block rounded-full bg-cognac-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-ink-950">{t("De la pista al entrenamiento")}</span>
              <p className="font-display text-2xl leading-tight text-sand-50">{t("EL M\u00C9TODO EMPIEZA")}<br />{t("POR ENTENDER AL JINETE.")}</p>
            </figcaption>
          </figure>
        </div>
        <div className="grid grid-cols-1 gap-5 border-t border-edge py-7 sm:grid-cols-3 sm:gap-8">
          {[['01', t("Fuerza espec\u00EDfica")], ['02', t("Control y movilidad")], ['03', t("Progreso a tu ritmo")]].map(([n, label]) => (<div key={n} className="flex items-center gap-4 text-[13px] font-medium uppercase tracking-wider"><span className="text-cognac-400">{n} /</span><span className="text-sand-300">{t(label)}</span></div>))}
        </div>
      </div>
    </section>);
}
