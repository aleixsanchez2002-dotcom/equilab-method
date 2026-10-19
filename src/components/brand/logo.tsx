import { cn } from "@/lib/cn";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  /** «light» para fondos de color (marino, noche). */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Marca gráfica: bocado de anillas — dos anillas, embocadura articulada y
 * anilla central (ADR-0019). Trazo grueso para que se lea a 32 px.
 */
export function BitMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="14" r="8.5" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="53" cy="14" r="8.5" stroke="currentColor" strokeWidth="3.2" />
      <path
        d="M19.5 14 L29 11.2 M35 11.2 L44.5 14"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="11" r="3" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

const sizeMap = {
  sm: { mark: "w-9", name: "text-xl", sub: "text-[7px]" },
  md: { mark: "w-10", name: "text-lg", sub: "text-[8px]" },
  lg: { mark: "w-12", name: "text-2xl", sub: "text-[9px]" },
} as const;

export function Logo({ size = "md", tone = "dark", className }: LogoProps) {
  const s = sizeMap[size];
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BitMark className={cn("shrink-0", tone === "light" ? "text-paper" : "text-cognac-500", s.mark)} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-semibold tracking-[0.04em]",
            tone === "light" ? "text-paper" : "text-sand-50",
            s.name,
          )}
        >
          EQUILAB
        </span>
        <span
          className={cn(
            "mt-1.5 font-sans font-semibold tracking-[0.62em] uppercase",
            tone === "light" ? "text-navy-soft" : "text-cognac-500",
            s.sub,
          )}
        >
          Method
        </span>
      </span>
    </span>
  );
}
