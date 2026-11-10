import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { LanguageLinks } from "@/components/i18n/language-switcher";
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
            { label: "Crear cuenta", href: "/acceso?modo=registro" },
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
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-[1.5fr_repeat(3,1fr)] sm:gap-12">
          <div className="col-span-2 sm:col-span-1">
            <Logo size="sm"/>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-sand-600">{t("Correcci\u00F3n postural y fuerza espec\u00EDfica para jinetes. El asiento se construye fuera de la silla.")}</p>
            <a href="https://instagram.com/equilab_method" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-sand-500 transition-colors hover:text-cognac-400 sm:mt-6">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/>
              </svg>
              @equilab_method
            </a>
          </div>

          {columns.map(({ title, links }) => (<nav key={title} aria-label={title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sand-500">{t(title)}</h3>
              <ul className="mt-2 flex flex-col sm:mt-5 sm:gap-3">
                {links.map(({ label, href }) => (<li key={label}>
                    <Link href={href.startsWith("/#") ? home + href.slice(1) : href} className="inline-flex min-h-11 items-center text-sm text-sand-600 transition-colors hover:text-sand-100 sm:min-h-0">{t(label)}</Link>
                  </li>))}
              </ul>
            </nav>))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-edge pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-sand-600">{t("\u00A9 2026 Equilab Method. Todos los derechos reservados.")}</p>
          <p className="text-xs text-sand-600">
            Giovanni Torrens · Alex Ricarte · Aleix Sánchez
          </p>
          <Suspense fallback={null}><LanguageLinks className="self-start sm:self-auto" /></Suspense>
        </div>
      </div>
    </footer>);
}
