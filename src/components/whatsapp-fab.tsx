import { Icon } from "@/components/icons";
import { waLink } from "@/lib/format";
import { site, type Locale } from "@/config/site";

/**
 * Sticky mobile WhatsApp contact button. Derives its target from the single
 * verified number in site.contact (via waLink) — no hardcoded number here.
 * General clean context (no reference, no client data).
 */
export function WhatsAppFab({ locale }: { locale: Locale }) {
  const href = waLink(
    locale === "ar"
      ? `مرحباً ${site.name.ar}، لديّ استفسار.`
      : `Hello ${site.name.en}, I have an enquiry.`,
  );
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={locale === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
      className="fixed bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 ltr:right-5 rtl:left-5"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}
