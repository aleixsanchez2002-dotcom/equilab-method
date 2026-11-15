import documents from "./documents.json";
import { PLAN_PRICES } from "@/lib/plans";
import type { Locale } from "@/lib/i18n/shared";

export const LEGAL_DRAFT_VERSION = "2026-10-20-borrador-1";
export const LEGAL_IS_DRAFT = true;
export const LEGAL_SLUGS = ["aviso-legal", "privacidad", "condiciones", "cookies"] as const;
export type LegalSlug = typeof LEGAL_SLUGS[number];
export type LegalDocument = { title: string; intro: string; pending: string[]; sections: { id: string; title: string; paragraphs: string[]; items?: string[] }[] };
export function legalDocument(slug: string, locale: Locale): LegalDocument | null {
  if (!LEGAL_SLUGS.some(s => s === slug)) return null;
  return documents[slug as LegalSlug][locale];
}
export function legalText(text: string, locale: Locale): string {
  const format = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  return text.replaceAll("{basico}", format.format(PLAN_PRICES.basico / 100)).replaceAll("{premium}", format.format(PLAN_PRICES.premium / 100));
}
/** Solo datos públicos del prestador, a completar tras confirmar su identidad. */
export const LEGAL_IDENTITY = [
  { es: "Titular / responsable", en: "Provider / controller", value: "" },
  { es: "NIF / CIF", en: "Tax ID", value: "" },
  { es: "Domicilio de contacto", en: "Contact address", value: "" },
  { es: "Correo de atención y privacidad", en: "Support and privacy email", value: "" },
  { es: "Teléfono de atención al cliente", en: "Customer support phone", value: "" },
];
export const LEGAL_SOURCES = [
  { label: "LSSI — Ley 34/2002", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758" },
  { label: "RGPD / GDPR — Reglamento (UE) 2016/679", href: "https://www.boe.es/doue/2016/119/L00001-00088.pdf" },
  { label: "LOPDGDD — Ley Orgánica 3/2018", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673" },
  { label: "Consumo — Real Decreto Legislativo 1/2007", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555" },
  { label: "AEPD — Guía sobre el uso de cookies", href: "https://www.aepd.es/guias/guia-cookies.pdf" },
  { label: "AEPD — Derechos / Rights", href: "https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos" },
];
