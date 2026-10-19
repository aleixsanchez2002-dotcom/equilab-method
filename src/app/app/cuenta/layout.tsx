import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import type { ReactNode } from "react";
import { ClientNav } from "@/components/app/client-nav";
import { AccountNav } from "@/components/app/account-nav";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
import { cerrarSesion } from "../actions";
/** Marco común de la cuenta: cabecera y menú de secciones. */
export default async function CuentaLayout({ children }: {
    children: ReactNode;
}) {
    const { t, home } = await getI18n();
    return (<div className="min-h-dvh bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-edge bg-ink-950/95">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href={home} aria-label={t("Equilab Method \u2014 ir a la portada")} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400">
            <Logo size="sm"/>
          </Link>
          <div className="flex items-center gap-3">
            <form action={cerrarSesion}>
              <Button variant="ghost" size="sm" type="submit">{t("Salir")}</Button>
            </form>
          </div>
        </div>
      </header>

      <ClientNav active="cuenta"/>
      <main className="mx-auto max-w-4xl px-6 pt-10 pb-32">
        <Overline accent>{t("Tu cuenta")}</Overline>

        <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
          <AccountNav />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </div>);
}
