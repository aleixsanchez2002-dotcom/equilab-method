"use client";
import { usePathname } from "next/navigation";
import { useI18n } from "./provider";
import { cn } from "@/lib/cn";
/**
 * Selector ES/EN. «floating» es la pestaña fija abajo a la derecha que ven las
 * pantallas privadas; en la portada se oculta porque el selector va dentro de
 * la barra superior («inline»), donde no tapa ningún contenido.
 */
export function LanguageSwitcher({ variant = "floating", tono = "oscuro", className }: {
    variant?: "floating" | "inline";
    /** Color del texto en la variante «inline»: «claro» para fondos oscuros. */
    tono?: "oscuro" | "claro";
    className?: string;
}) {
    const { locale } = useI18n();
    const pathname = usePathname();
    const portada = pathname === "/" || pathname === "/en" || pathname === "/en/";
    if (variant === "floating" && portada)
        return null;
    const inline = variant === "inline";
    return (<nav aria-label={locale === "en" ? "Language" : "Idioma"} className={cn(inline ? "flex" : "fixed bottom-3 right-3 z-[60] flex bg-sand-50 p-1", className)}>
      {(["es", "en"] as const).map((language) => {
            const actual = locale === language;
            return (<a key={language} href={`/language?locale=${language}&next=${encodeURIComponent(pathname)}`} lang={language} hrefLang={language} aria-label={language === "en" ? "English" : "Español"} aria-current={actual ? "true" : undefined} className={cn("press inline-flex min-h-10 min-w-11 items-center justify-center text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2", inline
                    ? tono === "claro"
                        ? cn("focus-visible:outline-white", actual ? "text-white underline decoration-2 underline-offset-[6px]" : "text-white/60 hover:text-white")
                        : cn("focus-visible:outline-navy", actual ? "text-night underline decoration-2 underline-offset-[6px]" : "text-slate hover:text-night")
                    : cn("focus-visible:outline-ink-950", actual ? "bg-ink-950 text-sand-50" : "text-ink-950/75 hover:text-ink-950"))}>{language.toUpperCase()}</a>);
        })}
    </nav>);
}
