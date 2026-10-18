import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

/* Botón plano y de esquinas rectas, en minúsculas: la sobriedad del
   material ecuestre. El marino es el único color de acción. */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-cognac-500 text-ink-950 hover:bg-cognac-600 active:bg-cognac-600",
  outline:
    "border border-sand-300/60 text-sand-50 hover:border-sand-50 hover:bg-sand-50/5",
  ghost: "text-sand-300 hover:text-sand-50 hover:bg-sand-50/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[14px]",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-7 text-[16px]",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-none font-sans font-semibold",
        "cursor-pointer select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cognac-500",
        "disabled:pointer-events-none disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
