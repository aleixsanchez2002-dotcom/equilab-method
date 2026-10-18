import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Logo } from "@/components/brand/logo";
import { ImageSlot } from "@/components/media/image-slot";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Acceso — Equilab Method"),
        description: t("Inicia sesión o crea tu cuenta en Equilab Method.")
    };
}
async function BrandPanel() {
    const { t, home } = await getI18n();
    return (<section className="relative flex flex-col justify-between gap-12 bg-navy p-6 text-paper sm:p-10 lg:min-h-dvh lg:p-12">
      <header className="animate-rise relative flex items-center justify-between">
        <Link href={home} aria-label={t("Equilab Method \u2014 volver a la portada")} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper">
          <Logo size="md" tone="light"/>
        </Link>
        <Link href={home} className="link-quiet text-[14px] font-semibold text-navy-soft hover:text-paper">{t("\u2190 Volver")}</Link>
      </header>

      <div className="relative max-w-xl">
        <h1 className="animate-rise font-display text-[clamp(2.5rem,1.6rem+3.6vw,4.5rem)] leading-none tracking-[-0.03em]" style={{ animationDelay: "120ms" }}>
          <span className="block">{t("Entrena fuera.")}</span>
          <span className="block">{t("Monta mejor.")}</span>
        </h1>
        <p className="animate-rise mt-6 max-w-md font-serif text-[18px] leading-relaxed text-navy-soft" style={{ animationDelay: "200ms" }}>{t("Crea tu cuenta, cu\u00E9ntanos c\u00F3mo montas y recibe un entrenamiento pensado para tu asiento.")}</p>
      </div>

      {/* Misma foto y tratamiento que la portada */}
      <figure className="animate-rise relative hidden aspect-[2/1] overflow-hidden lg:block" style={{ animationDelay: "280ms" }}>
        <ImageSlot src="/media/pista.jpg" alt={t("Jinete y caballo durante una sesi\u00F3n en la pista")} spec="Entrenamiento en pista" sizes="50vw" imgClassName="photo-mono"/>
      </figure>

      <footer className="relative hidden items-center justify-between text-[14px] text-navy-soft lg:flex">
        <span>© 2026 Equilab Method</span>
        <span>Giovanni Torrens · Alex Ricarte · Aleix Sánchez</span>
      </footer>
    </section>);
}
export default async function AccesoPage() {
    const { t } = await getI18n();
    // Quien ya tiene sesión va directo a su área.
    if (supabaseConfigurado) {
        const supabase = await createSupabaseServer();
        const { data: { user }, } = await supabase.auth.getUser();
        if (user)
            redirect("/app");
    }
    return (<main className="min-h-dvh lg:grid lg:grid-cols-[1.15fr_1fr]">
      <BrandPanel />
      <section className="flex items-start justify-center bg-linen px-6 py-14 sm:px-12 lg:items-center lg:py-0">
        <div className="animate-rise w-full max-w-sm" style={{ animationDelay: "200ms" }}>
          <AuthCard />
          <p className="mt-10 text-center text-[13px] leading-relaxed text-sand-500">{t("Al continuar aceptas los")}{" "}
            <a href="#" className="underline underline-offset-2 hover:text-sand-300">{t("t\u00E9rminos del servicio")}</a>{" "}{t("y la")}{" "}
            <a href="#" className="underline underline-offset-2 hover:text-sand-300">{t("pol\u00EDtica de privacidad")}</a>
            .
          </p>
        </div>
      </section>
    </main>);
}
