import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, Eyebrow, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return buildMetadata({ locale, path: "/about", title: d.meta.aboutTitle, description: d.meta.aboutDesc });
}

const VALUE_ICONS = ["shield", "check", "chart", "key"] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const l = locale as Locale;
  const base = `/${l}`;

  return (
    <>
      <Section tone="sunken" className="!py-14 sm:!py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="flex flex-col gap-4">
              <Eyebrow>{d.nav.about}</Eyebrow>
              <h1 className="text-3xl font-bold text-content sm:text-4xl">{d.about.title}</h1>
              <p className="text-lg text-content-muted">{d.about.lead}</p>
            </div>
            <div className="rounded-3xl bg-surface-deep p-8 text-content-inverse shadow-xl">
              <div className="flex flex-col gap-4">
                <span className="eyebrow !text-gold-400">{d.about.valuesTitle}</span>
                <ul className="flex flex-col gap-4">
                  {d.about.values.map((v, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-400">
                        <Icon name={VALUE_ICONS[i]} className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-base font-semibold">{v.t}</span>
                        <span className="text-sm leading-relaxed text-white/65">{v.d}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {d.about.body.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-content-muted">{para}</p>
            ))}
            <div className="mt-4 flex flex-wrap gap-3">
              <Button href={`${base}/services`}>{d.nav.services}</Button>
              <Button href={`${base}/contact`} variant="secondary">{d.nav.contact}</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
