import { getI18n } from "@/lib/i18n/server";
import { QUESTIONNAIRE_SECTIONS, type PreguntaCuestionario, type Respuestas } from "@/lib/questionnaire";

export async function QuestionnaireAnswers({ preguntas, respuestas }: { preguntas: PreguntaCuestionario[]; respuestas: Respuestas }) {
  const { t } = await getI18n();
  const known = new Set(preguntas.map(p => p.id));
  const fields: PreguntaCuestionario[] = [...preguntas, ...Object.keys(respuestas).filter(id => !known.has(id)).map(id => ({ id, texto: id, tipo: "texto" as const }))];
  return <div className="mt-5 space-y-4">{QUESTIONNAIRE_SECTIONS.map(section => {
    const questions = fields.filter(q => (q.seccion ?? "perfil") === section.id && q.id in respuestas);
    if (!questions.length) return null;
    return <details key={section.id} open className="rounded-xl border border-edge p-4 sm:p-5">
      <summary className="cursor-pointer text-sm font-semibold text-cognac-300">{t(section.titulo)}</summary>
      <dl className="mt-4 space-y-4">{questions.map(q => {
        const value = respuestas[q.id];
        return <div key={q.id}><dt className="text-xs leading-relaxed text-sand-500">{t(q.texto)}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-sand-100">{Array.isArray(value) ? value.map(v => t(v)).join(", ") : (q.tipo === "select" ? t(value) : value) || "—"}{value && q.unidad ? ` ${t(q.unidad)}` : ""}</dd></div>;
      })}</dl>
    </details>;
  })}</div>;
}
