import Link from "next/link";
import type { ReactNode } from "react";
import { getI18n } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";

/* Iconos propios en SVG (trazo de 1.6, como el filete del logotipo): los
   caracteres tipográficos cambian de forma y tamaño según el teléfono. */
const iconos: Record<"inicio" | "rutina" | "progreso" | "cuenta", ReactNode> = {
  inicio: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />,
  rutina: <path d="M8 6.5h11M8 12h11M8 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" />,
  progreso: <path d="M4 19.5h16M6.5 15.5l4-4 3 3 5-6.5" />,
  cuenta: <path d="M12 12a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM5 19.5c.9-3 3.6-4.5 7-4.5s6.1 1.5 7 4.5" />,
};

export async function ClientNav({ active }: { active: "inicio" | "rutina" | "progreso" | "cuenta" }) {
  const { t } = await getI18n();
  const items = [
    { id: "inicio", label: "Inicio", href: "/app" },
    { id: "rutina", label: "Mi rutina", href: "/app?vista=rutina" },
    { id: "progreso", label: "Progreso", href: "/app?vista=progreso" },
    { id: "cuenta", label: "Cuenta", href: "/app/cuenta" },
  ] as const;
  return <nav aria-label={t("Tu espacio")} className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-edge bg-ink-950 pb-[env(safe-area-inset-bottom)] sm:static sm:mx-auto sm:mt-5 sm:max-w-5xl sm:gap-2 sm:rounded-xl sm:border sm:p-1">
    {items.map(item => <Link key={item.id} href={item.href} aria-current={active === item.id ? "page" : undefined} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-xs font-medium transition-colors sm:min-h-12 sm:flex-row sm:gap-2 sm:rounded-lg", active === item.id ? "bg-cognac-500/10 text-cognac-300" : "text-sand-500 hover:bg-ink-800 hover:text-sand-50")}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-6 sm:size-5">{iconos[item.id]}</svg>{t(item.label)}</Link>)}
  </nav>;
}
