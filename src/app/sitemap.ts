import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/lib/sitio";
/** Páginas públicas, con su versión en cada idioma. */
export default function sitemap(): MetadataRoute.Sitemap {
    const idiomas = { languages: { es: `${URL_SITIO}/`, en: `${URL_SITIO}/en` } };
    return [
        { url: `${URL_SITIO}/`, changeFrequency: "monthly", priority: 1, alternates: idiomas },
        { url: `${URL_SITIO}/en`, changeFrequency: "monthly", priority: 0.9, alternates: idiomas },
        { url: `${URL_SITIO}/acceso`, changeFrequency: "yearly", priority: 0.3 },
    ];
}
