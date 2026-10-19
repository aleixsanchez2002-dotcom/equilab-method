import { getI18n } from "@/lib/i18n/server";
import { Reveal } from "@/components/motion/reveal";
import { Overline } from "@/components/ui/overline";
const steps = [
    {
        index: "01",
        title: "Cuéntanos cómo montas",
        text: "Un cuestionario de 10 minutos sobre tu postura, tu historial físico y tus objetivos en la pista.",
    },
    {
        index: "02",
        title: "Recibe tu rutina",
        text: "Semi-personalizada en el plan Básico; construida a mano por el equipo, con valoración 1:1, en el Premium.",
    },
    {
        index: "03",
        title: "Progresa mes a mes",
        text: "Entrena desde el móvil en el gimnasio y siente el cambio donde importa: encima del caballo.",
    },
];
export async function Steps() {
    const { t } = await getI18n();
    return (<section className="light-section border-t border-edge bg-ink-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal className="text-left">
          <Overline accent>{t("C\u00F3mo funciona")}</Overline>
          <h2 className="section-heading mt-6 max-w-3xl font-display text-sand-50">{t("UN PLAN. TRES PASOS.")}</h2>
        </Reveal>

        <ol className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {steps.map(({ index, title, text }, i) => (<Reveal key={index} delay={i * 110}>
              <li className="relative border-t border-edge pt-7 text-left">
                <span className="font-display text-5xl text-cognac-500">
                  {index}
                </span>
                <h3 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-sand-100">{t(title)}</h3>
                <p className="mx-auto mt-3 max-w-[32ch] text-[15px] leading-relaxed text-sand-500 sm:mx-0">{t(text)}</p>
              </li>
            </Reveal>))}
        </ol>
      </div>
    </section>);
}
