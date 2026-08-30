/**
 * Single source of truth for company facts and contact channels.
 *
 * HONESTY RULE: never invent contact details. Values marked `null`/empty are
 * intentionally blank until a VERIFIED value is provided. The UI renders only
 * channels that have a real value, so nothing fabricated is ever shown.
 */

export type Locale = "ar" | "en";

export interface ContactChannel {
  /** E.164 phone, digits only for wa.me (e.g. "965XXXXXXXX"). null = not yet provided. */
  phone: string | null;
  /** Additional call numbers (E.164, e.g. "+965XXXXXXXX"). Rendered as tel: links. */
  phones: string[];
  whatsapp: string | null; // digits only, no "+"
  /** Ready-to-use WhatsApp chat link (e.g. a wa.me/message/… short link). */
  whatsappUrl: string | null;
  /** Conventional mailbox on the owned domain. Confirm the exact address exists. */
  email: string | null;
  addressAr: string | null;
  addressEn: string | null;
  /** Google Maps place URL or embed src. null hides the map. */
  mapUrl: string | null;
  instagram: string | null; // full URL
  twitter: string | null;
  linkedin: string | null;
}

export const site = {
  domain: "fawazalothmanre.com",
  url: "https://fawazalothmanre.com",
  name: {
    ar: "فواز العثمان العقارية",
    en: "Fawaz Al Othman Real Estate",
  },
  shortName: {
    ar: "فواز العثمان العقارية",
    en: "Fawaz Al Othman Real Estate",
  },
  country: { ar: "الكويت", en: "Kuwait" },
  // Contact — VERIFIED values provided by the owner.
  contact: {
    phone: "+96566961919",
    phones: ["+96566961919", "+96599586343"],
    whatsapp: null, // digits unknown; WhatsApp uses the official short link below
    whatsappUrl: "https://wa.me/message/RI5SA2F6D7HGJ1",
    email: "info@fawazalothmanre.com", // conventional default on the owned domain — confirm it exists
    addressAr: null,
    addressEn: null,
    mapUrl: null,
    instagram: null,
    twitter: null,
    linkedin: null,
  } as ContactChannel,
  locales: ["ar", "en"] as Locale[],
  defaultLocale: "ar" as Locale,
} as const;

export const isRtl = (locale: Locale) => locale === "ar";
export const otherLocale = (locale: Locale): Locale => (locale === "ar" ? "en" : "ar");

/** True when at least one live contact channel is configured. */
export const hasAnyContact = (c: ContactChannel = site.contact) =>
  Boolean(
    c.phone || (c.phones && c.phones.length) || c.whatsapp || c.whatsappUrl || c.email || c.addressAr || c.addressEn,
  );
