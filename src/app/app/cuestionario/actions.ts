"use server";

import { validarCuestionario, type PreguntaCuestionario, type Respuestas } from "@/lib/questionnaire";
import { tieneAccesoVigente, type Subscription } from "@/lib/supabase/types";
import { getI18n } from "@/lib/i18n/server";
import { redirect } from "next/navigation";
import {
  generarRutinaSemi,
  type EjercicioCatalogo,
} from "@/lib/motor-rutinas";
import { createSupabaseServer } from "@/lib/supabase/server";

export type CuestionarioEstado = { error?: string; errores?: Record<string, string> };

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

  const { data: acceso } = await supabase.from("subscriptions")
    .select("plan_code, status, current_period_end, cancel_at_period_end")
    .eq("user_id", user.id).maybeSingle<Subscription>();
  if (!tieneAccesoVigente(acceso ?? null)) return { error: "Necesitas un plan activo para enviar el cuestionario." };

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
    .eq("active", true)
    .single<{ id: string; questions: PreguntaCuestionario[] }>();
  if (!plantilla) return { error: "El cuestionario ha cambiado. Recarga la página." };

  let entrada: Respuestas;
  try {
    const raw = formData.get("answers");
    if (typeof raw === "string" && raw.length > 100_000) return { error: "El cuestionario es demasiado largo." };
    entrada = raw ? JSON.parse(String(raw)) : Object.fromEntries(plantilla.questions.map(p => [p.id, p.tipo === "multiselect" ? formData.getAll(p.id).map(String) : String(formData.get(p.id) ?? "")]));
    if (!entrada || typeof entrada !== "object" || Array.isArray(entrada)) throw new Error("Invalid answers");
  } catch {
    return { error: "No se pudieron leer las respuestas. Revisa el formulario." };
  }
  const { respuestas, errores } = validarCuestionario(plantilla.questions, entrada);
  if (Object.keys(errores).length) return { error: t("Revisa las respuestas marcadas antes de enviar."), errores };

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
