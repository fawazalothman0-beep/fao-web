import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { getProperties } from "@/content/properties";
import { getRequests } from "@/content/requests";

const STATIC_PATHS = ["", "/properties", "/requests", "/services", "/about", "/contact", "/list-your-property", "/buyer-requirement"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const [properties, requests] = await Promise.all([getProperties(), getRequests()]);
  const propertyPaths = properties.map((p) => `/properties/${p.ref}`);
  const requestPaths = requests.map((r) => `/requests/${r.ref}`);
  const allPaths = [...STATIC_PATHS, ...propertyPaths, ...requestPaths];

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
