/**
 * Property inventory — CMS-ready typed source. Swap this module for a DB/CMS
 * fetch later without touching the components (they consume `getProperties`).
 *
 * HONESTY: every entry here is `sample: true` (illustrative), rendered with a
 * clear «نموذج توضيحي / Sample» badge and NO fabricated photos. No sample is
 * presented as a real, available listing. Replace with verified inventory.
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
  sample: boolean;
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
  images: string[]; // empty → branded placeholder (never fabricated photos)
  coords: { lat: number; lng: number } | null;
  featured?: boolean;
}

// Illustrative dataset — real Kuwait areas, plausible generic specs, no photos.
export const properties: Property[] = [
  {
    ref: "FAO-1001",
    sample: true,
    transaction: "sale",
    category: "residential",
    type: "villa",
    title: { ar: "فيلا في مشرف", en: "Villa in Mishref" },
    area: { ar: "مشرف", en: "Mishref" },
    governorate: { ar: "حولي", en: "Hawalli" },
    price: 650000,
    size: 600,
    bedrooms: 6,
    bathrooms: 7,
    description: {
      ar: "فيلا بتشطيب راقٍ في موقع هادئ، مساحات معيشة واسعة وتقسيم عملي مناسب للعائلات.",
      en: "An elegantly finished villa in a quiet location, with generous living areas and a practical family layout.",
    },
    features: [
      { ar: "مدخلان", en: "Two entrances" },
      { ar: "حديقة", en: "Garden" },
      { ar: "مواقف خاصة", en: "Private parking" },
    ],
    images: [],
    coords: null,
    featured: true,
  },
  {
    ref: "FAO-1002",
    sample: true,
    transaction: "sale",
    category: "residential",
    type: "villa",
    title: { ar: "فيلا في السالمية", en: "Villa in Salmiya" },
    area: { ar: "السالمية", en: "Salmiya" },
    governorate: { ar: "حولي", en: "Hawalli" },
    price: 720000,
    size: 500,
    bedrooms: 5,
    bathrooms: 6,
    description: {
      ar: "فيلا قريبة من الخدمات والواجهة البحرية، مناسبة للسكن العائلي أو الاستثمار.",
      en: "A villa close to services and the seafront, suitable for family living or investment.",
    },
    features: [
      { ar: "قريبة من البحر", en: "Near the sea" },
      { ar: "تشطيب حديث", en: "Modern finish" },
    ],
    images: [],
    coords: null,
    featured: true,
  },
  {
    ref: "FAO-1003",
    sample: true,
    transaction: "sale",
    category: "land",
    type: "land",
    title: { ar: "أرض سكنية في صباح السالم", en: "Residential land in Sabah Al Salem" },
    area: { ar: "صباح السالم", en: "Sabah Al Salem" },
    governorate: { ar: "مبارك الكبير", en: "Mubarak Al-Kabeer" },
    price: 240000,
    size: 400,
    bedrooms: null,
    bathrooms: null,
    description: {
      ar: "قسيمة سكنية بموقع مطلوب وأبعاد منتظمة، جاهزة للبناء.",
      en: "A residential plot in a sought-after location with regular dimensions, ready to build.",
    },
    features: [
      { ar: "سكن خاص", en: "Private residential" },
      { ar: "موقع مطلوب", en: "Prime location" },
    ],
    images: [],
    coords: null,
    featured: true,
  },
  {
    ref: "FAO-1004",
    sample: true,
    transaction: "rent",
    category: "commercial",
    type: "office",
    title: { ar: "مكتب تجاري في الكويت", en: "Commercial office in Kuwait City" },
    area: { ar: "مدينة الكويت", en: "Kuwait City" },
    governorate: { ar: "العاصمة", en: "Capital" },
    price: 1200,
    size: 180,
    bedrooms: null,
    bathrooms: 2,
    description: {
      ar: "مساحة مكتبية بموقع مركزي، تشطيب جاهز ومناسبة للشركات.",
      en: "Office space in a central location, fit-out ready and suited to companies.",
    },
    features: [
      { ar: "موقع مركزي", en: "Central location" },
      { ar: "مواقف", en: "Parking" },
    ],
    images: [],
    coords: null,
  },
  {
    ref: "FAO-1005",
    sample: true,
    transaction: "sale",
    category: "investment",
    type: "building",
    title: { ar: "عمارة استثمارية في حولي", en: "Investment building in Hawalli" },
    area: { ar: "حولي", en: "Hawalli" },
    governorate: { ar: "حولي", en: "Hawalli" },
    price: 1450000,
    size: 500,
    bedrooms: null,
    bathrooms: null,
    description: {
      ar: "عمارة سكنية مؤجّرة بعائد تشغيلي منتظم في منطقة عالية الطلب.",
      en: "A leased residential building with steady operating income in a high-demand area.",
    },
    features: [
      { ar: "عائد إيجاري", en: "Rental yield" },
      { ar: "إشغال مرتفع", en: "High occupancy" },
    ],
    images: [],
    coords: null,
  },
  {
    ref: "FAO-1006",
    sample: true,
    transaction: "rent",
    category: "residential",
    type: "apartment",
    title: { ar: "شقة في الجابرية", en: "Apartment in Jabriya" },
    area: { ar: "الجابرية", en: "Jabriya" },
    governorate: { ar: "حولي", en: "Hawalli" },
    price: 450,
    size: 165,
    bedrooms: 3,
    bathrooms: 2,
    description: {
      ar: "شقة عائلية بمساحة مريحة قريبة من المدارس والخدمات.",
      en: "A comfortable family apartment close to schools and services.",
    },
    features: [
      { ar: "مصعد", en: "Elevator" },
      { ar: "قريبة من الخدمات", en: "Near services" },
    ],
    images: [],
    coords: null,
  },
];

export function getProperties(): Property[] {
  return properties;
}

export function getProperty(ref: string): Property | undefined {
  return properties.find((p) => p.ref.toLowerCase() === ref.toLowerCase());
}

export function getFeatured(): Property[] {
  const f = properties.filter((p) => p.featured);
  return f.length ? f : properties.slice(0, 3);
}
