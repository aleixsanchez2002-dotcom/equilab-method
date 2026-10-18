import type { Aviso, DiaAgenda, DiaVista, EnvioTecnica, Mensaje, ProgresoVista, RutinaVista } from "@/components/area/tipos";

/* Datos de ejemplo de las maquetas. Jinete ficticio; nada de esto sale de
   la base de datos ni representa a un cliente real. */

const serie = (peso: string, reps: string, rir: string, descanso: string, n = 3) => Array.from({ length: n }, () => ({ peso, reps, rir, descanso }));

const dia1: DiaVista = {
    id: "d1",
    numero: 1,
    letra: "A",
    enfoque: "Fuerza y cadera",
    duracion: "45 min",
    hecho: "lun 12",
    ejercicios: [
        { id: "e1", nombre: "Hip thrust", nota: "Pausa de un segundo arriba, sin arquear la zona lumbar. La cadera empuja, no la espalda.", foto: null, tieneVideo: true, series: serie("carga media", "8", "2", "2 min"), ultima: "40 × 8" },
        { id: "e2", nombre: "Peso muerto rumano", nota: "Cadera atrás, espalda larga. La carga baja de serie en serie: la técnica no.", foto: null, tieneVideo: true, series: serie("carga media", "8", "2", "2 min"), ultima: "35 × 8" },
        { id: "e3", nombre: "Copenhagen plank", nota: "Aductores activos: es lo que sujeta la pierna pegada al caballo.", foto: null, tieneVideo: false, series: serie("corporal", "20 s/lado", "", "1 min"), ultima: null },
        { id: "e4", nombre: "Face pull", nota: "El antídoto del hombro adelantado.", foto: null, tieneVideo: true, series: serie("banda o polea suave", "12", "3", "1 min 30 s"), ultima: "12,5 × 12" },
        { id: "e5", nombre: "90/90 de caderas", nota: "Transiciones lentas, sin ayudarte con las manos.", foto: null, tieneVideo: false, series: serie("corporal", "8/lado", "", "45 s", 2), ultima: null },
    ],
};

const dia2: DiaVista = {
    id: "d2",
    numero: 2,
    letra: "E",
    enfoque: "Control y core",
    duracion: "40 min",
    hecho: null,
    ejercicios: [
        { id: "e6", nombre: "Pallof press", nota: "Anti-rotación: el tronco no gira, como en un círculo de 10 m.", foto: null, tieneVideo: true, series: serie("banda o polea suave", "12/lado", "3", "1 min 30 s"), ultima: "10 × 12" },
        { id: "e7", nombre: "Bird dog", nota: "Lento y sin balancear la pelvis.", foto: null, tieneVideo: true, series: serie("corporal", "8/lado", "", "45 s"), ultima: null },
        { id: "e8", nombre: "Plancha con arrastre", nota: "Las caderas quietas mientras arrastras el peso.", foto: null, tieneVideo: false, series: serie("disco ligero", "10", "2", "1 min"), ultima: null },
        { id: "e9", nombre: "Farmer carry", nota: "Hombros abajo y atrás, pasos cortos.", foto: null, tieneVideo: true, series: serie("carga alta", "30 m", "2", "1 min 30 s"), ultima: "2 × 20 kg" },
    ],
};

const dia3: DiaVista = {
    id: "d3",
    numero: 3,
    letra: "C",
    enfoque: "Espalda y postura",
    duracion: "40 min",
    hecho: null,
    ejercicios: [
        { id: "e10", nombre: "Remo con barra", nota: "Tira con los codos, el pecho no se mueve.", foto: null, tieneVideo: true, series: serie("carga media", "10", "2", "2 min"), ultima: "30 × 10" },
        { id: "e11", nombre: "Press militar con mancuernas", nota: "Costillas abajo: no arquees para subir.", foto: null, tieneVideo: true, series: serie("carga media", "8", "2", "2 min"), ultima: "10 × 8" },
        { id: "e12", nombre: "Band pull-apart", nota: "Escápulas atrás y abajo al final de cada repetición.", foto: null, tieneVideo: false, series: serie("banda suave", "15", "3", "45 s"), ultima: null },
        { id: "e13", nombre: "Movilidad torácica en cuadrupedia", nota: "Sigue la mano con la mirada.", foto: null, tieneVideo: false, series: serie("corporal", "8/lado", "", "30 s", 2), ultima: null },
    ],
};

export const RUTINA: RutinaVista = {
    titulo: "Bloque 1 · Base",
    explicacion: "Este primer bloque construye la base: una cadera que acompaña el movimiento del caballo y un tronco que no se desarma en las transiciones.\n\nLas cargas son moderadas a propósito. Primero la técnica; la fuerza llega en el bloque 2.",
    semanaActual: 2,
    totalSemanas: 4,
    dias: [dia1, dia2, dia3],
};

export const AVISOS_PREMIUM: Aviso[] = [
    { id: "a1", titulo: "Tu corrección está lista", detalle: "Hip thrust · respuesta de Giovanni en vídeo", href: "/maquetas/correccion", accion: "Ver" },
    { id: "a2", titulo: "Apunta tu peso de esta semana", detalle: "Un dato cada lunes, para ver la tendencia", href: "/maquetas/progreso", accion: "Apuntar" },
    { id: "a3", titulo: "Tu revisión de octubre está abierta", detalle: "Cinco minutos: peso, medidas y cómo te encuentras", href: "/maquetas/progreso", accion: "Rellenar" },
];

