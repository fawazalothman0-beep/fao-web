import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";
import { site, hasAnyContact, type Locale } from "@/config/site";
import { telLink, whatsappLink, mailtoLink } from "@/lib/format";
import type { Dict } from "@/i18n/dictionaries";

export function Footer({ locale, dict }: { locale: Locale; dict: Dict }) {
  const base = `/${locale}`;
  const year = 2026;
  const c = site.contact;
  const links = [
    { href: `${base}/properties`, label: dict.nav.properties },
    { href: `${base}/services`, label: dict.nav.services },
    { href: `${base}/list-your-property`, label: dict.nav.listProperty },
    { href: `${base}/buyer-requirement`, label: dict.nav.buyerRequest },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="bg-surface-deep text-content-inverse">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo locale={locale} onPlate imgClassName="h-16 sm:h-[72px]" />
            <p className="max-w-sm text-sm leading-relaxed text-white/70">{dict.footer.tagline}</p>
          </div>

          <nav aria-label={dict.footer.quickLinks} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white/90">{dict.footer.quickLinks}</h3>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white/90">{dict.footer.contact}</h3>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              {(c.phones?.length ? c.phones : c.phone ? [c.phone] : []).map((ph) => (
                <li key={ph}>
                  <a href={telLink(ph)} className="transition-colors hover:text-white nums" dir="ltr">
                    {ph}
                  </a>
                </li>
              ))}
              {c.whatsappUrl || c.whatsapp ? (
                <li>
                  <a
                    href={c.whatsappUrl ?? whatsappLink(c.whatsapp!, site.name[locale])}
                    className="transition-colors hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dict.common.whatsapp}
                  </a>
                </li>
              ) : null}
              {(c.emails?.length ? c.emails : c.email ? [c.email] : []).map((em) => (
                <li key={em}>
                  <a href={mailtoLink(em, site.name[locale], "")} className="transition-colors hover:text-white" dir="ltr">
                    {em}
                  </a>
                </li>
              ))}
              {c[locale === "ar" ? "addressAr" : "addressEn"] ? (
                <li>{c[locale === "ar" ? "addressAr" : "addressEn"]}</li>
              ) : null}
              {!hasAnyContact() ? (
                <li>
                  <Link href={`${base}/contact`} className="transition-colors hover:text-white">
                    {dict.nav.contact}
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name[locale]}. {dict.footer.rights}
          </p>
          <p>{site.name[locale === "ar" ? "en" : "ar"]}</p>
        </div>
      </Container>
    </footer>
  );
}
