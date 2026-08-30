import { site, type Locale } from "@/config/site";

/**
 * Central WhatsApp link builder — the ONLY place CTAs derive the WhatsApp target.
 * Uses the single verified number from site.contact.whatsapp (digits) with an optional
 * prefilled context; falls back to a ready whatsappUrl, else null (no channel configured).
 * Never include private client/CRM data in `context`.
 */
export function waLink(context?: string): string | null {
  const c = site.contact;
  if (c.whatsapp) return whatsappLink(c.whatsapp, context ?? site.name.ar);
  if (c.whatsappUrl) return c.whatsappUrl;
  return null;
}

/** Money in KWD, LTR digits, 3-decimals convention shown compactly. */
export function formatMoney(v: number, locale: Locale): string {
  const n = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(v);
  return locale === "ar" ? `${n} د.ك` : `KWD ${n}`;
}

export function formatNumber(v: number): string {
  return new Intl.NumberFormat("en-US").format(v);
}

/** Build a wa.me deep link (digits only, no "+"). */
export function whatsappLink(digits: string, text: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function mailtoLink(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
