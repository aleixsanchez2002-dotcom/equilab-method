"use client";

import { useActionState, useState } from "react";
import {
  guardarRutina,
  type AccionEstado,
  type DiaInput,
  type EjercicioInput,
  type RutinaInput,
  type SemanaInput,
  type SerieInput,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

/* Letras de pista de doma para los días — la firma de la marca. */
const LETRAS_PISTA = ["A", "E", "C", "B", "F", "K", "H", "M"];

type EjercicioCatalogo = { id: string; name: string; category: string };

type Props = {
  cliente: { id: string; full_name: string };
  catalogo: EjercicioCatalogo[];
  /** Presentes al abrir una rutina existente para revisarla/editarla. */
  rutinaId?: string;
  inicial?: {
    title: string;
    type: "semi" | "personalizada";
    explanation: string | null;
    semanas: SemanaInput[];
  };
};

const serieVacia = (): SerieInput => ({
  peso: "",
  reps: "",
  rir: "",
  descanso: "",
});
const ejercicioVacio = (): EjercicioInput => ({
  exercise_id: "",
  technique_note: "",
  series: [serieVacia(), serieVacia(), serieVacia()],
});
const diaVacio = (): DiaInput => ({
  focus: "",
  duration_note: "",
  ejercicios: [ejercicioVacio()],
});
const semanaVacia = (): SemanaInput => ({ dias: [diaVacio()] });

const estadoInicial: AccionEstado = {};

const etiqueta =
  "text-[13px] font-medium text-sand-500";
const selectCls =
  "h-11 w-full rounded-xs border border-edge bg-ink-900 px-3 text-[15px] text-sand-100 focus:border-cognac-500/60 focus:outline-none focus:ring-2 focus:ring-cognac-500/20";

export function RoutineBuilder({ cliente, catalogo, rutinaId, inicial }: Props) {
  const [title, setTitle] = useState(inicial?.title ?? "");
  const [tipo, setTipo] = useState<"semi" | "personalizada">(
    inicial?.type ?? "personalizada",
  );
  const [explicacion, setExplicacion] = useState(inicial?.explanation ?? "");
  const [semanas, setSemanas] = useState<SemanaInput[]>(
    inicial && inicial.semanas.length > 0 ? inicial.semanas : [semanaVacia()],
  );
  const [activa, setActiva] = useState(0);

  const [estado, accion, pendiente] = useActionState(
    guardarRutina,
    estadoInicial,
  );

  /** Edita el mesociclo sobre una copia: legible y sin mutar el estado. */
  function editar(receta: (borrador: SemanaInput[]) => void) {
    setSemanas((prev) => {
      const borrador = structuredClone(prev);
      receta(borrador);
      return borrador;
    });
  }

  function añadirSemana(copiarAnterior: boolean) {
    setSemanas((prev) => {
      const nueva =
        copiarAnterior && prev.length > 0
          ? structuredClone(prev[prev.length - 1])
          : semanaVacia();
      return [...prev, nueva];
    });
    setActiva(semanas.length);
  }

  function quitarSemana(indice: number) {
    setSemanas((prev) => prev.filter((_, s) => s !== indice));
    setActiva((a) => Math.max(0, Math.min(a, semanas.length - 2)));
  }

  const semana = semanas[Math.min(activa, semanas.length - 1)];

  const payload: RutinaInput = {
    rutina_id: rutinaId,
    user_id: cliente.id,
    title,
    type: tipo,
    explanation: explicacion,
    semanas,
  };

  return (
    <form action={accion} className="flex flex-col gap-8">
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      {/* ————— Cabecera del bloque ————— */}
      <section className="grid gap-5 rounded-sm border border-edge bg-ink-900 p-6 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-2">
          <label htmlFor="rb-titulo" className={etiqueta}>
            Nombre del bloque
          </label>
          <Input
            id="rb-titulo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Estabilidad de cadera"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="rb-tipo" className={etiqueta}>
            Tipo
          </label>
          <select
            id="rb-tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "semi" | "personalizada")}
            className={selectCls}
          >
            <option value="personalizada">Personalizada (Premium)</option>
            <option value="semi">Semi-personalizada (Básico)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="rb-explicacion" className={etiqueta}>
            Información de este bloque (el cliente la lee en su propia página)
          </label>
          <textarea
            id="rb-explicacion"
            rows={3}
            value={explicacion}
            onChange={(e) => setExplicacion(e.target.value)}
            placeholder="Qué busca este bloque, en qué debe fijarse, qué sentirá encima del caballo…"
            className="w-full rounded-xs border border-edge bg-ink-900 px-4 py-3 text-[15px] text-sand-100 placeholder:text-sand-600 focus:border-cognac-500/60 focus:outline-none focus:ring-2 focus:ring-cognac-500/20"
          />
        </div>
      </section>

      {/* ————— Semanas del mesociclo ————— */}
      <section className="overflow-hidden rounded-sm border border-edge bg-ink-900">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-edge px-6 py-4">
          <span className={etiqueta}>
            Mesociclo · {semanas.length} semana{semanas.length === 1 ? "" : "s"}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => añadirSemana(true)}>
              + Semana (copia de la última)
            </Button>
            <Button variant="ghost" size="sm" onClick={() => añadirSemana(false)}>
              + Semana vacía
            </Button>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Semanas del mesociclo"
          className="flex gap-1 overflow-x-auto border-b border-edge px-4 py-2"
        >
          {semanas.map((_, s) => {
            const seleccionada = s === Math.min(activa, semanas.length - 1);
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={seleccionada}
                onClick={() => setActiva(s)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-xs px-4 py-2 text-[13px] font-semibold transition-colors",
                  seleccionada
                    ? "bg-cognac-500 text-ink-950"
                    : "text-sand-500 hover:bg-sand-100/5 hover:text-sand-100",
                )}
              >
                Semana {s + 1}
              </button>
            );
          })}
        </div>

        {/* ————— Días de la semana activa ————— */}
        {semana.dias.map((dia, i) => {
          const s = Math.min(activa, semanas.length - 1);
          return (
            <div key={i} className="border-b border-edge">
              <div className="flex flex-wrap items-center gap-4 bg-ink-800/40 px-6 py-3">
                <span className="font-display text-lg italic text-cognac-400">
                  {LETRAS_PISTA[i % LETRAS_PISTA.length]}
                </span>
                <h3 className="text-[13px] font-semibold text-sand-100">
                  Día {i + 1}
                </h3>
                {semana.dias.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() =>
                      editar((d) => {
                        d[s].dias.splice(i, 1);
                      })
                    }
                  >
                    Quitar día
                  </Button>
                )}
              </div>

              <div className="grid gap-4 px-6 py-5 sm:grid-cols-[2fr_1fr]">
                <div className="flex flex-col gap-2">
                  <label htmlFor={`rb-foco-${s}-${i}`} className={etiqueta}>
                    Foco del día
                  </label>
                  <Input
                    id={`rb-foco-${s}-${i}`}
                    value={dia.focus}
                    onChange={(e) =>
                      editar((d) => {
                        d[s].dias[i].focus = e.target.value;
                      })
                    }
                    placeholder="Fuerza + cadera"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`rb-dur-${s}-${i}`} className={etiqueta}>
                    Duración (orientativa)
                  </label>
                  <Input
                    id={`rb-dur-${s}-${i}`}
                    value={dia.duration_note}
                    onChange={(e) =>
                      editar((d) => {
                        d[s].dias[i].duration_note = e.target.value;
                      })
                    }
                    placeholder="±50 min"
                  />
                </div>
              </div>

              {dia.ejercicios.map((ej, j) => (
                <div key={j} className="border-t border-edge px-6 py-5">
                  <div className="grid gap-4 sm:grid-cols-[auto_2fr_2fr_auto] sm:items-end">
                    <span className="hidden font-display text-[15px] italic text-cognac-400 sm:block sm:pb-3">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`rb-ej-${s}-${i}-${j}`} className={etiqueta}>
                        Ejercicio
                      </label>
                      <select
                        id={`rb-ej-${s}-${i}-${j}`}
                        value={ej.exercise_id}
                        onChange={(e) =>
                          editar((d) => {
                            d[s].dias[i].ejercicios[j].exercise_id = e.target.value;
                          })
                        }
                        className={selectCls}
                      >
                        <option value="">— Elegir de la biblioteca —</option>
                        {catalogo.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} · {c.category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`rb-nota-${s}-${i}-${j}`} className={etiqueta}>
                        Nota de técnica (opcional)
                      </label>
                      <Input
                        id={`rb-nota-${s}-${i}-${j}`}
                        value={ej.technique_note}
                        onChange={(e) =>
                          editar((d) => {
                            d[s].dias[i].ejercicios[j].technique_note =
                              e.target.value;
                          })
                        }
                        placeholder="Cadera atrás, espalda larga"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-self-start sm:mb-1"
                      onClick={() =>
                        editar((d) => {
                          d[s].dias[i].ejercicios.splice(j, 1);
                        })
                      }
                    >
                      Quitar
                    </Button>
                  </div>

                  {/* Series: peso, reps, RIR y descanso POR SERIE */}
                  <div className="mt-4 flex flex-col gap-2 sm:pl-10">
                    <div className="grid grid-cols-[1.75rem_repeat(4,minmax(0,1fr))_1.5rem] gap-2">
                      <span />
                      {["peso", "reps", "RIR", "descanso"].map((c) => (
                        <span key={c} className={cn(etiqueta, "text-sand-600")}>
                          {c}
                        </span>
                      ))}
                      <span />
                    </div>
                    {ej.series.map((serie, k) => (
                      <div
                        key={k}
                        className="grid grid-cols-[1.75rem_repeat(4,minmax(0,1fr))_1.5rem] items-center gap-2"
                      >
                        <span className="font-display text-[13px] italic text-sand-600">
                          S{k + 1}
                        </span>
                        {(
                          [
                            ["peso", "62,5 kg"],
                            ["reps", "8"],
                            ["rir", "2"],
                            ["descanso", "2:30"],
                          ] as const
                        ).map(([campo, ejemplo]) => (
                          <Input
                            key={campo}
                            aria-label={`${campo} de la serie ${k + 1}`}
                            value={serie[campo]}
                            onChange={(e) =>
                              editar((d) => {
                                d[s].dias[i].ejercicios[j].series[k][campo] =
                                  e.target.value;
                              })
                            }
                            placeholder={ejemplo}
                            className="h-10 px-2.5 text-[14px]"
                          />
                        ))}
                        {ej.series.length > 1 ? (
                          <button
                            type="button"
                            aria-label={`Quitar serie ${k + 1}`}
                            onClick={() =>
                              editar((d) => {
                                d[s].dias[i].ejercicios[j].series.splice(k, 1);
                              })
                            }
                            className="cursor-pointer text-sand-600 transition-colors hover:text-error"
                          >
                            ×
                          </button>
                        ) : (
                          <span />
                        )}
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start"
                      onClick={() =>
                        editar((d) => {
                          d[s].dias[i].ejercicios[j].series.push(serieVacia());
                        })
                      }
                    >
                      + Añadir serie
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t border-edge px-6 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    editar((d) => {
                      d[s].dias[i].ejercicios.push(ejercicioVacio());
                    })
                  }
                >
                  + Añadir ejercicio al día {i + 1}
                </Button>
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center gap-3 px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              editar((d) => {
                d[Math.min(activa, semanas.length - 1)].dias.push(diaVacio());
              })
            }
          >
            + Añadir día a la semana {Math.min(activa, semanas.length - 1) + 1}
          </Button>
          {semanas.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => quitarSemana(Math.min(activa, semanas.length - 1))}
            >
              Quitar semana {Math.min(activa, semanas.length - 1) + 1}
            </Button>
          )}
        </div>
      </section>

      {/* ————— Guardar ————— */}
      <section className="flex flex-col gap-4 rounded-sm border border-edge bg-ink-900 p-6">
        {estado.error && (
          <p
            role="alert"
            className="rounded-xs border border-oxblood-500/50 bg-ink-800 px-4 py-3 text-[13px] leading-relaxed text-error"
          >
            {estado.error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            name="accion"
            value="publicar"
            size="lg"
            disabled={pendiente}
          >
            {pendiente
              ? "Guardando…"
              : `Publicar a ${cliente.full_name.split(" ")[0]}`}
          </Button>
          <Button
            type="submit"
            name="accion"
            value="borrador"
            variant="outline"
            size="lg"
            disabled={pendiente}
          >
            Guardar como borrador
          </Button>
          <p className="text-[12.5px] text-sand-600 sm:ml-auto sm:max-w-[28ch] sm:text-right">
            El borrador no es visible para el cliente hasta que lo publiques.
          </p>
        </div>
      </section>
    </form>
  );
}
