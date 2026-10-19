import Link from "next/link";
import { redirect } from "next/navigation";
import { QuestionnaireForm } from "@/components/app/questionnaire-form";
import { QUESTIONNAIRE_QUESTIONS, QUESTIONNAIRE_VERSION } from "@/lib/questionnaire";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
import { activarCuestionario } from "./actions";
import { Button } from "@/components/ui/button";

export default async function CuestionarioEquipo({ searchParams }: { searchParams: Promise<{ actualizado?: string; error?: string }> }) {
  const { t } = await getI18n();
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/acceso");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "coach") redirect("/app");
  const { data: current } = await supabase.from("questionnaire_templates").select("version").eq("active", true).order("version", { ascending: false }).limit(1).maybeSingle();
  const params = await searchParams;
  const active = current?.version === QUESTIONNAIRE_VERSION;
  return <main className="mx-auto w-full max-w-3xl px-5 pt-8 pb-36 sm:px-6">
    <Link href="/admin" className="inline-flex min-h-11 items-center text-sm text-cognac-300">{t("← Volver al panel")}</Link>
    <h1 className="mt-6 font-display text-3xl text-sand-50">{t("Cuestionario inicial del jinete")}</h1>
    <p className="mt-4 text-sm leading-relaxed text-sand-500">{t("Cinco bloques y una revisión final. Las respuestas anteriores se conservan con su versión original.")}</p>
    <div className="my-8 rounded-xl border border-edge bg-ink-900 p-5">
      {active ? <p role="status" className="text-sm text-cognac-300">{t("Este cuestionario ya está activo para los nuevos clientes.")}</p> : <form action={activarCuestionario}><Button type="submit">{t("Activar este cuestionario")}</Button><p className="mt-3 text-xs text-sand-500">{t("Se utilizará para las próximas respuestas. No modifica los cuestionarios ya enviados.")}</p></form>}
      {params.error && <p role="alert" className="mt-3 text-sm text-error">{t("No se pudo activar el cuestionario. Revisa la versión o los permisos del equipo.")}</p>}
    </div>
    <QuestionnaireForm templateId="preview" preguntas={QUESTIONNAIRE_QUESTIONS} preview/>
  </main>;
}
