import { PLAN_PRICES } from "@/lib/plans";
import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Overline } from "@/components/ui/overline";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import { tieneAccesoVigente, type Subscription } from "@/lib/supabase/types";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Plan y suscripción — Equilab Method")
    };
}
function diasRestantes(sub: Subscription): number | null {
    if (!sub.current_period_end)
        return null;
    const ms = new Date(sub.current_period_end).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 86400000));
}
export default async function PlanPage() {
    const { t, intlLocale } = await getI18n();
    const formatoFecha = new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "long", year: "numeric" });
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
    const acceso = tieneAccesoVigente(sub ?? null);
    const esPremium = sub?.plan_code === "premium";
    const dias = sub ? diasRestantes(sub) : null;
    return (<>
      <h1 className="font-display text-3xl font-medium text-sand-50">{t("Plan y suscripci\u00F3n")}</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-sand-500">{t("Tu plan, tu pr\u00F3ximo cobro y los cambios que quieras hacer.")}</p>

      {/* ————— Estado ————— */}
      <Card className="mt-8 p-6 sm:p-8">
        <Overline accent>{t("Plan actual")}</Overline>
        {acceso && sub ? (<>
            <p className="mt-3 font-display text-3xl text-sand-50">
              {esPremium ? "Premium" : t("B\u00E1sico")}
              <span className="ml-3 align-middle text-[15px] text-sand-500">
                {(PLAN_PRICES[esPremium ? "premium" : "basico"] / 100).toLocaleString(intlLocale)} €{t(" / mes")}</span>
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-light text-sand-50 tabular-nums">
                {dias ?? "—"}
              </span>
              <span className="max-w-[18ch] text-[12px] uppercase tracking-[0.14em] text-sand-600">{t("d\u00EDas de acceso restantes")}</span>
            </div>
            {sub.current_period_end && (<p className="mt-4 text-[14px] text-sand-500">
                {sub.cancel_at_period_end ? (<>{t("Tu suscripci\u00F3n est\u00E1 cancelada: mantienes el acceso hasta el")}{" "}
                    <b className="font-semibold text-sand-100">
                      {formatoFecha.format(new Date(sub.current_period_end))}
                    </b>
                    .
                  </>) : (<>{t("Se renueva el")}{" "}
                    <b className="font-semibold text-sand-100">
                      {formatoFecha.format(new Date(sub.current_period_end))}
                    </b>
                    .
                  </>)}
              </p>)}
          </>) : (<>
            <p className="mt-3 font-display text-2xl text-sand-50">{t("Sin plan activo")}</p>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-sand-500">{t("Tu rutina, tu progreso y tus registros siguen guardados. Al reactivar, lo recuperas todo.")}</p>
          </>)}
      </Card>

      {/* ————— Cambios ————— */}
      <Card className="mt-6 p-6 sm:p-8">
        <Overline>{t("Gestionar")}</Overline>
        <div className="mt-5 flex flex-col gap-3">
          {[
            {
                titulo: esPremium ? t("Cambiar a B\u00E1sico") : t("Mejorar a Premium"),
                detalle: esPremium
                    ? t("Efectivo al final del periodo que ya has pagado.") : t("Valoraci\u00F3n 1:1, rutina hecha a mano y seguimiento mensual del equipo."),
                principal: !esPremium,
            },
            {
                titulo: t("Cambiar tarjeta"),
                detalle: t("Actualiza el m\u00E9todo de pago de tu suscripci\u00F3n."),
                principal: false,
            },
            {
                titulo: t("Cancelar suscripci\u00F3n"),
                detalle: "Sin permanencia: mantienes el acceso hasta el final del periodo pagado.",
                principal: false,
            },
        ].map(({ titulo, detalle, principal }) => (<div key={titulo} className="flex flex-col gap-3 border-t border-edge pt-4 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-sand-100">{t(titulo)}</p>
                <p className="mt-1 max-w-md text-[12.5px] leading-relaxed text-sand-600">
                  {t(detalle)}
                </p>
              </div>
              <Button variant={principal ? "primary" : "outline"} size="sm" disabled title={t("Se activa con los pagos autom\u00E1ticos")} className="shrink-0">
                {t(titulo)}
              </Button>
            </div>))}
        </div>
        <p className="mt-6 max-w-lg text-[12.5px] leading-relaxed text-sand-600">{t("La gesti\u00F3n autom\u00E1tica del plan y la tarjeta llega con los pagos. Mientras tanto, escr\u00EDbenos y lo hacemos nosotros en el momento.")}</p>
      </Card>
    </>);
}
