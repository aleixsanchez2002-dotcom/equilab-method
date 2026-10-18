import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/lib/sitio";
/** Los buscadores pueden leer la web pública, nunca las áreas privadas. */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/app", "/admin", "/auth", "/language"],
        },
        sitemap: `${URL_SITIO}/sitemap.xml`,
    };
}
