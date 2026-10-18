import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { IconoFlecha } from "./iconos";
import { BotonEnlace, Cuadros, Loseta, Rotulo } from "./piezas";
import type { Aviso, DiaVista } from "./tipos";

export type LlamadaVista = {
    cuando: string;
    con: string;
    enlace: string;
};

/**
 * Pantalla «Hoy»: lo que toca hoy y nada más. La sesión del día manda;
 * la constancia y los avisos acompañan.
 */
export async function PantallaHoy({ nombre, fecha, semanaActual, totalSemanas, sesion, hechas, previstas, avisos, llamada, hrefEntreno, hrefRutina, }: {
    nombre: string;
    /** Fecha de hoy ya formateada («Lunes, 19 de octubre»). */
    fecha: string;
    semanaActual: number;
    totalSemanas: number;
    /** Siguiente día pendiente de la semana; null si la semana está hecha. */
    sesion: DiaVista | null;
    hechas: number;
    previstas: number;
    avisos: Aviso[];
    /** Próxima videollamada (Premium). */
    llamada: LlamadaVista | null;
    hrefEntreno: string;
    hrefRutina: string;
}) {
    const { t } = await getI18n();
    return (<div className="grid gap-2 lg:grid-cols-12">
      <div className="grid gap-2 lg:col-span-7 lg:content-start">
        <Loseta className="pt-8 sm:pt-10">
          <Rotulo className="text-slate">{fecha}</Rotulo>
          <h1 className="mt-2 font-display text-step-head text-night">{t("Hola, {0}.", { "0": nombre })}</h1>
        </Loseta>

        {sesion ? (<Loseta tono="noche" className="relative overflow-hidden pt-8 sm:pt-10">
            {/* La letra de pista del día, como en la portada «Equilab» */}
            <span aria-hidden="true" className="pointer-events-none absolute -top-6 right-2 font-display text-[11rem] leading-none tracking-[-0.05em] text-paper/10 sm:text-[14rem]">
              {sesion.letra}
            </span>
            <Rotulo className="relative text-navy-soft">
              {t("Sesión de hoy · semana {0} de {1}", { "0": semanaActual, "1": totalSemanas })}
            </Rotulo>
            <p className="relative mt-3 font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.02]">
              {t("Día {0}", { "0": sesion.numero })}
              <span className="block text-paper/70">{t(sesion.enfoque)}</span>
            </p>
            <p className="relative mt-4 text-[15px] text-paper/80">
              {t("{0} ejercicios · {1}", { "0": sesion.ejercicios.length, "1": sesion.duracion })}
            </p>
            <ol className="relative mt-6 grid gap-1 text-[15px]">
              {sesion.ejercicios.map((ej, i) => (<li key={ej.id} className="flex gap-3">
                  <span className="w-6 shrink-0 font-semibold text-navy-soft tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {t(ej.nombre)}
                </li>))}
            </ol>
            <BotonEnlace href={hrefEntreno} tono="papel" className="relative mt-8 w-full sm:w-auto sm:min-w-72">
              {t("Empezar sesión")}
            </BotonEnlace>
          </Loseta>) : (<Loseta tono="noche" className="pt-8 sm:pt-10">
            <Rotulo className="text-navy-soft">{t("Esta semana")}</Rotulo>
            <p className="mt-3 font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.02]">{t("Semana completa.")}</p>
            <p className="mt-4 max-w-[40ch] font-serif text-[17px] text-paper/80">{t("Has hecho todas las sesiones previstas. El lunes empieza la siguiente.")}</p>
            <BotonEnlace href={hrefRutina} tono="papel" className="mt-8 w-full sm:w-auto sm:min-w-72">{t("Ver la rutina")}</BotonEnlace>
          </Loseta>)}
      </div>

      <div className="grid gap-2 lg:col-span-5 lg:content-start">
        <Loseta>
          <Rotulo className="text-slate">{t("Esta semana")}</Rotulo>
          <div className="mt-3 flex items-end justify-between gap-4">
            <p className="font-display text-step-lead">{t("{0} de {1} sesiones", { "0": hechas, "1": previstas })}</p>
            <Cuadros hechas={hechas} total={previstas} etiqueta={t("{0} de {1} sesiones hechas", { "0": hechas, "1": previstas })} className="mb-1.5"/>
          </div>
        </Loseta>

        {llamada && (<Loseta tono="marino">
            <Rotulo className="text-navy-soft">{t("Tu valoración 1:1")}</Rotulo>
            <p className="mt-2 font-display text-step-lead">{llamada.cuando}</p>
            <p className="mt-1 text-[15px] text-paper/80">{t("Google Meet · con {0}", { "0": llamada.con })}</p>
            <BotonEnlace href={llamada.enlace} tono="papel" className="mt-5 w-full">{t("Abrir la videollamada")}</BotonEnlace>
          </Loseta>)}

        {avisos.length > 0 && (<section aria-labelledby="avisos" className="grid gap-2">
            <h2 id="avisos" className="sr-only">{t("Avisos")}</h2>
            {avisos.map((aviso) => (<Link key={aviso.id} href={aviso.href} className={cn("press group flex items-center justify-between gap-4 bg-linen p-5 hover:bg-linen-deep sm:p-6", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy")}>
                <span className="min-w-0">
                  <span className="block text-[16px] font-semibold">{t(aviso.titulo)}</span>
                  <span className="mt-1 block text-step-small text-slate">{t(aviso.detalle)}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-step-small font-semibold text-navy">
                  <span className="hidden sm:inline">{t(aviso.accion)}</span>
                  <IconoFlecha className="size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
                </span>
              </Link>))}
          </section>)}
      </div>
    </div>);
}
