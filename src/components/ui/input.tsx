import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type InputProps = ComponentPropsWithRef<"input"> & {
  invalid?: boolean;
};

export function Input({ invalid = false, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "h-12 w-full rounded-none border border-edge-strong bg-chalk px-4 text-[16px] text-sand-100",
        "placeholder:text-sand-600 transition-colors duration-200",
        "focus:border-cognac-500 focus:outline-none focus:ring-2 focus:ring-cognac-500/20",
        "autofill:shadow-[inset_0_0_0_1000px_var(--color-chalk)]",
        invalid && "border-error/60 focus:border-error/60 focus:ring-error/20",
        className,
      )}
      {...props}
    />
  );
}
