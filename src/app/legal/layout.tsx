import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/legal-shell";
import { LEGAL_IS_DRAFT } from "@/lib/legal";

export const metadata: Metadata = {
  robots: LEGAL_IS_DRAFT ? { index: false, follow: false } : { index: true, follow: true },
};
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <LegalShell>{children}</LegalShell>;
}
