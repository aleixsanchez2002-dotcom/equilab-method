/**
 * Dirección pública de la web, sin barra final. Se usa para las URL
 * absolutas de la imagen para compartir, el sitemap y robots.txt.
 * En producción se fija con NEXT_PUBLIC_SITE_URL (p. ej. https://equilab…);
 * mientras no haya dominio, se usa la dirección local.
 */
export const URL_SITIO = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
