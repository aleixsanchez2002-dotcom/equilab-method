import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Páginas públicas indexables: la portada en español y en inglés. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { es: `${SITE_URL}/`, en: `${SITE_URL}/en` };
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${SITE_URL}/en`, changeFrequency: "monthly", priority: 0.8, alternates: { languages } },
  ];
}
