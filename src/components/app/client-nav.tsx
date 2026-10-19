import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";

export async function ClientNav({ active }: { active: "inicio" | "rutina" | "progreso" | "cuenta" }) {
  const { t } = await getI18n();
  const items = [
    { id: "inicio", label: "Inicio", href: "/app", icon: "⌂" },
    { id: "rutina", label: "Mi rutina", href: "/app?vista=rutina", icon: "≡" },
    { id: "progreso", label: "Progreso", href: "/app?vista=progreso", icon: "↗" },
    { id: "cuenta", label: "Cuenta", href: "/app/cuenta", icon: "○" },
  ];
  return <nav aria-label={t("Tu espacio")} className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-edge bg-ink-950 pb-[env(safe-area-inset-bottom)] sm:static sm:mx-auto sm:mt-5 sm:max-w-5xl sm:gap-2 sm:rounded-xl sm:border sm:p-1">
    {items.map(item => <Link key={item.id} href={item.href} aria-current={active === item.id ? "page" : undefined} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-xs font-medium transition-colors sm:min-h-12 sm:flex-row sm:gap-2 sm:rounded-lg", active === item.id ? "bg-cognac-500/10 text-cognac-300" : "text-sand-500 hover:bg-ink-800 hover:text-sand-50")}><span aria-hidden="true" className="text-xl leading-none">{item.icon}</span>{t(item.label)}</Link>)}
  </nav>;
}
