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
        "h-11 w-full rounded-xs border border-edge bg-ink-900 px-4 text-[15px] text-sand-100",
        "placeholder:text-sand-600 transition-colors duration-200",
        "focus:border-cognac-500/60 focus:outline-none focus:ring-2 focus:ring-cognac-500/20",
        "autofill:shadow-[inset_0_0_0_1000px_var(--color-ink-900)]",
        invalid && "border-error/60 focus:border-error/60 focus:ring-error/20",
        className,
      )}
      {...props}
    />
  );
}
