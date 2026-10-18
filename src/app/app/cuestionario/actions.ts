"use server";

import { getI18n } from "@/lib/i18n/server";
import { redirect } from "next/navigation";
import {
  generarRutinaSemi,
  type EjercicioCatalogo,
  type RespuestasCuestionario,
} from "@/lib/motor-rutinas";
import { createSupabaseServer } from "@/lib/supabase/server";

export type CuestionarioEstado = { error?: string };

type Pregunta = {
  id: string;
  tipo: "select" | "multiselect" | "texto";
  texto: string;
  opciones?: string[];
};

export async function responderCuestionario(
  _prev: CuestionarioEstado,
  formData: FormData,
): Promise<CuestionarioEstado> {
  const { t } = await getI18n();
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión ha caducado: vuelve a entrar." };

  // Evita respuestas duplicadas
  const { data: previa } = await supabase
    .from("questionnaire_responses")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (previa) return { error: "Ya tenemos tu cuestionario. El equipo está con ello." };

  // La plantilla define qué validar (el formulario podría estar desfasado)
  const templateId = String(formData.get("template_id") ?? "");
  const { data: plantilla } = await supabase
    .from("questionnaire_templates")
    .select("id, questions")
    .eq("id", templateId)
    .single<{ id: string; questions: Pregunta[] }>();
  if (!plantilla) return { error: "El cuestionario ha cambiado. Recarga la página." };

  const respuestas: RespuestasCuestionario = {};
  for (const pregunta of plantilla.questions) {
    if (pregunta.tipo === "multiselect") {
      const valores = formData.getAll(pregunta.id).map(String).filter(Boolean);
      if (valores.length === 0) {
        return { error: t("Falta responder: «{0}»", { "0": t(pregunta.texto) }) };
      }
      respuestas[pregunta.id] = valores;
    } else {
      const valor = String(formData.get(pregunta.id) ?? "").trim();
      if (!valor && pregunta.tipo === "select") {
        return { error: t("Falta responder: «{0}»", { "0": t(pregunta.texto) }) };
      }
      respuestas[pregunta.id] = valor;
    }
  }

  const { error: errorRespuesta } = await supabase
    .from("questionnaire_responses")
    .insert({
      user_id: user.id,
      template_id: plantilla.id,
      answers: respuestas,
    });
  if (errorRespuesta) {
    return { error: "No se pudo guardar el cuestionario. Inténtalo de nuevo." };
  }

  // El motor solo propone rutina en el plan Básico; en Premium el equipo
  // construye a mano tras la valoración 1:1.
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_code")
    .eq("user_id", user.id)
    .maybeSingle<{ plan_code: string }>();

  if (sub?.plan_code === "basico") {
    const { data: catalogo } = await supabase
      .from("exercises")
      .select("id, name, category, equipment")
      .returns<EjercicioCatalogo[]>();

    const propuesta = generarRutinaSemi(respuestas, catalogo ?? []);

    // La propuesta se guarda como borrador (políticas de 0004/0005: el
    // cliente puede crear SOLO esto). Los ids se generan aquí porque el
    // cliente no tiene permiso para LEER sus borradores, así que no se
    // puede usar insert().select(). Si algo falla, no bloquea: el equipo
    // verá el cuestionario y podrá crear la rutina a mano.
    const rutinaId = crypto.randomUUID();
    const { error: errorRutina } = await supabase.from("routines").insert({
      id: rutinaId,
      user_id: user.id,
      coach_id: null,
      title: propuesta.title,
      type: "semi",
      status: "borrador",
      weeks: propuesta.weeks,
      notes: propuesta.notes,
      explanation: propuesta.explanation,
    });

    if (!errorRutina) {
      for (const [i, dia] of propuesta.dias.entries()) {
        const diaId = crypto.randomUUID();
        const { error: errorDia } = await supabase.from("routine_days").insert({
          id: diaId,
          routine_id: rutinaId,
          position: i + 1,
          focus: dia.focus,
          duration_note: dia.duration_note,
        });
        if (errorDia) break;
        await supabase.from("routine_exercises").insert(
          dia.ejercicios.map((ej, j) => ({
            routine_day_id: diaId,
            exercise_id: ej.exercise_id,
            position: j + 1,
            technique_note: ej.technique_note || null,
            series: ej.series,
          })),
        );
      }
    }
  }

  redirect("/app?cuestionario=gracias");
}
