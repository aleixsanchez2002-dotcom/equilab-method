/* Forma de los datos que pintan las pantallas del área de cliente.
   En las maquetas vienen de src/app/maquetas/datos.ts; en la fase 2 los
   rellenará Supabase con las mismas formas. */

export type Plan = "basico" | "premium";

export type Pestana = "hoy" | "rutina" | "tecnica" | "progreso" | "cuenta";

export type SerieObjetivo = {
    peso: string;
    reps: string;
    rir: string;
    descanso: string;
};

export type SerieHecha = {
    kg: string;
    reps: string;
    rir: string;
};

export type EjercicioVista = {
    id: string;
    nombre: string;
    nota: string | null;
    /** Foto de ejecución en /public, si existe. */
    foto: string | null;
    tieneVideo: boolean;
    series: SerieObjetivo[];
    /** Última marca registrada, en texto corto («40 × 8»). */
    ultima: string | null;
};

export type DiaVista = {
    id: string;
    numero: number;
    /** Letra de pista de doma que identifica el día (A, E, C…). */
    letra: string;
    enfoque: string;
    duracion: string;
    ejercicios: EjercicioVista[];
    /** Fecha en que se hizo esta semana, o null si está pendiente. */
    hecho: string | null;
};

export type RutinaVista = {
    titulo: string;
    explicacion: string;
    semanaActual: number;
    totalSemanas: number;
    dias: DiaVista[];
};

export type Aviso = {
    id: string;
    titulo: string;
    detalle: string;
    href: string;
    accion: string;
};

export type EstadoEnvio = "enviado" | "en_revision" | "corregido";

export type RespuestaTecnica = {
    autor: string;
    duracion: string;
    resumen: string;
    comentarios: { segundo: string; texto: string }[];
    correctivo: string | null;
};

export type EnvioTecnica = {
    id: string;
    ejercicio: string;
    fecha: string;
    duracion: string;
    estado: EstadoEnvio;
    nota: string | null;
    /** Plazo de respuesta, si aún no está corregido. */
    plazo: string | null;
    respuesta: RespuestaTecnica | null;
};

export type Mensaje = {
    id: string;
    deEquipo: boolean;
    autor: string;
    hora: string;
    texto: string;
};

export type DiaAgenda = {
    id: string;
    semana: string;
    numero: string;
    huecos: { hora: string; libre: boolean }[];
};

export type RevisionMensual = {
    mes: string;
    estado: "abierta" | "enviada" | "respondida";
    nota: string | null;
};

/** Valores de una serie en el tiempo, con una fecha corta por valor. */
export type SerieTemporal = {
    valores: number[];
    fechas: string[];
};

export type ProgresoVista = {
    constancia: { semana: string; hechas: number; previstas: number }[];
    cargas: ({ ejercicio: string } & SerieTemporal)[];
    peso: SerieTemporal;
    revisiones: RevisionMensual[];
};
