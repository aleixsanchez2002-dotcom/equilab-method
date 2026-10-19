import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/overline";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getI18n();
    return {
        title: t("Información del bloque — Equilab Method")
    };
}
type Rutina = {
    title: string;
    weeks: number | null;
    explanation: string | null;
};
/** La explicación completa del bloque: el porqué de tu entrenamiento. */
export default async function BloquePage() {
    const { t } = await getI18n();
    if (!supabaseConfigurado)
        redirect("/app");
    const supabase = await createSupabaseServer();
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user)
        redirect("/acceso");
    const { data: rutina } = await supabase
        .from("routines")
        .select("title, weeks, explanation")
        .eq("user_id", user.id)
        .eq("status", "publicada")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<Rutina>();
    if (!rutina?.explanation)
        redirect("/app");
    return (<div className="min-h-dvh bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-edge bg-ink-950/95">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Logo size="sm"/>
          <Link href="/app">
            <Button variant="ghost" size="sm" tabIndex={-1}>{t("\u2190 Tu entrenamiento")}</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        <Overline accent>{t("Informaci\u00F3n de este bloque")}</Overline>
        <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-sand-50">
          {t(rutina.title)}
        </h1>
        {rutina.weeks && (<p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-sand-600">{t("Bloque de ")}{rutina.weeks}{t(" semanas")}</p>)}

        {/* whitespace-pre-line: el coach puede estructurar con párrafos */}
        <div className="mt-10 border-l-2 border-cognac-500/40 pl-6">
          <p className="text-[16px] leading-[1.8] whitespace-pre-line break-words text-sand-300">
            {t(rutina.explanation)}
          </p>
        </div>

        <div className="mt-12">
          <Link href="/app">
            <Button variant="outline" tabIndex={-1}>{t("Volver a tu rutina")}</Button>
          </Link>
        </div>
      </main>
    </div>);
}
