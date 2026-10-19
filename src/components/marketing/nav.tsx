"use client";
import { useI18n } from "@/components/i18n/provider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
const links = [
    { href: "#metodo", label: "El método" },
    { href: "#entrenadores", label: "Equipo" },
    { href: "#planes", label: "Planes" },
    { href: "#faq", label: "Preguntas" },
];
/** `sesion` viene del servidor: cambia los accesos por los del cliente. */
export function Nav({ sesion = false }: {
    sesion?: boolean;
}) {
    const { t, home } = useI18n();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    // Bloquea el scroll de fondo mientras el menú móvil está abierto
    useEffect(() => {
        document.documentElement.style.overflow = open ? "hidden" : "";
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [open]);
    return (<header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled
            ? "border-b border-edge bg-ink-950/85 backdrop-blur-md"
            : "border-b border-edge bg-ink-950/95")}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-20 sm:px-10">
        <Link href={home} aria-label={t("Equilab Method \u2014 inicio")} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400" onClick={() => setOpen(false)}>
          <Logo size="sm"/>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map(({ href, label }) => (<li key={href}>
              <a href={href} className="text-[12px] font-medium uppercase tracking-[0.16em] text-sand-500 transition-colors duration-200 hover:text-sand-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognac-400">{t(label)}</a>
            </li>))}
        </ul>

        <div className="flex items-center gap-3">
          {sesion ? (<>
              <Link href="/app/cuenta" className="hidden lg:block">
                <Button variant="outline" size="sm" tabIndex={-1}>{t("Tu cuenta")}</Button>
              </Link>
              <Link href="/app" className="hidden sm:block">
                <Button size="sm" tabIndex={-1}>{t("Tu entrenamiento")}</Button>
              </Link>
            </>) : (<>
              <Link href="/acceso" className="hidden lg:block">
                <Button variant="outline" size="sm" tabIndex={-1}>{t("Iniciar sesi\u00F3n")}</Button>
              </Link>
              <Link href="/acceso" className="hidden sm:block">
                <Button size="sm" tabIndex={-1}>{t("Empezar")}</Button>
              </Link>
            </>)}

          {/* Menú móvil */}
          <button type="button" aria-expanded={open} aria-label={open ? t("Cerrar men\u00FA") : t("Abrir men\u00FA")} onClick={() => setOpen((v) => !v)} className="flex size-11 cursor-pointer flex-col items-center justify-center gap-[7px] lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400">
            <span className={cn("h-px w-6 bg-sand-100 transition-transform duration-300", open && "translate-y-1 rotate-45")}/>
            <span className={cn("h-px w-6 bg-sand-100 transition-transform duration-300", open && "-translate-y-1.5 -rotate-45")}/>
          </button>
        </div>
      </nav>

      {/* Overlay de navegación móvil */}
      <div className={cn("fixed inset-0 top-16 z-40 flex flex-col bg-ink-950/97 backdrop-blur-lg transition-opacity duration-300 lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}>
        <ul className="flex flex-1 flex-col justify-center gap-2 px-8">
          {links.map(({ href, label }, i) => (<li key={href}>
              <a href={href} onClick={() => setOpen(false)} className={cn("block py-3 font-display text-3xl text-sand-100 transition-all duration-500", open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")} style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}>
                <span className="mr-4 font-display text-sm italic text-cognac-400">
                  0{i + 1}
                </span>{t(label)}

              </a>
            </li>))}
        </ul>
        <div className="flex flex-col gap-3 px-8 pb-12">
          {sesion ? (<>
              <Link href="/app" onClick={() => setOpen(false)}>
                <Button fullWidth size="lg" tabIndex={-1}>{t("Tu entrenamiento")}</Button>
              </Link>
              <Link href="/app/cuenta" onClick={() => setOpen(false)}>
                <Button fullWidth variant="outline" size="lg" tabIndex={-1}>{t("Tu cuenta")}</Button>
              </Link>
            </>) : (<>
              <Link href="/acceso" onClick={() => setOpen(false)}>
                <Button fullWidth size="lg" tabIndex={-1}>{t("Empezar ahora")}</Button>
              </Link>
              <Link href="/acceso" onClick={() => setOpen(false)}>
                <Button fullWidth variant="outline" size="lg" tabIndex={-1}>{t("Iniciar sesi\u00F3n")}</Button>
              </Link>
            </>)}
        </div>
      </div>
    </header>);
}
