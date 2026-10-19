import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  /** Elemento opcional a la derecha de la etiqueta (p. ej. "¿Olvidaste tu contraseña?") */
  labelAside?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Agrupa etiqueta + control + mensaje de ayuda o error con estilo consistente. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  labelAside,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-medium uppercase tracking-[0.14em] text-sand-500"
        >
          {label}
        </label>
        {labelAside}
      </div>
      {children}
      {error ? (
        <p className="text-[13px] text-error">{error}</p>
      ) : hint ? (
        <p className="text-[13px] text-sand-600">{hint}</p>
      ) : null}
    </div>
  );
}
