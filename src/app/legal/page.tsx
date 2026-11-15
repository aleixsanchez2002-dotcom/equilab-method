import type { Metadata } from "next";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { LEGAL_SLUGS, LEGAL_SOURCES, legalDocument } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  return { title: locale === "en" ? "Legal drafts — Equilab Method" : "Borradores legales — Equilab Method" };
}
export default async function LegalPage() {
  const { locale } = await getI18n();
  const en = locale === "en";
  return <>
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cognac-400 print:text-black">Equilab Method / {en ? "Legal" : "Legal"}</p>
    <h1 className="mt-4 font-display text-3xl leading-tight sm:text-5xl">{en ? "CLEAR INFORMATION." : "INFORMACIÓN CLARA."}</h1>
    <p className="mt-5 max-w-2xl text-base leading-relaxed text-sand-300 print:text-black">{en ? "Four documents to review how the website works, how we handle your data and the terms of training. All are drafts while the provider details are being finalised." : "Cuatro documentos para revisar cómo funciona la web, cómo tratamos tus datos y las condiciones del entrenamiento. Todos son borradores mientras se completa la identificación del prestador."}</p>
    <div className="mt-9 grid gap-4 sm:grid-cols-2">
      {LEGAL_SLUGS.map((slug, i) => {
        const doc = legalDocument(slug, locale)!;
        return <Link key={slug} href={`/legal/${slug}`} className="group rounded-2xl border border-edge bg-ink-900 p-6 transition-colors hover:border-cognac-400 focus-visible:outline-2 focus-visible:outline-cognac-400 print:bg-white">
          <span aria-hidden="true" className="text-xs text-cognac-400 print:text-black">0{i + 1} / ↗</span>
          <h2 className="mt-5 text-xl font-semibold">{doc.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-sand-500 print:text-black">{doc.intro}</p>
        </Link>;
      })}
    </div>
    <section className="mt-12" aria-labelledby="fuentes">
      <h2 id="fuentes" className="text-lg font-semibold">{en ? "Official reference sources" : "Fuentes oficiales de referencia"}</h2>
      <ul className="mt-4 space-y-3 text-sm text-sand-300 print:text-black">{LEGAL_SOURCES.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-cognac-400">{source.label} ↗</a></li>)}</ul>
    </section>
  </>;
}
