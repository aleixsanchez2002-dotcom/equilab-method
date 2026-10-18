import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type OverlineProps = ComponentPropsWithRef<"span"> & {
  accent?: boolean;
};

/** Etiqueta de sección: texto corto en negrita, sin versalitas. */
export function Overline({ accent = false, className, ...props }: OverlineProps) {
  return (
    <span
      className={cn(
        "font-sans text-[14px] font-semibold",
        accent ? "text-cognac-500" : "text-sand-500",
        className,
      )}
      {...props}
    />
  );
}
