import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import "./globals.css";
import { getI18n } from "@/lib/i18n/server";
import { I18nProvider } from "@/components/i18n/provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { SITE_URL } from "@/lib/site";
const display = Archivo_Black({
    variable: "--font-archivo-black",
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});
const archivo = Archivo({
    variable: "--font-archivo",
    subsets: ["latin"],
    axes: ["wdth"],
});
export async function generateMetadata(): Promise<Metadata> {
    const { t, locale } = await getI18n();
    const title = t("Equilab Method — Entrenamiento para jinetes");
    const description = t("Corrección postural y fuerza específica para jinetes de doma clásica. El asiento se construye fuera de la silla.");
    // Imagen que acompaña al enlace cuando se comparte (WhatsApp, Instagram…).
    const imagen = {
        url: "/media/compartir.jpg",
        width: 1200,
        height: 630,
        alt: t("Giovanni Torrens a caballo en una competici\u00F3n de doma cl\u00E1sica"),
    };
    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        openGraph: {
            type: "website",
            siteName: "Equilab Method",
            title,
            description,
            locale: locale === "en" ? "en_GB" : "es_ES",
            images: [imagen],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imagen],
        },
    };
}
export const viewport: Viewport = {
    themeColor: "#141719",
};
export default async function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    const { locale } = await getI18n();
    return (<html lang={locale} className={`${display.variable} ${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col"><I18nProvider locale={locale}>{children}<Suspense fallback={null}><LanguageSwitcher /></Suspense></I18nProvider></body>
    </html>);
}
