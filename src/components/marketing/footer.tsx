import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
const columns = [
    {
        title: "Método",
        links: [
            { label: "El método", href: "/#metodo" },
            { label: "Equipo", href: "/#entrenadores" },
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
export async function Footer() {
    const { t, home } = await getI18n();
    return (<footer className="border-t border-edge bg-ink-950">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Logo size="sm"/>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-sand-600">{t("Correcci\u00F3n postural y fuerza espec\u00EDfica para jinetes. El asiento se construye fuera de la silla.")}</p>
            <a href="https://instagram.com/equilab_method" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-sand-500 transition-colors hover:text-cognac-400">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/>
              </svg>
              @equilab_method
            </a>
          </div>

          {columns.map(({ title, links }) => (<nav key={title} aria-label={title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sand-500">{t(title)}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {links.map(({ label, href }) => (<li key={label}>
                    <Link href={href.startsWith("/#") ? home + href.slice(1) : href} className="text-[13px] text-sand-600 transition-colors hover:text-sand-100">{t(label)}</Link>
                  </li>))}
              </ul>
            </nav>))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-edge pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-sand-600">{t("\u00A9 2026 Equilab Method. Todos los derechos reservados.")}</p>
          <p className="text-[12px] text-sand-600">
            Giovanni Torrens · Alex Ricarte · Aleix Sánchez
          </p>
        </div>
      </div>
    </footer>);
}
