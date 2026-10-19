"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export type AccionEstado = { error?: string; success?: string };

/* ————— Serie/día tal como los envía el constructor ————— */
/** `rir` = repeticiones en reserva objetivo (esfuerzo prescrito). */
export type SerieInput = {
  peso: string;
  reps: string;
  rir: string;
  descanso: string;
};
export type EjercicioInput = {
  exercise_id: string;
  technique_note: string;
  series: SerieInput[];
};
export type DiaInput = {
  focus: string;
  duration_note: string;
  ejercicios: EjercicioInput[];
};
/** Una semana del mesociclo, con sus días. */
export type SemanaInput = {
  dias: DiaInput[];
};
export type RutinaInput = {
  /** Presente al editar una rutina existente (modo revisión). */
  rutina_id?: string;
  user_id: string;
  title: string;
  type: "semi" | "personalizada";
  /** Texto que ve el cliente en su área («Información de este bloque»). */
  explanation?: string;
  /** El mesociclo completo: una entrada por semana. */
  semanas: SemanaInput[];
};

const ERROR_PERMISOS =
  "No se pudo guardar. ¿Has ejecutado la migración 0003 en Supabase?";

/** Alta manual de 30 días mientras Stripe (fase 3) no está conectado. */
export async function concederAcceso(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId") ?? "");
  const planCode = String(formData.get("planCode") ?? "basico");
  if (!userId) return;

  const supabase = await createSupabaseServer();
  const fin = new Date(Date.now() + 30 * 86_400_000).toISOString();

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_code: planCode,
      status: "active",
      current_period_end: fin,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  revalidatePath("/admin");
}

export async function retirarAcceso(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  const supabase = await createSupabaseServer();
  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      current_period_end: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  revalidatePath("/admin");
}

/** Fecha de hoy en formato yyyy-mm-dd (zona local). */
function hoyISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/**
 * Marca el arranque del mesociclo la primera vez que se publica.
 * El `.is("started_on", null)` evita reiniciar la cuenta de semanas si el
 * coach edita una rutina que ya estaba en marcha.
 */
async function marcarArranque(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  rutinaId: string,
): Promise<void> {
  await supabase
    .from("routines")
    .update({ started_on: hoyISO() })
    .eq("id", rutinaId)
    .is("started_on", null);
}

export async function publicarRutina(formData: FormData): Promise<void> {
  const rutinaId = String(formData.get("rutinaId") ?? "");
  if (!rutinaId) return;

  const supabase = await createSupabaseServer();
  await supabase
    .from("routines")
    .update({ status: "publicada", updated_at: new Date().toISOString() })
    .eq("id", rutinaId);
  await marcarArranque(supabase, rutinaId);

  revalidatePath("/admin");
}

export async function archivarRutina(formData: FormData): Promise<void> {
  const rutinaId = String(formData.get("rutinaId") ?? "");
  if (!rutinaId) return;

  const supabase = await createSupabaseServer();
  await supabase
    .from("routines")
    .update({ status: "archivada", updated_at: new Date().toISOString() })
    .eq("id", rutinaId);

  revalidatePath("/admin");
}

