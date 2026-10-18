import { cn } from "@/lib/cn";

/* Gráficas del área de cliente. Pocas, de una sola serie y sin adornos:
   línea fina, referencias muy tenues y el valor actual escrito fuera, en
   grande. Sin rellenos ni degradados (DESIGN.md). HTML y SVG, sin librerías. */

/**
 * Tendencia de un valor en el tiempo (cargas, peso). La línea se dibuja en
 * un SVG que se estira con el contenedor; el marcador, las referencias y
 * los textos son HTML, así no se deforman ni cambian de tamaño.
 */
export function GraficaTendencia({ valores, fechas, formato, etiqueta, rangoMinimo = 0, className, }: {
    valores: number[];
    /** Una fecha corta por valor («1 sep»). */
    fechas: string[];
    /** Cómo se escribe un valor («40 kg»). */
    formato: (n: number) => string;
    etiqueta: string;
    /** Escala mínima en las unidades del valor: evita que una variación
        pequeña (0,8 kg de peso) parezca una montaña. */
    rangoMinimo?: number;
    className?: string;
}) {
    const min = Math.min(...valores);
    const max = Math.max(...valores);
    // Escala con cifras redondas en los extremos (30–40 kg, 59–62 kg): las dos
    // referencias quedan siempre arriba y abajo, sin pisarse
    const holgura = Math.max(0, rangoMinimo - (max - min)) / 2;
    const amplitud = max - min + 2 * holgura;
    const paso = amplitud <= 5 ? 1 : amplitud <= 25 ? 5 : 10;
    const bajo = Math.floor((min - holgura) / paso) * paso;
    const alto = Math.max(Math.ceil((max + holgura) / paso) * paso, bajo + paso);
    const y = (v: number) => 88 - ((v - bajo) / (alto - bajo)) * 76;
    const x = (i: number) => (valores.length === 1 ? 50 : (i / (valores.length - 1)) * 100);
    const puntos = valores.map((v, i) => [x(i), y(v)] as const);
    const linea = puntos.map(([px, py]) => `${px},${py}`).join(" ");
    const [ux, uy] = puntos[puntos.length - 1];
    return (<figure className={cn("m-0", className)}>
      <div role="img" aria-label={etiqueta} className="relative h-28">
        {/* Referencias en los extremos de la escala, con su cifra en un margen
            a la derecha para que nunca tape la línea */}
        {[[alto, y(alto)], [bajo, y(bajo)]].map(([v, py]) => (<div key={py} aria-hidden="true" className="absolute inset-x-0" style={{ top: `${py}%` }}>
            <div className="mr-14 h-px bg-linen-deep"/>
            <span className="absolute right-0 w-12 -translate-y-1/2 text-right text-[12px] leading-none text-slate tabular-nums">{formato(v)}</span>
          </div>))}

        <div className="absolute inset-y-0 left-0 right-14">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible text-navy">
            <polyline points={linea} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
          </svg>

          {/* Último valor: marcador cuadrado con un aro del color del fondo */}
          <span aria-hidden="true" className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 bg-navy ring-2 ring-linen" style={{ left: `${ux}%`, top: `${uy}%` }}/>

          {/* Zonas invisibles para ver cada valor al pasar el ratón */}
          {puntos.map(([px], i) => (<span key={i} title={`${fechas[i]}: ${formato(valores[i])}`} className="absolute inset-y-0 w-6 -translate-x-1/2" style={{ left: `${px}%` }}/>))}
        </div>
      </div>
      <figcaption aria-hidden="true" className="mt-2 mr-14 flex justify-between text-[12px] text-slate">
        <span>{fechas[0]}</span>
        <span>{fechas[fechas.length - 1]}</span>
      </figcaption>
    </figure>);
}

/**
 * Constancia: una columna por semana. El fondo claro es lo previsto y el
 * marino, lo hecho; una semana completa es una columna llena.
 */
export function GraficaConstancia({ semanas, etiqueta, describir, className, }: {
    semanas: { semana: string; hechas: number; previstas: number }[];
    etiqueta: string;
    /** Texto de cada columna al pasar el ratón («S2: 2 de 3»). */
    describir: (s: { semana: string; hechas: number; previstas: number }) => string;
    className?: string;
}) {
    const tope = Math.max(...semanas.map((s) => s.previstas), 1);
    return (<div role="img" aria-label={etiqueta} className={cn("flex items-end justify-between gap-2", className)}>
      {semanas.map((s, i) => {
            const ultima = i === semanas.length - 1;
            return (<div key={s.semana} title={describir(s)} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-24 w-full max-w-6 items-end">
              <div className="relative w-full bg-linen-deep" style={{ height: `${(s.previstas / tope) * 100}%` }}>
                <div className="absolute inset-x-0 bottom-0 bg-navy" style={{ height: `${(Math.min(s.hechas, s.previstas) / s.previstas) * 100}%` }}/>
              </div>
            </div>
            <span aria-hidden="true" className={cn("text-[12px]", ultima ? "font-semibold text-night" : "text-slate")}>{s.semana}</span>
          </div>);
        })}
    </div>);
}
