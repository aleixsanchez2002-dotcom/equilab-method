"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/components/i18n/provider";
import { responderCuestionario, type CuestionarioEstado } from "@/app/app/cuestionario/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { QUESTIONNAIRE_SECTIONS, preguntaVisible, preguntaRequerida, validarCuestionario, type PreguntaCuestionario, type Respuestas } from "@/lib/questionnaire";
export type { PreguntaCuestionario } from "@/lib/questionnaire";

const estadoInicial: CuestionarioEstado = {};
const inputClass = "w-full rounded-lg border border-edge bg-ink-900 px-4 py-3 text-base text-sand-100 placeholder:text-sand-600 focus:border-cognac-400 focus:outline-none focus:ring-2 focus:ring-cognac-500/20";

export function QuestionnaireForm({ templateId, preguntas, preview = false }: {
  templateId: string;
  preguntas: PreguntaCuestionario[];
  preview?: boolean;
}) {
  const { t } = useI18n();
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [paso, setPaso] = useState(0);
  const [ultimoPaso, setUltimoPaso] = useState(0);
  const initialStep = useRef(true);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, accion, pendiente] = useActionState(responderCuestionario, estadoInicial);
  const heading = useRef<HTMLHeadingElement>(null);
  const grupos = QUESTIONNAIRE_SECTIONS.map(section => ({ ...section, preguntas: preguntas.filter(p => (p.seccion ?? "perfil") === section.id) })).filter(s => s.preguntas.length > 0);
  const revisar = paso === grupos.length;
  const grupo = grupos[paso];
  const visibles = grupo?.preguntas.filter(p => preguntaVisible(p, respuestas)) ?? [];
  const errors = { ...estado.errores, ...errores };

  useEffect(() => {
    if (initialStep.current) { initialStep.current = false; return; }
    heading.current?.focus();
  }, [paso]);

  function cambiar(id: string, valor: string | string[]) {
    setRespuestas(prev => ({ ...prev, [id]: valor }));
    setErrores(prev => { const next = { ...prev }; delete next[id]; return next; });
  }
  function elegir(p: PreguntaCuestionario, opcion: string) {
    if (p.tipo === "select") return cambiar(p.id, opcion);
    const previous = Array.isArray(respuestas[p.id]) ? respuestas[p.id] as string[] : [];
    const next = previous.includes(opcion) ? previous.filter(v => v !== opcion)
      : p.exclusivas?.includes(opcion) ? [opcion]
      : [...previous.filter(v => !p.exclusivas?.includes(v)), opcion];
    cambiar(p.id, next);
  }
  function continuar() {
    const validacion = validarCuestionario(visibles, respuestas);
    setErrores(validacion.errores);
    if (Object.keys(validacion.errores).length) {
      document.getElementById(`q-${Object.keys(validacion.errores)[0]}`)?.focus();
      return;
    }
    const siguiente = Math.min(paso + 1, grupos.length);
    setUltimoPaso(prev => Math.max(prev, siguiente));
    setPaso(siguiente);
  }
  function enviar(event: FormEvent<HTMLFormElement>) {
    if (!revisar) { event.preventDefault(); continuar(); return; }
    if (preview) { event.preventDefault(); return; }
    const validacion = validarCuestionario(preguntas, respuestas);
    if (Object.keys(validacion.errores).length) {
      event.preventDefault(); setErrores(validacion.errores);
      setPaso(Math.max(0, grupos.findIndex(g => g.preguntas.some(p => validacion.errores[p.id]))));
    }
  }

  if (!grupos.length) return <p role="status">{t("El cuestionario no está disponible ahora mismo.")}</p>;

  return <form action={accion} onSubmit={enviar} noValidate className="space-y-8">
    <input type="hidden" name="template_id" value={templateId}/>
    <input type="hidden" name="answers" value={JSON.stringify(respuestas)}/>
    {preview && <p className="rounded-xl border border-cognac-500/30 bg-cognac-500/5 p-4 text-sm text-cognac-300">{t("Vista previa: puedes probar los pasos, pero no se guardan respuestas.")}</p>}
    <div className="rounded-2xl border border-edge bg-ink-900 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 text-xs text-sand-500"><span>{t("Paso {0} de {1}", { "0": paso + 1, "1": grupos.length + 1 })}</span><span>{t("8–12 minutos")}</span></div>
      <div role="progressbar" aria-label={t("Progreso del cuestionario")} aria-valuemin={1} aria-valuemax={grupos.length + 1} aria-valuenow={paso + 1} className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-800"><div className="h-full bg-cognac-500 transition-all" style={{ width: `${(paso + 1) / (grupos.length + 1) * 100}%` }}/></div>
      <nav aria-label={t("Pasos del cuestionario")} className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {[...grupos.map(g => g.titulo), "Revisar y enviar"].map((label, i) => <button key={label} type="button" disabled={i > ultimoPaso || pendiente} onClick={() => setPaso(i)} aria-current={i === paso ? "step" : undefined} className={cn("min-h-10 shrink-0 whitespace-nowrap rounded-lg px-3 text-xs transition-colors disabled:opacity-40", i === paso ? "bg-cognac-500 text-ink-950" : "text-sand-300 hover:bg-ink-800")}>{i + 1}. {t(label)}</button>)}
      </nav>
    </div>

    <section aria-labelledby="questionnaire-step-heading">
      <h2 ref={heading} id="questionnaire-step-heading" tabIndex={-1} className="font-display text-2xl text-sand-50 outline-none sm:text-3xl">{t(revisar ? "Todo listo. Repasa tus respuestas." : grupo.titulo)}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sand-500">{t(revisar ? "Comprueba que reflejan tu situación actual. Puedes editar cualquier bloque antes de enviarlo." : grupo.descripcion)}</p>
      {!revisar && <p className="mt-3 text-xs text-sand-500">{t("Las preguntas marcadas como opcionales se pueden dejar en blanco.")}</p>}
      {grupo?.id === "salud" && <p className="mt-4 rounded-xl border border-edge p-4 text-sm leading-relaxed text-sand-300">{t("Cuéntanos solo lo necesario para adaptar el entrenamiento. No adjuntes informes médicos. Tus respuestas son privadas y las revisa el equipo.")}</p>}

      {revisar ? <div className="mt-8 space-y-5">{grupos.map((g, index) => <div key={g.id} className="rounded-xl border border-edge bg-ink-900 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-lg text-sand-50">{t(g.titulo)}</h3><Button variant="outline" size="sm" onClick={() => setPaso(index)}>{t("Editar este bloque")}</Button></div>
        <dl className="mt-4 space-y-4">{g.preguntas.filter(p => preguntaVisible(p, respuestas)).map(p => {
          const value = respuestas[p.id];
          return <div key={p.id}><dt className="text-xs text-sand-500">{t(p.texto)}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-sand-100">{Array.isArray(value) ? value.map(v => t(v)).join(", ") : value ? (p.tipo === "select" ? t(value) : value) : t("Sin respuesta (opcional)")}{value && p.unidad ? ` ${t(p.unidad)}` : ""}</dd></div>;
        })}</dl>
      </div>)}</div> : <div className="mt-8 space-y-6">{visibles.map(p => {
        const error = errors[p.id];
        return <fieldset key={p.id} id={`q-${p.id}`} tabIndex={-1} disabled={pendiente} aria-describedby={`${p.ayuda ? `hint-${p.id}` : ""} ${error ? `error-${p.id}` : ""}`.trim() || undefined} className="min-w-0 rounded-xl border border-edge bg-ink-900/40 p-5 outline-cognac-400 sm:p-6">
          <legend className="max-w-full px-1 text-base font-semibold text-sand-100">{t(p.texto)}{!preguntaRequerida(p) && <span className="ml-2 text-xs font-normal text-sand-500">{t("Opcional")}</span>}</legend>
          {p.ayuda && <p id={`hint-${p.id}`} className="mb-4 text-sm leading-relaxed text-sand-500">{t(p.ayuda)}</p>}
          {p.tipo === "select" || p.tipo === "multiselect" ? <div className="flex flex-wrap gap-2">
            {p.opciones?.map(opcion => <label key={opcion} className="min-w-0 cursor-pointer">
              <input type={p.tipo === "select" ? "radio" : "checkbox"} name={`choice-${p.id}`} value={opcion} checked={Array.isArray(respuestas[p.id]) ? respuestas[p.id].includes(opcion) : respuestas[p.id] === opcion} onChange={() => elegir(p, opcion)} aria-invalid={!!error} className="peer sr-only"/>
              <span className="inline-flex min-h-12 items-center rounded-lg border border-edge px-4 py-3 text-sm text-sand-300 transition-colors hover:border-cognac-400 peer-checked:border-cognac-500 peer-checked:bg-cognac-500 peer-checked:text-ink-950 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cognac-400">{t(opcion)}</span>
            </label>)}
          </div> : p.tipo === "numero" ? <div className="flex max-w-xs items-center gap-3"><input aria-label={t(p.texto)} aria-invalid={!!error} type="number" inputMode={p.paso === "0.1" ? "decimal" : "numeric"} min={p.min} max={p.max} step={p.paso ?? 1} value={String(respuestas[p.id] ?? "")} onChange={e => cambiar(p.id, e.target.value)} className={inputClass}/>{p.unidad && <span className="text-sm text-sand-500">{t(p.unidad)}</span>}</div>
          : <textarea aria-label={t(p.texto)} aria-invalid={!!error} rows={3} maxLength={2000} placeholder={t("Cuéntanoslo con tus palabras…")} value={String(respuestas[p.id] ?? "")} onChange={e => cambiar(p.id, e.target.value)} className={inputClass}/>}
          {p.tipo === "multiselect" && <p className="mt-3 text-xs text-sand-500">{t("Puedes elegir varias.")}</p>}
          {error && <p id={`error-${p.id}`} role="alert" className="mt-3 text-sm text-error">{t(error)}</p>}
        </fieldset>;
      })}</div>}
    </section>
    {estado.error && <p role="alert" className="rounded-xl border border-oxblood-500/50 p-4 text-sm text-error">{t(estado.error)}</p>}
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-edge bg-ink-900 p-4 sm:p-6">
      {paso > 0 && <Button variant="outline" onClick={() => setPaso(p => p - 1)} disabled={pendiente}>{t("Anterior")}</Button>}
      {revisar ? <Button key="enviar" type="submit" disabled={pendiente || preview}>{pendiente ? t("Enviando…") : t("Enviar cuestionario")}</Button> : <Button key="continuar" onClick={continuar}>{t(paso === grupos.length - 1 ? "Revisar mis respuestas" : "Continuar")}{" →"}</Button>}
      <p className="w-full text-xs leading-relaxed text-sand-500">{t("Las respuestas se guardan al enviar. Puedes volver a los pasos anteriores sin perder lo que has escrito.")}</p>
    </div>
  </form>;
}
