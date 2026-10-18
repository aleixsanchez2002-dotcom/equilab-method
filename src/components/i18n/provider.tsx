"use client";
import { createContext, useContext, type ReactNode } from "react";
import { localeSettings, type Locale } from "@/lib/i18n/shared";
const LocaleContext = createContext<Locale>("es");
export function I18nProvider({ locale, children }: {
    locale: Locale;
    children: ReactNode;
}) {
    return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
export function useI18n() {
    return localeSettings(useContext(LocaleContext));
}
