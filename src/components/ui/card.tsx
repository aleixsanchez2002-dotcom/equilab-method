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
        "rounded-none border border-edge",
        elevated ? "bg-chalk" : "bg-ink-900",
        className,
      )}
      {...props}
    />
  );
}
