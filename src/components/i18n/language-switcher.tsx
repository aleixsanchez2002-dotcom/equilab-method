"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "./provider";
export function LanguageSwitcher() {
    const { locale } = useI18n();
    const pathname = usePathname();
    const params = useSearchParams();
    const destination = `${pathname}${params.size ? `?${params.toString()}` : ""}`;
    return (<nav aria-label={locale === "en" ? "Language" : "Idioma"} className={`fixed right-4 z-[60] flex rounded-full border border-edge-strong bg-ink-950 p-1 shadow-lg ${pathname === "/app" || pathname.startsWith("/app/") ? "bottom-20 sm:bottom-4" : pathname.startsWith("/admin/rutinas/") ? "bottom-56 sm:bottom-4" : "bottom-4"}`}>
      {(["es", "en"] as const).map((language) => (<a key={language} href={`/language?locale=${language}&next=${encodeURIComponent(destination)}`} lang={language} hrefLang={language} aria-label={language === "en" ? "English" : "Español"} aria-current={locale === language ? "true" : undefined} className={`inline-flex min-h-10 min-w-11 items-center justify-center rounded-full text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400 ${locale === language ? "bg-cognac-500 text-ink-950" : "text-sand-300 hover:bg-ink-800"}`}>{language.toUpperCase()}</a>))}
    </nav>);
}
