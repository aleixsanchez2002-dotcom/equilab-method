import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/shared";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale");
  if (locale !== "es" && locale !== "en") return new NextResponse("Invalid language", { status: 400 });
  const next = request.nextUrl.searchParams.get("next") ?? "/";
  // Allow only internal application paths; never redirect to an external origin.
  const allowed = /^\/(?:en\/?|acceso(?:\/[^?#]*)?|app(?:\/[^?#]*)?|admin(?:\/[^?#]*)?)?$/.test(next);
  const path = allowed ? next : "/";
  const target = path === "/" || path === "/en" || path === "/en/" ? (locale === "en" ? "/en" : "/") : path;
  // A relative Location keeps the browser on its current host, including
  // local previews behind a reverse proxy.
  const response = new NextResponse(null, { status: 303, headers: { Location: target } });
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", httpOnly: true, secure: request.nextUrl.protocol === "https:" });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
