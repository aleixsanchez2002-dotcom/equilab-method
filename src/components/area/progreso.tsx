import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { IconoFlecha } from "./iconos";
import { Boton, Loseta, MiniGrafica, Rotulo } from "./piezas";
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
    const maxPrevistas = Math.max(...progreso.constancia.map((s) => s.previstas));
    return (<div className="grid gap-2 lg:grid-cols-12">
      <Loseta className="pt-8 sm:pt-10 lg:col-span-12">
        <Rotulo className="text-slate">{t("Progreso")}</Rotulo>
        <h1 className="mt-2 font-display text-step-head">{t("Tu evolución")}</h1>
      </Loseta>

      {/* Constancia: una columna por semana, un cuadro por sesión */}
      <Loseta tono="noche" className="lg:col-span-5">
        <Rotulo className="text-navy-soft">{t("Constancia · últimas {0} semanas", { "0": progreso.constancia.length })}</Rotulo>
        <p className="mt-2 font-display text-step-lead">{t("{0} de {1} sesiones", { "0": hechas, "1": previstas })}</p>
        <div role="img" aria-label={t("{0} de {1} sesiones en las últimas semanas", { "0": hechas, "1": previstas })} className="mt-6 grid items-end gap-1.5" style={{ gridTemplateColumns: `repeat(${progreso.constancia.length}, minmax(0, 1fr))` }}>
          {progreso.constancia.map((s) => (<div key={s.semana} className="grid gap-1">
              {Array.from({ length: maxPrevistas }, (_, i) => maxPrevistas - 1 - i).map((i) => (<span key={i} className={cn("h-5 sm:h-6", i >= s.previstas ? "bg-transparent" : i < s.hechas ? "bg-paper" : "bg-paper/20")}/>))}
              <span className="mt-1 text-center text-[12px] font-semibold text-navy-soft">{s.semana}</span>
            </div>))}
        </div>
      </Loseta>

      <section aria-labelledby="cargas" className="grid gap-2 sm:grid-cols-2 lg:col-span-7">
        <h2 id="cargas" className="sr-only">{t("Tus cargas")}</h2>
        {progreso.cargas.map((c) => (<Loseta key={c.ejercicio}>
            <Rotulo className="text-slate">{t(c.ejercicio)}</Rotulo>
            <p className="mt-2 font-display text-step-lead tabular-nums">{kg(c.valores[c.valores.length - 1])}</p>
            <p className="mt-1 text-step-small text-slate">
              {t("+{0} desde el inicio del bloque", { "0": kg(c.valores[c.valores.length - 1] - c.valores[0]) })}
            </p>
            <MiniGrafica valores={c.valores} etiqueta={t("Evolución de la carga en {0}", { "0": t(c.ejercicio) })} className="mt-6 text-night"/>
          </Loseta>))}
      </section>

      <Loseta className="lg:col-span-5">
        <Rotulo className="text-slate">{t("Peso corporal · cada lunes")}</Rotulo>
        <p className="mt-2 font-display text-step-lead tabular-nums">{kg(progreso.peso[progreso.peso.length - 1])}</p>
        <MiniGrafica valores={progreso.peso} etiqueta={t("Evolución del peso corporal")} className="mt-6 text-night"/>
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
