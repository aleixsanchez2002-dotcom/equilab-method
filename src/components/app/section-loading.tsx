"use client";

import { useI18n } from "@/components/i18n/provider";

export function SectionLoading() {
  const { t } = useI18n();
  return <div role="status" aria-live="polite" className="mx-auto w-full max-w-5xl px-6 py-16">
    <p className="text-sm text-sand-300">{t("Cargando tu espacio…")}</p>
    <div aria-hidden="true" className="mt-6 space-y-4 motion-safe:animate-pulse">
      <div className="h-8 w-2/3 rounded-lg bg-ink-800" />
      <div className="h-40 rounded-xl border border-edge bg-ink-900" />
    </div>
  </div>;
}
