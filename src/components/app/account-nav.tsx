"use client";
import { useI18n } from "@/components/i18n/provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
const secciones = [
    { href: "/app/cuenta", label: "Perfil" },
    { href: "/app/cuenta/plan", label: "Plan y suscripción" },
    { href: "/app/cuenta/contacto", label: "Contáctanos" },
];
/** Menú lateral de la cuenta (pestañas horizontales en móvil). */
export function AccountNav() {
    const { t } = useI18n();
    const ruta = usePathname();
    return (<nav aria-label={t("Secciones de tu cuenta")} className="flex gap-1 overflow-x-auto border-b border-edge pb-px lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:border-r lg:pr-4 lg:pb-0">
      {secciones.map(({ href, label }) => {
            const activa = ruta === href;
            return (<Link key={href} href={href} aria-current={activa ? "page" : undefined} className={cn("relative shrink-0 rounded-xs px-4 py-3 text-[13px] font-semibold transition-colors lg:px-4 lg:py-2.5", activa
                    ? "text-sand-50 lg:bg-ink-900"
                    : "text-sand-600 hover:text-sand-300 lg:hover:bg-ink-900/60")}>
            {t(label)}
            <span aria-hidden="true" className={cn("absolute bg-cognac-400 transition-transform duration-300", "inset-x-0 bottom-[-1px] h-0.5 origin-left lg:inset-y-1 lg:right-auto lg:left-[-17px] lg:h-auto lg:w-0.5 lg:origin-top", activa ? "scale-100" : "scale-x-0 lg:scale-y-0")}/>
          </Link>);
        })}
    </nav>);
}
