import { getI18n } from "@/lib/i18n/server";
import { plans, rows } from "@/components/marketing/plans";
import { Aparecer } from "@/components/motion/aparecer";
import { cn } from "@/lib/cn";
import { Antetitulo, BotonPista, Contenedor, TituloPista } from "./piezas";

/** Planes sobre carbón: dos tarjetas, Premium en blanco y destacado. */
export async function PlanesPista() {
    const { t } = await getI18n();
    return (<section id="planes" aria-labelledby="planes-titulo" className="scroll-mt-20 bg-carbon py-24 text-white sm:py-32">
      <Contenedor>
        <div className="mx-auto max-w-[720px] text-center">
          <Aparecer className="flex justify-center"><Antetitulo>{t("Planes")}</Antetitulo></Aparecer>
          <Aparecer retraso={100}>
            <TituloPista id="planes-titulo" className="mt-5">{t("Tu objetivo, tu plan")}</TituloPista>
          </Aparecer>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1000px] gap-5 lg:grid-cols-2">
          {plans.map((plan, i) => {
            const premium = i === 1;
            return (<Aparecer key={plan.name} efecto={premium ? "derecha" : "izquierda"} className={cn("relative flex flex-col rounded-[28px] p-8 sm:p-10", premium ? "bg-white text-carbon" : "bg-grafito")}>
                {premium && (<span className="absolute top-8 right-8 rounded-full bg-cuero px-3.5 py-1 text-[13px] font-semibold text-carbon sm:top-10 sm:right-10">
                    {t("Plazas limitadas")}
                  </span>)}
                <h3 className="text-[22px] font-semibold">{t(plan.name)}</h3>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-[clamp(3rem,6vw,4rem)] leading-none font-semibold tracking-[-0.04em]">{plan.price} €</span>
                  <span className={cn("text-[16px]", premium ? "text-humo" : "text-white/60")}>{t("/ mes")}</span>
                </p>
                <dl className={cn("mt-8 grid flex-1 content-start gap-4 border-t pt-8", premium ? "border-carbon/10" : "border-white/10")}>
                  {rows.map(([label, basico, prem]) => (<div key={label} className="grid gap-0.5">
                      <dt className={cn("text-[13px] font-semibold tracking-[0.06em] uppercase", premium ? "text-humo" : "text-white/50")}>{t(label)}</dt>
                      <dd className="text-[16px]">{t(premium ? prem : basico)}</dd>
                    </div>))}
                </dl>
                <BotonPista href="/acceso/registro" tono={premium ? "carbon" : "cuero"} className="mt-10 w-full">{t(plan.cta)}</BotonPista>
              </Aparecer>);
        })}
        </div>

        <Aparecer>
          <p className="mx-auto mt-12 max-w-[64ch] text-center text-[15px] leading-relaxed text-white/60">
            {t("Cambia de plan o cancela cuando quieras desde tu portal de cliente. El plan Premium tiene plazas limitadas: cada jinete recibe seguimiento directo del equipo.")}
          </p>
        </Aparecer>
      </Contenedor>
    </section>);
}
