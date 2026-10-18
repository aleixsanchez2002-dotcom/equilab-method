import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* Piezas comunes de la variante «Pista». */

type TonoBoton = "cuero" | "blanco" | "contorno" | "carbon" | "contorno-oscuro";

const tonos: Record<TonoBoton, string> = {
    // Texto oscuro sobre cuero: contraste suficiente (el blanco no llega)
    cuero: "bg-cuero text-carbon hover:bg-cuero-claro",
    blanco: "bg-white text-carbon hover:bg-arena",
    contorno: "border border-white/80 text-white hover:bg-white hover:text-carbon",
    carbon: "bg-carbon text-white hover:bg-cuero hover:text-carbon",
    "contorno-oscuro": "border border-carbon/25 text-carbon hover:border-carbon hover:bg-carbon hover:text-white",
};

/** Botón de píldora con flecha, como en la referencia. */
export function BotonPista({ href, tono = "cuero", flecha = true, className, children, }: {
    href: string;
    tono?: TonoBoton;
    flecha?: boolean;
    className?: string;
    children: ReactNode;
}) {
    return (<Link href={href} className={cn("pista-boton inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 text-[16px] font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cuero", tonos[tono], className)}>
      {children}
      {flecha && (<svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
          <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>)}
    </Link>);
}

/** Rótulo pequeño en cuero encima de un título. */
export function Antetitulo({ className, children }: {
    className?: string;
    children: ReactNode;
}) {
    return (<p className={cn("flex items-center gap-3 text-[13px] font-semibold tracking-[0.18em] text-cuero uppercase", className)}>
      <span aria-hidden="true" className="h-px w-8 bg-current"/>
      {children}
    </p>);
}

/** Contenedor de ancho máximo con márgenes laterales. */
export function Contenedor({ className, children }: {
    className?: string;
    children: ReactNode;
}) {
    return <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8", className)}>{children}</div>;
}

/** Título de sección. */
export function TituloPista({ id, className, children }: {
    id?: string;
    className?: string;
    children: ReactNode;
}) {
    return (<h2 id={id} className={cn("text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.02em]", className)}>
      {children}
    </h2>);
}
