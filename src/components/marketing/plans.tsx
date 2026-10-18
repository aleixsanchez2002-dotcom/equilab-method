import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";
type Plan = {
    name: string;
    price: string;
    cta: string;
};
const plans: Plan[] = [
    { name: "Básico", price: "75", cta: "Empezar con Básico" },
    { name: "Premium", price: "150", cta: "Solicitar plaza Premium" },
];
/* Cada fila compara en palabras, nunca con marcas de verificación. */
const rows: [string, string, string][] = [
    ["Rutina", "Semi-personalizada y revisada por el equipo", "100 % personalizada, hecha a mano"],
    ["Cuestionario postural inicial", "Incluido", "Incluido"],
    ["Valoración inicial 1:1", "No incluida", "Con el equipo, por videollamada"],
    ["Biblioteca de ejercicios en vídeo", "Incluida", "Incluida"],
    ["Progresiones de rutina", "Periódicas", "Ajustes continuos"],
    ["Seguimiento", "Tu registro de sesiones y progreso", "Revisión mensual de progreso y bienestar"],
    ["Contacto con el equipo", "No incluido", "Directo"],
    ["Acceso desde el móvil", "Incluido", "Incluido"],
    ["Plazas", "Sin límite", "Limitadas"],
];
export async function Plans() {
    const { t } = await getI18n();
    return (<section id="planes" aria-labelledby="planes-titulo" className="scroll-mt-20 px-[var(--gutter)] pt-28 pb-5 sm:pt-36">
      {/* Escritorio: una tabla grande; la columna Premium va sobre marino */}
      <Reveal className="hidden lg:block">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">{t("Comparativa de planes")}</caption>
          <colgroup>
            <col className="w-[34%]"/>
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <td className="pr-8 pb-10 align-bottom">
                <h2 id="planes-titulo" className="font-display text-step-head text-night">{t("Tu objetivo, tu plan")}</h2>
              </td>
              {plans.map((plan, i) => (<th key={plan.name} scope="col" className={cn("px-8 pt-10 pb-10 align-bottom", i === 1 ? "bg-navy text-paper" : "text-night")}>
                  <span className="block font-display text-step-head">{t(plan.name)}</span>
                  <span className="mt-2 block text-step-lead">
                    {plan.price} €<span className="text-step-small"> {t("/ mes")}</span>
                  </span>
                </th>))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, basico, premium], r) => (<tr key={label} className={r % 2 === 0 ? "bg-linen" : undefined}>
                <th scope="row" className="py-5 pr-8 pl-5 align-top text-step-small font-semibold text-slate">{t(label)}</th>
                <td className="px-8 py-5 align-top font-serif text-step-body text-night">{t(basico)}</td>
                <td className={cn("px-8 py-5 align-top font-serif text-step-body text-paper", r % 2 === 0 ? "bg-navy-deep" : "bg-navy")}>{t(premium)}</td>
              </tr>))}
            <tr>
              <td />
              {plans.map((plan, i) => (<td key={plan.name} className={cn("px-8 pt-8 pb-8", i === 1 && "bg-navy")}>
                  <Link href="/acceso" className={cn("press flex h-14 items-center justify-center px-6 text-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2", i === 1
                ? "bg-paper text-night hover:bg-linen focus-visible:outline-paper"
                : "bg-navy text-paper hover:bg-navy-deep focus-visible:outline-navy")}>
                    {t(plan.cta)}
                  </Link>
                </td>))}
            </tr>
          </tbody>
        </table>
      </Reveal>

      {/* Móvil: cada plan es un bloque propio */}
      <div className="lg:hidden">
        <Reveal>
          <h2 className="font-display text-step-head text-night">{t("Tu objetivo, tu plan")}</h2>
        </Reveal>
        <div className="mt-10 flex flex-col gap-10">
          {plans.map((plan, i) => (<Reveal key={plan.name} delay={i * 90}>
              <article className={cn("p-6", i === 1 ? "bg-navy text-paper" : "bg-linen text-night")}>
                <h3 className="font-display text-[clamp(2.25rem,9vw,3rem)] leading-none">{t(plan.name)}</h3>
                <p className="mt-2 text-step-lead">
                  {plan.price} €<span className="text-step-small"> {t("/ mes")}</span>
                </p>
                <dl className="mt-6 flex flex-col gap-4">
                  {rows.map(([label, basico, premium]) => (<div key={label}>
                      <dt className={cn("text-step-small", i === 1 ? "text-navy-soft" : "text-slate")}>{t(label)}</dt>
                      <dd className="mt-1 font-serif text-[17px] leading-snug">{t(i === 1 ? premium : basico)}</dd>
                    </div>))}
                </dl>
                <Link href="/acceso" className={cn("press mt-8 flex h-14 items-center justify-center px-6 text-[16px] font-semibold", i === 1 ? "bg-paper text-night" : "bg-navy text-paper")}>
                  {t(plan.cta)}
                </Link>
              </article>
            </Reveal>))}
        </div>
      </div>

      <Reveal delay={120}>
        <p className="mt-20 text-step-small text-slate xl:whitespace-nowrap">
          {t("Cambia de plan o cancela cuando quieras desde tu portal de cliente. El plan Premium tiene plazas limitadas: cada jinete recibe seguimiento directo del equipo.")}
        </p>
      </Reveal>
    </section>);
}
