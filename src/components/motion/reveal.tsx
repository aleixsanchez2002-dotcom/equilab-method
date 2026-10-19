"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
type RevealProps = {
    children: ReactNode;
    className?: string;
    /** Retardo en ms para escalonar elementos hermanos. */
    delay?: number;
};
/**
 * Revela su contenido con un desplazamiento suave cuando entra en el viewport.
 * Respeta prefers-reduced-motion (el contenido aparece sin animación).
 * Usar solo por debajo del pliegue; el hero anima con CSS puro para no
 * depender de la hidratación.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            el.classList.add("is-revealed");
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    el.classList.add("is-revealed");
                    observer.disconnect();
                }
            }
        }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return (<div ref={ref} className={cn("reveal", className)} style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}>
      {children}
    </div>);
}
