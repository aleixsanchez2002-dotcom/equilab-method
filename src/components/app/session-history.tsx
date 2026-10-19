"use client";
import { useI18n } from "@/components/i18n/provider";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
export type LogHistorial = {
    ejercicio: string;
    series: {
        kg: string;
        reps: string;
        rir?: string;
        descanso: string;
    }[];
};
export type SesionHistorial = {
    id: string;
    fecha: string; // ISO yyyy-mm-dd
    titulo: string; // «Día 1 · Fuerza + cadera» o «Sesión»
    logs: LogHistorial[];
};
function Sesion({ sesion }: {
    sesion: SesionHistorial;
}) {
    const { t, intlLocale } = useI18n();
    const formatoFecha = new Intl.DateTimeFormat(intlLocale, { weekday: "long", day: "numeric", month: "long" });
    const [abierta, setAbierta] = useState(false);
    return (<div className="border-b border-edge last:border-b-0">
      <button type="button" aria-expanded={abierta} onClick={() => setAbierta((v) => !v)} className="flex w-full cursor-pointer items-baseline gap-4 px-6 py-4 text-left transition-colors hover:bg-sand-100/[0.02]">
        <span className="text-[13px] font-semibold capitalize text-sand-100">
          {formatoFecha.format(new Date(sesion.fecha))}
        </span>
        <span className="text-[12px] text-sand-600">{t(sesion.titulo)}</span>
        <span className="ml-auto text-[12px] text-sand-600">
          {sesion.logs.length}{t(" ejercicio")}{sesion.logs.length === 1 ? "" : "s"}
        </span>
        <svg viewBox="0 0 12 12" aria-hidden="true" className={cn("h-3 w-3 shrink-0 self-center text-sand-600 transition-transform duration-300", abierta && "rotate-180 text-cognac-400")}>
          <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {abierta && (<div className="px-6 pb-5">
          {sesion.logs.map((log, i) => (<div key={i} className="border-t border-dashed border-edge py-3">
              <p className="text-[13.5px] font-medium text-sand-300">
                {t(log.ejercicio)}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
                {log.series.map((s, k) => (<span key={k} className="text-[12.5px] text-sand-500 tabular-nums">
                    <span className="mr-1.5 font-display italic text-sand-600">
                      S{k + 1}
                    </span>
                    <b className="font-semibold text-sand-100">{s.kg || "—"}</b>
                    {" × "}
                    {s.reps || "—"}
                    {s.rir && (<span className="ml-1.5 text-cognac-400">{t("RIR ")}{s.rir}</span>)}
                    {s.descanso && (<span className="ml-1.5 text-sand-600">· {s.descanso}</span>)}
                  </span>))}
              </div>
            </div>))}
        </div>)}
    </div>);
}
/** Sesiones pasadas, en solo lectura: el registro fiel del trabajo hecho. */
export function SessionHistory({ sesiones }: {
    sesiones: SesionHistorial[];
}) {
    const { t } = useI18n();
    if (sesiones.length === 0)
        return null;
    return (<Card className="mt-4 overflow-hidden p-0">
      {sesiones.map((sesion) => (<Sesion key={sesion.id} sesion={sesion}/>))}
      <p className="border-t border-edge px-6 py-3 text-[11.5px] text-sand-600">{t("El historial no se puede modificar: es el registro fiel de tu trabajo.")}</p>
    </Card>);
}
