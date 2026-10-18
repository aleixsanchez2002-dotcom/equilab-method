import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { BotonEnlace, Loseta, Rotulo } from "./piezas";
import type { DiaVista, RutinaVista } from "./tipos";

/** «3 × 8 · RIR 2» a partir de las series objetivo de un ejercicio. */
function resumenSeries(series: DiaVista["ejercicios"][number]["series"]): string {
    if (series.length === 0)
        return "";
    const primera = series[0];
    const iguales = series.every((s) => s.reps === primera.reps);
    const reps = iguales ? primera.reps : series.map((s) => s.reps).join("/");
    return `${series.length} × ${reps}${primera.rir ? ` · RIR ${primera.rir}` : ""}`;
}

/**
 * Pantalla «Rutina»: el bloque entero, semana a semana. Cada día es una
 * loseta con su letra de pista; desde aquí se entra al modo entreno.
 */
export async function PantallaRutina({ rutina, semanaVista, hrefSemana, hrefEntreno, }: {
    rutina: RutinaVista;
    semanaVista: number;
    hrefSemana: (semana: number) => string;
    hrefEntreno: (diaId: string) => string;
}) {
    const { t } = await getI18n();
    const semanas = Array.from({ length: rutina.totalSemanas }, (_, i) => i + 1);
    return (<div className="grid gap-2">
      <Loseta className="pt-8 sm:pt-10">
        <Rotulo className="text-slate">{t("Tu bloque · semana {0} de {1}", { "0": rutina.semanaActual, "1": rutina.totalSemanas })}</Rotulo>
        <h1 className="mt-2 font-display text-step-head">{t(rutina.titulo)}</h1>
        <details className="group mt-6 max-w-[62ch]">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-[16px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="inline-block w-4 text-center transition-transform duration-200 group-open:rotate-45">+</span>
            {t("Por qué entrenas así")}
          </summary>
          <p className="mt-4 font-serif text-[17px] leading-relaxed whitespace-pre-line">{t(rutina.explicacion)}</p>
        </details>
      </Loseta>

      <nav aria-label={t("Semanas del bloque")} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${semanas.length}, minmax(0, 1fr))` }}>
        {semanas.map((n) => {
            const vista = n === semanaVista;
            const actual = n === rutina.semanaActual;
            return (<Link key={n} href={hrefSemana(n)} aria-current={vista ? "page" : undefined} className={cn("press relative flex h-14 items-center justify-center text-[15px] font-semibold", vista ? "bg-night text-paper" : "bg-linen hover:bg-linen-deep", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy")}>
              <span className="sm:hidden">{t("S{0}", { "0": n })}</span>
              <span className="hidden sm:inline">{t("Semana {0}", { "0": n })}</span>
              {actual && (<span className={cn("absolute top-2 right-2 size-2", vista ? "bg-paper" : "bg-navy")}>
                  <span className="sr-only">{t("(semana actual)")}</span>
                </span>)}
            </Link>);
        })}
      </nav>

      {semanaVista !== rutina.semanaActual && (<p className="px-1 py-2 text-step-small text-slate">
          {semanaVista < rutina.semanaActual
                ? t("Estás viendo una semana ya pasada del bloque.")
                : t("Estás viendo una semana que aún no te toca.")}
        </p>)}

      <div className="grid gap-2 lg:grid-cols-3">
        {rutina.dias.map((dia) => (<article key={dia.id} aria-labelledby={`dia-${dia.id}`} className="flex flex-col bg-linen p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <span aria-hidden="true" className={cn("font-display text-[4.5rem] leading-[0.8] tracking-[-0.05em]", dia.hecho ? "text-linen-deep" : "text-night")}>
                {dia.letra}
              </span>
              <span className={cn("px-2.5 py-1 text-[13px] font-semibold", dia.hecho ? "bg-paper text-slate" : "bg-navy text-paper")}>
                {dia.hecho ? t("Hecho · {0}", { "0": dia.hecho }) : t("Pendiente")}
              </span>
            </div>
            <h2 id={`dia-${dia.id}`} className="mt-5 font-display text-step-lead">
              {t("Día {0}", { "0": dia.numero })}
              <span className="block text-slate">{t(dia.enfoque)}</span>
            </h2>
            <p className="mt-2 text-step-small text-slate">
              {t("{0} ejercicios · {1}", { "0": dia.ejercicios.length, "1": dia.duracion })}
            </p>
            <ul className="mt-5 grid flex-1 content-start gap-2 text-[15px]">
              {dia.ejercicios.map((ej) => (<li key={ej.id} className="flex items-baseline justify-between gap-3">
                  <span>{t(ej.nombre)}</span>
                  <span className="shrink-0 text-step-small font-semibold text-slate tabular-nums">{resumenSeries(ej.series)}</span>
                </li>))}
            </ul>
            <BotonEnlace href={hrefEntreno(dia.id)} tono={dia.hecho ? "papel" : "noche"} className="mt-6 w-full">
              {dia.hecho ? t("Repetir sesión") : t("Empezar sesión")}
            </BotonEnlace>
          </article>))}
      </div>
    </div>);
}
