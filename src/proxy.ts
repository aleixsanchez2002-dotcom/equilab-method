import { LOCALE_COOKIE } from "@/lib/i18n/shared";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  supabaseAnonKey,
  supabaseConfigurado,
  supabaseUrl,
} from "@/lib/supabase/config";

/**
 * Refresca la sesión de Supabase en cada petición a rutas privadas y
 * redirige a /acceso si no hay usuario. (En Next 16, `proxy` sustituye
 * al antiguo `middleware`.)
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/" || pathname === "/en") {
    const locale = pathname === "/en" ? "en" : "es";
    request.cookies.set(LOCALE_COOKIE, locale);
    const response = NextResponse.next({ request });
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", httpOnly: true, secure: request.nextUrl.protocol === "https:" });
    return response;
  }
  let response = NextResponse.next({ request });

  if (!supabaseConfigurado) {
    // Sin backend conectado no hay sesiones: las rutas privadas avisan.
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/acceso";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/", "/en", "/app/:path*", "/admin/:path*"],
};
