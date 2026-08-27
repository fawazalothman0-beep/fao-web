import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { getProperties } from "@/content/properties";

const STATIC_PATHS = ["", "/properties", "/services", "/about", "/contact", "/list-your-property", "/buyer-requirement"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const propertyPaths = getProperties().map((p) => `/properties/${p.ref}`);
  const allPaths = [...STATIC_PATHS, ...propertyPaths];

  for (const path of allPaths) {
    for (const locale of locales) {
      entries.push({
        url: `${site.url}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path.startsWith("/properties/") ? "weekly" : "monthly",
        priority: path === "" ? 1 : path === "/properties" ? 0.9 : 0.7,
        alternates: {
          languages: {
            ar: `${site.url}/ar${path}`,
            en: `${site.url}/en${path}`,
          },
        },
      });
    }
  }
  return entries;
}
