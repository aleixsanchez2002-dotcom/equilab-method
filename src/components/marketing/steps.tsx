import { getI18n } from "@/lib/i18n/server";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/reveal";
const steps = [
    {
        title: "Cuéntanos",
        text: "Cuestionario de 10 minutos sobre tu postura, historial físico, material disponible y objetivos en la pista.",
    },
    {
        title: "Recibe tu rutina",
        text: "Personalizada y revisada por el equipo en el plan Básico. Construida a mano y valoración 1:1 en el plan Premium.",
    },
    {
        title: "Progresa",
        text: "Entrena desde el móvil en el gimnasio, registra cada sesión y siente el cambio donde importa: encima del caballo.",
    },
];
/* ————— Diagrama: tus respuestas sueltas → una rutina → semanas en orden ————— */
type Cuadro = {
    x: number;
    y: number;
    tono: "claro" | "medio" | "marca";
    d: number;
};
/** Generador pseudoaleatorio con semilla: el dibujo es igual en cada visita. */
function semilla(n: number) {
    let s = n;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}
/** Coordenadas en un lienzo de 900 × 200 (el móvil las gira). */
function cuadros(): Cuadro[] {
    const azar = semilla(7);
    const out: Cuadro[] = [];
    const lado = 12;
    // Primer tercio: respuestas sueltas, en dos tonos claros
    for (let i = 0; i < 46; i++) {
        out.push({
            x: 8 + azar() * (270 - lado),
            y: 10 + azar() * (180 - lado),
            tono: azar() > 0.5 ? "claro" : "medio",
            d: Math.round(azar() * 260),
        });
    }
    // Segundo tercio: una cinta compacta de tres cuadros de alto
    for (let c = 0; c < 15; c++) {
        for (let f = 0; f < 3; f++) {
            out.push({ x: 318 + c * 17, y: 74 + f * 17, tono: "medio", d: 320 + c * 22 });
        }
    }
    // Último tercio: filas ordenadas, ya en el color de marca
    for (let f = 0; f < 6; f++) {
        for (let c = 0; c < 9; c++) {
            out.push({ x: 640 + c * 28, y: 18 + f * 30, tono: "marca", d: 700 + f * 60 + c * 14 });
        }
    }
    return out;
}
const color = {
    claro: "var(--color-navy-soft)",
    medio: "#8c9cbb",
    marca: "var(--color-navy)",
};
function Diagrama({ vertical = false }: {
    vertical?: boolean;
}) {
    const lista = cuadros();
    return (<svg viewBox={vertical ? "0 0 200 900" : "0 0 900 200"} aria-hidden="true" className="diagram block h-auto w-full">
      {lista.map((q, i) => (<rect key={i} x={vertical ? q.y : q.x} y={vertical ? q.x : q.y} width="12" height="12" fill={color[q.tono]} style={{ "--d": q.d } as CSSProperties}/>))}
    </svg>);
}
export async function Steps() {
    const { t } = await getI18n();
    return (<section aria-labelledby="pasos-titulo" className="bg-linen px-[var(--gutter)] py-24 sm:py-32">
      <Reveal>
        <h2 id="pasos-titulo" className="font-display text-step-head text-night lg:whitespace-nowrap">
          {t("Del cuestionario a la pista")}
        </h2>
      </Reveal>

      {/* Escritorio: el diagrama corre de izquierda a derecha sobre los tres pasos */}
      <Reveal delay={120} className="mt-16 hidden sm:block">
        <Diagrama />
      </Reveal>

      <div className="mt-12 grid grid-cols-[38%_1fr] gap-6 sm:mt-10 sm:block">
        <Reveal className="sm:hidden">
          <Diagrama vertical/>
        </Reveal>
        <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map(({ title, text }, i) => (<li key={title}>
              <Reveal delay={i * 90}>
                <h3 className="font-display text-step-lead text-night">{t(title)}</h3>
                <p className="mt-3 max-w-[34ch] font-serif text-step-body text-night">{t(text)}</p>
              </Reveal>
            </li>))}
        </ol>
      </div>
    </section>);
}
