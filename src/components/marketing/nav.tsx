"use client";
import { useI18n } from "@/components/i18n/provider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BitMark } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { cn } from "@/lib/cn";
const links = [
    { href: "#metodo", label: "El método" },
    { href: "#entrenadores", label: "Entrenadores" },
    { href: "#planes", label: "Planes" },
    { href: "#faq", label: "Preguntas" },
];
function Arrow({ className }: {
    className?: string;
}) {
    return (<svg viewBox="0 0 16 16" aria-hidden="true" className={cn("size-4 shrink-0", className)}>
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"/>
    </svg>);
}
/**
 * Fila superior del tablero: marca, enlaces y una sola acción, en losetas
 * planas. Se queda fija arriba al hacer scroll. `sesion` viene del servidor
 * y cambia los accesos por los del cliente.
 */
export function Nav({ sesion = false }: {
    sesion?: boolean;
}) {
    const { t, home } = useI18n();
    const [open, setOpen] = useState(false);
    // Bloquea el scroll de fondo mientras el menú móvil está abierto
    useEffect(() => {
        document.documentElement.style.overflow = open ? "hidden" : "";
        if (!open)
            return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape")
                setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.documentElement.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);
    const accion = sesion
        ? { href: "/app", label: t("Tu entrenamiento") }
        : { href: "/acceso", label: t("Empezar") };
    const secundaria = sesion
        ? { href: "/app/cuenta", label: t("Tu cuenta") }
        : { href: "/acceso", label: t("Iniciar sesión") };
    return (<header className="sticky top-0 z-50 bg-paper px-2 pt-2 pb-2">
      <nav className="grid h-[60px] grid-cols-[60px_1fr_60px] gap-2 lg:grid-cols-[60px_1fr_auto]" aria-label={t("Principal")}>
        <Link href={home} aria-label={t("Equilab Method — inicio")} className="press flex items-center justify-center bg-night text-paper hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy" onClick={() => setOpen(false)}>
          <BitMark className="w-9"/>
        </Link>

        {/* Loseta central: idioma a la izquierda y enlaces a la derecha (escritorio) / acción (móvil) */}
        <div className="flex items-center bg-linen">
          <div className="hidden h-full w-full items-center lg:flex">
            <LanguageSwitcher variant="inline" className="pl-2"/>
            <ul className="ml-auto flex items-center gap-8 pr-6">
              {links.slice(0, 3).map(({ href, label }) => (<li key={href}>
                  <a href={href} className="link-quiet text-[16px] font-semibold text-night focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">{t(label)}</a>
                </li>))}
            </ul>
          </div>
          <Link href={accion.href} className="press flex h-full w-full items-center justify-between px-4 text-[16px] font-semibold text-night lg:hidden">
            {accion.label}
            <Arrow />
          </Link>
        </div>

        <div className="hidden gap-2 lg:flex">
          <Link href={secundaria.href} className="press flex items-center bg-linen px-6 text-[16px] font-semibold text-night hover:bg-linen-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
            {secundaria.label}
          </Link>
          <Link href={accion.href} className="press flex items-center gap-3 bg-night px-6 text-[16px] font-semibold text-paper hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
            {accion.label}
            <Arrow />
          </Link>
        </div>

        {/* Menú móvil */}
        <button type="button" aria-expanded={open} aria-controls="menu-movil" aria-label={open ? t("Cerrar menú") : t("Abrir menú")} onClick={() => setOpen((v) => !v)} className="press flex cursor-pointer flex-col items-center justify-center gap-[7px] bg-night lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
          <span className={cn("h-[2px] w-6 bg-paper transition-transform duration-300", open && "translate-y-[4.5px] rotate-45")}/>
          <span className={cn("h-[2px] w-6 bg-paper transition-transform duration-300", open && "-translate-y-[4.5px] -rotate-45")}/>
        </button>
      </nav>

      {/* Menú a pantalla completa en móvil */}
      <div id="menu-movil" className={cn("fixed inset-x-0 top-[76px] bottom-0 z-40 flex flex-col bg-paper px-4 pb-8 transition-opacity duration-200 lg:hidden", open ? "opacity-100" : "pointer-events-none invisible opacity-0")}>
        <ul className="flex flex-1 flex-col justify-center gap-1">
          {links.map(({ href, label }, i) => (<li key={href}>
              <a href={href} onClick={() => setOpen(false)} className={cn("block py-2 font-display text-[clamp(2.25rem,11vw,3.5rem)] leading-none text-night transition-[opacity,transform] duration-500", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")} style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}>
                {t(label)}
              </a>
            </li>))}
        </ul>
        <LanguageSwitcher variant="inline" className="mb-4 -ml-3"/>
        <div className="grid grid-cols-2 gap-2">
          <Link href={accion.href} onClick={() => setOpen(false)} className="press flex h-14 items-center justify-between bg-navy px-4 text-[16px] font-semibold text-paper">
            {accion.label}
            <Arrow />
          </Link>
          <Link href={secundaria.href} onClick={() => setOpen(false)} className="press flex h-14 items-center bg-linen px-4 text-[16px] font-semibold text-night">
            {secundaria.label}
          </Link>
        </div>
      </div>
    </header>);
}
