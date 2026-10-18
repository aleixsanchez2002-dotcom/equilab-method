import { getI18n } from "@/lib/i18n/server";
import { faqs } from "@/components/marketing/faq";
import { Aparecer } from "@/components/motion/aparecer";
import { Antetitulo, BotonPista, Contenedor, TituloPista } from "./piezas";

/** Preguntas en acordeón (details nativo: funciona sin JavaScript). */
export async function FaqPista() {
    const { t } = await getI18n();
    return (<section id="faq" aria-labelledby="faq-titulo" className="scroll-mt-20 bg-crema py-24 sm:py-32">
      <Contenedor className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Aparecer><Antetitulo>{t("Dudas")}</Antetitulo></Aparecer>
          <Aparecer retraso={100}>
            <TituloPista id="faq-titulo" className="mt-5">{t("Preguntas frecuentes")}</TituloPista>
          </Aparecer>
          <Aparecer retraso={200}>
            <BotonPista href="/acceso" tono="contorno-oscuro" className="mt-9">{t("Empezar")}</BotonPista>
          </Aparecer>
        </div>
        <div className="grid content-start gap-3 lg:col-span-8">
          {faqs.map(({ question, answer }, i) => (<Aparecer key={question} retraso={i * 80}>
              <details open={i === 0} className="pista-faq group rounded-[22px] bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-[18px] font-semibold sm:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cuero">
                  {t(question)}
                  <span aria-hidden="true" className="pista-faq-signo flex size-9 shrink-0 items-center justify-center rounded-full bg-arena text-[22px] leading-none font-light text-carbon transition-transform duration-300 group-open:bg-cuero">+</span>
                </summary>
                <p className="max-w-[62ch] px-6 pb-7 text-[16px] leading-relaxed text-humo sm:px-7">{t(answer)}</p>
              </details>
            </Aparecer>))}
        </div>
      </Contenedor>
    </section>);
}
