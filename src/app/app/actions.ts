"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validarRegistro, type SesionEnviada } from "@/lib/workout-submission";
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

export type { SerieHecha, RegistroInput } from "@/lib/workout-submission";
export type RegistroEstado = { error?: string; success?: string; registro?: SesionEnviada };

export async function registrarSesion(_prev: RegistroEstado, formData: FormData): Promise<RegistroEstado> {
  const raw = String(formData.get("payload") ?? "");
  if (raw.length > 100000) return { error: "Revisa el registro: apunta al menos una serie y utiliza valores válidos." };
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return {error:"No se pudo leer el registro. Recarga la página."}; }
  const datos = validarRegistro(parsed);
  if (!datos) return {error:"Revisa el registro: apunta al menos una serie y utiliza valores válidos."};
  const supabase = await createSupabaseServer();
  const {data:{user}} = await supabase.auth.getUser();
  if (!user) return {error:"Tu sesión ha caducado: vuelve a entrar."};
  const {data,error} = await supabase.rpc("enviar_dia_entrenamiento", {p_dia:datos.routine_day_id,p_entradas:datos.entradas,p_revision:datos.revision});
  if (error) return {error: error.code === "40001" ? "Este día ya se ha enviado o modificado. Recarga la página para ver el registro guardado." : "No se pudo enviar el día. Comprueba tu acceso e inténtalo de nuevo; tus datos siguen en el formulario."};
  const guardado = data as {id:string;completed_at:string;revision:number};
  revalidatePath("/app");
  revalidatePath(`/admin/clientes/${user.id}`);
  return {success:datos.revision === null ? "Día completado. Tu registro ya está disponible para el equipo." : "Corrección guardada. El día sigue completado.",registro:{...guardado,entradas:datos.entradas}};
}
