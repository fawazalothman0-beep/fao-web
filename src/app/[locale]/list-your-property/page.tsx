import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, Eyebrow, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { waLink } from "@/lib/format";
import type { Locale } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return buildMetadata({ locale, path: "/list-your-property", title: d.meta.ownerTitle, description: d.meta.ownerDesc });
}

export default async function OwnerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const l = locale as Locale;

  return (
    <Section tone="sunken" className="!py-14 sm:!py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-3">
            <Eyebrow>{d.nav.listProperty}</Eyebrow>
            <h1 className="text-3xl font-bold text-content sm:text-4xl">{d.owner.title}</h1>
            <p className="text-base text-content-muted">{d.owner.lead}</p>
          </div>
          <div className="card-surface mt-8 p-6 sm:p-8">
            <LeadForm variant="owner" locale={l} dict={d} />
          </div>
          {(() => {
            const href = waLink(l === "ar"
              ? "مرحباً، أرغب في عرض عقاري لدى فواز العثمان العقارية."
              : "Hello, I'd like to list a property with Fawaz Al Othman Real Estate.");
            return href ? (
              <div className="mt-4 flex justify-center">
                <Button href={href} variant="gold" target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" className="h-5 w-5" /> {d.common.whatsapp}
                </Button>
              </div>
            ) : null;
          })()}
        </div>
      </Container>
    </Section>
  );
}
