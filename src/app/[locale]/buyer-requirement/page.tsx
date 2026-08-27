import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, Eyebrow } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return buildMetadata({ locale, path: "/buyer-requirement", title: d.meta.buyerTitle, description: d.meta.buyerDesc });
}

export default async function BuyerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const l = locale as Locale;

  return (
    <Section tone="sunken" className="!py-14 sm:!py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-3">
            <Eyebrow>{d.nav.buyerRequest}</Eyebrow>
            <h1 className="text-3xl font-bold text-content sm:text-4xl">{d.buyer.title}</h1>
            <p className="text-base text-content-muted">{d.buyer.lead}</p>
          </div>
          <div className="card-surface mt-8 p-6 sm:p-8">
            <LeadForm variant="buyer" locale={l} dict={d} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
