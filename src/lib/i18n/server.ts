import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, localeSettings } from "./shared";

export const getI18n = cache(async () => {
  const locale = (await cookies()).get(LOCALE_COOKIE)?.value === "en" ? "en" : "es";
  return localeSettings(locale);
});
