/**
 * Public property source — reads ONLY published properties from the FAO internal
 * system (Supabase), which is the single source of truth. Nothing is fabricated:
 * if no property is published internally, the public site shows an empty state.
 *
 * Property text is authored in the internal system (Arabic); it is presented on
 * both locales as-is (Kuwait real-estate titles/areas are commonly Arabic).
 */
import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

export type Transaction = "sale" | "rent";
export type Category = "residential" | "commercial" | "land" | "investment";
export type PropertyType =
  | "villa" | "apartment" | "floor" | "land" | "building" | "shop" | "office" | "chalet";

export interface Localized {
  ar: string;
  en: string;
}

export interface Property {
  ref: string;
  transaction: Transaction;
  category: Category;
  type: PropertyType;
  title: Localized;
  area: Localized;
  governorate: Localized;
  price: number | null;
  size: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  description: Localized;
  features: Localized[];
  images: string[];
  coords: { lat: number; lng: number } | null;
  featured?: boolean;
}

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

const both = (s: string | null | undefined): Localized => ({ ar: s ?? "", en: s ?? "" });

function mapRow(r: Record<string, unknown>): Property {
  return {
    ref: r.ref as string,
    transaction: r.transaction as Transaction,
    category: r.category as Category,
    type: r.type as PropertyType,
    title: both(r.title as string),
    area: both(r.area as string),
    governorate: both(r.governorate as string),
    price: (r.price as number) ?? null,
    size: (r.size as number) ?? (r.built_area as number) ?? (r.land_area as number) ?? null,
    bedrooms: (r.bedrooms as number) ?? null,
    bathrooms: (r.bathrooms as number) ?? null,
    description: both(r.description as string),
    features: ((r.features as string[]) ?? []).map(both),
    images: (r.images as string[]) ?? [],
    coords: r.lat != null && r.lng != null ? { lat: r.lat as number, lng: r.lng as number } : null,
  };
}

export const getProperties = cache(async (): Promise<Property[]> => {
  const { data, error } = await db().rpc("list_published_properties");
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(mapRow);
});

export async function getProperty(ref: string): Promise<Property | undefined> {
  const { data, error } = await db().rpc("get_published_property", { p_ref: ref });
  if (error || !data) return undefined;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? mapRow(row as Record<string, unknown>) : undefined;
}

export async function getFeatured(): Promise<Property[]> {
  return (await getProperties()).slice(0, 3);
}
