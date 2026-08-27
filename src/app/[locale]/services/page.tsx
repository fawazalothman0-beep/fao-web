import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, Eyebrow, Button, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return buildMetadata({ locale, path: "/services", title: d.meta.servicesTitle, description: d.meta.servicesDesc });
}

const ICONS = ["tag", "building", "key", "handshake", "chart", "doc", "shield"] as const;

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const l = locale as Locale;
  const base = `/${l}`;

  return (
    <>
      <Section tone="sunken" className="!py-14 sm:!py-16">
        <Container>
          <div className="flex max-w-2xl flex-col gap-3">
            <Eyebrow>{d.nav.services}</Eyebrow>
            <h1 className="text-3xl font-bold text-content sm:text-4xl">{d.services.title}</h1>
            <p className="text-base text-content-muted">{d.services.lead}</p>
          </div>
        </Container>
      </Section>

      <Section className="!pt-0 !py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.services.items.map((s, i) => (
              <div key={i} className="card-surface flex flex-col gap-3 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary-strong">
                  <Icon name={ICONS[i % ICONS.length]} />
                </span>
                <h2 className="text-lg font-semibold text-content">{s.t}</h2>
                <p className="text-sm leading-relaxed text-content-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="deep" className="!py-16">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge tone="gold">{d.common.getInTouch}</Badge>
            <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">{d.home.ctaTitle}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href={`${base}/list-your-property`} variant="inverse" size="lg">{d.home.ctaOwner}</Button>
              <Button href={`${base}/buyer-requirement`} variant="gold" size="lg">{d.home.ctaBuyer}</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
