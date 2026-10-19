import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type OverlineProps = ComponentPropsWithRef<"span"> & {
  accent?: boolean;
};

/** Etiqueta editorial en versalitas con tracking amplio. */
export function Overline({ accent = false, className, ...props }: OverlineProps) {
  return (
    <span
      className={cn(
        "font-sans text-[11px] font-medium uppercase tracking-[0.24em]",
        accent ? "text-cognac-400" : "text-sand-500",
        className,
      )}
      {...props}
    />
  );
}
