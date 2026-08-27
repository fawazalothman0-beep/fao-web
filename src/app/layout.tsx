import type { Metadata } from "next";
import { headers } from "next/headers";
import { inter, plexArabic } from "@/lib/fonts";
import { dir, htmlLang, isLocale, defaultLocale } from "@/i18n/config";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name.en} — ${site.country.en}`,
    template: `%s`,
  },
  description:
    "Fawaz Al Othman Real Estate — a Kuwait real-estate company representing owners and buyers across sale, rent, land and investment property.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const raw = h.get("x-locale") ?? defaultLocale;
  const locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <html lang={htmlLang(locale)} dir={dir(locale)} className={`${inter.variable} ${plexArabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
