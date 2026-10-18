"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { lunesDeLaSemana } from "@/lib/semana";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function cerrarSesion(): Promise<void> {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/acceso");
}

/* ————— Peso corporal semanal ————— */

export type PesoEstado = { error?: string; success?: string };

/** Guarda (o corrige) el peso de la semana en curso. */
export async function registrarPeso(
  _prev: PesoEstado,
  formData: FormData,
): Promise<PesoEstado> {
  const kg = parseFloat(
    String(formData.get("peso") ?? "").replace(",", ".").trim(),
  );
  if (!Number.isFinite(kg) || kg < 25 || kg > 250) {
    return { error: "Escribe tu peso en kg (por ejemplo 62,5)." };
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión ha caducado: vuelve a entrar." };

  const { error } = await supabase.from("body_weight_logs").upsert(
    {
      user_id: user.id,
      measured_on: lunesDeLaSemana(new Date()),
      weight_kg: kg,
    },
    { onConflict: "user_id,measured_on" },
  );

  if (error) {
    return { error: "No se pudo guardar. ¿Has ejecutado la migración 0006?" };
  }

  revalidatePath("/app");
  return { success: "Peso guardado." };
}

/* ————— Registro de una sesión de entrenamiento ————— */

export type RegistroEstado = {
  error?: string;
  success?: string;
  /** Marca del guardado: al cambiar, el formulario se vacía. */
  token?: number;
};

/** `rir` = repeticiones en reserva que le quedaban al terminar la serie. */
export type SerieHecha = {
  kg: string;
  reps: string;
  rir: string;
  descanso: string;
};
export type EntradaEjercicio = {
  routine_exercise_id: string;
  exercise_id: string;
  series: SerieHecha[];
};
export type RegistroInput = {
  routine_day_id: string;
  entradas: EntradaEjercicio[];
};

/** Guarda lo que el jinete ha hecho hoy: kg, reps y descanso por serie. */
export async function registrarSesion(
  _prev: RegistroEstado,
  formData: FormData,
): Promise<RegistroEstado> {
  let datos: RegistroInput;
  try {
    datos = JSON.parse(String(formData.get("payload") ?? "")) as RegistroInput;
  } catch {
    return { error: "No se pudo leer el registro. Recarga la página." };
  }

  // Solo cuentan las series con algo apuntado; los ejercicios sin nada, fuera.
  const entradas = datos.entradas
    .map((e) => ({
      ...e,
      series: e.series.filter(
        (s) => (s.kg + s.reps + s.rir + s.descanso).trim() !== "",
      ),
    }))
    .filter((e) => e.series.length > 0);

  if (entradas.length === 0) {
    return { error: "Apunta al menos una serie antes de guardar." };
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión ha caducado: vuelve a entrar." };

  const { data: sesion, error: errorSesion } = await supabase
    .from("workout_sessions")
    .insert({ user_id: user.id, routine_day_id: datos.routine_day_id })
    .select("id")
    .single<{ id: string }>();

  if (errorSesion || !sesion) {
    return { error: "No se pudo guardar. ¿Sigue vigente tu suscripción?" };
  }

  const filas = entradas.map((e) => ({
    session_id: sesion.id,
    user_id: user.id,
    exercise_id: e.exercise_id,
    routine_exercise_id: e.routine_exercise_id,
    series: e.series,
  }));

  const { error: errorLogs } = await supabase.from("workout_logs").insert(filas);
  if (errorLogs) {
    return { error: "No se pudo guardar el detalle de las series. Inténtalo de nuevo." };
  }

  revalidatePath("/app");
  return { success: "Sesión guardada. ¡Buen trabajo!", token: Date.now() };
}
