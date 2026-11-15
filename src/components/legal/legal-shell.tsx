import Link from "next/link";
import { LegalNav } from "@/components/legal/legal-nav";
import { Logo } from "@/components/brand/logo";
import { getI18n } from "@/lib/i18n/server";
import { LEGAL_DRAFT_VERSION, LEGAL_IDENTITY, LEGAL_SLUGS, legalDocument } from "@/lib/legal";

export async function LegalShell({ children }: { children: React.ReactNode }) {
  const { locale, home } = await getI18n();
  const en = locale === "en";
  return <div className="min-h-dvh bg-ink-950 pb-24 print:bg-white print:text-black">
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 py-7 sm:px-10">
      <Link href={home} aria-label={en ? "Equilab Method — home" : "Equilab Method — inicio"}><Logo size="sm" /></Link>
      <Link href={home} className="text-sm text-sand-300 hover:text-cognac-400 print:text-black">{en ? "← Back to website" : "← Volver a la web"}</Link>
    </header>
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <aside aria-label={en ? "Draft status" : "Estado del borrador"} className="rounded-2xl border border-cognac-500/40 bg-cognac-500/10 p-5 print:border-black print:bg-white">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-cognac-400 print:text-black">{en ? "Draft for review · Not final" : "Borrador para revisión · No definitivo"}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-sand-300 print:text-black">{en ? "Provider details and operational decisions are still pending. These documents must be completed and reviewed before use as final legal information or before taking payments." : "Faltan los datos del titular y decisiones operativas. Estos textos deben completarse y revisarse antes de utilizarlos como información legal definitiva o comenzar a cobrar."}</p>
        <p className="mt-3 text-xs text-sand-500 print:text-black">{en ? "Prepared on 20 October 2026" : "Preparado el 20 de octubre de 2026"} · {LEGAL_DRAFT_VERSION}</p>
      </aside>
      <LegalNav label={en ? "Legal documents" : "Documentos legales"} links={[
        { href: "/legal", label: en ? "Overview" : "Resumen" },
        ...LEGAL_SLUGS.map(slug => ({ href: `/legal/${slug}`, label: legalDocument(slug, locale)!.title })),
      ]} />
      <main id="contenido-legal" className="py-10 sm:py-14">{children}</main>
      <section aria-labelledby="datos-titular" className="border-t border-edge pt-8 print:border-black">
        <h2 id="datos-titular" className="text-lg font-semibold">{en ? "Provider details — to be completed" : "Datos del titular — pendientes"}</h2>
        <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
          {LEGAL_IDENTITY.map(field => <div key={field.es}><dt className="text-sand-500 print:text-black">{field[locale]}</dt><dd className="mt-1 font-medium text-sand-100 print:text-black">{field.value || (en ? "[TO BE COMPLETED]" : "[PENDIENTE DE COMPLETAR]")}</dd></div>)}
        </dl>
      </section>
    </div>
  </div>;
}
