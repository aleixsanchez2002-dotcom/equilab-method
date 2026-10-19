import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/reveal";
/*
 * Lo que el motor prioriza para cada corrección habitual.
 * Copia de PRIORIDAD_POR_DEFECTO (src/lib/motor-rutinas.ts) y de las notas
 * de técnica del catálogo inicial (supabase/migrations/0002_datos_iniciales.sql).
 * Si el equipo cambia esas reglas, actualiza también esta lista.
 */
const correcciones = [
    {
        defecto: "Manos inquietas",
        causa: "Unas manos que no se separan del tronco suelen venir de un core que no aguanta la rotación.",
        ejercicios: [
            { nombre: "Pallof press", tipo: "Postura", nota: "Anti-rotación: el tronco no gira, como en el círculo de 10 m." },
            { nombre: "Plancha con arrastre", tipo: "Control", nota: "Cadera quieta mientras la mano trabaja — manos independientes." },
        ],
    },
    {
        defecto: "Hombros adelantados",
        causa: "El hombro se adelanta cuando la espalda alta no tiene fuerza para sostenerlo atrás y abajo.",
        ejercicios: [
            { nombre: "Face pull", tipo: "Postura", nota: "El antídoto del hombro adelantado." },
            { nombre: "Band pull-apart", tipo: "Postura", nota: "Ritmo lento, aprieta escápulas 1 s." },
        ],
    },
    {
        defecto: "Cadera bloqueada",
        causa: "Una cadera sin movilidad ni fuerza no puede seguir el movimiento del caballo y lo frena.",
        ejercicios: [
            { nombre: "90/90 de caderas", tipo: "Movilidad", nota: "Transiciones lentas, sin ayudarte con las manos." },
            { nombre: "Hip thrust", tipo: "Fuerza", nota: "Pausa de 1 s arriba, sin hiperextender la lumbar." },
        ],
    },
    {
        defecto: "Pierna inestable",
        causa: "La pierna se mueve cuando los aductores y el agarre no sostienen la posición por sí solos.",
        ejercicios: [
            { nombre: "Copenhagen plank", tipo: "Control", nota: "Aductores: tu pierna interior." },
            { nombre: "Farmer carry", tipo: "Fuerza", nota: "Hombros abajo y atrás, paso corto." },
        ],
    },
    {
        defecto: "Asiento en la reunión",
        causa: "Mantener el asiento en la reunión pide disociar pelvis y tronco, y respirar sin bloquearte.",
        ejercicios: [
            { nombre: "Bird dog", tipo: "Control", nota: "La pelvis ni se entera: disociación pura." },
            { nombre: "Respiración 360", tipo: "Movilidad", nota: "Costillas que se expanden a los lados — calma antes de montar." },
            { nombre: "Pallof press", tipo: "Postura", nota: "Anti-rotación: el tronco no gira, como en el círculo de 10 m." },
        ],
    },
];
/** Índice que aparece elegido al llegar (hombros adelantados, la más común). */
const INICIAL = 1;
/**
 * Lo vivo de la página: el jinete elige lo que más le corrigen y ve por qué
 * ejercicios empezaría su rutina. Radios nativos y CSS (:has), así que
 * funciona con teclado y sin JavaScript.
 */
export async function Correcciones() {
    const { t } = await getI18n();
    return (<section id="correcciones" aria-labelledby="correcciones-titulo" className="corr scroll-mt-20 bg-navy px-[var(--gutter)] py-24 text-paper sm:py-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="correcciones-titulo" className="font-display text-step-head">
              {t("¿Qué te corrigen en la pista?")}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-6 max-w-[40ch] font-serif text-step-body text-navy-soft">
              {t("Elige lo que más te repite tu entrenador y mira por dónde empezaría tu rutina.")}
            </p>
          </Reveal>

          <Reveal delay={160}>
            <fieldset className="mt-10">
              <legend className="sr-only">{t("Lo que más te corrigen")}</legend>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {correcciones.map(({ defecto }, i) => (<label key={defecto} className="relative cursor-pointer">
                    <input type="radio" name="correccion" value={defecto} data-i={i} defaultChecked={i === INICIAL} className="peer sr-only"/>
                    <span className="press flex min-h-12 items-center bg-navy-deep px-4 text-[16px] font-semibold text-navy-soft peer-checked:bg-paper peer-checked:text-night peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-paper hover:text-paper peer-checked:hover:text-night lg:min-h-14 lg:text-step-lead">
                      {t(defecto)}
                    </span>
                  </label>))}
              </div>
            </fieldset>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7" aria-live="polite">
          {correcciones.map(({ defecto, causa, ejercicios }, i) => (<div key={defecto} data-i={i} className="corr-panel">
              <p style={{ "--i": 0 } as CSSProperties} className="max-w-[34ch] font-serif text-step-lead">
                {t(causa)}
              </p>
              <ol style={{ "--i": 1 } as CSSProperties} className="mt-10 flex flex-col gap-2">
                {ejercicios.map((ej) => (<li key={ej.nombre} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 bg-navy-deep p-5 sm:p-6">
                    <span className="font-display text-step-lead">{t(ej.nombre)}</span>
                    <span className="text-step-small text-navy-soft">{t(ej.tipo)}</span>
                    <span className="col-span-2 font-serif text-step-body text-navy-soft">{t(ej.nota)}</span>
                  </li>))}
              </ol>
              <div style={{ "--i": 2 } as CSSProperties} className="mt-10 flex">
                <Link href="/acceso/registro" className="press inline-flex h-14 shrink-0 items-center justify-center bg-paper px-7 text-[16px] font-semibold text-night hover:bg-linen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper">
                  {t("Hacer el cuestionario")}
                </Link>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
