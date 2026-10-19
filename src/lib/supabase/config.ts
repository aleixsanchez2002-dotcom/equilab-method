export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Falso mientras Giovanni no haya creado el proyecto y rellenado .env.local. */
export const supabaseConfigurado =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

/** Versión de la política de privacidad que acepta el usuario al registrarse. */
export const POLICY_VERSION = "2026-07-privacidad-v1";
