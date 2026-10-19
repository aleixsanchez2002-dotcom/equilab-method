"use client";
import { useI18n } from "@/components/i18n/provider";
import { useId, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Overline } from "@/components/ui/overline";
import { cn } from "@/lib/cn";
/* PLACEHOLDER: preguntas y respuestas provisionales — validar con el equipo. */
const faqs = [
    {
        question: "¿Necesito experiencia en el gimnasio?",
        answer: "No. Las rutinas parten de tu nivel real, que nos cuentas en el cuestionario inicial. Cada ejercicio incluye vídeo demostrativo con la técnica explicada paso a paso.",
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
function FaqItem({ question, answer, index, }: {
    question: string;
    answer: string;
    index: number;
}) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const panelId = useId();
    return (<div className="border-b border-edge">
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)} className="group flex w-full cursor-pointer items-baseline gap-6 py-7 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400">
        <span className="font-display text-sm italic text-cognac-500">
          0{index + 1}
        </span>
        <span className={cn("flex-1 font-sans font-semibold text-xl leading-snug transition-colors duration-200 sm:text-2xl", open ? "text-sand-50" : "text-sand-300 group-hover:text-sand-50")}>{t(question)}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("size-4 shrink-0 self-center text-sand-500 transition-transform duration-300", open && "rotate-45 text-cognac-400")}>
          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>
      <div id={panelId} className="faq-body" data-open={open}>
        <div>
          <p className="max-w-2xl pb-7 pl-10 text-[15px] leading-relaxed text-sand-500 sm:pl-12">{t(answer)}</p>
        </div>
      </div>
    </div>);
}
export function Faq() {
    const { t } = useI18n();
    return (<section id="faq" className="scroll-mt-24 bg-ink-950 py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 sm:px-10 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
        <Reveal>
          <Overline accent>{t("Preguntas")}</Overline>
          <h2 className="section-heading mt-6 font-display text-sand-50">{t("RESOLVEMOS")}<em className="block text-cognac-300">{t("TUS DUDAS.")}</em>
          </h2>
          <p className="mt-7 max-w-xs text-[15px] leading-relaxed text-sand-500">{t("\u00BFTienes otra duda? Escr\u00EDbenos por Instagram a")}{" "}
            <a href="https://instagram.com/equilab_method" target="_blank" rel="noopener noreferrer" className="text-cognac-400 underline-offset-2 hover:underline">
              @equilab_method
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="border-t border-edge">
            {faqs.map((faq, i) => (<FaqItem key={faq.question} {...faq} index={i}/>))}
          </div>
        </Reveal>
      </div>
    </section>);
}
