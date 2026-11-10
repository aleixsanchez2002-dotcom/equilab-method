"use client";
import { useI18n } from "@/components/i18n/provider";
import Image from "next/image";
import { useActionState, useState, useSyncExternalStore } from "react";
import { registrarSesion, type RegistroEstado, type RegistroInput, type SerieHecha, } from "@/app/app/actions";
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
type Valores = Record<string, SerieHecha[]>;
const estadoInicial: RegistroEstado = {};
function serieVacia(): SerieHecha {
    return { kg: "", reps: "", rir: "", descanso: "" };
}
function valoresVacios(dia: DiaCliente): Valores {
    return Object.fromEntries(dia.ejercicios.map((ej) => [ej.id, ej.series.map(serieVacia)]));
}
function tieneAlgo(serie: SerieHecha | undefined): boolean {
    return !!serie && (serie.kg + serie.reps + serie.rir + serie.descanso).trim() !== "";
}

/* ————— Borrador de la sesión en el dispositivo —————
   Lo apuntado se conserva en este navegador hasta guardar la sesión, para
   que una recarga o un cambio de pestaña en el gimnasio no lo borren. Solo
   contiene kg, repeticiones, RIR y descanso del día en curso; caduca al
   cambiar de fecha y se elimina al guardar correctamente. */
