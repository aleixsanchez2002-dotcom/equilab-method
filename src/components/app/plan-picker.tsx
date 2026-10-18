import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
import { cn } from "@/lib/cn";
type Plan = {
    code: string;
    name: string;
    /** Precio de respaldo; el real llega de la tabla `plans`. */
    priceCents: number;
    tagline: string;
    incluye: string[];
    destacado: boolean;
    insignia?: string;
};
/* Mismo contenido que la sección de planes de la landing: una sola verdad
   sobre qué incluye cada plan. */
const PLANES: Plan[] = [
    {
        code: "basico",
        name: "Básico",
        priceCents: 7500,
        tagline: "Tu rutina, construida a partir de cómo montas.",
        incluye: [
            "Cuestionario postural inicial",
            "Rutina semi-personalizada, revisada por el equipo",
            "Biblioteca de ejercicios con vídeo de ejecución",
            "Registro de series y gráficos de progreso",
            "Progresiones periódicas de tu bloque",
        ],
        destacado: false,
    },
    {
        code: "premium",
        name: "Premium",
        priceCents: 15000,
        tagline: "El equipo entero, pendiente de tu asiento.",
        incluye: [
            "Todo lo del plan Básico",
            "Valoración inicial 1:1 por videollamada",
            "Rutina 100 % personalizada, hecha a mano",
            "Seguimiento mensual de progreso y bienestar",
            "Contacto directo y ajustes continuos",
        ],
        destacado: true,
        insignia: "Plazas limitadas",
    },
];
async function CheckIcon() {
    return (<svg viewBox="0 0 16 16" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cognac-400">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>);
}
type Props = {
    /** Plan que ya tiene contratado, para marcarlo como actual. */
    planActual?: string | null;
    /** Título y entradilla (cambian si es alta nueva o mejora de plan). */
    titulo: string;
    entradilla: string;
    /** Precios en céntimos desde la tabla `plans`, por código de plan. */
    preciosCents?: Record<string, number>;
};
/** Comparativa de planes con la diferencia real entre ambos. */
export async function PlanPicker({ planActual, titulo, entradilla, preciosCents, }: Props) {
    const { t, intlLocale } = await getI18n();
    return (<section className="mt-8">
      <Overline accent>{t("Planes")}</Overline>
      <h2 className="mt-3 max-w-xl font-display text-3xl leading-[1.15] font-medium text-sand-50">
        {t(titulo)}
      </h2>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-sand-500">
        {t(entradilla)}
      </p>

      <div className="mt-8 grid max-w-3xl gap-5 lg:grid-cols-2">
        {PLANES.map((plan) => {
            const esActual = planActual === plan.code;
            return (<article key={plan.code} className={cn("relative flex flex-col rounded-sm border p-6 transition-colors duration-200 sm:p-7", plan.destacado
                    ? "border-cognac-500 bg-chalk"
                    : "border-edge bg-ink-900/60")}>
              {plan.insignia && !esActual && (<span className="absolute -top-2.5 right-6 rounded-xs bg-cognac-500 px-2.5 py-1 text-[12px] font-bold text-ink-950">
                  {t(plan.insignia)}
                </span>)}
              {esActual && (<span className="absolute -top-2.5 right-6 rounded-xs border border-edge-strong bg-ink-800 px-2.5 py-1 text-[12px] font-bold text-sand-300">{t("Tu plan actual")}</span>)}

              <h3 className="text-[13px] font-semibold text-sand-300">
                {t(plan.name)}
              </h3>

              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-5xl font-light text-sand-50">
                  {((preciosCents?.[plan.code] ?? plan.priceCents) / 100).toLocaleString(intlLocale)}
                </span>
                <span className="text-[13px] text-sand-500">{t("\u20AC / mes")}</span>
              </p>

              <p className="mt-3 font-display text-[15px] leading-snug italic text-cognac-300">
                {t(plan.tagline)}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-edge pt-6">
                {plan.incluye.map((linea) => (<li key={t(linea)} className="flex gap-2.5 text-[13.5px] leading-relaxed text-sand-300">
                    <CheckIcon />
                    {t(linea)}
                  </li>))}
              </ul>

              <div className="mt-7">
                {esActual ? (<Button variant="outline" fullWidth disabled>{t("Tu plan actual")}</Button>) : (<Link href="/app/cuenta/contacto">
                    <Button variant={plan.destacado ? "primary" : "outline"} fullWidth tabIndex={-1}>
                      {planActual ? t("Cambiar a {0}", { "0": t(plan.name) }) : t("Quiero el {0}", { "0": t(plan.name) })}
                    </Button>
                  </Link>)}
              </div>
            </article>);
        })}
      </div>

      <p className="mt-6 max-w-2xl text-[12.5px] leading-relaxed text-sand-600">
        <b className="font-semibold text-sand-500">{t("La diferencia en una l\u00EDnea:")}</b>{" "}{t("en el B\u00E1sico tu rutina se genera a partir de tu cuestionario y el equipo la revisa; en el Premium te valoramos en persona, la construimos a mano y seguimos tu evoluci\u00F3n cada mes.")}{" "}{t("El pago con tarjeta se activar\u00E1 pronto: por ahora escr\u00EDbenos y activamos tu plan en menos de 24 h laborables. Sin permanencia.")}</p>
    </section>);
}
