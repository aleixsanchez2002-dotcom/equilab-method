"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type EfectoAparecer = "subir" | "izquierda" | "derecha" | "asentar" | "fundido";

/**
 * Hace aparecer su contenido una sola vez al entrar en pantalla (variante
 * «Pista»): sube, llega de un lado, se funde o, si es una imagen, se asienta
 * desde algo más grande. El estado oculto solo existe con JavaScript (clase
 * .js) y se anula con «reducir movimiento» (ver globals.css).
 */
export function Aparecer({ children, efecto = "subir", retraso = 0, className, style, as: Etiqueta = "div", }: {
    children: ReactNode;
    efecto?: EfectoAparecer;
    /** Retraso en ms, para escalonar elementos de una misma fila. */
    retraso?: number;
    className?: string;
    style?: CSSProperties;
    as?: "div" | "li" | "figure" | "section";
}) {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el || visible)
            return;
        if (!("IntersectionObserver" in window)) {
            const frame = requestAnimationFrame(() => setVisible(true));
            return () => cancelAnimationFrame(frame);
        }
        const observer = new IntersectionObserver((entradas) => {
            if (entradas.some((e) => e.isIntersecting)) {
                setVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
        observer.observe(el);
        return () => observer.disconnect();
    }, [visible]);
    return (<Etiqueta ref={ref as never} data-efecto={efecto} className={cn("aparecer", visible && "visible", className)} style={{ ...style, ...(retraso ? { "--retraso": `${retraso}ms` } : {}) } as CSSProperties}>
      {children}
    </Etiqueta>);
}
