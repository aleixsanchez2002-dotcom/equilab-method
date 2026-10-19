import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/shared";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale");
  if (locale !== "es" && locale !== "en") return new NextResponse("Invalid language", { status: 400 });
  const next = request.nextUrl.searchParams.get("next") ?? "/";
  // Validate the pathname separately so changing language keeps filters and
  // the selected client, while the redirect always stays on this origin.
  let path = "/";
  if (next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")) {
    const destination = new URL(next, request.url);
    const allowed = /^\/(?:en\/?|acceso(?:\/[^?#]*)?|app(?:\/[^?#]*)?|admin(?:\/[^?#]*)?)?$/.test(destination.pathname);
    if (destination.origin === request.nextUrl.origin && allowed) {
      path = `${destination.pathname}${destination.search}`;
    }
  }
  const target = path === "/" || path === "/en" || path === "/en/" ? (locale === "en" ? "/en" : "/") : path;
  // A relative Location keeps the browser on its current host, including
  // local previews behind a reverse proxy.
  const response = new NextResponse(null, { status: 303, headers: { Location: target } });
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", httpOnly: true, secure: request.nextUrl.protocol === "https:" });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
