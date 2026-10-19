import { premiumContacts } from "@/lib/premium-contacts";
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
    const contactos = esPremium ? premiumContacts() : [];
    return (<>
      <h1 className="font-display text-3xl font-medium text-sand-50">{t("Cont\u00E1ctanos")}</h1>
      <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-sand-500">{t("Dudas con un ejercicio, con tu plan o con tu cuenta: escr\u00EDbenos y te contestamos ")}{esPremium ? t("en menos de 24 h") : t("en menos de 48 h")}{" "}{t("laborables.")}</p>

      <Card className="mt-8 p-6 sm:p-8">
        <Overline accent>Instagram</Overline>
        <p className="mt-3 text-[14px] leading-relaxed text-sand-500">{t("La v\u00EDa m\u00E1s r\u00E1pida: m\u00E1ndanos un mensaje directo.")}</p>
        <a href="https://instagram.com/equilab_method" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xs border border-edge-strong px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sand-100 transition-colors hover:border-cognac-400 hover:text-cognac-300">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/>
          </svg>
          @equilab_method
        </a>
      </Card>

      {esPremium && contactos.length > 0 && (<Card className="mt-6 border-cognac-500/40 p-6 sm:p-8">
          <Overline accent>{t("Contacto directo Premium")}</Overline>
          <h2 className="mt-3 font-display text-2xl text-sand-50">{t("Tu equipo, más cerca.")}</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-sand-500">{t("Estos son tus contactos directos para el seguimiento de tu entrenamiento.")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {contactos.map(({ name, role, display, href }) => <div key={name} className="min-w-0 rounded-xl border border-edge bg-ink-950 p-5">
              <h3 className="font-semibold text-sand-100">{name}</h3>
              <p className="mt-1 text-xs text-sand-500">{t(role)}</p>
              <a href={href} aria-label={t("Llamar a {0}: {1}", { "0": name, "1": display })} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-lg border border-cognac-500/40 px-4 text-base font-semibold text-cognac-300 transition-colors hover:bg-cognac-500/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400">
                <span aria-hidden="true">☎</span>{display}
              </a>
            </div>)}
          </div>
        </Card>)}

      {esPremium && (<Card className="mt-6 border-cognac-500/40 p-6 sm:p-8">
          <Overline accent>{t("Tu seguimiento Premium")}</Overline>
          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-sand-500">{t("Como cliente Premium tienes revisi\u00F3n mensual con el equipo. Aqu\u00ED aparecer\u00E1 tu pr\u00F3xima videollamada y podr\u00E1s agendarla cuando conectemos la agenda.")}</p>
        </Card>)}

    </>);
}
