import { getI18n } from "@/lib/i18n/server";
import { steps } from "@/components/marketing/steps";
import { Aparecer } from "@/components/motion/aparecer";
import { Antetitulo, Contenedor, TituloPista } from "./piezas";

/** Tres pasos en tarjetas, con su número en cuero. */
export async function PasosPista() {
    const { t } = await getI18n();
    return (<section aria-labelledby="pasos-titulo" className="bg-crema py-24 sm:py-32">
      <Contenedor>
        <div className="mx-auto max-w-[720px] text-center">
          <Aparecer className="flex justify-center"><Antetitulo>{t("Cómo funciona")}</Antetitulo></Aparecer>
          <Aparecer retraso={100}>
            <TituloPista id="pasos-titulo" className="mt-5">{t("Del cuestionario a la pista")}</TituloPista>
          </Aparecer>
        </div>
        <ol className="mt-16 grid gap-5 md:grid-cols-3">
          {steps.map(({ title, text }, i) => (<Aparecer as="li" key={title} retraso={i * 140} className="pista-tarjeta flex flex-col rounded-[28px] bg-white p-8 sm:p-10">
              <span className="text-[56px] leading-none font-light tracking-[-0.04em] text-cuero tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-10 text-[22px] font-semibold tracking-[-0.01em]">{t(title)}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-humo">{t(text)}</p>
            </Aparecer>))}
        </ol>
      </Contenedor>
    </section>);
}
