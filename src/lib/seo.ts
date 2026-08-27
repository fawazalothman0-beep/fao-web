import type { Metadata } from "next";
import { site, type Locale } from "@/config/site";

/**
 * Build per-page metadata with canonical + hreflang alternates + Open Graph +
 * Twitter. `path` is the pathname WITHOUT the locale prefix (e.g. "/properties").
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string; // "" for home, "/properties", ...
  title: string;
  description: string;
}): Metadata {
  const clean = path && !path.startsWith("/") ? `/${path}` : path;
  const canonical = `${site.url}/${locale}${clean}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ar: `${site.url}/ar${clean}`,
        en: `${site.url}/en${clean}`,
        "x-default": `${site.url}/ar${clean}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name[locale],
      locale: locale === "ar" ? "ar_KW" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_KW",
      url: canonical,
      title,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name[locale] }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
