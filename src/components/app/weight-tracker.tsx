"use client";
import { useI18n } from "@/components/i18n/provider";
import { useActionState, useId, useState } from "react";
import { registrarPeso, type PesoEstado } from "@/app/app/actions";
import { ChartSvg, type PuntoProgreso } from "@/components/app/progress-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
function fmtKg(n: number, intlLocale: string): string {
    return n.toLocaleString(intlLocale, { maximumFractionDigits: 1 });
}
type Props = {
    /** Pesos semanales, ordenados por fecha ascendente. */
    puntos: PuntoProgreso[];
    /** Peso ya registrado esta semana (null si aún no). */
    pesoEstaSemana: number | null;
};
/** Peso corporal: aviso semanal + registro + evolución. */
export function WeightTracker({ puntos, pesoEstaSemana }: Props) {
    const { t, intlLocale } = useI18n();
    const formatoFecha = new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "short" });
    const [estado, accion, pendiente] = useActionState(registrarPeso, {} as PesoEstado);
    const [peso, setPeso] = useState("");
    const [corrigiendo, setCorrigiendo] = useState(false);
    const uid = useId();
    const pendienteDeSemana = pesoEstaSemana === null;
    const mostrarFormulario = pendienteDeSemana || corrigiendo;
    const primero = puntos[0];
    const ultimo = puntos[puntos.length - 1];
    return (<Card className={cn("mt-4 max-w-2xl p-6 sm:p-8", pendienteDeSemana && "border-cognac-500/40")}>
      {/* ————— El aviso del lunes ————— */}
      {mostrarFormulario ? (<form action={accion} className="flex flex-col gap-3">
          <label htmlFor={`${uid}-peso`} className="text-[13px] font-semibold text-sand-100">
            {pendienteDeSemana
                ? t("Nueva semana: \u00BFcu\u00E1nto pesas hoy?") : t("Corregir el peso de esta semana")}
          </label>
          <p className="text-[12.5px] text-sand-600">{t("Un dato a la semana basta para ver la tendencia. P\u00E9sate siempre en condiciones parecidas (por la ma\u00F1ana, antes de desayunar).")}</p>
          <div className="flex gap-2">
            <div className="relative w-32">
              <input id={`${uid}-peso`} name="peso" inputMode="decimal" placeholder="62,5" value={peso} onChange={(e) => setPeso(e.target.value)} required className="h-11 w-full rounded-xs border border-edge bg-ink-950 px-3 pr-9 text-[15px] text-sand-100 tabular-nums placeholder:text-sand-600 focus:border-cognac-500/60 focus:outline-none focus:ring-2 focus:ring-cognac-500/20"/>
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[13px] font-semibold text-sand-600">
                kg
              </span>
            </div>
            <Button type="submit" disabled={pendiente}>
              {pendiente ? t("Guardando\u2026") : t("Guardar")}
            </Button>
            {corrigiendo && (<Button variant="ghost" onClick={() => setCorrigiendo(false)}>{t("Cancelar")}</Button>)}
          </div>
          {estado.error && (<p role="alert" className="text-[13px] text-error">
              {t(estado.error)}
            </p>)}
        </form>) : (<div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-display text-4xl font-light text-sand-50 tabular-nums">
            {fmtKg(pesoEstaSemana, intlLocale)} kg
          </span>
          <span className="text-[13px] text-sand-600">{t("esta semana")}</span>
          {puntos.length > 1 && primero && ultimo && (<span className={cn("text-[13px] font-semibold", ultimo.kg <= primero.kg ? "text-cognac-400" : "text-sand-500")}>
              {ultimo.kg <= primero.kg ? "−" : "+"}
              {fmtKg(Math.abs(ultimo.kg - primero.kg), intlLocale)}{t(" kg desde el")}{" "}
              {formatoFecha.format(new Date(primero.fecha))}
            </span>)}
          <button type="button" onClick={() => setCorrigiendo(true)} className="cursor-pointer text-[12px] text-sand-600 underline-offset-2 transition-colors hover:text-cognac-400 hover:underline">{t("corregir")}</button>
        </div>)}

      {/* ————— La evolución ————— */}
      {puntos.length > 0 && (<>
          <ChartSvg puntos={puntos}/>
          <div className="mt-1 flex justify-between text-[13px] text-sand-600">
            <span>{primero && formatoFecha.format(new Date(primero.fecha))}</span>
            {puntos.length > 1 && ultimo && (<span>{formatoFecha.format(new Date(ultimo.fecha))}</span>)}
          </div>
        </>)}
      <p className="mt-4 text-[12px] text-sand-600">{t("Tu peso, semana a semana \u2014 se pide cada lunes.")}{puntos.length === 1 && " Con la próxima semana aparecerá la línea."}
      </p>
    </Card>);
}