export const AVISOS_BASICO: Aviso[] = [
    { id: "a2", titulo: "Apunta tu peso de esta semana", detalle: "Un dato cada lunes, para ver la tendencia", href: "/maquetas/progreso?plan=basico", accion: "Apuntar" },
];

export const ENVIOS: EnvioTecnica[] = [
    {
        id: "v3",
        ejercicio: "Pallof press",
        fecha: "18 oct",
        duracion: "0:41",
        estado: "en_revision",
        nota: null,
        plazo: "mar 21, 12:00",
        respuesta: null,
    },
    {
        id: "v2",
        ejercicio: "Hip thrust",
        fecha: "15 oct",
        duracion: "0:52",
        estado: "corregido",
        nota: "Noto que al subir me cargo más la lumbar que el glúteo.",
        plazo: null,
        respuesta: {
            autor: "Giovanni",
            duracion: "1:48",
            resumen: "Buena base: la barra sube recta y el ritmo es constante. Lo que te carga la lumbar es que terminas cada repetición arqueando la espalda en lugar de cerrar con el glúteo. Mete la barbilla, mira al frente y piensa en «acercar las costillas a la pelvis» arriba.",
            comentarios: [
                { segundo: "0:08", texto: "Aquí la mirada va al techo y arrastra el cuello: mira al frente." },
                { segundo: "0:21", texto: "Arriba sobra rango: para cuando la cadera esté alineada con rodillas y hombros." },
                { segundo: "0:37", texto: "Esta repetición es la buena. Así todas." },
            ],
            correctivo: "Bird dog",
        },
    },
    {
        id: "v1",
        ejercicio: "Copenhagen plank",
        fecha: "2 oct",
        duracion: "0:35",
        estado: "corregido",
        nota: null,
        plazo: null,
        respuesta: {
            autor: "Alex",
            duracion: "1:12",
            resumen: "Bien alineada. Sube a 25 segundos por lado la semana que viene.",
            comentarios: [],
            correctivo: null,
        },
    },
];

export const MENSAJES: Mensaje[] = [
    { id: "m1", deEquipo: false, autor: "Laura", hora: "ayer, 21:14", texto: "Hola, el jueves tengo concurso. ¿Hago igualmente la sesión del día 3 o la muevo?" },
    { id: "m2", deEquipo: true, autor: "Giovanni", hora: "hoy, 9:02", texto: "¡Mucha suerte! Haz el día 3 el martes y el jueves solo la movilidad del 90/90 antes de montar. El viernes descansas." },
    { id: "m3", deEquipo: false, autor: "Laura", hora: "hoy, 9:20", texto: "Perfecto, gracias." },
];

export const MENSAJES_BASICO: Mensaje[] = [
    { id: "m1", deEquipo: false, autor: "Laura", hora: "ayer, 18:40", texto: "No me deja cambiar el email de la cuenta, ¿me podéis ayudar?" },
    { id: "m2", deEquipo: true, autor: "Equipo Equilab", hora: "hoy, 10:05", texto: "Hecho: ya tienes el email nuevo. Te llegará un correo para confirmarlo." },
];

export const PROGRESO: ProgresoVista = {
    constancia: [
        { semana: "S1", hechas: 3, previstas: 3 },
        { semana: "S2", hechas: 2, previstas: 3 },
        { semana: "S3", hechas: 3, previstas: 3 },
        { semana: "S4", hechas: 3, previstas: 3 },
        { semana: "S5", hechas: 1, previstas: 3 },
        { semana: "S6", hechas: 3, previstas: 3 },
        { semana: "S7", hechas: 3, previstas: 3 },
        { semana: "S8", hechas: 1, previstas: 3 },
    ],
    cargas: [
        { ejercicio: "Hip thrust", valores: [30, 32.5, 35, 35, 37.5, 40] },
        { ejercicio: "Peso muerto rumano", valores: [25, 27.5, 27.5, 30, 32.5, 35] },
    ],
    peso: [61.2, 61, 60.8, 61.1, 60.6, 60.5, 60.4],
    revisiones: [
        { mes: "octubre", estado: "abierta", nota: null },
        { mes: "septiembre", estado: "respondida", nota: "Muy buen mes de constancia. Notamos menos molestias lumbares: seguimos con el bloque y subimos cargas en la cadera." },
    ],
};

export const AGENDA: DiaAgenda[] = [
    { id: "lun20", semana: "lun", numero: "20", huecos: [{ hora: "17:00", libre: false }, { hora: "18:00", libre: false }, { hora: "19:00", libre: false }] },
    { id: "mar21", semana: "mar", numero: "21", huecos: [{ hora: "10:00", libre: true }, { hora: "11:00", libre: false }, { hora: "17:00", libre: true }, { hora: "18:00", libre: true }, { hora: "19:00", libre: false }] },
    { id: "mie22", semana: "mié", numero: "22", huecos: [{ hora: "18:00", libre: true }, { hora: "19:00", libre: true }] },
    { id: "jue23", semana: "jue", numero: "23", huecos: [{ hora: "10:00", libre: true }, { hora: "17:00", libre: false }] },
    { id: "vie24", semana: "vie", numero: "24", huecos: [{ hora: "10:00", libre: true }, { hora: "11:00", libre: true }, { hora: "12:00", libre: true }] },
    { id: "lun27", semana: "lun", numero: "27", huecos: [{ hora: "17:00", libre: true }, { hora: "18:00", libre: true }] },
];
