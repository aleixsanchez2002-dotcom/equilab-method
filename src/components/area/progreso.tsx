import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { IconoFlecha } from "./iconos";
import { GraficaConstancia, GraficaTendencia } from "./graficas";
import { Boton, Loseta, Rotulo } from "./piezas";
import type { Plan, ProgresoVista } from "./tipos";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

/**
 * Progreso: constancia, cargas y peso para todos; la revisión mensual con
 * el equipo, solo en Premium.
 */
export async function PantallaProgreso({ progreso, plan, pesoPendiente, hrefRevision, }: {
    progreso: ProgresoVista;
    plan: Plan;
    /** Si aún no ha apuntado el peso de esta semana. */
    pesoPendiente: boolean;
    hrefRevision: string;
}) {
    const { t, intlLocale } = await getI18n();
    const kg = (n: number) => `${n.toLocaleString(intlLocale)} kg`;
    const hechas = progreso.constancia.reduce((n, s) => n + s.hechas, 0);
    const previstas = progreso.constancia.reduce((n, s) => n + s.previstas, 0);
    return (<div className="grid gap-2 lg:grid-cols-12">
      <Loseta className="pt-8 sm:pt-10 lg:col-span-12">
        <Rotulo className="text-slate">{t("Progreso")}</Rotulo>
        <h1 className="mt-2 font-display text-step-head">{t("Tu evolución")}</h1>
      </Loseta>

      {/* Constancia: una columna por semana (previsto de fondo, hecho en marino) */}
      <Loseta className="lg:col-span-5">
        <Rotulo className="text-slate">{t("Constancia · últimas {0} semanas", { "0": progreso.constancia.length })}</Rotulo>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-step-head">{hechas}</span>
          <span className="text-[16px] text-slate">{t("de {0} sesiones hechas", { "0": previstas })}</span>
        </p>
        <GraficaConstancia semanas={progreso.constancia} etiqueta={t("{0} de {1} sesiones en las últimas semanas", { "0": hechas, "1": previstas })} describir={(s) => t("{0}: {1} de {2} sesiones", { "0": s.semana, "1": s.hechas, "2": s.previstas })} className="mt-6"/>
      </Loseta>

      <section aria-labelledby="cargas" className="grid gap-2 sm:grid-cols-2 lg:col-span-7">
        <h2 id="cargas" className="sr-only">{t("Tus cargas")}</h2>
        {progreso.cargas.map((c) => (<Loseta key={c.ejercicio}>
            <Rotulo className="text-slate">{t(c.ejercicio)}</Rotulo>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-step-lead">{kg(c.valores[c.valores.length - 1])}</span>
              <span className="text-step-small text-slate">{t("+{0} desde el inicio del bloque", { "0": kg(c.valores[c.valores.length - 1] - c.valores[0]) })}</span>
            </p>
            <GraficaTendencia valores={c.valores} fechas={c.fechas} formato={kg} etiqueta={t("Evolución de la carga en {0}", { "0": t(c.ejercicio) })} className="mt-6"/>
          </Loseta>))}
      </section>

      <Loseta className="lg:col-span-5">
        <Rotulo className="text-slate">{t("Peso corporal · cada lunes")}</Rotulo>
        <p className="mt-2 font-display text-step-lead">{kg(progreso.peso.valores[progreso.peso.valores.length - 1])}</p>
        <GraficaTendencia valores={progreso.peso.valores} fechas={progreso.peso.fechas} formato={kg} rangoMinimo={2} etiqueta={t("Evolución del peso corporal")} className="mt-6"/>
        {pesoPendiente && (<form className="mt-6 flex gap-2">
            <label className="sr-only" htmlFor="peso">{t("Tu peso de esta semana, en kg")}</label>
            <input id="peso" inputMode="decimal" placeholder={t("Peso de hoy (kg)")} className="h-14 min-w-0 flex-1 bg-paper px-4 text-[17px] font-semibold tabular-nums placeholder:font-normal placeholder:text-slate/70 focus:outline-2 focus:outline-navy"/>
            <Boton className="shrink-0">{t("Guardar")}</Boton>
          </form>)}
      </Loseta>

      {plan === "premium" && (<section aria-labelledby="revisiones" className="grid content-start gap-2 lg:col-span-7">
          <h2 id="revisiones" className="sr-only">{t("Revisiones mensuales")}</h2>
          {progreso.revisiones.map((r) => r.estado === "abierta" ? (<Link key={r.mes} href={hrefRevision} className={cn("press group flex items-center justify-between gap-4 bg-navy p-5 text-paper hover:bg-navy-deep sm:p-6", foco)}>
                <span>
                  <span className="block text-step-small font-semibold text-navy-soft">{t("Revisión mensual · {0}", { "0": r.mes })}</span>
                  <span className="mt-1 block font-display text-step-lead">{t("Cuéntanos cómo ha ido el mes")}</span>
                  <span className="mt-1 block text-step-small text-navy-soft">{t("Peso, medidas, cómo te encuentras y fotos si quieres. Cinco minutos.")}</span>
                </span>
                <IconoFlecha className="size-6 shrink-0"/>
              </Link>) : (<Loseta key={r.mes}>
                <div className="flex items-baseline justify-between gap-4">
                  <Rotulo>{t("Revisión mensual · {0}", { "0": r.mes })}</Rotulo>
                  <span className="text-step-small font-semibold text-slate">{r.estado === "respondida" ? t("Respondida") : t("Enviada")}</span>
                </div>
                {r.nota && <p className="mt-3 max-w-[56ch] font-serif text-[17px] leading-relaxed">{r.nota}</p>}
              </Loseta>))}
        </section>)}
    </div>);
}
