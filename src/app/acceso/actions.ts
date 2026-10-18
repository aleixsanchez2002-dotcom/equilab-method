"use server";

import { getI18n } from "@/lib/i18n/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { POLICY_VERSION, supabaseConfigurado } from "@/lib/supabase/config";
import { createSupabaseServer } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  success?: string;
};

const SIN_BACKEND =
  "El backend aún no está conectado: falta crear el proyecto de Supabase y rellenar .env.local (pasos en supabase/README.md).";

const SIN_CONEXION =
  "No pudimos conectar con el servidor. Si el proyecto de Supabase está pausado, reanúdalo; si no, inténtalo en un minuto.";

/**
 * Distingue un fallo de red o de servidor (proyecto pausado, caída, DNS)
 * de un error real de credenciales: decir «contraseña incorrecta» cuando
 * el servidor no responde manda a buscar el problema donde no está.
 */
function esFalloDeConexion(error: {
  status?: number;
  code?: string;
  message?: string;
}): boolean {
  if (error.code === "over_request_rate_limit") return false;
  if (typeof error.status === "number") {
    // status 0 = fetch fallido; 5xx = servidor caído o pausado
    if (error.status === 0 || error.status >= 500) return true;
  }
  return /fetch failed|network|ENOTFOUND|ECONNREFUSED|timeout/i.test(
    error.message ?? "",
  );
}

export async function registrar(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!supabaseConfigurado) return { error: SIN_BACKEND };

  const nombre = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const consentimiento = formData.get("healthConsent") === "on";

  if (!nombre) return { error: "Dinos tu nombre." };
  if (!email.includes("@")) return { error: "Ese email no parece válido." };
  if (password.length < 8) {
    return { error: "La contraseña necesita al menos 8 caracteres." };
  }
  if (!consentimiento) {
    // El consentimiento explícito de datos de salud es requisito RGPD:
    // sin casilla marcada no se crea la cuenta.
    return { error: "Necesitamos tu consentimiento para tratar tus datos de salud." };
  }

  const supabase = await createSupabaseServer();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      // El trigger handle_new_user crea el perfil y registra el
      // consentimiento (versión de política incluida) a partir de esto.
      data: {
        full_name: nombre,
        health_consent: consentimiento,
        policy_version: POLICY_VERSION,
      },
    },
  });

  if (error) {
    if (esFalloDeConexion(error)) return { error: SIN_CONEXION };
    if (error.code === "user_already_exists") {
      return { error: "Ya existe una cuenta con este email. Prueba a iniciar sesión." };
    }
    return { error: "No se pudo crear la cuenta. Inténtalo de nuevo en un momento." };
  }

  // Se repite la dirección escrita: es la forma más rápida de cazar una
  // errata («…@gmail» mal escrito) antes de esperar un correo que no llegará.
  const { t } = await getI18n();
  return { success: t("Cuenta creada. Te hemos enviado un correo a {0}: confírmalo para entrar. Si no llega en unos minutos, mira en spam y comprueba que la dirección esté bien escrita.", { "0": email }) };
}

/** Envía el email con el enlace para crear una contraseña nueva. */
export async function solicitarRecuperacion(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!supabaseConfigurado) return { error: SIN_BACKEND };

  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) return { error: "Ese email no parece válido." };

  const supabase = await createSupabaseServer();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/acceso/nueva-contrasena`,
  });

  // Respuesta idéntica exista o no la cuenta: no se filtra quién es cliente.
  return {
    success:
      "Si existe una cuenta con ese email, te hemos enviado un enlace para crear una contraseña nueva. Revisa tu correo.",
  };
}

/** Cambia la contraseña del usuario que llegó por el enlace de recuperación. */
export async function cambiarContrasena(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!supabaseConfigurado) return { error: SIN_BACKEND };

  const password = String(formData.get("password") ?? "");
  const repetida = String(formData.get("password2") ?? "");
  if (password.length < 8) {
    return { error: "La contraseña necesita al menos 8 caracteres." };
  }
  if (password !== repetida) {
    return { error: "Las dos contraseñas no coinciden." };
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "El enlace ha caducado. Pide uno nuevo desde «¿La has olvidado?»." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "No se pudo cambiar la contraseña. Pide un enlace nuevo e inténtalo otra vez." };
  }

  redirect("/app?contrasena=cambiada");
}

export async function entrar(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!supabaseConfigurado) return { error: SIN_BACKEND };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (esFalloDeConexion(error)) return { error: SIN_CONEXION };
    if (error.code === "email_not_confirmed") {
      return {
        error:
          "Tu email aún no está confirmado: busca nuestro correo (mira también en spam). " +
          "Si te equivocaste al escribir la dirección, escríbenos y la corregimos.",
      };
    }
    return { error: "Email o contraseña incorrectos." };
  }

  redirect("/app");
}
