import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Overline } from "@/components/ui/overline";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import { tieneAccesoVigente, type Subscription } from "@/lib/supabase/types";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Contáctanos — Equilab Method")
    };
}
export default async function ContactoPage() {
    const { t } = await getI18n();
    if (!supabaseConfigurado)
        redirect("/app");
    const supabase = await createSupabaseServer();
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user)
        redirect("/acceso");
    const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan_code, status, current_period_end, cancel_at_period_end")
        .eq("user_id", user.id)
        .maybeSingle<Subscription>();
    const esPremium = sub?.plan_code === "premium" && tieneAccesoVigente(sub ?? null);
    return (<>
      <h1 className="font-display text-3xl font-medium text-sand-50">{t("Cont\u00E1ctanos")}</h1>
      <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-sand-500">{t("Dudas con un ejercicio, con tu plan o con tu cuenta: escr\u00EDbenos y te contestamos ")}{esPremium ? "en menos de 24 h" : "en menos de 48 h"}{" "}{t("laborables.")}</p>

      <Card className="mt-8 p-6 sm:p-8">
        <Overline accent>Instagram</Overline>
        <p className="mt-3 text-[14px] leading-relaxed text-sand-500">{t("La v\u00EDa m\u00E1s r\u00E1pida: m\u00E1ndanos un mensaje directo.")}</p>
        <a href="https://instagram.com/giovannidressage" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xs border border-edge-strong px-4 py-2.5 text-[13px] font-semibold text-sand-100 transition-colors hover:border-cognac-400 hover:text-cognac-300">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/>
          </svg>
          @giovannidressage
        </a>
      </Card>

      {esPremium && (<Card className="mt-6 border-cognac-500/40 p-6 sm:p-8">
          <Overline accent>{t("Tu seguimiento Premium")}</Overline>
          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-sand-500">{t("Como cliente Premium tienes revisi\u00F3n mensual con el equipo. Aqu\u00ED aparecer\u00E1 tu pr\u00F3xima videollamada y podr\u00E1s agendarla cuando conectemos la agenda.")}</p>
        </Card>)}

      {/* PLACEHOLDER: email y WhatsApp de soporte pendientes de que el equipo
                decida cuáles usar. */}
      <p className="mt-6 text-[12.5px] leading-relaxed text-sand-600">{t("Pronto a\u00F1adiremos tambi\u00E9n email y WhatsApp de soporte.")}</p>
    </>);
}
