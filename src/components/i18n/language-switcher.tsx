"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { useI18n } from "./provider";

const IDIOMAS = ["es", "en"] as const;

/** Enlaces ES / EN que conservan la ruta y los parámetros actuales. */
function EnlacesIdioma() {
    const { locale } = useI18n();
    const pathname = usePathname();
    const params = useSearchParams();
    const destination = `${pathname}${params.size ? `?${params.toString()}` : ""}`;
    return (<>
      {IDIOMAS.map((language) => (<a key={language} href={`/language?locale=${language}&next=${encodeURIComponent(destination)}`} lang={language} hrefLang={language} aria-label={language === "en" ? "English" : "Español"} aria-current={locale === language ? "true" : undefined} className={`inline-flex min-h-10 min-w-11 items-center justify-center rounded-full text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400 ${locale === language ? "bg-cognac-500 text-ink-950" : "text-sand-300 hover:bg-ink-800"}`}>{language.toUpperCase()}</a>))}
    </>);
}

/** Selector de idioma en línea, para la cabecera y el pie de la portada. */
export function LanguageLinks({ className }: {
    className?: string;
}) {
    const { locale } = useI18n();
    return (<nav aria-label={locale === "en" ? "Language" : "Idioma"} className={cn("inline-flex rounded-full border border-edge-control p-0.5", className)}>
      <EnlacesIdioma />
    </nav>);
}

/** Selector de idioma flotante para el resto de páginas. */
export function LanguageSwitcher() {
    const { locale } = useI18n();
    const pathname = usePathname();
    const params = useSearchParams();
    // La portada lo lleva integrado en la cabecera, el menú y el pie.
    if (pathname === "/" || pathname === "/en")
        return null;
    const enApp = pathname === "/app" || pathname.startsWith("/app/");
    // En móvil, la pantalla de registro reserva el pie para la barra de guardar:
    // el idioma se cambia desde Inicio, Progreso o Cuenta.
    const enRegistro = pathname === "/app" && params.get("vista") === "rutina";
    const posicion = enRegistro
        ? "hidden sm:bottom-4 sm:flex"
        : enApp
            ? "bottom-[calc(5rem+env(safe-area-inset-bottom))] flex sm:bottom-4"
            : pathname.startsWith("/admin/rutinas/")
                ? "bottom-56 flex sm:bottom-4"
                : "bottom-4 flex";
    return (<nav aria-label={locale === "en" ? "Language" : "Idioma"} className={`fixed right-4 z-[60] rounded-full border border-edge-strong bg-ink-950 p-1 shadow-lg ${posicion}`}>
      <EnlacesIdioma />
    </nav>);
}
