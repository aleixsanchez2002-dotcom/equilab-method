import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Link from "next/link";
import { RecoveryRequestForm } from "@/components/auth/recovery-form";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Recuperar contraseña — Equilab Method")
    };
}
export default async function RecuperarPage() {
    const { t } = await getI18n();
    return (<div className="flex min-h-dvh flex-col bg-ink-950">
      <header className="border-b border-edge">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-6">
          <Link href="/acceso" aria-label={t("Volver al acceso")}>
            <Logo size="sm"/>
          </Link>
          <Link href="/acceso">
            <Button variant="ghost" size="sm" tabIndex={-1}>{t("\u2190 Volver")}</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-14">
        <Overline accent>{t("Recuperar acceso")}</Overline>
        <h1 className="mt-4 font-display text-3xl font-medium leading-[1.15] text-sand-50">{t("\u00BFHas olvidado tu contrase\u00F1a?")}</h1>
        <p className="mt-4 text-[14px] leading-relaxed text-sand-500">{t("Dinos tu email y te enviamos un enlace para crear una nueva.")}</p>
        <div className="mt-8">
          <RecoveryRequestForm />
        </div>
      </main>
    </div>);
}
