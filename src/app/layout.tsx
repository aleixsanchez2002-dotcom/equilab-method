import type { Metadata, Viewport } from "next";
import { Libre_Franklin, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { getI18n } from "@/lib/i18n/server";
import { URL_SITIO } from "@/lib/sitio";
import { I18nProvider } from "@/components/i18n/provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
const franklin = Libre_Franklin({
    variable: "--font-franklin",
    subsets: ["latin"],
    style: ["normal", "italic"],
    display: "swap",
});
const sourceSerif = Source_Serif_4({
    variable: "--font-source-serif",
    subsets: ["latin"],
    style: ["normal", "italic"],
    display: "swap",
});
export async function generateMetadata(): Promise<Metadata> {
    const { t, locale } = await getI18n();
    const titulo = t("Equilab Method — Entrenamiento para jinetes");
    const descripcion = t("Corrección postural y fuerza específica para jinetes de doma clásica. El asiento se construye fuera de la silla.");
    return {
        // Base de las URL absolutas (imagen para compartir, sitemap): ver src/lib/sitio.ts
        metadataBase: new URL(URL_SITIO),
        title: titulo,
        description: descripcion,
        // Vista previa al compartir el enlace (WhatsApp, Instagram…); la imagen
        // sale de app/opengraph-image.jpg
        openGraph: {
            type: "website",
            siteName: "Equilab Method",
            locale: locale === "en" ? "en_GB" : "es_ES",
            title: titulo,
            description: descripcion,
        },
    };
}
export const viewport: Viewport = {
    themeColor: "#f3f1ec",
};
export default async function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    const { locale } = await getI18n();
    return (<html lang={locale} className={`${franklin.variable} ${sourceSerif.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Marca <html> con .js antes de pintar: las animaciones de entrada
            solo ocultan contenido cuando hay script para mostrarlo. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}/>
      </head>
      <body className="min-h-full flex flex-col"><I18nProvider locale={locale}>{children}<LanguageSwitcher /></I18nProvider></body>
    </html>);
}
