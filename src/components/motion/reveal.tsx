"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
type RevealProps = {
    children: ReactNode;
    className?: string;
    /** Retardo en ms para escalonar las partes de una sección (60–90 ms entre ellas). */
    delay?: number;
};
/**
 * Muestra su contenido con una subida corta cuando entra en pantalla, una sola vez.
 * El estado vive en React (no en classList) para que un nuevo render no lo borre.
 * El estado oculto solo se aplica con la clase .js en <html> (ver layout), así que
 * sin script el contenido es visible. Respeta prefers-reduced-motion desde el CSS.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el || visible)
            return;
        if (!("IntersectionObserver" in window)) {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                setVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });
        observer.observe(el);
        return () => observer.disconnect();
    }, [visible]);
    return (<div ref={ref} className={cn("reveal", visible && "is-revealed", className)} style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}>
      {children}
    </div>);
}
