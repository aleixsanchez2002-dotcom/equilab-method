"use client";

import { useLinkStatus } from "next/link";
import { useI18n } from "@/components/i18n/provider";

/** Confirma el clic mientras llega la siguiente sección, sin mover el menú. */
export function NavigationHint() {
  const { pending } = useLinkStatus();
  const { t } = useI18n();
  return <span role="status" className="absolute inset-x-2 bottom-1 h-0.5" aria-live="polite">
    {pending && <><span aria-hidden="true" className="block h-full animate-pulse rounded-full bg-cognac-400 motion-reduce:animate-none" /><span className="sr-only">{t("Cargando sección…")}</span></>}
  </span>;
}
