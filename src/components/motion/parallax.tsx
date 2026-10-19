"use client";
import { useEffect, useRef, type ReactNode } from "react";
type ParallaxProps = {
    children: ReactNode;
    className?: string;
    /** Intensidad del desplazamiento: 0.1 = sutil, 0.3 = notable. */
    speed?: number;
};
/**
 * Parallax vertical sutil basado en transform (nunca provoca reflow).
 * Se desactiva por completo con prefers-reduced-motion.
 */
export function Parallax({ children, className, speed = 0.12 }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        let frame = 0;
        const update = () => {
            const rect = el.getBoundingClientRect();
            const viewport = window.innerHeight;
            // Progreso -0.5..0.5 según la distancia del centro del elemento al centro del viewport
            const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
            el.style.transform = `translate3d(0, ${(-progress * speed * 100).toFixed(2)}px, 0)`;
        };
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(frame);
        };
    }, [speed]);
    return (<div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>);
}
