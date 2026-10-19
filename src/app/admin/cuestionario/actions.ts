"use server";
import { isDeepStrictEqual } from "node:util";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { QUESTIONNAIRE_QUESTIONS, QUESTIONNAIRE_TITLE, QUESTIONNAIRE_VERSION } from "@/lib/questionnaire";

export async function activarCuestionario() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/acceso");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "coach") redirect("/app");
  const { data: existing } = await supabase.from("questionnaire_templates").select("id, questions, active").eq("version", QUESTIONNAIRE_VERSION).maybeSingle();
  if (existing) {
    // Nunca sustituir preguntas de una versión que ya puede tener respuestas.
    if (!isDeepStrictEqual(existing.questions, QUESTIONNAIRE_QUESTIONS)) redirect("/admin/cuestionario?error=version");
    const { error } = await supabase.from("questionnaire_templates").update({ active: true }).eq("id", existing.id);
    if (error) redirect("/admin/cuestionario?error=guardar");
  } else {
    const { error } = await supabase.from("questionnaire_templates").insert({ version: QUESTIONNAIRE_VERSION, title: QUESTIONNAIRE_TITLE, questions: QUESTIONNAIRE_QUESTIONS, active: true });
    if (error) redirect("/admin/cuestionario?error=guardar");
  }
  revalidatePath("/app/cuestionario");
  revalidatePath("/admin/cuestionario");
  redirect("/admin/cuestionario?actualizado=1");
}
