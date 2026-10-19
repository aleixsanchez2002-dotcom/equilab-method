import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { PLAN_PRICES } from "@/lib/plans";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
import { cn } from "@/lib/cn";
type Plan = {
    name: string;
    price: string;
    tagline: string;
    features: string[];
    cta: string;
    highlighted: boolean;
    badge?: string;
};
// Comparativa de la versión de Aleix, adaptada a la identidad grafito/lima.
const comparison = [
    { label: "Diseño de la rutina", basic: "Semi-personalizada y revisada por el equipo", premium: "100 % personalizada, hecha a mano" },
    { label: "Cuestionario postural inicial", basic: "Incluido", premium: "Incluido" },
    { label: "Valoración inicial 1:1", basic: "No incluida", premium: "Con el equipo, por videollamada" },
    { label: "Biblioteca de ejercicios en vídeo", basic: "Incluida", premium: "Incluida" },
    { label: "Progresiones de rutina", basic: "Periódicas", premium: "Ajustes continuos" },
    { label: "Seguimiento", basic: "Tu registro de sesiones y progreso", premium: "Revisión mensual de progreso y bienestar" },
    { label: "Contacto con el equipo", basic: "No incluido", premium: "Directo" },
    { label: "Acceso desde el móvil", basic: "Incluido", premium: "Incluido" },
    { label: "Plazas", basic: "Sin límite", premium: "Limitadas" },
];
const plans: Plan[] = [
    {
        name: "Básico",
        price: String(PLAN_PRICES.basico / 100),
        tagline: "Tu rutina, construida a partir de cómo montas.",
        features: [
            "Cuestionario postural inicial",
            "Rutina semi-personalizada",
            "Biblioteca de ejercicios en vídeo",
            "Progresiones de rutina periódicas",
            "Acceso desde el móvil en el gimnasio",
        ],
        cta: "Empezar con Básico",
        highlighted: false,
    },
    {
        name: "Premium",
        price: String(PLAN_PRICES.premium / 100),
        tagline: "El equipo entero, pendiente de tu asiento.",
        features: [
            "Todo lo del plan Básico",
            "Valoración inicial 1:1 con el equipo",
            "Rutina 100 % personalizada, hecha a mano",
            "Seguimiento mensual de progreso y bienestar",
            "Contacto directo y ajustes continuos",
        ],
        cta: "Solicitar plaza Premium",
        highlighted: true,
        badge: "Plazas limitadas",
    },
];
async function CheckIcon() {
    return (<svg viewBox="0 0 16 16" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cognac-400">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>);
}
export async function Plans() {
    const { t } = await getI18n();
    return (<section id="planes" className="relative scroll-mt-24 overflow-hidden border-t border-edge bg-ink-900 py-28 sm:py-36">
      <div aria-hidden="true" className="absolute inset-0" style={{
            background: "radial-gradient(90% 60% at 50% 120%, rgba(185,232,91,0.1) 0%, transparent 60%)",
        }}/>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal className="text-center">
          <Overline accent>{t("Planes")}</Overline>
          <h2 className="section-heading mx-auto mt-6 max-w-3xl font-display text-sand-50">{t("TU OBJETIVO.")}<em className="block text-cognac-300">{t("TU PLAN.")}</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-sand-500">{t("Dos formas de trabajar el mismo método. Elige la estructura y el acompañamiento que necesitas.")}</p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-2 lg:gap-8">
          {plans.map((plan, i) => (<Reveal key={plan.name} delay={i * 120}>
              <article className={cn("relative flex h-full flex-col rounded-sm border p-8 transition-all duration-300 sm:p-10", plan.highlighted
                ? "border-cognac-500/50 bg-ink-950 shadow-[0_30px_60px_-25px_rgba(185,232,91,0.25)] hover:border-cognac-400/70"
                : "border-edge bg-ink-950/60 hover:border-edge-strong")}>
                {plan.badge && (<span className="absolute -top-3 right-8 rounded-xs bg-cognac-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-950">
                    {t(plan.badge)}
                  </span>)}

                <h3 className="text-[13px] font-semibold uppercase tracking-[0.22em] text-sand-300">{t(plan.name)}</h3>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-6xl text-sand-50">
                    {plan.price}
                  </span>
                  <span className="text-sm text-sand-500">{t("\u20AC / mes")}</span>
                </div>

                <p className="mt-4 font-sans text-[17px] leading-snug text-cognac-300">{t(plan.tagline)}</p>
                <p className="mt-4 text-sm leading-relaxed text-sand-500">{t(plan.highlighted ? "Para quien busca un trabajo individual y un seguimiento más cercano." : "Para quien quiere una estructura clara y entrenar con autonomía.")}</p>

                <ul className="mt-8 flex flex-col gap-3.5 border-t border-edge pt-8">
                  {plan.features.map((feature) => (<li key={feature} className="flex gap-3 text-[14px] leading-relaxed text-sand-300">
                      <CheckIcon />{t(feature)}

                    </li>))}
                </ul>

                <div className="mt-10 flex-1"/>

                <Link href="/acceso">
                  <Button fullWidth size="lg" variant={plan.highlighted ? "primary" : "outline"} tabIndex={-1}>
                    {t(plan.cta)}
                  </Button>
                </Link>
              </article>
            </Reveal>))}
        </div>

        <Reveal className="mx-auto mt-16 max-w-5xl">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div><Overline accent>{t("Compara lo que incluye")}</Overline><h3 className="mt-3 font-display text-2xl text-sand-50 sm:text-3xl">{t("EL MISMO MÉTODO. DISTINTO ACOMPAÑAMIENTO.")}</h3></div>
          </div>
          <div className="overflow-hidden rounded-xl border border-edge">
            <table className="w-full table-fixed text-left text-xs leading-relaxed sm:text-sm">
              <caption className="sr-only">{t("Comparación de los planes Básico y Premium")}</caption>
              <thead className="bg-ink-800"><tr>
                <th scope="col" className="w-[38%] px-3 py-5 font-medium text-sand-300 sm:px-6">{t("Qué incluye")}</th>
                <th scope="col" className="px-3 py-5 font-semibold text-sand-50 sm:px-6">{t("Básico")}</th>
                <th scope="col" className="px-3 py-5 font-semibold text-cognac-400 sm:px-6">Premium</th>
              </tr></thead>
              <tbody>{comparison.map(({label,basic,premium}) => <tr key={label} className="border-t border-edge">
                <th scope="row" className="break-words px-3 py-5 align-top font-medium text-sand-300 sm:px-6">{t(label)}</th>
                <td className="break-words px-3 py-5 align-top text-sand-500 sm:px-6">{t(basic)}</td>
                <td className="break-words bg-cognac-500/[0.04] px-3 py-5 align-top text-sand-100 sm:px-6">{t(premium)}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-sand-500">{t("¿No sabes cuál elegir?")} <a href="https://instagram.com/equilab_method" target="_blank" rel="noopener noreferrer" className="text-cognac-400 underline underline-offset-4">{t("Habla con el equipo")}</a></p>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-10 text-center text-[13px] text-sand-600">{t("El plan Premium tiene plazas limitadas: cada jinete recibe seguimiento directo del equipo.")}</p>
        </Reveal>
      </div>
    </section>);
}
