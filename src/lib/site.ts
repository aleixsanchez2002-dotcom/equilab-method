/**
 * URL pública del sitio, sin barra final. Sirve para las URLs absolutas que
 * necesitan los buscadores y las vistas previas al compartir un enlace.
 *
 * Orden: `NEXT_PUBLIC_SITE_URL` (ponerla cuando haya dominio propio), el
 * dominio de producción que expone Vercel y, si no, el dominio actual.
 */
const explicita = process.env.NEXT_PUBLIC_SITE_URL;
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  explicita || (vercel ? `https://${vercel}` : "https://equilab-method.vercel.app")
).replace(/\/+$/, "");
