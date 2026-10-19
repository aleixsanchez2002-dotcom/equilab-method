import { cn } from "@/lib/cn";

type DividerProps = {
  label?: string;
  className?: string;
};

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn("border-edge", className)} />;
  }
  return (
    <div className={cn("flex items-center gap-4", className)} role="separator">
      <span className="h-px flex-1 bg-edge" />
      <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-sand-600">
        {label}
      </span>
      <span className="h-px flex-1 bg-edge" />
    </div>
  );
}
