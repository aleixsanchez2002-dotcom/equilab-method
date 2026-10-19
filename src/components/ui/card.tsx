import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type CardProps = ComponentPropsWithRef<"div"> & {
  /** Superficie elevada (bordes + fondo más claro que la página). */
  elevated?: boolean;
};

export function Card({ elevated = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-sm border border-edge",
        elevated ? "bg-ink-800" : "bg-ink-900",
        className,
      )}
      {...props}
    />
  );
}