/** Guarda la rutina completa del constructor (borrador o publicada). */
export async function guardarRutina(
  _prev: AccionEstado,
  formData: FormData,
): Promise<AccionEstado> {
  let datos: RutinaInput;
  try {
    datos = JSON.parse(String(formData.get("payload") ?? "")) as RutinaInput;
  } catch {
    return { error: "No se pudo leer el formulario. Recarga la página." };
  }
  const publicar = formData.get("accion") === "publicar";

  // Las series sin rellenar se descartan: así un despiste del coach no
  // llega al cliente como "— × —".
  for (const semana of datos.semanas) {
    for (const dia of semana.dias) {
      for (const ej of dia.ejercicios) {
        ej.series = ej.series.filter(
          (s) => (s.peso + s.reps + s.rir + s.descanso).trim() !== "",
        );
      }
    }
  }

  // Validación mínima antes de tocar la base de datos
  if (!datos.user_id) return { error: "Falta el cliente." };
  if (!datos.title.trim()) return { error: "Ponle un nombre al bloque (p. ej. «Estabilidad de cadera»)." };
  if (datos.semanas.length === 0) {
    return { error: "La rutina necesita al menos una semana." };
  }
  for (const [s, semana] of datos.semanas.entries()) {
    const donde = (i: number) => `semana ${s + 1}, día ${i + 1}`;
    if (semana.dias.length === 0) {
      return { error: `La semana ${s + 1} no tiene ningún día.` };
    }
    for (const [i, dia] of semana.dias.entries()) {
      if (!dia.focus.trim()) {
        return { error: `Falta el foco del día en ${donde(i)} (p. ej. «Fuerza + cadera»).` };
      }
      if (dia.ejercicios.length === 0) {
        return { error: `No hay ejercicios en ${donde(i)}.` };
      }
      for (const [j, ej] of dia.ejercicios.entries()) {
        if (!ej.exercise_id) {
          return { error: `Elige el ejercicio ${j + 1} de ${donde(i)}.` };
        }
        if (ej.series.length === 0) {
          return { error: `El ejercicio ${j + 1} de ${donde(i)} no tiene series.` };
        }
      }
    }
  }

  const supabase = await createSupabaseServer();
  const coachId = (await supabase.auth.getUser()).data.user?.id ?? null;

  let rutinaId: string;
  if (datos.rutina_id) {
    // Modo revisión: se actualiza la cabecera y se reescriben los días
    // (el coach que edita pasa a ser el responsable de la rutina).
    const { error: errorUpdate } = await supabase
      .from("routines")
      .update({
        title: datos.title.trim(),
        type: datos.type,
        weeks: datos.semanas.length,
        explanation: datos.explanation?.trim() || null,
        status: publicar ? "publicada" : "borrador",
        coach_id: coachId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", datos.rutina_id);
    if (errorUpdate) return { error: ERROR_PERMISOS };

    const { error: errorBorrado } = await supabase
      .from("routine_days")
      .delete()
      .eq("routine_id", datos.rutina_id);
    if (errorBorrado) return { error: ERROR_PERMISOS };

    rutinaId = datos.rutina_id;
  } else {
    const { data: rutina, error: errorRutina } = await supabase
      .from("routines")
      .insert({
        user_id: datos.user_id,
        coach_id: coachId,
        title: datos.title.trim(),
        type: datos.type,
        weeks: datos.semanas.length,
        explanation: datos.explanation?.trim() || null,
        status: publicar ? "publicada" : "borrador",
      })
      .select("id")
      .single<{ id: string }>();

    if (errorRutina || !rutina) return { error: ERROR_PERMISOS };
    rutinaId = rutina.id;
  }

  for (const [s, semana] of datos.semanas.entries()) {
    for (const [i, dia] of semana.dias.entries()) {
      const { data: diaRow, error: errorDia } = await supabase
        .from("routine_days")
        .insert({
          routine_id: rutinaId,
          week: s + 1,
          position: i + 1,
          focus: dia.focus.trim(),
          duration_note: dia.duration_note.trim() || null,
        })
        .select("id")
        .single<{ id: string }>();

      if (errorDia || !diaRow) return { error: ERROR_PERMISOS };

      const ejercicios = dia.ejercicios.map((ej, j) => ({
        routine_day_id: diaRow.id,
        exercise_id: ej.exercise_id,
        position: j + 1,
        technique_note: ej.technique_note.trim() || null,
        series: ej.series,
      }));

      const { error: errorEj } = await supabase
        .from("routine_exercises")
        .insert(ejercicios);
      if (errorEj) return { error: ERROR_PERMISOS };
    }
  }

  if (publicar) await marcarArranque(supabase, rutinaId);

  revalidatePath("/admin");
  redirect(`/admin?creada=${publicar ? "publicada" : "borrador"}`);
}
