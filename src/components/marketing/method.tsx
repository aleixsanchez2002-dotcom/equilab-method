import { getI18n } from "@/lib/i18n/server";
import { Reveal } from "@/components/motion/reveal";
/* Cifras del servicio: salen del cuestionario, del equipo y de los planes. */
export const facts: {
    value: string;
    label?: string;
    text: string;
}[] = [
    { value: "10 min", text: "Cuestionario sobre cómo montas." },
    { value: "2–4 días", text: "Tiempo de dedicación semanal." },
    { value: "3 entrenadores", text: "Tres expertos a tu disposición, cada uno especializado en un campo." },
    { value: "75–150 €", label: "Básico–Premium", text: "Sin permanencia." },
];
export async function Method() {
    const { t } = await getI18n();
    return (<section id="metodo" aria-labelledby="metodo-titulo" className="scroll-mt-20 px-[var(--gutter)] pt-16 pb-24 sm:pt-20 sm:pb-32">
      {/* Título arriba y el texto justo debajo, en la misma columna */}
      <Reveal>
        <h2 id="metodo-titulo" className="font-display text-step-head text-night">
          {t("Tu asiento también puntúa")}
        </h2>
      </Reveal>
      <Reveal delay={80}>
        <p className="mt-6 max-w-[52ch] font-serif text-step-body text-night">
          {t("El juez mira al caballo, pero lo que ve empieza en ti: un asiento estable, unas manos independientes y una cadera que acompaña. Ese trabajo se hace fuera de la silla.")}
        </p>
      </Reveal>

      <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-20 lg:grid-cols-4 lg:gap-10">
        {facts.map(({ value, label, text }, i) => (<Reveal key={value} delay={i * 80} className="lg:max-w-[16rem]">
            <dt className="font-display text-step-lead text-night">{t(value)}</dt>
            {label && <dd className="mt-1 text-[16px] font-semibold text-navy">{t(label)}</dd>}
            <dd className={label ? "mt-0.5 text-step-small text-slate" : "mt-3 text-step-small text-slate"}>{t(text)}</dd>
          </Reveal>))}
      </dl>
    </section>);
}
