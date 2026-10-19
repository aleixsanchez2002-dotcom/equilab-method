export type Respuestas = Record<string, string | string[]>;
export type PreguntaCuestionario = {
  id: string;
  tipo: "select" | "multiselect" | "texto" | "numero";
  texto: string;
  seccion?: string;
  opciones?: string[];
  requerida?: boolean;
  ayuda?: string;
  min?: number;
  max?: number;
  paso?: string;
  unidad?: string;
  exclusivas?: string[];
  mostrarSi?: { id: string; valores: string[] };
};
export const QUESTIONNAIRE_VERSION = 2;
export const QUESTIONNAIRE_TITLE = "Perfil inicial del jinete — Equilab";
export const QUESTIONNAIRE_SECTIONS = [
  { id: "perfil", titulo: "Tu perfil como jinete", descripcion: "Empezamos por tu experiencia y tu día a día a caballo." },
  { id: "tecnica", titulo: "Tu técnica a caballo", descripcion: "Cuéntanos lo que sientes en la silla y lo que quieres trabajar." },
  { id: "fisico", titulo: "Tu preparación física", descripcion: "Partimos de tu nivel real. No necesitas experiencia en el gimnasio." },
  { id: "salud", titulo: "Salud y antecedentes", descripcion: "Nos interesan las limitaciones que debemos respetar para adaptar tu entrenamiento." },
  { id: "objetivos", titulo: "Tus objetivos y disponibilidad", descripcion: "Un plan útil tiene que encajar con tu vida, tu material y tus metas." },
];
export const QUESTIONNAIRE_QUESTIONS: PreguntaCuestionario[] = [
  {
    "id": "edad",
    "seccion": "perfil",
    "tipo": "numero",
    "texto": "¿Qué edad tienes?",
    "requerida": true,
    "min": 1,
    "max": 120,
    "unidad": "años"
  },
  {
    "id": "peso",
    "seccion": "perfil",
    "tipo": "numero",
    "texto": "¿Cuál es tu peso aproximado?",
    "min": 1,
    "max": 500,
    "paso": "0.1",
    "unidad": "kg",
    "ayuda": "Opcional. Nos sirve como referencia para el seguimiento, no para valorar tu nivel."
  },
  {
    "id": "disciplina",
    "seccion": "perfil",
    "tipo": "select",
    "texto": "¿Qué disciplina montas principalmente?",
    "opciones": [
      "Doma clásica",
      "Salto",
      "Completo",
      "Ocio/otra"
    ]
  },
  {
    "id": "experiencia_montar",
    "seccion": "perfil",
    "tipo": "select",
    "texto": "¿Cuánto tiempo llevas montando?",
    "opciones": [
      "Menos de 1 año",
      "Entre 1 y 3 años",
      "Entre 4 y 7 años",
      "Más de 7 años"
    ]
  },
  {
    "id": "nivel_actual",
    "seccion": "perfil",
    "tipo": "texto",
    "texto": "¿En qué nivel estás y qué categoría preparas?",
    "ayuda": "Si no compites, cuéntanos qué estás trabajando ahora."
  },
  {
    "id": "nivel_montar",
    "seccion": "perfil",
    "tipo": "select",
    "texto": "¿Cuántos días a la semana montas?",
    "opciones": [
      "1-2",
      "3-4",
      "5 o más"
    ]
  },
  {
    "id": "competicion",
    "seccion": "perfil",
    "tipo": "select",
    "texto": "¿Con qué frecuencia compites?",
    "opciones": [
      "No compito",
      "Alguna vez al año",
      "Varias veces por temporada",
      "Cada mes o más"
    ]
  },
  {
    "id": "fortalezas",
    "seccion": "tecnica",
    "tipo": "texto",
    "texto": "¿Qué se te da mejor encima del caballo?",
    "ayuda": "Queremos conocer también tus puntos fuertes."
  },
  {
    "id": "defecto_postural",
    "seccion": "tecnica",
    "tipo": "multiselect",
    "texto": "¿Qué dificultades tienes o te corrigen más a menudo?",
    "exclusivas": [
      "Ninguna en particular"
    ],
    "opciones": [
      "Manos inquietas",
      "Hombros adelantados",
      "Cadera bloqueada",
      "Pierna inestable",
      "Me cuesta mantener el asiento en la reunión",
      "Otra dificultad",
      "Ninguna en particular"
    ]
  },
  {
    "id": "equilibrio_silla",
    "seccion": "tecnica",
    "tipo": "select",
    "texto": "¿Cómo sientes tu equilibrio y estabilidad en la silla?",
    "opciones": [
      "Me cuesta mantenerlos",
      "Depende del ejercicio o del aire",
      "Me siento estable casi siempre",
      "No sabría valorarlo"
    ]
  },
  {
    "id": "postura_fatiga",
    "seccion": "tecnica",
    "tipo": "select",
    "texto": "¿Te cuesta mantener la postura a medida que avanza la sesión?",
    "opciones": [
      "Casi nunca",
      "Al final de sesiones largas",
      "A menudo, incluso en sesiones cortas"
    ]
  },
  {
    "id": "coordinacion",
    "seccion": "tecnica",
    "tipo": "select",
    "texto": "¿Te cuesta coordinar piernas, manos y tronco sin tensarte?",
    "opciones": [
      "Casi nunca",
      "En ejercicios concretos",
      "Con bastante frecuencia"
    ]
  },
  {
    "id": "asimetria",
    "seccion": "tecnica",
    "tipo": "select",
    "texto": "¿Notas diferencias entre tu lado derecho e izquierdo?",
    "opciones": [
      "No noto diferencias",
      "Me cuesta más hacia la derecha",
      "Me cuesta más hacia la izquierda",
      "Noto diferencias, pero no sé describirlas"
    ]
  },
  {
    "id": "indicaciones_entrenador",
    "seccion": "tecnica",
    "tipo": "texto",
    "texto": "¿Qué indicaciones concretas te ha dado tu entrenador?",
    "ayuda": "Incluye aquí otras dificultades técnicas que quieras trabajar."
  },
  {
    "id": "experiencia_gym",
    "seccion": "fisico",
    "tipo": "select",
    "texto": "¿Cuál es tu experiencia en el gimnasio?",
    "opciones": [
      "Ninguna",
      "Algo, sin constancia",
      "Entreno regularmente"
    ]
  },
  {
    "id": "fuerza_actual",
    "seccion": "fisico",
    "tipo": "select",
    "texto": "¿Cuántos días entrenas fuerza actualmente?",
    "opciones": [
      "0",
      "1",
      "2",
      "3",
      "4 o más"
    ]
  },
  {
    "id": "core",
    "seccion": "fisico",
    "tipo": "select",
    "texto": "¿Cómo valoras el control de tu tronco (core)?",
    "opciones": [
      "Me cuesta estabilizarlo",
      "Intermedio",
      "Me siento fuerte y con control",
      "No sabría valorarlo"
    ]
  },
  {
    "id": "movilidad",
    "seccion": "fisico",
    "tipo": "select",
    "texto": "¿Notas limitaciones de movilidad en caderas o tobillos?",
    "opciones": [
      "En caderas",
      "En tobillos",
      "En ambos",
      "No noto limitaciones",
      "No lo sé"
    ]
  },
  {
    "id": "fatiga",
    "seccion": "fisico",
    "tipo": "multiselect",
    "texto": "¿Dónde notas más fatiga al montar?",
    "exclusivas": [
      "No suelo fatigarme"
    ],
    "opciones": [
      "Piernas",
      "Tronco / abdomen",
      "Espalda",
      "Brazos / hombros",
      "Fatiga general",
      "No suelo fatigarme"
    ]
  },
  {
    "id": "capacidades",
    "seccion": "fisico",
    "tipo": "multiselect",
    "texto": "¿Qué capacidades te gustaría mejorar?",
    "exclusivas": [
      "No lo tengo claro"
    ],
    "opciones": [
      "Fuerza",
      "Movilidad",
      "Equilibrio y estabilidad",
      "Coordinación",
      "Resistencia",
      "No lo tengo claro"
    ]
  },
  {
    "id": "molestias",
    "seccion": "salud",
    "tipo": "multiselect",
    "texto": "¿En qué zonas tienes dolor o molestias recurrentes?",
    "exclusivas": [
      "Ninguna"
    ],
    "opciones": [
      "Lumbar",
      "Cadera",
      "Rodilla",
      "Hombro/cuello",
      "Tobillo/pie",
      "Otra zona",
      "Ninguna"
    ]
  },
  {
    "id": "lesion",
    "seccion": "salud",
    "tipo": "select",
    "texto": "¿Hay alguna lesión actual o anterior que debamos tener en cuenta?",
    "opciones": [
      "No",
      "Sí",
      "No estoy seguro/a"
    ]
  },
  {
    "id": "detalle_lesion",
    "seccion": "salud",
    "tipo": "texto",
    "texto": "¿Cómo afecta esa lesión a tu actividad?",
    "mostrarSi": {
      "id": "lesion",
      "valores": [
        "Sí",
        "No estoy seguro/a"
      ]
    },
    "ayuda": "Indica movimientos que te molestan o limitaciones relevantes. No necesitamos informes ni diagnósticos detallados."
  },
  {
    "id": "pautas_profesional",
    "seccion": "salud",
    "tipo": "select",
    "texto": "¿Tienes indicaciones médicas o de fisioterapia para entrenar?",
    "opciones": [
      "No",
      "Sí"
    ]
  },
  {
    "id": "detalle_pautas",
    "seccion": "salud",
    "tipo": "texto",
    "texto": "¿Qué indicaciones o precauciones debemos respetar?",
    "requerida": true,
    "mostrarSi": {
      "id": "pautas_profesional",
      "valores": [
        "Sí"
      ]
    },
    "ayuda": "Por ejemplo, movimientos o esfuerzos que te hayan indicado evitar."
  },
  {
    "id": "objetivo",
    "seccion": "objetivos",
    "tipo": "texto",
    "texto": "¿Qué cambio concreto quieres conseguir en las próximas 8–12 semanas?",
    "requerida": true,
    "ayuda": "Piensa en algo que puedas reconocer al montar: mantener mejor la postura, llegar con menos fatiga o controlar mejor una ayuda."
  },
  {
    "id": "objetivo_largo",
    "seccion": "objetivos",
    "tipo": "texto",
    "texto": "¿Cuál es tu objetivo deportivo a largo plazo?"
  },
  {
    "id": "dias_entreno",
    "seccion": "objetivos",
    "tipo": "select",
    "texto": "¿Cuántos días puedes entrenar fuera del caballo?",
    "opciones": [
      "1",
      "2",
      "3",
      "4 o más"
    ]
  },
  {
    "id": "duracion_sesion",
    "seccion": "objetivos",
    "tipo": "select",
    "texto": "¿Cuántos minutos reales puedes dedicar a cada sesión?",
    "opciones": [
      "20–30 min",
      "30–45 min",
      "45–60 min",
      "Más de 60 min"
    ]
  },
  {
    "id": "material",
    "seccion": "objetivos",
    "tipo": "select",
    "texto": "¿Con qué material cuentas para entrenar?",
    "opciones": [
      "Gimnasio completo",
      "Material básico en casa",
      "Solo peso corporal"
    ]
  },
  {
    "id": "detalle_material",
    "seccion": "objetivos",
    "tipo": "texto",
    "texto": "¿Qué material tienes y qué días te encajan mejor?",
    "ayuda": "Si entrenas en casa, detalla si tienes mancuernas, bandas, banco u otro material."
  },
  {
    "id": "eventos",
    "seccion": "objetivos",
    "tipo": "texto",
    "texto": "¿Qué competiciones o eventos importantes tienes previstos?",
    "mostrarSi": {
      "id": "competicion",
      "valores": [
        "Alguna vez al año",
        "Varias veces por temporada",
        "Cada mes o más"
      ]
    },
    "ayuda": "Añade las fechas aproximadas para que podamos planificar el bloque."
  },
  {
    "id": "expectativas",
    "seccion": "objetivos",
    "tipo": "texto",
    "texto": "¿Qué esperas del equipo y qué más te gustaría contarnos?"
  }
];

