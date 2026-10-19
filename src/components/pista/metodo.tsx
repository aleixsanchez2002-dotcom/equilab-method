import { getI18n } from "@/lib/i18n/server";
import Image from "next/image";
import { facts } from "@/components/marketing/method";
import { Aparecer } from "@/components/motion/aparecer";
import { Antetitulo, BotonPista, Contenedor, TituloPista } from "./piezas";

/** El método: foto y texto a dos columnas y, debajo, las cifras del servicio. */
export async function MetodoPista() {
    const { t } = await getI18n();
    return (<section id="metodo" aria-labelledby="metodo-titulo" className="scroll-mt-20 bg-white py-24 sm:py-32">
      <Contenedor className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Aparecer efecto="asentar" className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-arena">
          <Image src="/media/pista.jpg" alt={t("Jinete y caballo durante una sesión en la pista")} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-[50%_55%]"/>
        </Aparecer>

        <div>
          <Aparecer><Antetitulo>{t("El método")}</Antetitulo></Aparecer>
          <Aparecer retraso={100}>
            <TituloPista id="metodo-titulo" className="mt-5">{t("Tu asiento también puntúa")}</TituloPista>
          </Aparecer>
          <Aparecer retraso={200}>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-humo">
              {t("El juez mira al caballo, pero lo que ve empieza en ti: un asiento estable, unas manos independientes y una cadera que acompaña. Ese trabajo se hace fuera de la silla.")}
            </p>
          </Aparecer>
          <Aparecer retraso={300}>
            <BotonPista href="/acceso/registro" tono="carbon" className="mt-9">{t("Hacer el cuestionario")}</BotonPista>
          </Aparecer>
        </div>
      </Contenedor>

      {/* Cifras: número grande, etiqueta y una línea, como los contadores de la referencia */}
      <Contenedor className="mt-28 sm:mt-40">
        {/* En pantallas anchas cada columna mide lo que su contenido y el espacio
            sobrante se reparte entre ellas: así «3 entrenadores» no se parte. */}
        <dl className="grid grid-cols-1 gap-x-16 gap-y-14 border-t border-carbon/10 pt-16 min-[460px]:grid-cols-2 xl:grid-cols-[repeat(4,auto)] xl:justify-between">
          {facts.map(({ value, label, text }, i) => (<Aparecer key={value} retraso={i * 120}>
              <dt className="text-[clamp(1.9rem,2.6vw,2.25rem)] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap">{t(value)}</dt>
              {label && <dd className="mt-3 text-[15px] font-semibold text-cuero">{t(label)}</dd>}
              <dd className={label ? "mt-1 max-w-[26ch] text-[15px] text-humo" : "mt-3 max-w-[26ch] text-[15px] text-humo"}>{t(text)}</dd>
            </Aparecer>))}
        </dl>
      </Contenedor>
    </section>);
}
