import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NewPasswordForm } from "@/components/auth/recovery-form";
import { Logo } from "@/components/brand/logo";
import { Overline } from "@/components/ui/overline";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Nueva contraseña — Equilab Method")
    };
}
export default async function NuevaContrasenaPage() {
    const { t } = await getI18n();
    if (!supabaseConfigurado)
        redirect("/acceso");
    // Solo se llega aquí con la sesión que abre el enlace del email.
    const supabase = await createSupabaseServer();
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user)
        redirect("/acceso/recuperar");
    return (<div className="flex min-h-dvh flex-col bg-ink-950">
      <header className="border-b border-edge">
        <div className="mx-auto flex h-16 max-w-md items-center px-6">
          <Link href="/acceso" aria-label="Equilab Method">
            <Logo size="sm"/>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-14">
        <Overline accent>{t("Un paso m\u00E1s")}</Overline>
        <h1 className="mt-4 font-display text-3xl font-medium leading-[1.15] text-sand-50">{t("Crea tu contrase\u00F1a nueva.")}</h1>
        <div className="mt-8">
          <NewPasswordForm />
        </div>
      </main>
    </div>);
}
