import { getI18n } from "@/lib/i18n/server";
import type { CSSProperties } from "react";
import { correcciones, INICIAL } from "@/components/marketing/correcciones";
import { Aparecer } from "@/components/motion/aparecer";
import { Antetitulo, BotonPista, Contenedor, TituloPista } from "./piezas";

/**
 * Selector de correcciones sobre carbón (mismo contenido y misma lógica que
 * la versión actual: radios nativos y CSS :has, funciona sin JavaScript).
 */
export async function CorreccionesPista() {
    const { t } = await getI18n();
    return (<section id="correcciones" aria-labelledby="correcciones-titulo" className="corr scroll-mt-20 bg-carbon py-24 text-white sm:py-32">
      <Contenedor className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Aparecer><Antetitulo>{t("Por dónde empezar")}</Antetitulo></Aparecer>
          <Aparecer retraso={100}>
            <TituloPista id="correcciones-titulo" className="mt-5">{t("¿Qué te corrigen en la pista?")}</TituloPista>
          </Aparecer>
          <Aparecer retraso={200}>
            <p className="mt-6 max-w-[40ch] text-[17px] leading-relaxed text-white/70">
              {t("Elige lo que más te repite tu entrenador y mira por dónde empezaría tu rutina.")}
            </p>
          </Aparecer>
          <Aparecer retraso={300}>
            <fieldset className="mt-10">
              <legend className="sr-only">{t("Lo que más te corrigen")}</legend>
              <div className="flex flex-wrap gap-2">
                {correcciones.map(({ defecto }, i) => (<label key={defecto} className="relative cursor-pointer">
                    <input type="radio" name="correccion" value={defecto} data-i={i} defaultChecked={i === INICIAL} className="peer sr-only"/>
                    <span className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-[15px] font-semibold text-white/75 transition-colors duration-300 hover:border-white hover:text-white peer-checked:border-cuero peer-checked:bg-cuero peer-checked:text-carbon peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cuero">
                      {t(defecto)}
                    </span>
                  </label>))}
              </div>
            </fieldset>
          </Aparecer>
        </div>

        <div className="lg:col-span-6 lg:col-start-7" aria-live="polite">
          {correcciones.map(({ defecto, causa, ejercicios }, i) => (<div key={defecto} data-i={i} className="corr-panel">
              <p style={{ "--i": 0 } as CSSProperties} className="max-w-[36ch] text-[clamp(1.25rem,2vw,1.6rem)] leading-snug font-medium">
                {t(causa)}
              </p>
              <ol style={{ "--i": 1 } as CSSProperties} className="mt-8 grid gap-3">
                {ejercicios.map((ej, n) => (<li key={ej.nombre} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-1.5 rounded-[20px] bg-grafito p-6">
                    <span className="text-[15px] font-semibold text-cuero tabular-nums">{String(n + 1).padStart(2, "0")}</span>
                    <span className="text-[19px] font-semibold">{t(ej.nombre)}</span>
                    <span className="rounded-full border border-white/15 px-3 py-0.5 text-[13px] text-white/70">{t(ej.tipo)}</span>
                    <span className="col-start-2 col-end-4 text-[15px] leading-relaxed text-white/65">{t(ej.nota)}</span>
                  </li>))}
              </ol>
              <div style={{ "--i": 2 } as CSSProperties} className="mt-9 flex">
                <BotonPista href="/acceso/registro">{t("Hacer el cuestionario")}</BotonPista>
              </div>
            </div>))}
        </div>
      </Contenedor>
    </section>);
}
