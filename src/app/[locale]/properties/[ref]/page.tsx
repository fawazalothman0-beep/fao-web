import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section, Badge, Button, Divider } from "@/components/ui";
import { Icon } from "@/components/icons";
import { PropertyMedia } from "@/components/property-card";
import { getDict } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getProperties, getProperty } from "@/content/properties";
import { site, hasAnyContact, type Locale } from "@/config/site";
import { formatMoney, whatsappLink, mailtoLink } from "@/lib/format";

export function generateStaticParams() {
  return locales.flatMap((locale) => getProperties().map((p) => ({ locale, ref: p.ref })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; ref: string }>;
}): Promise<Metadata> {
  const { locale, ref } = await params;
  if (!isLocale(locale)) return {};
  const p = getProperty(ref);
  const d = getDict(locale);
  if (!p) return buildMetadata({ locale, path: `/properties/${ref}`, title: d.property.notFound, description: d.property.notFoundLead });
  const title = `${p.title[locale]} — ${site.name[locale]}`;
  const desc = p.description[locale];
  return buildMetadata({ locale, path: `/properties/${p.ref}`, title, description: desc });
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ locale: string; ref: string }>;
}) {
  const { locale, ref } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const base = `/${l}`;
  const p = getProperty(ref);
  if (!p) notFound();

  const specs: { label: string; value: string; icon: "bed" | "bath" | "ruler" | "pin" | "tag" | "building" }[] = [];
  if (p.size != null) specs.push({ label: d.common.size, value: `${p.size} ${d.common.sqm}`, icon: "ruler" });
  if (p.bedrooms != null) specs.push({ label: d.common.bedrooms, value: String(p.bedrooms), icon: "bed" });
  if (p.bathrooms != null) specs.push({ label: d.common.bathrooms, value: String(p.bathrooms), icon: "bath" });
  specs.push({ label: d.common.type, value: d.ptype[p.type], icon: "building" });
  specs.push({ label: d.common.area, value: p.area[l], icon: "pin" });
  specs.push({ label: d.common.governorate, value: p.governorate[l], icon: "pin" });

  const contactMsg =
    l === "ar"
      ? `مرحباً، أنا مهتم بالعقار ${p.title.ar} (${p.ref}).`
      : `Hello, I'm interested in ${p.title.en} (${p.ref}).`;
  const c = site.contact;
  const primaryHref = c.whatsapp
    ? whatsappLink(c.whatsapp, contactMsg)
    : c.email
      ? mailtoLink(c.email, `${p.title[l]} — ${p.ref}`, contactMsg)
      : `${base}/contact`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title[l],
    description: p.description[l],
    url: `${site.url}${base}/properties/${p.ref}`,
    identifier: p.ref,
    ...(p.price != null && {
      offers: { "@type": "Offer", price: p.price, priceCurrency: "KWD", availability: "https://schema.org/InStock" },
    }),
    areaServed: { "@type": "Place", name: `${p.area[l]}, ${site.country[l]}` },
  };

  return (
    <Section tone="sunken" className="!py-10 sm:!py-12">
      <Container>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="mb-6 flex items-center gap-1.5 text-sm text-content-muted">
          <Link href={`${base}/properties`} className="inline-flex items-center gap-1 hover:text-content">
            <Icon name="arrow" className="h-4 w-4 ltr:-scale-x-100" />
            {d.nav.properties}
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-border">
              <PropertyMedia property={p} className="aspect-[16/9] w-full" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                <Badge tone={p.transaction === "sale" ? "navy" : "blue"}>{d.transaction[p.transaction]}</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="muted">
                  {d.common.reference}: <span className="nums font-semibold" dir="ltr">{p.ref}</span>
                </Badge>
                <Badge tone="outline">{d.category[p.category]}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-content sm:text-4xl">{p.title[l]}</h1>
              <p className="text-base text-content-muted">
                {p.area[l]} · {p.governorate[l]} · {site.country[l]}
              </p>
              <p className="nums mt-1 text-2xl font-bold text-content" dir="ltr">
                {p.price != null ? (
                  <>
                    {formatMoney(p.price, l)}
                    {p.transaction === "rent" ? (
                      <span className="text-base font-normal text-content-subtle">{d.common.perMonth}</span>
                    ) : null}
                  </>
                ) : (
                  <span className="text-base font-normal text-content-subtle">{d.common.onRequest}</span>
                )}
              </p>
            </div>

            <Divider />

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-content">{d.property.specifications}</h2>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {specs.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-sunken text-content-muted">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <dt className="text-xs text-content-subtle">{s.label}</dt>
                      <dd className="truncate text-sm font-semibold text-content">{s.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-content">{d.property.description}</h2>
              <p className="text-base leading-relaxed text-content-muted">{p.description[l]}</p>
            </section>

            {p.features.length ? (
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-content">{d.property.features}</h2>
                <ul className="flex flex-wrap gap-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-content">
                      <Icon name="check" className="h-4 w-4 text-success" />
                      {f[l]}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-content">{d.property.location}</h2>
              {p.coords && c ? (
                <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
                  <iframe
                    title={p.title[l]}
                    src={`https://www.google.com/maps?q=${p.coords.lat},${p.coords.lng}&z=14&output=embed`}
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface p-5 text-sm text-content-muted">
                  <Icon name="pin" className="h-5 w-5 text-content-subtle" />
                  {d.property.mapUnavailable}
                </div>
              )}
            </section>
          </div>

          {/* Contact rail */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-surface flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-content">{d.property.interested}</h2>
                <p className="text-sm text-content-muted">{d.property.interestedLead}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-sunken px-3 py-2.5 text-sm">
                <span className="text-content-muted">{d.common.reference}</span>
                <span className="nums font-semibold text-content" dir="ltr">{p.ref}</span>
              </div>
              <div className="flex flex-col gap-2">
                {c.whatsapp ? (
                  <Button href={primaryHref} variant="gold" className="w-full" target="_blank" rel="noopener noreferrer">
                    <Icon name="whatsapp" className="h-5 w-5" />
                    {d.common.whatsapp}
                  </Button>
                ) : null}
                <Button href={c.whatsapp ? `${base}/contact` : primaryHref} variant={c.whatsapp ? "secondary" : "primary"} className="w-full">
                  <Icon name="mail" className="h-5 w-5" />
                  {d.property.contactAgent}
                </Button>
              </div>
              {!hasAnyContact() ? (
                <p className="text-xs text-content-subtle">{d.contact.noChannels}</p>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
