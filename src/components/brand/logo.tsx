import { cn } from "@/lib/cn";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  /** «light» para fondos de color (marino, noche). */
  tone?: "dark" | "light";
  className?: string;
};

/** Marca gráfica: filete (bocado) minimalista — dos anillas y embocadura articulada. */
export function BitMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="10" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="46" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M18 12 L28 9.5 L38 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="9.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

const sizeMap = {
  sm: { mark: "w-8", name: "text-xl", sub: "text-[7px] tracking-[0.42em]" },
  md: { mark: "w-10", name: "text-lg", sub: "text-[9px] tracking-[0.5em]" },
  lg: { mark: "w-12", name: "text-2xl", sub: "text-[10px] tracking-[0.56em]" },
} as const;

export function Logo({ size = "md", tone = "dark", className }: LogoProps) {
  const s = sizeMap[size];
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BitMark className={cn("shrink-0", tone === "light" ? "text-paper" : "text-cognac-500", s.mark)} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display tracking-[-0.03em]",
            tone === "light" ? "text-paper" : "text-sand-50",
            s.name,
          )}
        >
          EQUILAB
        </span>
        <span
          className={cn(
            "mt-1 font-sans font-semibold uppercase",
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
