import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section, Eyebrow, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { PropertyFilters } from "@/components/property-filters";
import { PropertyCard } from "@/components/property-card";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getProperties } from "@/content/properties";
import type { Locale } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return buildMetadata({ locale, path: "/properties", title: d.meta.propertiesTitle, description: d.meta.propertiesDesc });
}

type SP = { [k: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || "";

export default async function PropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SP>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const l = locale as Locale;
  const sp = await searchParams;

  const fTransaction = one(sp.transaction);
  const fCategory = one(sp.category);
  const fType = one(sp.type);
  const fArea = one(sp.area).toLowerCase();
  const fMaxPrice = Number(one(sp.maxPrice)) || 0;

  const all = await getProperties();
  const results = all.filter((p) => {
    if (fTransaction && p.transaction !== fTransaction) return false;
    if (fCategory && p.category !== fCategory) return false;
    if (fType && p.type !== fType) return false;
    if (fArea && !(`${p.area.ar} ${p.area.en}`.toLowerCase().includes(fArea))) return false;
    if (fMaxPrice && p.price != null && p.price > fMaxPrice) return false;
    return true;
  });

  const base = `/${l}`;
  const count = results.length;

  return (
    <Section tone="sunken" className="!py-12 sm:!py-16">
      <Container>
        <div className="flex flex-col gap-3">
          <Eyebrow>{d.nav.properties}</Eyebrow>
          <h1 className="text-3xl font-bold text-content sm:text-4xl">{d.properties.title}</h1>
          <p className="max-w-2xl text-base text-content-muted">{d.properties.lead}</p>
        </div>

        <div className="mt-6">
          <PropertyFilters locale={l} dict={d} />
        </div>

        <p className="mt-6 text-sm text-content-muted">
          <span className="nums font-semibold text-content">{count}</span>{" "}
          {count === 1 ? d.properties.resultsOne : d.properties.resultsMany}
        </p>

        {count > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <PropertyCard key={p.ref} property={p} locale={l} dict={d} />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border-strong bg-surface p-12 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken text-content-subtle">
              <Icon name="search" />
            </span>
            <p className="text-base font-medium text-content">{d.properties.empty}</p>
            <p className="max-w-md text-sm text-content-muted">{d.properties.emptyHint}</p>
            <Button href={`${base}/buyer-requirement`}>
              {d.nav.buyerRequest}
              <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" />
            </Button>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-content-subtle">
          <Link href={`${base}/list-your-property`} className="link-underline hover:text-content">
            {d.nav.listProperty}
          </Link>
        </p>
      </Container>
    </Section>
  );
}
