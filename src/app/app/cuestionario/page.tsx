import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { QuestionnaireForm, type PreguntaCuestionario, } from "@/components/app/questionnaire-form";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import { tieneAccesoVigente, type Subscription } from "@/lib/supabase/types";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Tu cuestionario — Equilab Method")
    };
}
export default async function CuestionarioPage() {
    const { t } = await getI18n();
    if (!supabaseConfigurado)
        redirect("/app");
    const supabase = await createSupabaseServer();
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user)
        redirect("/acceso");
    const [{ data: sub }, { data: previa }, { data: plantilla }] = await Promise.all([
        supabase
            .from("subscriptions")
            .select("plan_code, status, current_period_end, cancel_at_period_end")
            .eq("user_id", user.id)
            .maybeSingle<Subscription>(),
        supabase
            .from("questionnaire_responses")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle<{
            id: string;
        }>(),
        supabase
            .from("questionnaire_templates")
            .select("id, title, questions")
            .eq("active", true)
            .order("version", { ascending: false })
            .limit(1)
            .maybeSingle<{
            id: string;
            title: string;
            questions: PreguntaCuestionario[];
        }>(),
    ]);
    // Sin acceso no hay cuestionario; y si ya respondió, no se repite.
    if (!tieneAccesoVigente(sub ?? null) || previa)
        redirect("/app");
    return (<div className="min-h-dvh bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-edge bg-ink-950/95">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Logo size="sm"/>
          <Link href="/app">
            <Button variant="ghost" size="sm" tabIndex={-1}>{t("\u2190 Volver")}</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <Overline accent>{t("Antes de empezar")}</Overline>
        <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-sand-50">{t("Cu\u00E9ntanos c\u00F3mo montas.")}</h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-sand-500">{t("Gracias por confiar en Equilab. Queremos conocer cómo montas, qué necesitas y qué quieres conseguir. Tus respuestas nos ayudan a preparar un entrenamiento que encaje contigo, dentro y fuera de la pista.")}</p>

        <div className="mt-12">
          {plantilla ? (<QuestionnaireForm templateId={plantilla.id} preguntas={plantilla.questions}/>) : (<p className="text-[14px] text-sand-500">{t("El cuestionario no est\u00E1 disponible ahora mismo. Vuelve a intentarlo en un rato.")}</p>)}
        </div>
      </main>
    </div>);
}
