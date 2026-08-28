/**
 * Property inventory — CMS-ready typed source. Swap this module for a DB/CMS
 * fetch later without touching the components (they consume `getProperties`).
 *
 * CONTENT INTEGRITY: this array is intentionally EMPTY. No sample/demo/illustrative
 * listings are published — nothing fabricated is presented as real inventory. The
 * UI shows a polished empty state until verified listings are added here (or wired
 * to a CMS/DB). To publish real inventory, add typed `Property` entries below.
 */

export type Transaction = "sale" | "rent";
export type Category = "residential" | "commercial" | "land" | "investment";
export type PropertyType =
  | "villa"
  | "apartment"
  | "floor"
  | "land"
  | "building"
  | "shop"
  | "office"
  | "chalet";

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
  area: Localized; // Kuwait area
  governorate: Localized;
  price: number | null; // KWD
  size: number | null; // m²
  bedrooms: number | null;
  bathrooms: number | null;
  description: Localized;
  features: Localized[];
  images: string[]; // real assets only; empty → branded placeholder (never fabricated photos)
  coords: { lat: number; lng: number } | null; // real coordinates only; null → no map (never invented)
  featured?: boolean;
}

/** Verified inventory only. Empty until real listings are provided. */
export const properties: Property[] = [];

export function getProperties(): Property[] {
  return properties;
}

export function getProperty(ref: string): Property | undefined {
  return properties.find((p) => p.ref.toLowerCase() === ref.toLowerCase());
}

export function getFeatured(): Property[] {
  return properties.filter((p) => p.featured).slice(0, 3);
}

export const hasInventory = () => properties.length > 0;
