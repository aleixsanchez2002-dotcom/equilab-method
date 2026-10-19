"use client";
import { useI18n } from "@/components/i18n/provider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BitMark } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { cn } from "@/lib/cn";

const enlaces = [
    { href: "#metodo", label: "El método" },
    { href: "#entrenadores", label: "Entrenadores" },
    { href: "#planes", label: "Planes" },
    { href: "#faq", label: "Preguntas" },
];

/**
 * Barra de la variante «Pista»: transparente sobre la foto de portada y
 * sólida (carbón) en cuanto se hace scroll, como en la referencia.
 */
export function NavPista({ sesion = false }: { sesion?: boolean }) {
    const { t, home } = useI18n();
    const [solida, setSolida] = useState(false);
    const [abierto, setAbierto] = useState(false);

    useEffect(() => {
        const alDesplazar = () => setSolida(window.scrollY > 40);
        const frame = requestAnimationFrame(alDesplazar);
        window.addEventListener("scroll", alDesplazar, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", alDesplazar);
        };
    }, []);

    // Bloquea el scroll de fondo y permite cerrar con Escape mientras el menú está abierto
    useEffect(() => {
        document.documentElement.style.overflow = abierto ? "hidden" : "";
        if (!abierto)
            return;
        const alPulsar = (e: KeyboardEvent) => {
            if (e.key === "Escape")
                setAbierto(false);
        };
        window.addEventListener("keydown", alPulsar);
        return () => {
            document.documentElement.style.overflow = "";
            window.removeEventListener("keydown", alPulsar);
        };
    }, [abierto]);

    const accion = sesion ? { href: "/app", label: t("Tu entrenamiento") } : { href: "/acceso", label: t("Registrarse") };
    const secundaria = sesion ? { href: "/app/cuenta", label: t("Tu cuenta") } : { href: "/acceso", label: t("Iniciar sesión") };

    return (<header className={cn("fixed inset-x-0 top-0 z-50 text-white transition-colors duration-500", solida || abierto ? "bg-carbon/95" : "bg-transparent")}>
      <nav aria-label={t("Principal")} className={cn("mx-auto flex max-w-[1240px] items-center gap-6 px-5 transition-[height] duration-500 sm:px-8", solida ? "h-[72px]" : "h-[88px]")}>
        <Link href={home} aria-label={t("Equilab Method — inicio")} className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" onClick={() => setAbierto(false)}>
          <BitMark className="w-10 shrink-0 text-cuero"/>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[21px] font-semibold tracking-[0.04em] text-crema">EQUILAB</span>
            <span className="mt-1.5 font-display text-[7.5px] font-semibold tracking-[0.62em] text-cuero">METHOD</span>
          </span>
        </Link>

        <ul className="ml-auto hidden items-center gap-9 lg:flex">
          {enlaces.map(({ href, label }) => (<li key={href}>
              <a href={href} className="text-[16px] font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {t(label)}
              </a>
            </li>))}
        </ul>

        <div className="ml-auto hidden items-center gap-3 lg:ml-6 lg:flex">
          <LanguageSwitcher variant="inline" tono="claro" className="mr-2"/>
          <Link href={secundaria.href} className="inline-flex min-h-11 items-center rounded-full border border-white/70 px-6 text-[15px] font-semibold transition-colors duration-300 hover:bg-white hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            {secundaria.label}
          </Link>
          <Link href={accion.href} className="inline-flex min-h-11 items-center rounded-full bg-white px-6 text-[15px] font-semibold text-carbon transition-colors duration-300 hover:bg-cuero focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            {accion.label}
          </Link>
        </div>

        <button type="button" aria-expanded={abierto} aria-controls="menu-pista" aria-label={abierto ? t("Cerrar menú") : t("Abrir menú")} onClick={() => setAbierto((v) => !v)} className="ml-auto flex size-12 cursor-pointer flex-col items-center justify-center gap-[7px] rounded-full border border-white/40 lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <span className={cn("h-[2px] w-5 bg-white transition-transform duration-300", abierto && "translate-y-[4.5px] rotate-45")}/>
          <span className={cn("h-[2px] w-5 bg-white transition-transform duration-300", abierto && "-translate-y-[4.5px] -rotate-45")}/>
        </button>
      </nav>

      {/* Menú del móvil a pantalla completa */}
      <div id="menu-pista" className={cn("fixed inset-x-0 top-[88px] bottom-0 flex flex-col bg-carbon px-5 pb-8 transition-opacity duration-300 lg:hidden", abierto ? "opacity-100" : "pointer-events-none invisible opacity-0")}>
        <ul className="flex flex-1 flex-col justify-center gap-2">
          {enlaces.map(({ href, label }, i) => (<li key={href}>
              <a href={href} onClick={() => setAbierto(false)} className={cn("block py-2 text-[clamp(2.25rem,10vw,3.25rem)] leading-none font-semibold tracking-[-0.02em] transition-[opacity,transform] duration-500", abierto ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")} style={{ transitionDelay: abierto ? `${100 + i * 70}ms` : "0ms" }}>
                {t(label)}
              </a>
            </li>))}
        </ul>
        <LanguageSwitcher variant="inline" tono="claro" className="mb-5 -ml-3"/>
        <div className="grid grid-cols-2 gap-2">
          <Link href={accion.href} onClick={() => setAbierto(false)} className="inline-flex h-13 items-center justify-center rounded-full bg-cuero text-[16px] font-semibold text-carbon">{accion.label}</Link>
          <Link href={secundaria.href} onClick={() => setAbierto(false)} className="inline-flex h-13 items-center justify-center rounded-full border border-white/60 text-[16px] font-semibold">{secundaria.label}</Link>
        </div>
      </div>
    </header>);
}
