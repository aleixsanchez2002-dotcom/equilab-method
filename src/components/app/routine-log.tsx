"use client";
import { useI18n } from "@/components/i18n/provider";
import Image from "next/image";
import { useActionState, useState } from "react";
import { registrarSesion, type RegistroEstado, type RegistroInput, type SerieHecha, } from "@/app/app/actions";
import { BitMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
/* Letras de pista de doma para los días — la firma de la marca. */
const LETRAS_PISTA = ["A", "E", "C", "B", "F", "K", "H", "M"];
export type SeriePrescrita = {
    peso: string;
    reps: string;
    rir: string;
    descanso: string;
};
export type EjercicioCliente = {
    id: string; // routine_exercise_id
    exercise_id: string;
    nombre: string;
    nota: string | null;
    /** Ruta de la foto en /public (null mientras no exista el archivo). */
    foto: string | null;
    /** Enlace al vídeo de ejecución (null si aún no hay). */
    video: string | null;
    series: SeriePrescrita[];
    /** Series de la última sesión registrada, si existe. */
    ultima: SerieHecha[] | null;
};
export type DiaCliente = {
    id: string; // routine_day_id
    position: number;
    focus: string;
    duration_note: string | null;
    ejercicios: EjercicioCliente[];
};
export type SemanaCliente = {
    week: number;
    dias: DiaCliente[];
};
const estadoInicial: RegistroEstado = {};
function serieVacia(): SerieHecha {
    return { kg: "", reps: "", rir: "", descanso: "" };
}
const inputCls = "h-12 w-full rounded-xs border border-edge bg-ink-950 px-2.5 text-[14px] text-sand-100 " +
    "placeholder:text-sand-600 placeholder:text-[12px] focus:border-cognac-500/60 focus:outline-none " +
    "focus:ring-2 focus:ring-cognac-500/20 font-[inherit] tabular-nums";
/** Foto del ejercicio + acceso al vídeo de ejecución. */
function MediaEjercicio({ ej }: {
    ej: EjercicioCliente;
}) {
    const { t } = useI18n();
    return (<div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
      {ej.foto ? (<Image src={ej.foto} alt={t("Ejecuci\u00F3n de {0}", { "0": t(ej.nombre) })} width={112} height={84} className="h-[84px] w-[112px] rounded-xs border border-edge object-cover"/>) : (<span aria-hidden="true" className="grid h-[84px] w-[112px] shrink-0 place-items-center rounded-xs border border-edge bg-ink-800" title={t("Foto del ejercicio pendiente")}>
          <BitMark className="w-8 text-sand-100/15"/>
        </span>)}
      {ej.video ? (<a href={ej.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xs border border-edge-strong px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sand-300 transition-colors hover:border-cognac-400 hover:text-cognac-300">
          <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="h-2.5 w-2.5">
            <path d="M2 1.5v9l8-4.5z"/>
          </svg>{t("V\u00EDdeo de ejecuci\u00F3n")}</a>) : (<span className="text-[10px] uppercase tracking-[0.14em] text-sand-600">{t("V\u00EDdeo \u00B7 pr\u00F3ximamente")}</span>)}
    </div>);
}
/** Los campos de registro del día. Su estado vive aquí para que baste
    cambiar la `key` (al guardar) para vaciarlos de golpe. */
function CamposSesion({ dia }: {
    dia: DiaCliente;
}) {
    const { t } = useI18n();
    const [valores, setValores] = useState<Record<string, SerieHecha[]>>(() => Object.fromEntries(dia.ejercicios.map((ej) => [ej.id, ej.series.map(serieVacia)])));
    function setCampo(ejId: string, k: number, campo: keyof SerieHecha, valor: string) {
        setValores((v) => ({
            ...v,
            [ejId]: v[ejId].map((s, idx) => idx === k ? { ...s, [campo]: valor } : s),
        }));
    }
    const payload: RegistroInput = {
        routine_day_id: dia.id,
        entradas: dia.ejercicios.map((ej) => ({
            routine_exercise_id: ej.id,
            exercise_id: ej.exercise_id,
            series: valores[ej.id] ?? [],
        })),
    };
    return (<>
      <input type="hidden" name="payload" value={JSON.stringify(payload)}/>

      <p className="border-b border-edge px-6 py-3 text-[12px] leading-relaxed text-sand-600">
        {dia.duration_note && <>{t("Duraci\u00F3n orientativa: ")}{dia.duration_note} · </>}
        <b className="font-semibold text-sand-500">{t("RIR")}</b>{t(" = repeticiones que podr\u00EDas haber hecho m\u00E1s al terminar la serie (RIR 2 = te quedaban dos).")}</p>

      {dia.ejercicios.map((ej, j) => (<div key={ej.id} className="border-b border-edge px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-[15px] italic text-cognac-400">
                {String(j + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-[15px] font-medium text-sand-100">{t(ej.nombre)}</p>
                {ej.nota && (<p className="mt-1 max-w-md text-[12.5px] text-sand-600">{t(ej.nota)}</p>)}
              </div>
            </div>
            <MediaEjercicio ej={ej}/>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:pl-9">
            <div className="hidden gap-2 text-[10px] uppercase tracking-[0.16em] text-sand-600 sm:grid sm:grid-cols-[minmax(0,1fr)_320px]">
              <span>{t("Serie \u00B7 objetivo")}</span>
              <span>{t("Tu registro: kg \u00B7 reps \u00B7 RIR \u00B7 descanso")}</span>
            </div>

            {ej.series.map((s, k) => {
                const hecho = valores[ej.id]?.[k];
                const ultima = ej.ultima?.[k];
                return (<div key={k} className="grid gap-2 border-t border-dashed border-edge pt-3 sm:grid-cols-[minmax(0,1fr)_320px] sm:items-center">
                  <p className="text-[13.5px] text-sand-500">
                    <span className="mr-3 font-display italic text-sand-600">
                      S{k + 1}
                    </span>
                    <b className="font-semibold text-sand-100">{t(s.peso) || "—"}</b>
                    {" × "}
                    {s.reps || "—"}
                    {s.rir && (<span className="ml-3 text-cognac-400">{t("RIR ")}{s.rir}</span>)}
                    <span className="ml-3 text-sand-600">{t("descanso ")}{s.descanso || "—"}
                    </span>
                    {ultima && (ultima.kg || ultima.reps) && (<span className="ml-3 text-[12px] text-cognac-400">{t("\u00FAltima: ")}{ultima.kg || "—"} × {ultima.reps || "—"}
                        {ultima.rir ? ` · RIR ${ultima.rir}` : ""}
                      </span>)}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {([
                        ["kg", "kg", "decimal"],
                        ["reps", "reps", "numeric"],
                        ["rir", t("RIR"), "numeric"],
                        ["descanso", t("descanso"), "text"],
                    ] as const).map(([campo, marcador, modo]) => (<input key={campo} aria-label={t("{0} de la serie {1} de {2}", { "0": marcador, "1": k + 1, "2": t(ej.nombre) })} inputMode={modo} placeholder={marcador} value={hecho?.[campo] ?? ""} onChange={(e) => setCampo(ej.id, k, campo, e.target.value)} className={inputCls}/>))}
                  </div>
                </div>);
            })}
          </div>
        </div>))}

    </>);
}
/** Un día de la rutina con su formulario de registro. */
function DiaPanel({ dia }: {
    dia: DiaCliente;
}) {
    const { t } = useI18n();
    const [estado, accion, pendiente] = useActionState(registrarSesion, estadoInicial);
    return (<form action={accion}>
      {/* Al guardar cambia el token, cambia la clave y los campos nacen
                vacíos: la sesión ya está en el historial. */}
      <CamposSesion key={estado.token ?? "inicial"} dia={dia}/>

      <div className="flex flex-col gap-3 border-t border-edge bg-ink-900 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center">
        <Button type="submit" disabled={pendiente}>
          {pendiente ? t("Guardando\u2026") : t("Guardar sesi\u00F3n del d\u00EDa {0}", { "0": dia.position })}
        </Button>
        {estado.error && (<p role="alert" className="text-[13px] text-error">
            {t(estado.error)}
          </p>)}
        {estado.success && (<p role="status" className="text-[13px] text-sand-300">
            {t(estado.success)}
          </p>)}
        <p className="whitespace-nowrap text-[11px] text-sand-600 sm:ml-auto sm:text-right sm:text-[12px]">{t("Solo se guardan las series con algo apuntado.")}</p>
      </div>
    </form>);
}
type Props = {
    semanas: SemanaCliente[];
    /** Semana en la que va el cliente según la fecha de arranque (1..n). */
    semanaActual: number;
};
export function RoutineLog({ semanas, semanaActual }: Props) {
    const { t } = useI18n();
    const indiceInicial = Math.max(0, semanas.findIndex((s) => s.week === semanaActual));
    const [semanaActiva, setSemanaActiva] = useState(indiceInicial);
    const [diaActivo, setDiaActivo] = useState(0);
    const semana = semanas[Math.min(semanaActiva, semanas.length - 1)];
    if (!semana) return <Card className="mt-6 p-6"><p role="status" className="text-sm text-sand-300">{t("El equipo está terminando de preparar los días de este bloque.")}</p></Card>;
    return (<div className="mt-6 flex flex-col gap-4">
      {/* ————— Semanas del mesociclo ————— */}
      {semanas.length > 1 && (<div role="tablist" aria-label={t("Semanas del bloque")} className="flex gap-2 overflow-x-auto pb-1">
          {semanas.map((s, i) => {
                const activa = i === Math.min(semanaActiva, semanas.length - 1);
                const esActual = s.week === semanaActual;
                return (<button key={s.week} type="button" role="tab" aria-selected={activa} onClick={() => {
                        setSemanaActiva(i);
                        setDiaActivo(0);
                    }} className={cn("relative shrink-0 cursor-pointer rounded-xs border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors", activa
                        ? "border-cognac-500 bg-cognac-500 text-ink-950"
                        : "border-edge text-sand-500 hover:border-edge-strong hover:text-sand-100")}>{t("Semana ")}{s.week}
                {esActual && !activa && (<span aria-hidden="true" className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-cognac-400"/>)}
              </button>);
            })}
        </div>)}

      {semana.week !== semanaActual && (<p className="text-[12.5px] text-sand-600">
          {semana.week < semanaActual
                ? t("Est\u00E1s viendo una semana ya pasada del bloque.") : t("Est\u00E1s viendo una semana que a\u00FAn no te toca.")}{" "}{t("Tu semana actual es la ")}{semanaActual}.
        </p>)}

      {/* ————— Días de la semana ————— */}
      <Card className="overflow-hidden p-0">
        <div role="tablist" aria-label={t("D\u00EDas de entrenamiento")} className="flex overflow-x-auto border-b border-edge">
          {semana.dias.map((dia, i) => {
            const seleccionado = i === Math.min(diaActivo, semana.dias.length - 1);
            return (<button key={dia.id} type="button" role="tab" aria-selected={seleccionado} onClick={() => setDiaActivo(i)} className={cn("relative min-w-24 flex-1 shrink-0 cursor-pointer px-2 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors", seleccionado
                    ? "text-sand-50"
                    : "text-sand-600 hover:text-sand-300")}>
                <span className={cn("mr-2 font-display text-[13px] italic normal-case tracking-normal", seleccionado ? "text-cognac-400" : "text-sand-600")}>
                  {LETRAS_PISTA[i % LETRAS_PISTA.length]}
                </span>{t("D\u00EDa ")}{dia.position}
                <span className="ml-2 hidden normal-case tracking-normal text-sand-600 md:inline">
                  · {t(dia.focus)}
                </span>
                <span aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left bg-cognac-400 transition-transform duration-300", seleccionado ? "scale-x-100" : "scale-x-0")}/>
              </button>);
        })}
        </div>

        {/* Se remonta al cambiar de semana o día: cada día tiene su propio
            formulario y su propio estado de guardado. */}
        {semana.dias.map((dia, i) => (<div key={`${semana.week}-${dia.id}`} className={i === Math.min(diaActivo, semana.dias.length - 1) ? "" : "hidden"}>
            <p className="border-b border-edge px-6 pt-4 pb-3 text-[13px] text-sand-500 md:hidden">
              <b className="font-semibold text-sand-300">{t(dia.focus)}</b>
            </p>
            <DiaPanel dia={dia}/>
          </div>))}
      </Card>
    </div>);
}
