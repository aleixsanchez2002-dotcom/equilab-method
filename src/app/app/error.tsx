"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/provider";

export default function ClientError({ unstable_retry }: { unstable_retry: () => void }) {
  const { t } = useI18n();
  return <div role="alert" className="mx-auto max-w-xl px-6 py-16">
    <h2 className="font-display text-2xl text-sand-50">{t("No hemos podido cargar esta sección.")}</h2>
    <p className="mt-4 text-sm leading-relaxed text-sand-500">{t("Comprueba tu conexión e inténtalo de nuevo. Tus datos guardados siguen intactos.")}</p>
    <div className="mt-6 flex flex-wrap gap-4">
      <button type="button" onClick={unstable_retry} className="min-h-12 rounded-lg bg-cognac-500 px-6 font-semibold text-ink-950">{t("Volver a intentar")}</button>
      <Link href="/app/cuenta" className="inline-flex min-h-12 items-center rounded-lg border border-edge px-6 text-sand-100">{t("Cuenta")}</Link>
    </div>
  </div>;
}
