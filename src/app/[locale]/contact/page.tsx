import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, Eyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/lead-form";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { site, hasAnyContact, type Locale } from "@/config/site";
import { telLink, whatsappLink, mailtoLink } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return buildMetadata({ locale, path: "/contact", title: d.meta.contactTitle, description: d.meta.contactDesc });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const l = locale as Locale;
  const c = site.contact;
  const address = c[l === "ar" ? "addressAr" : "addressEn"];

  const channels: { icon: "phone" | "whatsapp" | "mail" | "pin"; label: string; value: string; href?: string; dir?: "ltr" }[] = [];
  const phones = c.phones?.length ? c.phones : c.phone ? [c.phone] : [];
  for (const ph of phones) channels.push({ icon: "phone", label: d.common.call, value: ph, href: telLink(ph), dir: "ltr" });
  if (c.whatsappUrl || c.whatsapp) channels.push({ icon: "whatsapp", label: d.common.whatsapp, value: d.common.whatsapp, href: c.whatsappUrl ?? whatsappLink(c.whatsapp!, site.name[l]) });
  for (const em of (c.emails?.length ? c.emails : c.email ? [c.email] : [])) channels.push({ icon: "mail", label: d.common.email, value: em, href: mailtoLink(em, site.name[l], ""), dir: "ltr" });
  if (address) channels.push({ icon: "pin", label: d.common.area, value: address });

  return (
    <Section tone="sunken" className="!py-14 sm:!py-16">
      <Container>
        <div className="flex max-w-2xl flex-col gap-3">
          <Eyebrow>{d.nav.contact}</Eyebrow>
          <h1 className="text-3xl font-bold text-content sm:text-4xl">{d.contact.title}</h1>
          <p className="text-base text-content-muted">{d.contact.lead}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="card-surface p-6 sm:p-8">
            <h2 className="mb-5 text-lg font-semibold text-content">{d.contact.formTitle}</h2>
            <LeadForm variant="contact" locale={l} dict={d} />
          </div>

          <aside className="flex flex-col gap-4">
            <div className="card-surface flex flex-col gap-4 p-6">
              <h2 className="text-lg font-semibold text-content">{d.contact.channelsTitle}</h2>
              {channels.length ? (
                <ul className="flex flex-col gap-4">
                  {channels.map((ch, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-strong">
                        <Icon name={ch.icon} className="h-5 w-5" />
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="text-xs text-content-subtle">{ch.label}</span>
                        {ch.href ? (
                          <a href={ch.href} className="break-words text-sm font-medium text-content hover:text-primary" dir={ch.dir}>
                            {ch.value}
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-content" dir={ch.dir}>{ch.value}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-content-muted">{d.contact.noChannels}</p>
              )}
              {hasAnyContact() ? (
                <p className="border-t border-border-subtle pt-4 text-sm text-content-muted">{d.contact.officeHours}</p>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
