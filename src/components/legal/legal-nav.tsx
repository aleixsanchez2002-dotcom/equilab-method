"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type LegalNavProps = {
  label: string;
  links: { href: string; label: string }[];
};

export function LegalNav({ label, links }: LegalNavProps) {
  const pathname = usePathname();
  return <nav aria-label={label} className="flex flex-wrap gap-x-6 gap-y-4 border-b border-edge py-6 text-sm print:border-black">
    {links.map(link => {
      const active = pathname === link.href;
      return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400 print:text-black ${active ? "font-semibold text-cognac-400" : "text-sand-300 hover:text-sand-100"}`}>{link.label}</Link>;
    })}
  </nav>;
}