export function preguntaVisible(pregunta: PreguntaCuestionario, respuestas: Respuestas): boolean {
  return !pregunta.mostrarSi || pregunta.mostrarSi.valores.includes(String(respuestas[pregunta.mostrarSi.id] ?? ""));
}
export function preguntaRequerida(p: PreguntaCuestionario): boolean {
  return p.requerida ?? (p.tipo === "select" || p.tipo === "multiselect");
}
/** Normaliza y valida también en el servidor; los valores guardados mantienen los identificadores del motor. */
export function validarCuestionario(preguntas: PreguntaCuestionario[], entrada: Respuestas) {
  const respuestas: Respuestas = {};
  const errores: Record<string, string> = {};
  for (const p of preguntas) {
    if (!preguntaVisible(p, entrada)) continue;
    const raw = entrada[p.id];
    const valor = p.tipo === "multiselect"
      ? [...new Set(Array.isArray(raw) ? raw.filter((v): v is string => typeof v === "string") : [])]
      : typeof raw === "string" ? raw.trim() : "";
    respuestas[p.id] = valor;
    if (preguntaRequerida(p) && valor.length === 0) {
      errores[p.id] = "Responde a esta pregunta para continuar.";
      continue;
    }
    if (Array.isArray(valor)) {
      if (valor.some(v => !p.opciones?.includes(v))) errores[p.id] = "Elige una de las opciones disponibles.";
      if (valor.length > 1 && valor.some(v => p.exclusivas?.includes(v))) errores[p.id] = "Esta opción no se puede combinar con otras.";
    } else if (p.tipo === "select" && valor && !p.opciones?.includes(valor)) {
      errores[p.id] = "Elige una de las opciones disponibles.";
    } else if (p.tipo === "numero" && valor) {
      const n = Number(valor.replace(",", "."));
      if (!Number.isFinite(n) || (p.min !== undefined && n < p.min) || (p.max !== undefined && n > p.max) || (p.paso !== "0.1" && !Number.isInteger(n))) errores[p.id] = "Revisa el número introducido.";
    } else if (valor.length > 2000) {
      errores[p.id] = "Resume tu respuesta en un máximo de 2000 caracteres.";
    }
  }
  return { respuestas, errores };
}
