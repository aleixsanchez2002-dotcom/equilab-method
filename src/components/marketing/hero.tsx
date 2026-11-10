import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { PLAN_PRICES } from "@/lib/plans";
import { ImageSlot } from "@/components/media/image-slot";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
export async function Hero() {
    const { t } = await getI18n();
    return (<section className="relative overflow-hidden bg-ink-950 pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid items-center gap-8 pb-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="animate-rise lg:py-2">
            <div aria-hidden="true" className="hero-rule mb-7 hidden sm:block"/>
            <Overline accent>{t("Preparaci\u00F3n f\u00EDsica para jinetes")}</Overline>
            <h1 className="mt-5 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.98] text-sand-50 sm:mt-6">{t("ENTRENA")}<br />{t("FUERA.")}<br />
              <span className="text-cognac-400">{t("MONTA")}<br className="hidden lg:block"/>{t(" MEJOR.")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-sand-500 sm:mt-7 sm:text-lg">{t("Fuerza, movilidad y control corporal para tu vida en la pista. Un entrenamiento que empieza en ti y se siente en cada tranco.")}</p>
            <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">
              <Link href="/acceso?modo=registro" className="w-full sm:w-auto"><Button size="lg" as="span" className="w-full sm:w-auto">{t("Empezar mi entrenamiento ")}<span aria-hidden="true">↗</span></Button></Link>
              {/* En móvil la sección del método es justo la siguiente: basta el scroll. */}
              <a href="#metodo" className="hidden sm:block"><Button variant="outline" size="lg" as="span">{t("El m\u00E9todo")}</Button></a>
            </div>
            <p className="mt-5 text-sm text-sand-500 sm:mt-6">{t("Desde {0} €/mes ", { "0": PLAN_PRICES.basico / 100 })}<span aria-hidden="true" className="mx-2 text-cognac-400">/</span>{t(" Sin permanencia")}</p>
          </div>
          {/* Foto completa en móvil y tableta (3:2, sin recortar al caballo);
              cuadrada en la columna de escritorio. Sin texto encima: el
              titular ya dice lo que decía el rótulo. */}
          <figure className="animate-rise min-w-0">
            <ImageSlot src="/media/hero.jpg" alt={t("Giovanni Torrens a caballo en una competici\u00F3n de doma cl\u00E1sica")} spec="Fotografía de Giovanni en pista" className="aspect-[3/2] lg:aspect-square" sizes="(min-width: 1024px) 45vw, 90vw" priority/>
          </figure>
        </div>
        <div className="grid grid-cols-1 gap-3 border-t border-edge py-6 sm:grid-cols-3 sm:gap-8 sm:py-7">
          {[t("Fuerza espec\u00EDfica"), t("Control y movilidad"), t("Progreso a tu ritmo")].map((label) => (<div key={label} className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.08em]"><span aria-hidden="true" className="text-cognac-400">/</span><span className="text-sand-300">{label}</span></div>))}
        </div>
      </div>
    </section>);
}
