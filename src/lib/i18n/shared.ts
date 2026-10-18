import english from "./en.json";

export type Locale = "es" | "en";
export const LOCALE_COOKIE = "equilab_locale";
const dictionary: Record<string, string> = english;

/** Translate display text only; stored identifiers and questionnaire values stay unchanged. */
export function translator(locale: Locale) {
  return (source: string | null | undefined, values: Record<string, string | number> = {}) => {
    if (source == null) return "";
    const key = source.trim().replace(/\s+/g, " ");
    let result = locale === "en" ? dictionary[key] ?? source.trim() : source.trim();
    result = result.replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
    return `${/^\s/.test(source) ? " " : ""}${result}${/\s$/.test(source) ? " " : ""}`;
  };
}

export function localeSettings(locale: Locale) {
  return {
    locale,
    t: translator(locale),
    home: locale === "en" ? "/en" : "/",
    intlLocale: locale === "en" ? "en-GB" : "es-ES",
  };
}
