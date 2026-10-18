import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { IconoCerrar, IconoPlay, IconoTecnica } from "./iconos";
import { Boton, BotonEnlace, Rotulo } from "./piezas";
import type { DiaVista, Plan, SerieHecha } from "./tipos";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";
const campo = "h-14 w-full min-w-0 bg-paper px-3 text-[20px] font-semibold tabular-nums text-night placeholder:text-slate/60 focus:outline-2 focus:outline-navy";

/**
 * Modo entreno: un ejercicio cada vez, a pantalla completa, pensado para
 * usarse con el móvil en el gimnasio. Campos grandes, la última marca
 * precargada y el descanso contando solo al marcar una serie.
 * (Maqueta: los estados llegan por props; la interacción llega en la fase 3.)
 */
export async function PantallaEntreno({ dia, indice, hechas, descanso, plan, hrefCerrar, hrefAnterior, hrefSiguiente, hrefVideo, }: {
    dia: DiaVista;
    /** Ejercicio que se muestra (0…n-1). */
    indice: number;
    /** Series ya marcadas del ejercicio actual, en orden. */
    hechas: SerieHecha[];
    /** Descanso en curso tras la última serie marcada. */
    descanso: { restante: string; total: string; progreso: number } | null;
    plan: Plan;
    hrefCerrar: string;
    hrefAnterior: string | null;
    hrefSiguiente: string | null;
    hrefVideo: string;
}) {
    const { t } = await getI18n();
    const ej = dia.ejercicios[indice];
    const total = dia.ejercicios.length;
    const actual = hechas.length;
    return (<div className="min-h-dvh bg-paper pb-44 text-night lg:pb-12">
      <header className="sticky top-0 z-40 flex gap-2 bg-paper p-2">
        <Link href={hrefCerrar} aria-label={t("Salir del entreno")} className={cn("press flex size-14 shrink-0 items-center justify-center bg-linen hover:bg-linen-deep", foco)}>
          <IconoCerrar className="size-6"/>
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 bg-linen px-4">
          <p className="text-[15px] font-semibold">
            {t("Ejercicio {0} de {1}", { "0": indice + 1, "1": total })}
            <span className="ml-2 font-normal text-slate">· {t("Día {0}", { "0": dia.numero })}</span>
          </p>
          <div aria-hidden="true" className="grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
            {dia.ejercicios.map((e, i) => (<span key={e.id} className={cn("h-1", i <= indice ? "bg-night" : "bg-linen-deep")}/>))}
          </div>
        </div>
      </header>

      <main className="grid gap-2 px-2 lg:grid-cols-2">
        <div className="grid content-start gap-2">
          {/* Vídeo de ejecución (Bunny Stream en la fase de vídeo) */}
          <button type="button" className={cn("press group relative flex aspect-[16/10] cursor-pointer items-center justify-center bg-night text-paper", foco)}>
            <span className="flex size-16 items-center justify-center bg-paper text-night transition-transform duration-200 group-hover:scale-105">
              <IconoPlay className="size-7"/>
            </span>
            <span className="absolute bottom-0 left-0 bg-paper px-4 py-2.5 text-[14px] font-semibold text-night">
              {ej.tieneVideo ? t("Vídeo de ejecución") : t("Vídeo · próximamente")}
            </span>
          </button>

          <div className="bg-linen p-5 sm:p-6">
            <Rotulo className="text-slate">{t(dia.enfoque)}</Rotulo>
            <h1 className="mt-2 font-display text-[clamp(2rem,8vw,3.25rem)] leading-[1.02]">{t(ej.nombre)}</h1>
            {ej.nota && <p className="mt-4 max-w-[46ch] font-serif text-[17px] leading-relaxed">{t(ej.nota)}</p>}
            {ej.ultima && (<p className="mt-4 text-step-small font-semibold text-navy">{t("La última vez: {0}", { "0": ej.ultima })}</p>)}
          </div>

          {plan === "premium" && (<BotonEnlace href={hrefVideo} tono="lino" className="hidden lg:flex">
              <span className="flex items-center gap-3"><IconoTecnica className="size-5"/>{t("Enviar un vídeo de este ejercicio")}</span>
            </BotonEnlace>)}
        </div>

        <section aria-labelledby="series" className="grid content-start gap-2">
          <h2 id="series" className="sr-only">{t("Series")}</h2>
          {ej.series.map((s, i) => {
            const hecha = hechas[i];
            const objetivo = t("{0} × {1}", { "0": t(s.peso), "1": s.reps }) + (s.rir ? ` · RIR ${s.rir}` : "");
            if (hecha) {
                return (<div key={i} className="flex items-center justify-between gap-4 bg-night p-5 text-paper">
                  <span className="text-[15px] font-semibold text-navy-soft">{t("Serie {0}", { "0": i + 1 })}</span>
                  <span className="text-[18px] font-semibold tabular-nums">
                    {hecha.kg} kg × {hecha.reps}{hecha.rir && <span className="text-navy-soft"> · RIR {hecha.rir}</span>}
                  </span>
                </div>);
            }
            if (i === actual) {
                return (<div key={i} className="bg-linen p-5 sm:p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[17px] font-semibold">{t("Serie {0}", { "0": i + 1 })}</p>
                    <p className="text-step-small text-slate">{t("Objetivo: {0}", { "0": objetivo })}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {([
                        ["kg", "kg", "decimal", ej.ultima?.split(" × ")[0] ?? ""],
                        ["reps", t("reps"), "numeric", s.reps],
                        ["rir", "RIR", "numeric", s.rir],
                    ] as const).map(([clave, rotulo, modo, valor]) => (<label key={clave} className="grid gap-1.5">
                        <span className="text-step-small font-semibold text-slate">{rotulo}</span>
                        <input inputMode={modo} defaultValue={valor} aria-label={t("{0} de la serie {1}", { "0": rotulo, "1": i + 1 })} className={campo}/>
                      </label>))}
                  </div>
                  <Boton className="mt-4 w-full">{t("Serie hecha")}</Boton>
                </div>);
            }
            return (<div key={i} className="flex items-center justify-between gap-4 bg-linen p-5 text-slate">
                <span className="text-[15px] font-semibold">{t("Serie {0}", { "0": i + 1 })}</span>
                <span className="text-[15px] tabular-nums">{objetivo}</span>
              </div>);
        })}
          <p className="px-1 pt-1 text-step-small text-slate">
            {t("Descanso entre series: {0}. RIR = repeticiones que te quedaban al terminar.", { "0": ej.series[0]?.descanso ?? "—" })}
          </p>

          {plan === "premium" && (<BotonEnlace href={hrefVideo} tono="lino" className="lg:hidden">
              <span className="flex items-center gap-3"><IconoTecnica className="size-5"/>{t("Enviar un vídeo de este ejercicio")}</span>
            </BotonEnlace>)}

          <div className="hidden grid-cols-2 gap-2 lg:grid">
            {hrefAnterior ? <BotonEnlace href={hrefAnterior} tono="lino" flecha={false}>{t("← Anterior")}</BotonEnlace> : <span/>}
            {hrefSiguiente
            ? <BotonEnlace href={hrefSiguiente}>{t("Siguiente ejercicio")}</BotonEnlace>
            : <BotonEnlace href={hrefCerrar}>{t("Terminar y guardar")}</BotonEnlace>}
          </div>
        </section>
      </main>

      {/* Móvil: descanso y navegación fijos abajo, al alcance del pulgar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid gap-1 bg-paper px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:static lg:mt-2 lg:px-2 lg:pb-0">
        {descanso && (<div role="timer" aria-live="off" aria-label={t("Descanso: quedan {0}", { "0": descanso.restante })} className="relative overflow-hidden bg-navy text-paper">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-navy-deep" style={{ width: `${Math.round(descanso.progreso * 100)}%` }}/>
            <div className="relative flex items-center justify-between gap-3 px-5 py-3">
              <p>
                <span className="block text-step-small font-semibold text-navy-soft">{t("Descanso · {0}", { "0": descanso.total })}</span>
                <span className="block font-display text-[2rem] leading-none tabular-nums">{descanso.restante}</span>
              </p>
              <div className="flex gap-1">
                <Boton tono="marino" className="min-h-11 bg-navy-deep px-3 text-[14px]">{t("+15 s")}</Boton>
                <Boton tono="papel" className="min-h-11 px-4 text-[14px]">{t("Saltar")}</Boton>
              </div>
            </div>
          </div>)}
        <div className={cn("grid gap-1 lg:hidden", hrefAnterior && "grid-cols-[auto_1fr]")}>
          {hrefAnterior && (<BotonEnlace href={hrefAnterior} tono="lino" flecha={false} className="px-4">
              {t("←")}<span className="sr-only">{t("Anterior")}</span>
            </BotonEnlace>)}
          {hrefSiguiente
            ? <BotonEnlace href={hrefSiguiente}>{t("Siguiente ejercicio")}</BotonEnlace>
            : <BotonEnlace href={hrefCerrar}>{t("Terminar y guardar")}</BotonEnlace>}
        </div>
      </div>
    </div>);
}
