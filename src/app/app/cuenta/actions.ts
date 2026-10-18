"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase/server";

export type CuentaEstado = { error?: string; success?: string };

export async function actualizarNombre(
  _prev: CuentaEstado,
  formData: FormData,
): Promise<CuentaEstado> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) return { error: "El nombre no puede quedar vacío." };

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión ha caducado: vuelve a entrar." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: nombre, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { error: "No se pudo guardar. ¿Has ejecutado la migración 0006?" };
  }

  revalidatePath("/app");
  revalidatePath("/app/cuenta");
  return { success: "Nombre actualizado." };
}

export async function actualizarEmail(
  _prev: CuentaEstado,
  formData: FormData,
): Promise<CuentaEstado> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) return { error: "Ese email no parece válido." };

  const supabase = await createSupabaseServer();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: `${origin}/auth/confirm?next=/app/cuenta` },
  );

  if (error) {
    return { error: "No se pudo iniciar el cambio de email. Inténtalo de nuevo." };
  }

  return {
    success:
      "Te hemos enviado un correo de confirmación a la dirección nueva. El cambio se aplica al confirmarlo.",
  };
}
