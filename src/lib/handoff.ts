import { site } from "@/config/site";
import { whatsappLink, mailtoLink } from "@/lib/format";

export interface LeadField {
  label: string;
  value: string;
}

/**
 * Compose a lead into the best available handoff channel. If no verified
 * channel is configured, returns null (the UI then shows the "no channel"
 * guidance instead of pretending a message was sent).
 */
export function buildLead(
  subject: string,
  fields: LeadField[],
): { href: string; via: "whatsapp" | "email" } | null {
  const body = `${subject}\n\n${fields
    .filter((f) => f.value.trim())
    .map((f) => `${f.label}: ${f.value}`)
    .join("\n")}`;
  const c = site.contact;
  if (c.whatsapp) return { href: whatsappLink(c.whatsapp, body), via: "whatsapp" };
  if (c.email) return { href: mailtoLink(c.email, subject, body), via: "email" };
  return null;
}
