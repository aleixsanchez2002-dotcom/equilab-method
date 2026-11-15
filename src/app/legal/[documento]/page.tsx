import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getI18n } from "@/lib/i18n/server";
import { legalDocument, legalText } from "@/lib/legal";

type Props = { params: Promise<{ documento: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ documento }, { locale }] = await Promise.all([params, getI18n()]);
  const doc = legalDocument(documento, locale);
  if (!doc) notFound();
  return { title: `${doc.title} — ${locale === "en" ? "Draft" : "Borrador"} — Equilab Method`, description: doc.intro };
}
export default async function LegalDocumentPage({ params }: Props) {
  const [{ documento }, { locale }] = await Promise.all([params, getI18n()]);
  const doc = legalDocument(documento, locale);
  if (!doc) notFound();
  const en = locale === "en";
  return <article className="max-w-3xl">
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cognac-400 print:text-black">Equilab Method / {en ? "Legal draft" : "Borrador legal"}</p>
    <h1 className="mt-4 font-display text-3xl leading-tight sm:text-5xl">{doc.title}</h1>
    <p className="mt-5 text-lg leading-relaxed text-sand-300 print:text-black">{doc.intro}</p>
    <aside className="mt-8 rounded-2xl border border-edge bg-ink-900 p-6 print:bg-white" aria-labelledby="pendientes">
      <h2 id="pendientes" className="font-semibold">{en ? "Before finalising this document" : "Antes de cerrar este texto"}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-sand-300 print:text-black">{doc.pending.map(item => <li key={item}>{item}</li>)}</ul>
    </aside>
    <nav aria-label={en ? "On this page" : "En esta página"} className="my-9 print:hidden">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sand-500">{en ? "Contents" : "Contenido"}</p>
      <ul className="mt-3 space-y-2 text-sm">{doc.sections.map(section => <li key={section.id}><a href={`#${section.id}`} className="text-sand-300 underline-offset-4 hover:text-cognac-400 hover:underline">{section.title}</a></li>)}</ul>
    </nav>
    <div className="space-y-10">{doc.sections.map(section => <section key={section.id} id={section.id} className="scroll-mt-6">
      <h2 className="text-xl font-semibold leading-snug">{section.title}</h2>
      {section.paragraphs.map((paragraph, i) => <p key={i} className="mt-4 break-words text-base leading-7 text-sand-300 print:text-black">{legalText(paragraph, locale)}</p>)}
      {section.items && <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-7 text-sand-300 print:text-black">{section.items.map(item => <li key={item}>{legalText(item, locale)}</li>)}</ul>}
    </section>)}</div>
    <p className="mt-12 text-sm"><Link href="/legal#fuentes" className="text-cognac-400 underline underline-offset-4 print:text-black">{en ? "Official sources and other legal drafts" : "Fuentes oficiales y otros borradores legales"}</Link></p>
  </article>;
}
