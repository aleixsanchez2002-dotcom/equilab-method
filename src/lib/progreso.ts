import type { SerieProgreso } from "@/components/app/progress-chart";
import type { SesionHistorial } from "@/components/app/session-history";
import type { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Lecturas de progreso compartidas entre el área del cliente y la ficha
 * de cliente del panel del equipo (la RLS decide quién puede ver qué).
 */

type Supa = Awaited<ReturnType<typeof createSupabaseServer>>;

export type SerieRegistrada = {
  kg: string;
  reps: string;
  descanso: string;
  rir?: string;
};

/** Progresión de fuerza: la mejor carga de cada sesión, por ejercicio. */
export async function seriesDeProgreso(
  supabase: Supa,
  userId: string,
): Promise<SerieProgreso[]> {
  type LogRow = {
    exercise_id: string;
    series: SerieRegistrada[];
    performed_on: string;
    exercises: { name: string } | null;
  };
  const { data: logs } = await supabase
    .from("workout_logs")
    .select("exercise_id, series, performed_on, exercises(name)")
    .eq("user_id", userId)
    .order("performed_on", { ascending: true })
    .returns<LogRow[]>();

  const porEjercicio = new Map<
    string,
    { nombre: string; porFecha: Map<string, number> }
  >();
  for (const log of logs ?? []) {
    for (const s of log.series) {
      // Acepta «62,5», «62.5 kg»… se queda con el primer número.
      const kg = parseFloat(
        String(s.kg).replace(",", ".").replace(/[^\d.]+/g, " ").trim().split(" ")[0] ?? "",
      );
      if (!Number.isFinite(kg) || kg <= 0) continue;
      let entrada = porEjercicio.get(log.exercise_id);
      if (!entrada) {
        entrada = {
          nombre: log.exercises?.name ?? "Ejercicio",
          porFecha: new Map(),
        };
        porEjercicio.set(log.exercise_id, entrada);
      }
      const previo = entrada.porFecha.get(log.performed_on) ?? 0;
      if (kg > previo) entrada.porFecha.set(log.performed_on, kg);
    }
  }

  return [...porEjercicio.entries()]
    .map(([exercise_id, e]) => ({
      exercise_id,
      nombre: e.nombre,
      puntos: [...e.porFecha.entries()]
        .map(([fecha, kg]) => ({ fecha, kg }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    }))
    .filter((s) => s.puntos.length > 0)
    .sort((a, b) => b.puntos.length - a.puntos.length);
}

/** Sesiones pasadas con su detalle, más recientes primero. */
export async function historialDeSesiones(
  supabase: Supa,
  userId: string,
): Promise<SesionHistorial[]> {
  type SesionRow = { id: string; performed_on: string; routine_day_id: string | null };
  type LogRow = {
    session_id: string;
    series: SerieRegistrada[];
    exercises: { name: string } | null;
  };

  const { data: sesiones } = await supabase
    .from("workout_sessions")
    .select("id, performed_on, routine_day_id")
    .eq("user_id", userId)
    .order("performed_on", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(30)
    .returns<SesionRow[]>();
  if (!sesiones || sesiones.length === 0) return [];

  const { data: logs } = await supabase
    .from("workout_logs")
    .select("session_id, series, exercises(name)")
    .in("session_id", sesiones.map((s) => s.id))
    .returns<LogRow[]>();

  const diaIds = [
    ...new Set(
      sesiones.map((s) => s.routine_day_id).filter((x): x is string => x !== null),
    ),
  ];
  const titulos = new Map<string, string>();
  if (diaIds.length > 0) {
    const { data: dias } = await supabase
      .from("routine_days")
      .select("id, week, position, focus")
      .in("id", diaIds)
      .returns<{ id: string; week: number; position: number; focus: string }[]>();
    for (const d of dias ?? []) {
      titulos.set(d.id, `Semana ${d.week} · Día ${d.position} · ${d.focus}`);
    }
  }

  const logsPorSesion = new Map<string, LogRow[]>();
  for (const log of logs ?? []) {
    const lista = logsPorSesion.get(log.session_id) ?? [];
    lista.push(log);
    logsPorSesion.set(log.session_id, lista);
  }

  return sesiones
    .map((s) => ({
      id: s.id,
      fecha: s.performed_on,
      titulo: (s.routine_day_id && titulos.get(s.routine_day_id)) || "Sesión",
      logs: (logsPorSesion.get(s.id) ?? []).map((log) => ({
        ejercicio: log.exercises?.name ?? "Ejercicio",
        series: log.series,
      })),
    }))
    .filter((s) => s.logs.length > 0);
}

/** Pesos semanales, ordenados por fecha ascendente. */
export async function pesosSemanales(
  supabase: Supa,
  userId: string,
): Promise<{ fecha: string; kg: number }[]> {
  const { data: pesos } = await supabase
    .from("body_weight_logs")
    .select("measured_on, weight_kg")
    .eq("user_id", userId)
    .order("measured_on", { ascending: true })
    .returns<{ measured_on: string; weight_kg: number }[]>();
  return (pesos ?? []).map((p) => ({
    fecha: p.measured_on,
    kg: Number(p.weight_kg),
  }));
}
