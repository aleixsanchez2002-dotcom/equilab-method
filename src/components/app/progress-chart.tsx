"use client";
import { useI18n } from "@/components/i18n/provider";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
export type PuntoProgreso = {
    fecha: string;
    kg: number;
}; // fecha ISO (yyyy-mm-dd)
export type SerieProgreso = {
    exercise_id: string;
    nombre: string;
    puntos: PuntoProgreso[]; // ordenados por fecha ascendente
};
function fmtKg(n: number, intlLocale: string): string {
    return n.toLocaleString(intlLocale, { maximumFractionDigits: 1 });
}
/** Geometría del gráfico: viewBox 320×130, área útil x 10–310, y 25–115. */
function geometria(puntos: PuntoProgreso[]) {
    const kgs = puntos.map((p) => p.kg);
    let min = Math.min(...kgs);
    let max = Math.max(...kgs);
    if (min === max) {
        min -= 2.5;
        max += 2.5;
    }
    const t0 = new Date(puntos[0].fecha).getTime();
    const t1 = new Date(puntos[puntos.length - 1].fecha).getTime();
    const y = (kg: number) => 115 - ((kg - min) / (max - min)) * 90;
    const x = (fecha: string) => t1 === t0
        ? 160
        : 10 + ((new Date(fecha).getTime() - t0) / (t1 - t0)) * 300;
    return { x, y };
}
export function ChartSvg({ puntos }: {
    puntos: PuntoProgreso[];
}) {
    const { t, intlLocale } = useI18n();
    const { x, y } = geometria(puntos);
    const coords = puntos.map((p) => `${x(p.fecha).toFixed(1)},${y(p.kg).toFixed(1)}`);
    const linea = `M${coords.join(" L")}`;
    const ultimo = puntos[puntos.length - 1];
    return (<svg viewBox="0 0 320 130" className="mt-4 block w-full" role="img" aria-label={t("Evoluci\u00F3n de la carga: de {0} a {1} kg", { "0": fmtKg(puntos[0].kg, intlLocale), "1": fmtKg(ultimo.kg, intlLocale) })}>
      <defs>
        <linearGradient id="area-progreso" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-cognac-500)" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="var(--color-cognac-500)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <g stroke="var(--color-edge)" strokeDasharray="1 4">
        <line x1="10" y1="25" x2="310" y2="25"/>
        <line x1="10" y1="70" x2="310" y2="70"/>
        <line x1="10" y1="115" x2="310" y2="115"/>
      </g>
      {puntos.length > 1 && (<>
          <path d={`${linea} L${x(ultimo.fecha).toFixed(1)},126 L${x(puntos[0].fecha).toFixed(1)},126 Z`} fill="url(#area-progreso)"/>
          <path d={linea} fill="none" stroke="var(--color-cognac-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </>)}
      {puntos.map((p, i) => (<circle key={i} cx={x(p.fecha)} cy={y(p.kg)} r={i === puntos.length - 1 ? 4 : 2.5} fill={i === puntos.length - 1 ? "var(--color-wine)" : "var(--color-cognac-500)"}/>))}
    </svg>);
}
export function ProgressChart({ series }: {
    series: SerieProgreso[];
}) {
    const { t, intlLocale } = useI18n();
    const formatoFecha = new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "short" });
    const [activa, setActiva] = useState(0);
    if (series.length === 0) {
        return (<Card elevated className="mt-4 max-w-xl p-8">
        <p className="font-display text-xl text-sand-50">{t("Tu progresi\u00F3n se dibujar\u00E1 aqu\u00ED")}</p>
        <p className="mt-3 text-[14px] leading-relaxed text-sand-500">{t("Registra tus sesiones con los kilos que mueves y este gr\u00E1fico empezar\u00E1 a contar tu historia, ejercicio a ejercicio.")}</p>
      </Card>);
    }
    const serie = series[Math.min(activa, series.length - 1)];
    const primero = serie.puntos[0];
    const ultimo = serie.puntos[serie.puntos.length - 1];
    const delta = ultimo.kg - primero.kg;
    return (<Card className="mt-4 max-w-2xl p-6 sm:p-8">
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t("Elegir ejercicio")}>
        {series.map((s, i) => (<button key={s.exercise_id} type="button" aria-pressed={i === activa} onClick={() => setActiva(i)} className={cn("cursor-pointer whitespace-nowrap rounded-xs border px-3.5 py-1.5 text-[13px] font-semibold transition-colors", i === activa
                ? "border-cognac-500 bg-cognac-500 text-ink-950"
                : "border-edge text-sand-500 hover:border-edge-strong hover:text-sand-100")}>
            {t(s.nombre)}
          </button>))}
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-display text-4xl font-light text-sand-50 tabular-nums">
          {fmtKg(ultimo.kg, intlLocale)} kg
        </span>
        {serie.puntos.length > 1 && (<span className={cn("text-[13px] font-semibold", delta > 0 ? "text-cognac-400" : "text-sand-500")}>
            {delta >= 0 ? "+" : "−"}
            {fmtKg(Math.abs(delta), intlLocale)}{t(" kg desde el")}{" "}
            {formatoFecha.format(new Date(primero.fecha))}
          </span>)}
      </div>

      <ChartSvg puntos={serie.puntos}/>

      <div className="mt-1 flex justify-between text-[13px] text-sand-600">
        <span>{formatoFecha.format(new Date(primero.fecha))}</span>
        {serie.puntos.length > 1 && (<span>{formatoFecha.format(new Date(ultimo.fecha))}</span>)}
      </div>

      <p className="mt-4 text-[12px] text-sand-600">{t("La mejor carga de cada sesi\u00F3n registrada.")}{serie.puntos.length === 1 &&
            " Con tu próxima sesión aparecerá la línea de progresión."}
      </p>
    </Card>);
}
