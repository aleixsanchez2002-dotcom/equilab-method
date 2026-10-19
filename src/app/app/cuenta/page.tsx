import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmailForm, NombreForm, PasswordForm, } from "@/components/app/account-forms";
import { Card } from "@/components/ui/card";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Perfil — Equilab Method")
    };
}
export default async function PerfilPage() {
    const { t } = await getI18n();
    if (!supabaseConfigurado)
        redirect("/app");
    const supabase = await createSupabaseServer();
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user)
        redirect("/acceso");
    const { data: perfil } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", user.id)
        .single<Profile>();
    return (<>
      <h1 className="font-display text-3xl font-medium text-sand-50">{t("Perfil")}</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-sand-500">{t("Tu nombre, tu email y tu contrase\u00F1a.")}</p>

      <Card className="mt-8 flex flex-col gap-8 p-6 sm:p-8">
        <NombreForm nombreActual={perfil?.full_name ?? ""}/>
        <div className="border-t border-edge pt-8">
          <EmailForm emailActual={user.email ?? ""}/>
        </div>
        <div className="border-t border-edge pt-8">
          <PasswordForm />
        </div>
      </Card>
    </>);
}
