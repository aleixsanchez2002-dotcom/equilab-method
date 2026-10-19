"use client";
import { useI18n } from "@/components/i18n/provider";
import { useActionState, useState } from "react";
import { guardarRutina, type AccionEstado, type DiaInput, type EjercicioInput, type RutinaInput, type SemanaInput, type SerieInput, } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
/* Letras de pista de doma para los días — la firma de la marca. */
const LETRAS_PISTA = ["A", "E", "C", "B", "F", "K", "H", "M"];
type EjercicioCatalogo = {
    id: string;
    name: string;
    category: string;
};
type Props = {
    cliente: {
        id: string;
        full_name: string;
    };
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
const etiqueta = "text-[11px] font-medium uppercase tracking-[0.14em] text-sand-500";
const selectCls = "h-11 w-full rounded-xs border border-edge bg-ink-900 px-3 text-[15px] text-sand-100 focus:border-cognac-500/60 focus:outline-none focus:ring-2 focus:ring-cognac-500/20";
export function RoutineBuilder({ cliente, catalogo, rutinaId, inicial }: Props) {
    const { t } = useI18n();
    const [title, setTitle] = useState(inicial?.title ?? "");
    const [tipo, setTipo] = useState<"semi" | "personalizada">(inicial?.type ?? "personalizada");
    const [explicacion, setExplicacion] = useState(inicial?.explanation ?? "");
    const [semanas, setSemanas] = useState<SemanaInput[]>(inicial && inicial.semanas.length > 0 ? inicial.semanas : [semanaVacia()]);
    const [activa, setActiva] = useState(0);
    const [estado, accion, pendiente] = useActionState(guardarRutina, estadoInicial);
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
            const nueva = copiarAnterior && prev.length > 0
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
    return (<form action={accion} className="flex flex-col gap-8">
      <input type="hidden" name="payload" value={JSON.stringify(payload)}/>

      <div className="rounded-xl border border-edge bg-ink-900 px-5 py-4 text-sm leading-relaxed text-sand-300">
        <b className="text-cognac-300">{t("1. Define el bloque")}</b> → <b>{t("2. Organiza los d\u00EDas")}</b> → <b>{t("3. Guarda o publica")}</b>
        <p className="mt-2 text-sand-500">{t("Empieza con una semana y c\u00F3piala para preparar las siguientes. El cliente solo ver\u00E1 la rutina cuando la publiques.")}</p>
      </div>
      {/* ————— Cabecera del bloque ————— */}
      <section className="grid gap-5 rounded-sm border border-edge bg-ink-900 p-6 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-2">
          <label htmlFor="rb-titulo" className={etiqueta}>{t("Nombre del bloque")}</label>
          <Input id="rb-titulo" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("Estabilidad de cadera")}/>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="rb-tipo" className={etiqueta}>{t("Tipo")}</label>
          <select id="rb-tipo" value={tipo} onChange={(e) => setTipo(e.target.value as "semi" | "personalizada")} className={selectCls}>
            <option value="personalizada">{t("Personalizada (Premium)")}</option>
            <option value="semi">{t("Semi-personalizada (B\u00E1sico)")}</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="rb-explicacion" className={etiqueta}>{t("Informaci\u00F3n de este bloque (el cliente la lee en su propia p\u00E1gina)")}</label>
          <textarea id="rb-explicacion" rows={3} value={explicacion} onChange={(e) => setExplicacion(e.target.value)} placeholder={t("Qu\u00E9 busca este bloque, en qu\u00E9 debe fijarse, qu\u00E9 sentir\u00E1 encima del caballo\u2026")} className="w-full rounded-xs border border-edge bg-ink-900 px-4 py-3 text-[15px] text-sand-100 placeholder:text-sand-600 focus:border-cognac-500/60 focus:outline-none focus:ring-2 focus:ring-cognac-500/20"/>
        </div>
      </section>

      {/* ————— Semanas del bloque ————— */}
      <section className="overflow-hidden rounded-sm border border-edge bg-ink-900">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-edge px-6 py-4">
          <span className={etiqueta}>{t(semanas.length === 1 ? "Bloque de 1 semana" : "Bloque de {0} semanas", { "0": semanas.length })}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => añadirSemana(true)}>{t("+ Semana (copia de la \u00FAltima)")}</Button>
            <Button variant="ghost" size="sm" onClick={() => añadirSemana(false)}>{t("+ Semana vac\u00EDa")}</Button>
          </div>
        </div>

        <div role="tablist" aria-label={t("Semanas del bloque")} className="flex gap-1 overflow-x-auto border-b border-edge px-4 py-2">
          {semanas.map((_, s) => {
            const seleccionada = s === Math.min(activa, semanas.length - 1);
            return (<button key={s} type="button" role="tab" aria-selected={seleccionada} onClick={() => setActiva(s)} className={cn("shrink-0 cursor-pointer rounded-xs px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors", seleccionada
                    ? "bg-cognac-500 text-ink-950"
                    : "text-sand-500 hover:bg-sand-100/5 hover:text-sand-100")}>{t("Semana ")}{s + 1}
              </button>);
        })}
        </div>

        {/* ————— Días de la semana activa ————— */}
        {semana.dias.map((dia, i) => {
            const s = Math.min(activa, semanas.length - 1);
            return (<div key={i} className="border-b border-edge">
              <div className="flex flex-wrap items-center gap-4 bg-ink-800/40 px-6 py-3">
                <span className="font-display text-lg italic text-cognac-400">
                  {LETRAS_PISTA[i % LETRAS_PISTA.length]}
                </span>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sand-100">{t("Día {0}", { "0": i + 1 })}
                </h3>
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => editar(d => { d[s].dias.splice(i + 1, 0, structuredClone(d[s].dias[i])); })}>{t("Copiar d\u00EDa")}</Button>
                {semana.dias.length > 1 && (<Button variant="ghost" size="sm" className="" onClick={() => editar((d) => {
                        d[s].dias.splice(i, 1);
                    })}>{t("Quitar d\u00EDa")}</Button>)}
              </div>

              <div className="grid gap-4 px-6 py-5 sm:grid-cols-[2fr_1fr]">
                <div className="flex flex-col gap-2">
                  <label htmlFor={`rb-foco-${s}-${i}`} className={etiqueta}>{t("Foco del d\u00EDa")}</label>
                  <Input id={`rb-foco-${s}-${i}`} value={dia.focus} onChange={(e) => editar((d) => {
                    d[s].dias[i].focus = e.target.value;
                })} placeholder={t("Fuerza + cadera")}/>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`rb-dur-${s}-${i}`} className={etiqueta}>{t("Duraci\u00F3n (orientativa)")}</label>
                  <Input id={`rb-dur-${s}-${i}`} value={dia.duration_note} onChange={(e) => editar((d) => {
                    d[s].dias[i].duration_note = e.target.value;
                })} placeholder={t("\u00B150 min")}/>
                </div>
              </div>

              {dia.ejercicios.map((ej, j) => (<div key={j} className="border-t border-edge px-6 py-5">
                  <div className="grid gap-4 sm:grid-cols-[auto_2fr_2fr_auto] sm:items-end">
                    <span className="hidden font-display text-[15px] italic text-cognac-400 sm:block sm:pb-3">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`rb-ej-${s}-${i}-${j}`} className={etiqueta}>{t("Ejercicio")}</label>
                      <select id={`rb-ej-${s}-${i}-${j}`} value={ej.exercise_id} onChange={(e) => editar((d) => {
                        d[s].dias[i].ejercicios[j].exercise_id = e.target.value;
                    })} className={selectCls}>
                        <option value="">{t("\u2014 Elegir de la biblioteca \u2014")}</option>
                        {catalogo.map((c) => (<option key={c.id} value={c.id}>
                            {c.name} · {c.category}
                          </option>))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`rb-nota-${s}-${i}-${j}`} className={etiqueta}>{t("Nota de t\u00E9cnica (opcional)")}</label>
                      <Input id={`rb-nota-${s}-${i}-${j}`} value={ej.technique_note} onChange={(e) => editar((d) => {
                        d[s].dias[i].ejercicios[j].technique_note =
                            e.target.value;
                    })} placeholder={t("Cadera atr\u00E1s, espalda larga")}/>
                    </div>
                    <Button variant="ghost" size="sm" className="justify-self-start sm:mb-1" onClick={() => editar((d) => {
                        d[s].dias[i].ejercicios.splice(j, 1);
                    })}>{t("Quitar")}</Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 sm:pl-10">
                    <Button variant="ghost" size="sm" disabled={j === 0} onClick={() => editar(d => { const list = d[s].dias[i].ejercicios; [list[j - 1], list[j]] = [list[j], list[j - 1]]; })} aria-label={`Subir ejercicio ${j + 1}`}>{t("\u2191 Subir")}</Button>
                    <Button variant="ghost" size="sm" disabled={j === dia.ejercicios.length - 1} onClick={() => editar(d => { const list = d[s].dias[i].ejercicios; [list[j], list[j + 1]] = [list[j + 1], list[j]]; })} aria-label={`Bajar ejercicio ${j + 1}`}>{t("\u2193 Bajar")}</Button>
                    <Button variant="ghost" size="sm" onClick={() => editar(d => { d[s].dias[i].ejercicios.splice(j + 1, 0, structuredClone(d[s].dias[i].ejercicios[j])); })}>{t("Copiar ejercicio")}</Button>
                  </div>
                  {/* Series: peso, reps, RIR y descanso POR SERIE */}
                  <div className="mt-4 flex flex-col gap-2 sm:pl-10">
                    <Button variant="outline" size="sm" className="self-start" onClick={() => editar(d => { const series = d[s].dias[i].ejercicios[j].series; const primera = structuredClone(series[0]); d[s].dias[i].ejercicios[j].series = series.map(() => ({ ...primera })); })}>{t("Aplicar primera serie a todas")}</Button>
                    <div className="hidden grid-cols-[1.75rem_repeat(4,minmax(0,1fr))_1.5rem] gap-2 sm:grid">
                      <span />
                      {["peso", "reps", "RIR", "descanso"].map((c) => (<span key={t(c)} className={cn(etiqueta, "text-sand-600")}>
                          {t(c)}
                        </span>))}
                      <span />
                    </div>
                    {ej.series.map((serie, k) => (<div key={k} className="grid grid-cols-[1.75rem_minmax(0,1fr)_1.5rem] items-center gap-2">
                        <span className="font-display text-[13px] italic text-sand-600">{t("S")}{k + 1}
                        </span>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{([
                            ["peso", "62,5 kg"],
                            ["reps", "8"],
                            ["rir", "2"],
                            ["descanso", "2:30"],
                        ] as const).map(([campo, ejemplo]) => (<label key={campo} className="min-w-0"><span className="mb-1 block text-[10px] uppercase text-sand-500 sm:sr-only">{t(campo)}</span><Input aria-label={`${campo} de la serie ${k + 1}`} value={serie[campo]} onChange={(e) => editar((d) => {
                                d[s].dias[i].ejercicios[j].series[k][campo] =
                                    e.target.value;
                            })} placeholder={ejemplo} className="h-11 px-2.5 text-[14px]"/></label>))}</div>
                        {ej.series.length > 1 ? (<button type="button" aria-label={`Quitar serie ${k + 1}`} onClick={() => editar((d) => {
                                d[s].dias[i].ejercicios[j].series.splice(k, 1);
                            })} className="cursor-pointer text-sand-600 transition-colors hover:text-error">
                            ×
                          </button>) : (<span />)}
                      </div>))}
                    <Button variant="ghost" size="sm" className="self-start" onClick={() => editar((d) => {
                        d[s].dias[i].ejercicios[j].series.push(serieVacia());
                    })}>{t("+ A\u00F1adir serie")}</Button>
                  </div>
                </div>))}

              <div className="border-t border-edge px-6 py-4">
                <Button variant="outline" size="sm" onClick={() => editar((d) => {
                    d[s].dias[i].ejercicios.push(ejercicioVacio());
                })}>{t("+ Añadir ejercicio al día {0}", { "0": i + 1 })}
                </Button>
              </div>
            </div>);
        })}

        <div className="flex flex-wrap items-center gap-3 px-6 py-4">
          <Button variant="outline" size="sm" onClick={() => editar((d) => {
            d[Math.min(activa, semanas.length - 1)].dias.push(diaVacio());
        })}>{t("+ Añadir día a la semana {0}", { "0": Math.min(activa, semanas.length - 1) + 1 })}
          </Button>
          {semanas.length > 1 && (<Button variant="ghost" size="sm" className="ml-auto" onClick={() => quitarSemana(Math.min(activa, semanas.length - 1))}>{t("Quitar semana ")}{Math.min(activa, semanas.length - 1) + 1}
            </Button>)}
        </div>
      </section>

      {/* ————— Guardar ————— */}
      <section className="sticky bottom-0 z-30 flex flex-col gap-4 rounded-sm border border-edge bg-ink-900 p-4 shadow-xl sm:p-6">
        {estado.error && (<p role="alert" className="rounded-xs border border-oxblood-500/50 bg-ink-800 px-4 py-3 text-[13px] leading-relaxed text-error">
            {estado.error}
          </p>)}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" name="accion" value="publicar" size="md" disabled={pendiente}>
            {pendiente
            ? t("Guardando…")
            : t("Publicar a {0}", { "0": cliente.full_name.split(" ")[0] })}
          </Button>
          <Button type="submit" name="accion" value="borrador" variant="outline" size="md" disabled={pendiente}>{t("Guardar como borrador")}</Button>
          <p className="text-[12.5px] text-sand-500 sm:ml-auto sm:max-w-[28ch] sm:text-right">{t("El borrador no es visible para el cliente hasta que lo publiques.")}</p>
        </div>
      </section>
    </form>);
}
