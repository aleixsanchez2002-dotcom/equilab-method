import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Los buscadores pueden leer la portada; las zonas privadas quedan fuera. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app", "/admin", "/auth", "/language"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
