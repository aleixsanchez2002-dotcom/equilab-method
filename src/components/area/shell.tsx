import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import type { ReactNode } from "react";
import { BitMark } from "@/components/brand/logo";
import { cn } from "@/lib/cn";
import { IconoCuenta, IconoHoy, IconoMensajes, IconoProgreso, IconoRutina, IconoTecnica, } from "./iconos";
import type { Pestana, Plan } from "./tipos";

export type RutasArea = Record<Pestana | "mensajes", string>;

/** Rutas reales del área; las maquetas pasan las suyas para poder navegar. */
export const RUTAS_AREA: RutasArea = {
    hoy: "/app",
    rutina: "/app/rutina",
    tecnica: "/app/tecnica",
    progreso: "/app/progreso",
    cuenta: "/app/cuenta",
    mensajes: "/app/mensajes",
};

const PESTANAS = [
    { id: "hoy", etiqueta: "Hoy", Icono: IconoHoy },
    { id: "rutina", etiqueta: "Rutina", Icono: IconoRutina },
    { id: "tecnica", etiqueta: "Técnica", Icono: IconoTecnica },
    { id: "progreso", etiqueta: "Progreso", Icono: IconoProgreso },
    { id: "cuenta", etiqueta: "Cuenta", Icono: IconoCuenta },
] as const;

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

/**
 * Marco del área de cliente. En el móvil: barra superior con el título de
 * la pantalla y barra de pestañas fija abajo, al alcance del pulgar. En el
 * escritorio: una sola barra arriba, de losetas como la de la portada.
 */
export async function AreaShell({ activa, titulo, plan, sinLeer = 0, rutas = RUTAS_AREA, children, }: {
    activa: Pestana | "mensajes";
    /** Título de la pantalla en la barra del móvil. */
    titulo: string;
    plan: Plan;
    sinLeer?: number;
    rutas?: RutasArea;
    children: ReactNode;
}) {
    const { t } = await getI18n();
    return (<div className="min-h-dvh bg-paper text-night">
      <header className="sticky top-0 z-40 flex gap-2 bg-paper p-2">
        <Link href={rutas.hoy} aria-label={t("Equilab — tu entrenamiento")} className={cn("press flex size-14 shrink-0 items-center justify-center bg-night text-paper hover:bg-navy", foco)}>
          <BitMark className="w-9"/>
        </Link>

        {/* Móvil: título de la pantalla */}
        <p className="flex min-w-0 flex-1 items-center bg-linen px-4 text-[16px] font-semibold lg:hidden">
          <span className="truncate">{t(titulo)}</span>
        </p>

        {/* Escritorio: pestañas en la barra */}
        <nav aria-label={t("Secciones")} className="hidden flex-1 items-stretch bg-linen lg:flex">
          {PESTANAS.map(({ id, etiqueta, Icono }) => {
            const actual = activa === id;
            return (<Link key={id} href={rutas[id]} aria-current={actual ? "page" : undefined} className={cn("press flex items-center gap-2.5 px-5 text-[15px] font-semibold", actual ? "bg-night text-paper" : "hover:bg-linen-deep", foco)}>
                <Icono className="size-5"/>
                {t(etiqueta)}
                {id === "tecnica" && plan === "basico" && (<span className={cn("text-[12px] font-semibold", actual ? "text-navy-soft" : "text-slate")}>Premium</span>)}
              </Link>);
        })}
        </nav>

        <Link href={rutas.mensajes} aria-label={sinLeer > 0
            ? t("Mensajes, {0} sin leer", { "0": sinLeer })
            : t("Mensajes")} aria-current={activa === "mensajes" ? "page" : undefined} className={cn("press relative flex size-14 shrink-0 items-center justify-center lg:w-auto lg:gap-2.5 lg:px-5", activa === "mensajes" ? "bg-night text-paper" : "bg-linen hover:bg-linen-deep", foco)}>
          <IconoMensajes className="size-6 lg:size-5"/>
          <span className="hidden text-[15px] font-semibold lg:inline">{t("Mensajes")}</span>
          {sinLeer > 0 && (<span aria-hidden="true" className="absolute top-2.5 right-2.5 size-2.5 bg-wine lg:static lg:size-2"/>)}
        </Link>
      </header>

      <main className="px-2 pb-28 lg:pb-12">{children}</main>

      {/* Móvil: pestañas abajo */}
      <nav aria-label={t("Secciones")} className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 bg-paper px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
        {PESTANAS.map(({ id, etiqueta, Icono }) => {
            const actual = activa === id;
            return (<Link key={id} href={rutas[id]} aria-current={actual ? "page" : undefined} className={cn("press flex h-16 flex-col items-center justify-center gap-1 text-[12px] font-semibold", actual ? "bg-night text-paper" : "bg-linen text-night", foco)}>
              <Icono className="size-6"/>
              {t(etiqueta)}
            </Link>);
        })}
      </nav>
    </div>);
}
