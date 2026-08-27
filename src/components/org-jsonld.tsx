import { site, type Locale } from "@/config/site";

/** RealEstateAgent structured data — only VERIFIED fields are emitted. */
export function OrgJsonLd({ locale }: { locale: Locale }) {
  const c = site.contact;
  const sameAs = [c.instagram, c.twitter, c.linkedin].filter(Boolean) as string[];
  const address = c[locale === "ar" ? "addressAr" : "addressEn"];

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name[locale],
    alternateName: site.name[locale === "ar" ? "en" : "ar"],
    url: `${site.url}/${locale}`,
    image: `${site.url}/brand/logo.png`,
    logo: `${site.url}/brand/logo.png`,
    areaServed: { "@type": "Country", name: site.country[locale] },
    knowsLanguage: ["ar", "en"],
  };
  if (sameAs.length) data.sameAs = sameAs;
  if (c.phone || c.email) {
    data.contactPoint = {
      "@type": "ContactPoint",
      contactType: "sales",
      ...(c.phone && { telephone: c.phone }),
      ...(c.email && { email: c.email }),
      areaServed: "KW",
      availableLanguage: ["Arabic", "English"],
    };
  }
  if (address) {
    data.address = { "@type": "PostalAddress", addressCountry: "KW", streetAddress: address };
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
