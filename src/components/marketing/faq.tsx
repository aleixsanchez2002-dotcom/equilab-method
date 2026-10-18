import { getI18n } from "@/lib/i18n/server";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";
/* PLACEHOLDER: preguntas y respuestas provisionales — validar con el equipo. */
export const faqs = [
    {
        question: "¿Necesito experiencia en el gimnasio?",
        answer: "No. Con la información de tu cuestionario inicial, ajustamos cada ejercicio a tu punto de partida. Cada ejercicio incluye vídeo demostrativo con la técnica explicada paso a paso.",
    },
    {
        question: "¿Qué material necesito para entrenar?",
        answer: "Depende de tu rutina: hay versiones para gimnasio completo y adaptaciones con material mínimo o peso corporal. Nos lo indicas en el cuestionario y la rutina se ajusta a lo que tienes.",
    },
    {
        question: "Monto en otra disciplina, ¿me sirve el método?",
        answer: "El método nace de la doma clásica, pero la base — asiento, simetría, estabilidad de core y cadera — beneficia a cualquier jinete. Si buscas trabajo específico de tu disciplina, cuéntanoslo en el plan Premium.",
    },
    {
        question: "¿En qué se diferencia el plan Premium?",
        answer: "En el Básico, tu rutina se genera a partir del cuestionario y la revisa el equipo. En el Premium te valoramos 1:1, construimos tu rutina a mano, seguimos tu progreso cada mes y ajustamos sobre la marcha, con contacto directo con nosotros.",
    },
    {
        question: "¿Puedo cancelar cuando quiera?",
        answer: "Sí. No hay permanencia: cancelas desde tu portal de cliente en un clic y mantienes el acceso hasta el final del periodo que ya has pagado.",
    },
];
/** Una banda por pregunta, con todas las respuestas a la vista. */
export async function Faq() {
    const { t } = await getI18n();
    return (<section id="faq" aria-labelledby="faq-titulo" className="scroll-mt-20">
      <div className="flex min-h-[30svh] flex-col justify-end bg-wine px-[var(--gutter)] pt-10 pb-6 text-paper lg:min-h-[40svh]">
        <Reveal>
          <h2 id="faq-titulo" className="font-display text-step-head">
            {t("Preguntas frecuentes")}
          </h2>
        </Reveal>
      </div>

      <dl>
        {faqs.map(({ question, answer }, i) => (<div key={question} className={cn("grid gap-4 px-[var(--gutter)] py-10 lg:grid-cols-12 lg:gap-8 lg:py-14", i % 2 === 0 ? "bg-paper" : "bg-linen")}>
            <dt className="lg:col-span-5">
              <Reveal>
                <span className="block max-w-[24ch] font-display text-step-lead text-night">{t(question)}</span>
              </Reveal>
            </dt>
            <dd className="lg:col-span-5 lg:col-start-7">
              <Reveal delay={80}>
                <p className="max-w-[52ch] font-serif text-step-body text-night">{t(answer)}</p>
              </Reveal>
            </dd>
          </div>))}
      </dl>
    </section>);
}
