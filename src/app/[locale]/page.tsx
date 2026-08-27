import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, Eyebrow, Button, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { QuickSearch } from "@/components/quick-search";
import { PropertyCard } from "@/components/property-card";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getFeatured } from "@/content/properties";
import type { Locale } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return buildMetadata({ locale, path: "", title: d.meta.homeTitle, description: d.meta.homeDesc });
}

const WHY_ICONS = ["handshake", "chart", "search", "shield"] as const;
const SERVICE_ICONS = ["tag", "building", "key", "handshake", "chart", "doc", "shield"] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const l = locale as Locale;
  const base = `/${l}`;
  const featured = getFeatured();

  return (
    <>
      {/* Hero */}
      <Section tone="sunken" className="relative overflow-hidden !pt-14 !pb-16 sm:!pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col gap-6 animate-rise">
              <Eyebrow>{d.home.heroEyebrow}</Eyebrow>
              <h1 className="text-4xl font-bold leading-tight text-content sm:text-5xl lg:text-6xl">
                {d.home.heroTitle}
              </h1>
              <p className="max-w-xl text-lg text-content-muted">{d.home.heroLead}</p>
              <div className="flex flex-wrap gap-3">
                <Button href={`${base}/properties`} size="lg">
                  {d.home.heroPrimary}
                  <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" />
                </Button>
                <Button href={`${base}/list-your-property`} variant="secondary" size="lg">
                  {d.home.heroSecondary}
                </Button>
              </div>
            </div>

            {/* Navy positioning panel (no stock imagery) */}
            <div className="relative rounded-3xl bg-surface-deep p-7 text-content-inverse shadow-xl sm:p-8">
              <div className="flex flex-col gap-5">
                <span className="eyebrow !text-gold-400">{d.home.statsTitle}</span>
                <ul className="flex flex-col gap-4">
                  {d.home.why.slice(0, 3).map((w, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-400">
                        <Icon name={WHY_ICONS[i]} className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-base font-semibold">{w.t}</span>
                        <span className="text-sm leading-relaxed text-white/65">{w.d}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Quick search */}
          <div className="mt-10">
            <QuickSearch locale={l} dict={d} />
          </div>
        </Container>
      </Section>

      {/* Featured */}
      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Eyebrow>{d.nav.properties}</Eyebrow>
              <h2 className="text-3xl font-bold text-content sm:text-4xl">{d.home.featuredTitle}</h2>
              <p className="max-w-2xl text-base text-content-muted">{d.home.featuredLead}</p>
            </div>
            <Button href={`${base}/properties`} variant="secondary">
              {d.common.viewAll}
              <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" />
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.ref} property={p} locale={l} dict={d} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Services */}
      <Section tone="sunken">
        <Container>
          <div className="mb-10 flex flex-col gap-2 text-center">
            <Eyebrow className="justify-center">{d.nav.services}</Eyebrow>
            <h2 className="text-3xl font-bold text-content sm:text-4xl">{d.home.servicesTitle}</h2>
            <p className="mx-auto max-w-2xl text-base text-content-muted">{d.home.servicesLead}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.services.items.slice(0, 6).map((s, i) => (
              <div key={i} className="card-surface flex flex-col gap-3 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary-strong">
                  <Icon name={SERVICE_ICONS[i]} />
                </span>
                <h3 className="text-lg font-semibold text-content">{s.t}</h3>
                <p className="text-sm leading-relaxed text-content-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button href={`${base}/services`} variant="secondary">
              {d.common.viewAll}
              <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* Why us */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="flex flex-col gap-3">
              <Eyebrow>{d.home.whyTitle}</Eyebrow>
              <h2 className="text-3xl font-bold text-content sm:text-4xl">{d.home.whyTitle}</h2>
              <p className="text-base text-content-muted">{d.home.whyLead}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {d.home.why.map((w, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-5">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-soft text-gold-600">
                    <Icon name={WHY_ICONS[i]} className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-content">{w.t}</h3>
                    <p className="text-sm leading-relaxed text-content-muted">{w.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA band */}
      <Section tone="deep" className="!py-16">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge tone="gold">{d.common.getInTouch}</Badge>
            <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">{d.home.ctaTitle}</h2>
            <p className="max-w-xl text-base text-white/70">{d.home.ctaLead}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href={`${base}/list-your-property`} variant="inverse" size="lg">
                {d.home.ctaOwner}
              </Button>
              <Button href={`${base}/buyer-requirement`} variant="gold" size="lg">
                {d.home.ctaBuyer}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
