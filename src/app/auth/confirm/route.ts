import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Destino de los enlaces que Supabase envía por email (confirmación de
 * cuenta y recuperación de contraseña). Soporta los dos formatos de
 * enlace: token_hash+type (plantillas OTP) y ?code= (flujo PKCE, el que
 * usa @supabase/ssr por defecto).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  // Solo se permite redirigir a rutas internas de la app
  const next = searchParams.get("next");
  const destino =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/app";

  const supabase = await createSupabaseServer();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(destino, request.url));
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(destino, request.url));
  }

  return NextResponse.redirect(new URL("/acceso?error=confirmacion", request.url));
}
