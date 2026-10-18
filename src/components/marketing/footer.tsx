import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
const columns = [
    {
        title: "Método",
        links: [
            { label: "El método", href: "/#metodo" },
            { label: "Entrenadores", href: "/#entrenadores" },
            { label: "Planes", href: "/#planes" },
            { label: "Preguntas", href: "/#faq" },
        ],
    },
    {
        title: "Cuenta",
        links: [
            { label: "Iniciar sesión", href: "/acceso" },
            { label: "Crear cuenta", href: "/acceso" },
        ],
    },
    {
        title: "Legal",
        links: [
            /* PLACEHOLDER: páginas legales pendientes de redactar (fase 2, con RGPD). */
            { label: "Privacidad", href: "#" },
            { label: "Términos del servicio", href: "#" },
            { label: "Cookies", href: "#" },
        ],
    },
];
/**
 * Cierre de la página: invierte papel y tinta, deja las columnas arriba y el
 * nombre de lado a lado abajo. Se queda fijo detrás de la página y aparece
 * cuando la última sección se retira.
 */
export async function Footer() {
    const { t, home } = await getI18n();
    return (<footer className="marketing-footer grid min-h-[80svh] grid-rows-[auto_1fr_auto] bg-night px-[var(--gutter)] pt-10 pb-5 text-paper">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {columns.map(({ title, links }) => (<nav key={title} aria-label={t(title)}>
            <h2 className="text-[16px] font-semibold text-paper">{t(title)}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {links.map(({ label, href }) => (<li key={label}>
                  <Link href={href.startsWith("/#") ? home + href.slice(1) : href} className="link-quiet text-[16px] text-navy-soft hover:text-paper">{t(label)}</Link>
                </li>))}
            </ul>
          </nav>))}
        <div>
          <h2 className="text-[16px] font-semibold text-paper">{t("Contacto")}</h2>
          <ul className="mt-3 flex flex-col gap-2 text-[16px] text-navy-soft">
            <li>
              <a href="https://instagram.com/giovannidressage" target="_blank" rel="noopener noreferrer" className="link-quiet hover:text-paper">
                Instagram · @giovannidressage
              </a>
            </li>
            <li>Giovanni Torrens · Alex Ricarte · Aleix Sánchez</li>
          </ul>
        </div>
      </div>

      <div />

      <div>
        {/* El nombre de margen a margen, sin cortarse nunca */}
        <svg viewBox="0 0 1000 214" role="img" aria-label="Equilab Method" className="block h-auto w-full">
          <text x="0" y="160" textLength="1000" lengthAdjust="spacing" fontSize="214" fontWeight="900" fill="currentColor" fontFamily="var(--font-franklin), sans-serif">EQUILAB</text>
        </svg>
        <p className="mt-4 text-step-small text-navy-soft">{t("© 2026 Equilab Method. Todos los derechos reservados.")}</p>
      </div>
    </footer>);
}
