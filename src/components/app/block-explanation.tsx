import { Fragment } from "react";

/** Solo convierte identificadores PubMed en enlaces; el resto sigue siendo texto. */
export function BlockExplanation({ text }: { text: string }) {
  return <div className="space-y-6 text-[16px] leading-[1.8] text-sand-300">
    {text.split(/\n\s*\n/).map((paragraph, i) => <p key={i} className="whitespace-pre-line break-words">
      {paragraph.split(/(PMID:\s*\d{7,9})/g).map((part, j) => {
        const id = /^PMID:\s*(\d{7,9})$/.exec(part)?.[1];
        return id ? <a key={j} href={`https://pubmed.ncbi.nlm.nih.gov/${id}/`} target="_blank" rel="noopener noreferrer" className="text-cognac-300 underline underline-offset-4">{part}</a> : <Fragment key={j}>{part}</Fragment>;
      })}
    </p>)}
  </div>;
}
