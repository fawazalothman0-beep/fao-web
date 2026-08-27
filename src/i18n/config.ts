import type { Locale } from "@/config/site";

export const locales: Locale[] = ["ar", "en"];
export const defaultLocale: Locale = "ar";

export function isLocale(x: string): x is Locale {
  return (locales as string[]).includes(x);
}

export const dir = (locale: Locale): "rtl" | "ltr" => (locale === "ar" ? "rtl" : "ltr");
export const htmlLang = (locale: Locale) => (locale === "ar" ? "ar-KW" : "en");