const PREFIJO_BORRADOR = "equilab:sesion:";
function hoyLocal(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function leerBorrador(dia: DiaCliente): Valores | null {
    try {
        const crudo = window.localStorage.getItem(PREFIJO_BORRADOR + dia.id);
        if (!crudo)
            return null;
        const guardado = JSON.parse(crudo) as {
            fecha?: string;
            valores?: Record<string, Partial<SerieHecha>[] | undefined>;
        };
        if (guardado.fecha !== hoyLocal() || !guardado.valores)
            return null;
        const texto = (valor: unknown) => (typeof valor === "string" ? valor.slice(0, 20) : "");
        const valores: Valores = {};
        let hayAlgo = false;
        for (const ej of dia.ejercicios) {
            const previas = guardado.valores[ej.id];
            valores[ej.id] = ej.series.map((_, k) => {
                const previa = Array.isArray(previas) ? previas[k] : undefined;
                const serie: SerieHecha = {
                    kg: texto(previa?.kg),
                    reps: texto(previa?.reps),
                    rir: texto(previa?.rir),
                    descanso: texto(previa?.descanso),
                };
                if (tieneAlgo(serie))
                    hayAlgo = true;
                return serie;
            });
        }
        return hayAlgo ? valores : null;
    }
    catch {
        // Sin almacenamiento o con un borrador ilegible: se empieza en blanco.
        return null;
    }
}
function guardarBorrador(dia: DiaCliente, valores: Valores): void {
    try {
        const clave = PREFIJO_BORRADOR + dia.id;
        if (Object.values(valores).some((series) => series.some(tieneAlgo))) {
            window.localStorage.setItem(clave, JSON.stringify({ fecha: hoyLocal(), valores }));
        }
        else {
            window.localStorage.removeItem(clave);
        }
    }
    catch {
        // Sin almacenamiento disponible: el registro sigue en pantalla.
    }
}
/** Borra el borrador del día guardado y los de fechas anteriores. */
function borrarBorradores(diaId: string): void {
    try {
        const almacen = window.localStorage;
        almacen.removeItem(PREFIJO_BORRADOR + diaId);
        const hoy = hoyLocal();
        const claves: string[] = [];
        for (let i = 0; i < almacen.length; i++) {
            const clave = almacen.key(i);
            if (clave?.startsWith(PREFIJO_BORRADOR))
                claves.push(clave);
        }
        for (const clave of claves) {
            try {
                const { fecha } = JSON.parse(almacen.getItem(clave) ?? "{}") as { fecha?: string };
                if (fecha !== hoy)
                    almacen.removeItem(clave);
            }
            catch {
                almacen.removeItem(clave);
            }
        }
    }
    catch {
        // Sin almacenamiento disponible: no hay nada que limpiar.
    }
}
const sinSuscripcion = () => () => { };
/** Falso en el servidor y durante la hidratación; verdadero ya en el navegador. */
function useEnNavegador(): boolean {
    return useSyncExternalStore(sinSuscripcion, () => true, () => false);
}

const CAMPOS = [
    ["kg", "kg", "decimal"],
    ["reps", "reps", "numeric"],
    ["rir", "RIR", "numeric"],
    ["descanso", "descanso", "text"],
] as const;
const inputCls = "h-12 w-full rounded-lg border border-edge-control bg-ink-950 px-2.5 text-base text-sand-100 " +
    "tabular-nums focus:border-cognac-500/60 focus:outline-none focus:ring-2 focus:ring-cognac-500/20";
/** Foto del ejercicio y acceso al vídeo de ejecución, solo si existen. */
function MediaEjercicio({ ej }: {
    ej: EjercicioCliente;
}) {
    const { t } = useI18n();
    if (!ej.foto && !ej.video)
        return null;
    return (<div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
      {ej.foto && (<Image src={ej.foto} alt={t("Ejecución de {0}", { "0": t(ej.nombre) })} width={112} height={84} className="h-[60px] w-20 rounded-lg border border-edge object-cover sm:h-[84px] sm:w-[112px]"/>)}
      {ej.video && (<a href={ej.video} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-edge-control px-3 text-xs font-semibold uppercase tracking-[0.08em] text-sand-300 transition-colors hover:border-cognac-400 hover:text-cognac-300">
          <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="h-2.5 w-2.5">
            <path d="M2 1.5v9l8-4.5z"/>
          </svg>{t("Vídeo de ejecución")}</a>)}
    </div>);
}
/** Los campos de registro del día y la barra de guardar. Su estado vive aquí
    para que baste cambiar la `key` (al guardar) para vaciarlos de golpe. */
function CamposSesion({ dia, restaurar, estado, pendiente }: {
    dia: DiaCliente;
    /** Verdadero ya en el navegador: se puede leer el borrador guardado. */
    restaurar: boolean;
    estado: RegistroEstado;
    pendiente: boolean;
}) {
    const { t } = useI18n();
    const [inicio] = useState(() => {
        const borrador = restaurar ? leerBorrador(dia) : null;
        return { valores: borrador ?? valoresVacios(dia), recuperado: borrador !== null };
    });
    const [valores, setValores] = useState<Valores>(inicio.valores);
    const [recuperado, setRecuperado] = useState(inicio.recuperado);
    function aplicar(siguiente: Valores) {
        setValores(siguiente);
        guardarBorrador(dia, siguiente);
    }
    function setCampo(ejId: string, k: number, campo: keyof SerieHecha, valor: string) {
        aplicar({
            ...valores,
            [ejId]: (valores[ejId] ?? []).map((s, idx) => idx === k ? { ...s, [campo]: valor } : s),
        });
    }
    function repetirUltima(ej: EjercicioCliente) {
        const ultima = ej.ultima;
        if (!ultima)
            return;
        aplicar({
            ...valores,
            [ej.id]: ej.series.map((_, k) => {
                const previa = ultima[k];
                return previa
                    ? { kg: previa.kg ?? "", reps: previa.reps ?? "", rir: previa.rir ?? "", descanso: previa.descanso ?? "" }
                    : valores[ej.id]?.[k] ?? serieVacia();
            }),
        });
    }
    function vaciar() {
        aplicar(valoresVacios(dia));
        setRecuperado(false);
    }
    const payload: RegistroInput = {
        routine_day_id: dia.id,
        entradas: dia.ejercicios.map((ej) => ({
            routine_exercise_id: ej.id,
            exercise_id: ej.exercise_id,
            series: valores[ej.id] ?? [],
        })),
    };
    const totalSeries = dia.ejercicios.reduce((n, ej) => n + ej.series.length, 0);
    const seriesApuntadas = dia.ejercicios.reduce((n, ej) => n + (valores[ej.id] ?? []).filter(tieneAlgo).length, 0);
    return (<>
      <input type="hidden" name="payload" value={JSON.stringify(payload)}/>

      <p className="border-b border-edge px-5 py-3 text-sm leading-relaxed text-sand-500 sm:px-6">
        {dia.duration_note && <>{t("Duración orientativa: ")}{dia.duration_note} · </>}
        <b className="font-semibold text-sand-300">{t("RIR")}</b>{t(" = repeticiones que podrías haber hecho más al terminar la serie (RIR 2 = te quedaban dos).")}</p>

      {recuperado && (<p role="status" className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-edge bg-ink-800 px-5 py-3 text-sm text-sand-300 sm:px-6">
          {t("Hemos recuperado lo que habías apuntado hoy en este día.")}
          <button type="button" onClick={vaciar} className="inline-flex min-h-11 cursor-pointer items-center text-cognac-300 underline underline-offset-4">{t("Vaciar")}</button>
        </p>)}

      {dia.ejercicios.map((ej, j) => {
            const hayUltima = !!ej.ultima?.some((s) => s.kg || s.reps);
            return (<div key={ej.id} className="border-b border-edge px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex min-w-0 items-baseline gap-3">
              <span className="font-display text-base text-cognac-400">
                {String(j + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-base font-medium text-sand-100">{t(ej.nombre)}</p>
                {ej.nota && (<p className="mt-1 max-w-md text-sm text-sand-500">{t(ej.nota)}</p>)}
              </div>
            </div>
            <MediaEjercicio ej={ej}/>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:pl-9">
            <div className="hidden gap-2 text-xs uppercase tracking-[0.14em] text-sand-600 sm:grid sm:grid-cols-[minmax(0,1fr)_320px]">
              <span>{t("Serie · objetivo")}</span>
              <span>{t("Tu registro: kg · reps · RIR · descanso")}</span>
            </div>

            {ej.series.map((s, k) => {
                    const hecho = valores[ej.id]?.[k];
                    const ultima = ej.ultima?.[k];
                    return (<div key={k} className="grid gap-3 border-t border-dashed border-edge pt-3 sm:grid-cols-[minmax(0,1fr)_320px] sm:items-center">
                  <div className="flex gap-3 text-sm text-sand-500">
                    <span className="w-6 shrink-0 font-display text-sand-600">
                      S{k + 1}
                    </span>
                    <div className="min-w-0">
                      <p>
                        <span className="text-sand-600">{t("Objetivo")}: </span>
                        <b className="font-semibold text-sand-100">{t(s.peso) || "—"}</b>
                        {" × "}
                        {s.reps || "—"}
                        {s.rir && <span className="text-sand-300"> · {t("RIR")} {s.rir}</span>}
                        {s.descanso && <span> · {t("descanso")} {s.descanso}</span>}
                      </p>
                      {ultima && (ultima.kg || ultima.reps) && (<p className="mt-1 text-sand-600">
                          {t("Última vez")}: {ultima.kg || "—"} × {ultima.reps || "—"}
                          {ultima.rir ? ` · ${t("RIR")} ${ultima.rir}` : ""}
                        </p>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {CAMPOS.map(([campo, etiqueta, modo]) => (<label key={campo} className="min-w-0">
                        <span aria-hidden="true" className="mb-1 block truncate text-xs text-sand-500 sm:hidden">{t(etiqueta)}</span>
                        <input aria-label={t("{0} de la serie {1} de {2}", { "0": t(etiqueta), "1": k + 1, "2": t(ej.nombre) })} inputMode={modo} autoComplete="off" value={hecho?.[campo] ?? ""} onChange={(e) => setCampo(ej.id, k, campo, e.target.value)} className={inputCls}/>
                      </label>))}
                  </div>
                </div>);
                })}

            {hayUltima && (<button type="button" onClick={() => repetirUltima(ej)} className="inline-flex min-h-11 cursor-pointer items-center self-start text-sm text-cognac-300 underline underline-offset-4 hover:text-cognac-400">{t("Copiar lo de la última vez")}</button>)}
          </div>
        </div>);
        })}

      <p className="px-5 py-4 text-xs leading-relaxed text-sand-600 sm:px-6">{t("Solo se guardan las series con algo apuntado.")}{" "}{t("Mientras tanto, lo que escribes se conserva en este dispositivo.")}</p>

      {/* Barra de guardar: fija sobre la navegación inferior en móvil y al
          pie de la ventana en escritorio, con el avance de la sesión. */}
      <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-edge bg-ink-900 px-4 py-3 shadow-[0_-12px_24px_-16px_rgba(0,0,0,0.7)] sm:bottom-0 sm:px-6 sm:py-4">
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={pendiente} className="min-w-0 flex-1 px-3 sm:flex-none sm:px-6">
            {pendiente ? t("Guardando\u2026") : t("Guardar sesi\u00F3n del d\u00EDa {0}", { "0": dia.position })}
          </Button>
          <p className="shrink-0 text-sm text-sand-500 tabular-nums">
            <span aria-hidden="true" className="sm:hidden"><b className="font-semibold text-sand-100">{seriesApuntadas}</b>/{totalSeries}</span>
            <span className="sr-only sm:not-sr-only">{t("{0} de {1} series apuntadas", { "0": seriesApuntadas, "1": totalSeries })}</span>
          </p>
        </div>
        {estado.error && (<p role="alert" className="mt-2 text-sm text-error">
            {t(estado.error)}
          </p>)}
        {estado.success && (<p role="status" className="mt-2 text-sm text-sand-300">
            {t(estado.success)}
          </p>)}
      </div>
    </>);
}
/** Un día de la rutina con su formulario de registro. */
function DiaPanel({ dia }: {
    dia: DiaCliente;
}) {
    const enNavegador = useEnNavegador();
    const [estado, accion, pendiente] = useActionState(async (previo: RegistroEstado, datos: FormData) => {
        const resultado = await registrarSesion(previo, datos);
        // Guardada la sesión, el borrador del dispositivo ya no hace falta.
        if (resultado.token)
            borrarBorradores(dia.id);
        return resultado;
    }, estadoInicial);
    return (<form action={accion}>
      {/* Al guardar cambia el token, cambia la clave y los campos nacen
          vacíos: la sesión ya está en el historial. La clave también cambia
          una vez en el navegador, para poder recuperar el borrador. */}
      <CamposSesion key={`${estado.token ?? "inicial"}-${enNavegador ? "navegador" : "servidor"}`} dia={dia} restaurar={enNavegador} estado={estado} pendiente={pendiente}/>
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
                    }} className={cn("relative shrink-0 cursor-pointer rounded-lg border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors", activa
                        ? "border-cognac-500 bg-cognac-500 text-ink-950"
                        : "border-edge text-sand-500 hover:border-edge-strong hover:text-sand-100")}>{t("Semana ")}{s.week}
                {esActual && !activa && (<span aria-hidden="true" className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-cognac-400"/>)}
              </button>);
            })}
        </div>)}

      {semana.week !== semanaActual && (<p className="text-sm text-sand-600">
          {semana.week < semanaActual
                ? t("Est\u00E1s viendo una semana ya pasada del bloque.") : t("Est\u00E1s viendo una semana que a\u00FAn no te toca.")}{" "}{t("Tu semana actual es la ")}{semanaActual}.
        </p>)}

      {/* ————— Días de la semana ————— */}
      <Card className="overflow-clip p-0">
        <div role="tablist" aria-label={t("D\u00EDas de entrenamiento")} className="flex overflow-x-auto border-b border-edge">
          {semana.dias.map((dia, i) => {
            const seleccionado = i === Math.min(diaActivo, semana.dias.length - 1);
            return (<button key={dia.id} type="button" role="tab" aria-selected={seleccionado} onClick={() => setDiaActivo(i)} className={cn("relative min-w-24 flex-1 shrink-0 cursor-pointer px-2 py-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors", seleccionado
                    ? "text-sand-50"
                    : "text-sand-600 hover:text-sand-300")}>
                <span className={cn("mr-2 font-display text-sm normal-case tracking-normal", seleccionado ? "text-cognac-400" : "text-sand-600")}>
                  {LETRAS_PISTA[i % LETRAS_PISTA.length]}
                </span>{t("D\u00EDa ")}{dia.position}
                <span className="ml-2 hidden normal-case tracking-normal text-sand-600 md:inline">
                  · {t(dia.focus)}
                </span>
                <span aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left bg-cognac-400 transition-transform duration-250", seleccionado ? "scale-x-100" : "scale-x-0")}/>
              </button>);
        })}
        </div>

        {/* Se remonta al cambiar de semana o día: cada día tiene su propio
            formulario y su propio estado de guardado. */}
        {semana.dias.map((dia, i) => (<div key={`${semana.week}-${dia.id}`} className={i === Math.min(diaActivo, semana.dias.length - 1) ? "" : "hidden"}>
            <p className="border-b border-edge px-6 pt-4 pb-3 text-sm text-sand-500 md:hidden">
              <b className="font-semibold text-sand-300">{t(dia.focus)}</b>
            </p>
            <DiaPanel dia={dia}/>
          </div>))}
      </Card>
    </div>);
}
