"use client";
import { useId, useState, type ReactNode } from "react";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/cn";

type MobileDisclosureProps = {
  /** Texto del botón cuando el contenido está plegado. */
  showLabel: string;
  /** Texto del botón cuando el contenido está a la vista. */
  hideLabel: string;
  children: ReactNode;
};

/**
 * Contenido plegado solo en móvil: desde 640 px se muestra siempre y el
 * botón desaparece. Sirve para detalle que en el teléfono alarga mucho la
 * página (la tabla comparativa de planes ocupaba más de una pantalla).
 */
export function MobileDisclosure({ showLabel, hideLabel, children }: MobileDisclosureProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-edge-control px-5 text-sm font-semibold text-sand-100 transition-colors duration-150 hover:bg-sand-100/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400 sm:hidden"
      >
        {t(open ? hideLabel : showLabel)}
        <svg viewBox="0 0 12 12" aria-hidden="true" className={cn("size-3 shrink-0 text-cognac-400 transition-transform duration-250", open && "rotate-180")}>
          <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={id} className={cn("sm:block", open ? "mt-5 sm:mt-0" : "hidden")}>
        {children}
      </div>
    </>
  );
}
