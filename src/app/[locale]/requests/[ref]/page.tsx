import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section, Badge, Button, Divider } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getRequest } from "@/content/requests";
import { site, hasAnyContact, type Locale } from "@/config/site";
import { formatMoney, whatsappLink, mailtoLink } from "@/lib/format";

// Inventory is data-driven and may be empty; a missing ref must 404, not error.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; ref: string }>;
}): Promise<Metadata> {
  const { locale, ref } = await params;
  if (!isLocale(locale)) return {};
  const r = await getRequest(ref);
  const d = getDict(locale);
  if (!r) return buildMetadata({ locale, path: `/requests/${ref}`, title: d.requests.notFound, description: d.requests.notFoundLead });
  const title = `${r.title || d.requests.title} (${r.ref}) — ${site.name[locale]}`;
  return buildMetadata({ locale, path: `/requests/${r.ref}`, title, description: r.requirements || d.requests.lead });
}

function range(min: number | null, max: number | null, l: Locale, money: boolean, unit: string): string | null {
  const f = (n: number) => (money ? formatMoney(n, l) : `${new Intl.NumberFormat("en-US").format(n)} ${unit}`);
  if (min != null && max != null) return `${f(min)} – ${f(max)}`;
  if (max != null) return `${l === "ar" ? "حتى" : "up to"} ${f(max)}`;
  if (min != null) return `${l === "ar" ? "من" : "from"} ${f(min)}`;
  return null;
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ locale: string; ref: string }>;
}) {
  const { locale, ref } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const base = `/${l}`;
  const r = await getRequest(ref);
  if (!r) notFound();

  const specs: { label: string; value: string }[] = [];
  const budget = range(r.budgetMin, r.budgetMax, l, true, "");
  const size = range(r.sizeMin, r.sizeMax, l, false, d.common.sqm);
  if (budget) specs.push({ label: d.requests.budget, value: budget });
  if (size) specs.push({ label: d.requests.size, value: size });
  if (r.bedroomsMin != null) specs.push({ label: d.requests.minBeds, value: String(r.bedroomsMin) });
  if (r.type) specs.push({ label: d.common.type, value: d.ptype[r.type as keyof typeof d.ptype] });
  if (r.area) specs.push({ label: d.common.area, value: r.area });
  if (r.governorate) specs.push({ label: d.common.governorate, value: r.governorate });

  // Contact routes to FAO with the anonymized reference — NEVER to any client.
  const contactMsg =
    l === "ar"
      ? `مرحباً، لديّ عقار قد يطابق الطلب رقم ${r.ref}.`
      : `Hello, I may have a property matching request ${r.ref}.`;
  const c = site.contact;
  const waHref = c.whatsappUrl ?? (c.whatsapp ? whatsappLink(c.whatsapp, contactMsg) : null);
  const primaryHref = waHref
    ?? (c.email ? mailtoLink(c.email, `${d.requests.title} — ${r.ref}`, contactMsg) : `${base}/contact`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Demand",
    name: r.title || d.requests.title,
    description: r.requirements || d.requests.lead,
    url: `${site.url}${base}/requests/${r.ref}`,
    identifier: r.ref,
    areaServed: { "@type": "Place", name: [r.area, site.country[l]].filter(Boolean).join(", ") },
  };

  return (
    <Section tone="sunken" className="!py-10 sm:!py-12">
      <Container>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="mb-6 flex items-center gap-1.5 text-sm text-content-muted">
          <Link href={`${base}/requests`} className="inline-flex items-center gap-1 hover:text-content">
            <Icon name="arrow" className="h-4 w-4 ltr:-scale-x-100" />
            {d.nav.requests}
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={r.purpose === "buy" ? "navy" : "blue"}>{d.purpose[r.purpose]}</Badge>
                <Badge tone="muted">
                  {d.common.reference}: <span className="nums font-semibold" dir="ltr">{r.ref}</span>
                </Badge>
                {r.category ? <Badge tone="outline">{d.category[r.category as keyof typeof d.category]}</Badge> : null}
              </div>
              <h1 className="text-3xl font-bold text-content sm:text-4xl">{r.title || d.requests.title}</h1>
              <p className="text-base text-content-muted">
                {[r.area, r.governorate, site.country[l]].filter(Boolean).join(" · ")}
              </p>
            </div>

            <Divider />

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-content">{d.property.specifications}</h2>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {specs.map((s, i) => (
                  <div key={i} className="flex flex-col gap-0.5 rounded-xl border border-border bg-surface p-3.5">
                    <dt className="text-xs text-content-subtle">{s.label}</dt>
                    <dd className="nums truncate text-sm font-semibold text-content" dir={/[0-9]/.test(s.value) ? "ltr" : undefined}>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {r.requirements ? (
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-content">{d.requests.requirements}</h2>
                <p className="text-base leading-relaxed text-content-muted">{r.requirements}</p>
              </section>
            ) : null}

            {r.features.length ? (
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-content">{d.property.features}</h2>
                <ul className="flex flex-wrap gap-2">
                  {r.features.map((f, i) => (
                    <li key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-content">
                      <Icon name="check" className="h-4 w-4 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          {/* Contact rail — routes to FAO, never to the client */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-surface flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-content">{d.requests.interested}</h2>
                <p className="text-sm text-content-muted">{d.requests.interestedLead}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-sunken px-3 py-2.5 text-sm">
                <span className="text-content-muted">{d.common.reference}</span>
                <span className="nums font-semibold text-content" dir="ltr">{r.ref}</span>
              </div>
              <div className="flex flex-col gap-2">
                {waHref ? (
                  <Button href={waHref} variant="gold" className="w-full" target="_blank" rel="noopener noreferrer">
                    <Icon name="whatsapp" className="h-5 w-5" />
                    {d.common.whatsapp}
                  </Button>
                ) : null}
                <Button href={waHref ? `${base}/contact` : primaryHref} variant={waHref ? "secondary" : "primary"} className="w-full">
                  <Icon name="mail" className="h-5 w-5" />
                  {d.requests.contactCta}
                </Button>
              </div>
              {!hasAnyContact() ? <p className="text-xs text-content-subtle">{d.contact.noChannels}</p> : null}
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
