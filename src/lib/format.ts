import type { Locale } from "@/config/site";

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
