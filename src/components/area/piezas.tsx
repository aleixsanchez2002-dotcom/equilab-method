import Link from "next/link";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconoFlecha } from "./iconos";

/* Piezas comunes del área de cliente. Mismo lenguaje que la portada:
   losetas planas de color separadas por 8 px de papel, sin bordes ni
   sombras (ver docs/DESIGN.md). */

type Tono = "papel" | "lino" | "noche" | "marino" | "vino";

const fondos: Record<Tono, string> = {
    papel: "bg-paper text-night",
    lino: "bg-linen text-night",
    noche: "bg-night text-paper",
    marino: "bg-navy text-paper",
    vino: "bg-wine text-paper",
};

/** Plano de color con contenido. */
export function Loseta({ tono = "lino", className, children, }: {
    tono?: Tono;
    className?: string;
    children: ReactNode;
}) {
    return <div className={cn(fondos[tono], "p-5 sm:p-6", className)}>{children}</div>;
}

/** Rótulo pequeño encima de un título o de una cifra. */
export function Rotulo({ className, children }: {
    className?: string;
    children: ReactNode;
}) {
    return <p className={cn("text-step-small font-semibold", className)}>{children}</p>;
}

type TonoBoton = "noche" | "marino" | "papel" | "lino";

const botones: Record<TonoBoton, string> = {
    noche: "bg-night text-paper hover:bg-navy",
    marino: "bg-navy text-paper hover:bg-navy-deep",
    papel: "bg-paper text-night hover:bg-linen-deep",
    lino: "bg-linen text-night hover:bg-linen-deep",
};

const claseBoton = "press inline-flex min-h-14 items-center justify-between gap-4 px-5 text-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

/** Enlace con forma de botón, con la flecha de la marca. */
export function BotonEnlace({ href, tono = "noche", flecha = true, className, children, }: {
    href: string;
    tono?: TonoBoton;
    flecha?: boolean;
    className?: string;
    children: ReactNode;
}) {
    return (<Link href={href} className={cn(claseBoton, botones[tono], className)}>
      <span>{children}</span>
      {flecha && <IconoFlecha className="size-5 shrink-0"/>}
    </Link>);
}

/** Botón de formulario con el mismo aspecto (en las maquetas no envía nada). */
export function Boton({ tono = "noche", className, children, ...props }: Omit<ComponentPropsWithRef<"button">, "className"> & {
    tono?: TonoBoton;
    className?: string;
}) {
    return (<button type="button" className={cn(claseBoton, "cursor-pointer justify-center", botones[tono], className)} {...props}>
      {children}
    </button>);
}

/** Constancia: un cuadro por sesión prevista, relleno si está hecha. */
export function Cuadros({ hechas, total, tono = "noche", className, etiqueta, }: {
    hechas: number;
    total: number;
    tono?: "noche" | "papel";
    className?: string;
    etiqueta: string;
}) {
    return (<div role="img" aria-label={etiqueta} className={cn("flex gap-1.5", className)}>
      {Array.from({ length: total }, (_, i) => (<span key={i} className={cn("size-4", i < hechas
                ? tono === "noche" ? "bg-night" : "bg-paper"
                : tono === "noche" ? "bg-linen-deep" : "bg-paper/25")}/>))}
    </div>);
}
