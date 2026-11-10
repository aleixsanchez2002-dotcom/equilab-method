import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** `span` cuando el botón va dentro de un enlace: un `<button>` dentro de
      un `<a>` no es HTML válido y el foco debe quedarse en el enlace. */
  as?: "button" | "span";
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-cognac-500 text-ink-950 hover:bg-cognac-400 active:bg-cognac-600",
  outline:
    "border border-edge-control text-sand-100 hover:border-sand-300/50 hover:bg-sand-100/5 active:bg-sand-100/10",
  ghost: "text-sand-500 hover:text-sand-100 hover:bg-sand-100/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-xs",
  md: "h-11 px-6 text-xs",
  lg: "h-14 px-5 text-sm sm:px-7",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  type = "button",
  as = "button",
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold uppercase tracking-[0.08em]",
    "transition-all duration-150 cursor-pointer select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-400",
    "disabled:pointer-events-none disabled:opacity-40",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
  if (as === "span") {
    return <span className={classes}>{children}</span>;
  }
  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
