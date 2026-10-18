import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Boton, Loseta, Rotulo } from "./piezas";
import type { DiaAgenda } from "./tipos";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

/**
 * Reserva de la valoración 1:1 (ADR-0015, ADR-0017). El jinete elige un
 * hueco de la agenda del equipo; la reserva avisa en Slack y lleva el
 * enlace de Google Meet.
 */
export async function PantallaAgenda({ dias, diaElegido, horaElegida, duracion, hrefDia, }: {
    dias: DiaAgenda[];
    diaElegido: string;
    horaElegida: string | null;
    duracion: string;
    hrefDia: (id: string) => string;
}) {
    const { t } = await getI18n();
    const dia = dias.find((d) => d.id === diaElegido) ?? dias[0];
    return (<div className="grid gap-2 lg:grid-cols-12">
      <Loseta className="pt-8 sm:pt-10 lg:col-span-5 lg:self-start">
        <Rotulo className="text-slate">{t("Plan Premium")}</Rotulo>
        <h1 className="mt-2 font-display text-step-head">{t("Tu valoración 1:1")}</h1>
        <p className="mt-5 max-w-[40ch] font-serif text-[17px] leading-relaxed">
          {t("Una videollamada de {0} con el equipo para conocerte, ver cómo te mueves y ajustar tu rutina. Por Google Meet.", { "0": duracion })}
        </p>
      </Loseta>

      <div className="grid content-start gap-2 lg:col-span-7">
        <nav aria-label={t("Días disponibles")} className="flex gap-1 overflow-x-auto">
          {dias.map((d) => {
            const elegido = d.id === dia.id;
            const libres = d.huecos.filter((h) => h.libre).length;
            return (<Link key={d.id} href={hrefDia(d.id)} aria-current={elegido ? "date" : undefined} className={cn("press flex w-20 shrink-0 flex-col items-center gap-0.5 py-3", elegido ? "bg-night text-paper" : libres > 0 ? "bg-linen hover:bg-linen-deep" : "bg-linen text-slate/60", foco)}>
                <span className="text-[13px] font-semibold">{d.semana}</span>
                <span className="font-display text-[1.75rem] leading-none">{d.numero}</span>
                <span className={cn("text-[12px]", elegido ? "text-navy-soft" : "text-slate")}>
                  {libres === 0 ? t("completo") : libres === 1 ? t("1 libre") : t("{0} libres", { "0": libres })}
                </span>
              </Link>);
        })}
        </nav>

        <fieldset className="bg-linen p-5 sm:p-6">
          <legend className="float-left mb-4 w-full text-[17px] font-semibold">{t("Hora (hora de España)")}</legend>
          <div className="clear-both grid grid-cols-3 gap-1 sm:grid-cols-4">
            {dia.huecos.map((h) => (<label key={h.hora} className={cn("flex h-12 items-center justify-center text-[16px] font-semibold tabular-nums has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-navy", !h.libre
                ? "cursor-not-allowed bg-linen-deep text-slate/50 line-through"
                : h.hora === horaElegida ? "cursor-pointer bg-night text-paper" : "cursor-pointer bg-paper hover:bg-linen-deep")}>
                <input type="radio" name="hora" value={h.hora} disabled={!h.libre} defaultChecked={h.hora === horaElegida} className="sr-only"/>
                {h.hora}
              </label>))}
          </div>
        </fieldset>

        {horaElegida && (<div className="bg-navy p-5 text-paper sm:p-6">
            <Rotulo className="text-navy-soft">{t("Tu reserva")}</Rotulo>
            <p className="mt-2 font-display text-step-lead">{t("{0} {1}, {2}", { "0": dia.semana, "1": dia.numero, "2": horaElegida })}</p>
            <p className="mt-1 text-step-small text-navy-soft">{t("{0} · Google Meet · puedes cambiarla hasta 24 h antes", { "0": duracion })}</p>
            <Boton tono="papel" className="mt-5 w-full">{t("Confirmar reserva")}</Boton>
          </div>)}
      </div>
    </div>);
}
