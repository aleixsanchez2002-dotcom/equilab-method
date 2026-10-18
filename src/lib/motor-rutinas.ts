/**
 * Motor de reglas v1 (plan Básico).
 *
 * Función pura: respuestas del cuestionario + biblioteca de ejercicios →
 * propuesta de rutina semi-personalizada (siempre en borrador; el equipo
 * la revisa, ajusta cargas y publica). Determinista y sin dependencias:
 * fácil de testear y de afinar regla a regla.
 */

export type RespuestasCuestionario = Record<string, string | string[]>;

export type EjercicioCatalogo = {
  id: string;
  name: string;
  category: string; // fuerza | movilidad | postura | control
  equipment: string | null;
};

export type SeriePropuesta = {
  peso: string;
  reps: string;
  /** RIR objetivo: repeticiones en reserva al terminar la serie. */
  rir: string;
  descanso: string;
};
export type EjercicioPropuesto = {
  exercise_id: string;
  technique_note: string;
  series: SeriePropuesta[];
};
export type DiaPropuesto = {
  focus: string;
  duration_note: string;
  ejercicios: EjercicioPropuesto[];
};
export type RutinaPropuesta = {
  title: string;
  weeks: number;
  notes: string;
  /** Texto que verá el cliente en su área («Sobre este bloque»). */
  explanation: string;
  dias: DiaPropuesto[];
};

/* ————— Reglas declarativas ————— */

/** Material que NO está disponible según la respuesta. */
const EXCLUIDOS_POR_MATERIAL: Record<string, string[]> = {
  "Material básico en casa": [
    "Peso muerto rumano",
    "Hip thrust",
    "Remo con barra",
    "Face pull",
    "Plancha con arrastre",
    "Copenhagen plank",
  ],
  "Solo peso corporal": [
    "Peso muerto rumano",
    "Hip thrust",
    "Remo con barra",
    "Face pull",
    "Plancha con arrastre",
    "Copenhagen plank",
    "Sentadilla copa",
    "Press militar con mancuernas",
    "Farmer carry",
    "Pallof press",
    "Band pull-apart",
  ],
};

/** Ejercicios a evitar según molestias activas. */
const EXCLUIDOS_POR_MOLESTIA: Record<string, string[]> = {
  Lumbar: ["Peso muerto rumano", "Remo con barra"],
  Rodilla: ["Sentadilla copa"],
  "Hombro/cuello": ["Press militar con mancuernas"],
  Cadera: ["Copenhagen plank"],
};

/** Ejercicios prioritarios según el defecto postural a corregir. */
const PRIORIDAD_POR_DEFECTO: Record<string, string[]> = {
  "Manos inquietas": ["Pallof press", "Plancha con arrastre"],
  "Hombros adelantados": ["Face pull", "Band pull-apart"],
  "Cadera bloqueada": ["90/90 de caderas", "Hip thrust"],
  "Pierna inestable": ["Copenhagen plank", "Farmer carry"],
  "Me cuesta mantener el asiento en la reunión": [
    "Bird dog",
    "Respiración 360",
    "Pallof press",
  ],
};

/* ————— Dosificación por categoría ————— */

function seriesPara(
  categoria: string,
  principiante: boolean,
): SeriePropuesta[] {
  const n = principiante ? 3 : 3;
  // RIR alto en principiantes: margen para aprender la técnica sin fallar.
  const base: Record<string, SeriePropuesta> = {
    fuerza: {
      peso: principiante ? "empieza ligero" : "carga media",
      reps: principiante ? "10" : "8",
      rir: principiante ? "3" : "2",
      descanso: "2:00",
    },
    postura: { peso: "banda/polea suave", reps: "12", rir: "3", descanso: "1:30" },
    control: { peso: "corporal", reps: "10/lado", rir: "2", descanso: "1:00" },
    movilidad: { peso: "corporal", reps: "8/lado", rir: "", descanso: "0:45" },
  };
  const s = base[categoria] ?? base.control;
  return Array.from({ length: n }, () => ({ ...s }));
}

