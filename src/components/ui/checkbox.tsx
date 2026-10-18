import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CheckboxProps = Omit<ComponentPropsWithRef<"input">, "type"> & {
  label: ReactNode;
};

/** Checkbox accesible con estética propia; el input nativo se mantiene para teclado y lectores. */
export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-sand-300",
        className,
      )}
    >
      <span className="relative mt-0.5 inline-flex size-4 shrink-0">
        <input
          type="checkbox"
          id={id}
          className={cn(
            "peer size-4 cursor-pointer appearance-none rounded-none border border-edge-strong bg-chalk",
            "transition-colors duration-150 checked:border-cognac-500 checked:bg-cognac-500",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400",
          )}
          {...props}
        />
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto size-3 opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
        >
          <path
            d="M2.5 6.5 5 9l4.5-6"
            fill="none"
            stroke="var(--color-ink-950)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="transition-colors duration-150 group-hover:text-sand-100">
        {label}
      </span>
    </label>
  );
}