function lista(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/* ————— El motor ————— */

export function generarRutinaSemi(
  respuestas: RespuestasCuestionario,
  catalogo: EjercicioCatalogo[],
): RutinaPropuesta {
  const porNombre = new Map(catalogo.map((e) => [e.name, e]));
  const material = String(respuestas.material ?? "Gimnasio completo");
  const molestias = lista(respuestas.molestias).filter((m) => m !== "Ninguna");
  const defectos = lista(respuestas.defecto_postural);
  const principiante = respuestas.experiencia_gym === "Ninguna";
  const numDias = respuestas.dias_entreno === "2" ? 2 : 3;

  // 1. Pool disponible: catálogo menos exclusiones por material y molestias
  const excluidos = new Set([
    ...(EXCLUIDOS_POR_MATERIAL[material] ?? []),
    ...molestias.flatMap((m) => EXCLUIDOS_POR_MOLESTIA[m] ?? []),
  ]);
  const pool = catalogo.filter((e) => !excluidos.has(e.name));

  // 2. Prioritarios: los que atacan los defectos que marcó el jinete
  const prioritarios = defectos
    .flatMap((d) => PRIORIDAD_POR_DEFECTO[d] ?? [])
    .map((nombre) => porNombre.get(nombre))
    .filter((e): e is EjercicioCatalogo => !!e && !excluidos.has(e.name));

  // 3. Reparto por días, sin repetir ejercicio en el bloque
  const usados = new Set<string>();
  const coger = (
    categorias: string[],
    cuantos: number,
  ): EjercicioCatalogo[] => {
    const elegidos: EjercicioCatalogo[] = [];
    // primero los prioritarios que encajen en la categoría del día
    for (const e of prioritarios) {
      if (elegidos.length >= cuantos) break;
      if (categorias.includes(e.category) && !usados.has(e.id)) {
        elegidos.push(e);
        usados.add(e.id);
      }
    }
    // después, el resto del pool
    for (const e of pool) {
      if (elegidos.length >= cuantos) break;
      if (categorias.includes(e.category) && !usados.has(e.id)) {
        elegidos.push(e);
        usados.add(e.id);
      }
    }
    return elegidos;
  };

  const plantillaDias: { focus: string; categorias: string[]; cuantos: number }[] =
    numDias === 2
      ? [
          { focus: "Fuerza + estabilidad", categorias: ["fuerza", "postura"], cuantos: 5 },
          { focus: "Control + movilidad", categorias: ["control", "movilidad", "postura"], cuantos: 5 },
        ]
      : [
          { focus: "Fuerza + estabilidad", categorias: ["fuerza", "postura"], cuantos: 5 },
          { focus: "Postura + control", categorias: ["postura", "control"], cuantos: 4 },
          { focus: "Control + movilidad", categorias: ["movilidad", "control"], cuantos: 4 },
        ];

  const dias: DiaPropuesto[] = plantillaDias
    .map(({ focus, categorias, cuantos }) => ({
      focus,
      duration_note: "±45 min",
      ejercicios: coger(categorias, cuantos).map((e) => ({
        exercise_id: e.id,
        technique_note: "",
        series: seriesPara(e.category, principiante),
      })),
    }))
    .filter((d) => d.ejercicios.length > 0);

  // 4. Resumen para el coach que revisará la propuesta
  const claves = [
    `material: ${material}`,
    molestias.length > 0 ? `molestias: ${molestias.join(", ")}` : "sin molestias",
    defectos.length > 0 ? `corregir: ${defectos.join(", ")}` : null,
    principiante ? "sin experiencia en gimnasio" : null,
  ].filter(Boolean);

  const focos = dias.map((d) => d.focus.toLowerCase()).join(", ");
  const explanation =
    `Tu primer bloque: ${dias.length} días a la semana durante 6 semanas, ` +
    `centrado en ${focos}. ` +
    (defectos.length > 0
      ? `Cada ejercicio está elegido para trabajar lo que te corrigen montando. `
      : "") +
    (principiante
      ? "Empieza con cargas cómodas: las primeras dos semanas son para aprender la técnica, no para sufrir. "
      : "Empieza algo por debajo de lo que puedes y sube cada semana. ") +
    "Apunta cada serie: es lo que nos permite ajustarte el siguiente bloque.";

  return {
    title: "Bloque inicial Equilab",
    weeks: 6,
    notes: `Propuesta del motor v1 · ${claves.join(" · ")} · Revisar cargas antes de publicar.`,
    explanation,
    dias,
  };
}
