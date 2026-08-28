import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section, Eyebrow, Badge, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getRequests } from "@/content/requests";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return buildMetadata({ locale, path: "/requests", title: d.meta.requestsTitle, description: d.meta.requestsDesc });
}

function range(min: number | null, max: number | null, l: Locale, money: boolean, unit: string): string | null {
  const f = (n: number) => (money ? formatMoney(n, l) : `${new Intl.NumberFormat("en-US").format(n)} ${unit}`);
  if (min != null && max != null) return `${f(min)} – ${f(max)}`;
  if (max != null) return `${l === "ar" ? "حتى" : "up to"} ${f(max)}`;
  if (min != null) return `${l === "ar" ? "من" : "from"} ${f(min)}`;
  return null;
}

export default async function RequestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const base = `/${l}`;
  const requests = await getRequests();
  const count = requests.length;

  return (
    <Section tone="sunken" className="!py-12 sm:!py-16">
      <Container>
        <div className="flex flex-col gap-3">
          <Eyebrow>{d.nav.requests}</Eyebrow>
          <h1 className="text-3xl font-bold text-content sm:text-4xl">{d.requests.title}</h1>
          <p className="max-w-2xl text-base text-content-muted">{d.requests.lead}</p>
        </div>

        <p className="mt-6 text-sm text-content-muted">
          <span className="nums font-semibold text-content">{count}</span>{" "}
          {count === 1 ? d.requests.resultsOne : d.requests.resultsMany}
        </p>

        {count > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((r) => {
              const budget = range(r.budgetMin, r.budgetMax, l, true, "");
              const size = range(r.sizeMin, r.sizeMax, l, false, d.common.sqm);
              return (
                <Link
                  key={r.ref}
                  href={`${base}/requests/${r.ref}`}
                  className="card-surface card-hover flex flex-col gap-3 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={r.purpose === "buy" ? "navy" : "blue"}>{d.purpose[r.purpose]}</Badge>
                    {r.category ? <Badge tone="outline">{d.category[r.category as keyof typeof d.category]}</Badge> : null}
                    {r.type ? <Badge tone="muted">{d.ptype[r.type as keyof typeof d.ptype]}</Badge> : null}
                  </div>
                  <h2 className="text-lg font-semibold text-content">{r.title || d.requests.title}</h2>
                  <p className="text-sm text-content-muted">
                    {[r.area, r.governorate].filter(Boolean).join(" · ") || "—"}
                  </p>
                  <div className="mt-1 flex flex-col gap-1 text-sm">
                    {budget ? (
                      <span className="nums text-content" dir="ltr">
                        {d.requests.budget}: <span className="font-semibold">{budget}</span>
                      </span>
                    ) : null}
                    {size ? (
                      <span className="nums text-content-muted" dir="ltr">
                        {d.requests.size}: {size}
                      </span>
                    ) : null}
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    <span className="nums" dir="ltr">{r.ref}</span>
                    <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border-strong bg-surface p-12 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken text-content-subtle">
              <Icon name="search" />
            </span>
            <p className="text-base font-medium text-content">{d.requests.empty}</p>
            <p className="max-w-md text-sm text-content-muted">{d.requests.emptyHint}</p>
            <Button href={`${base}/list-your-property`}>
              {d.nav.listProperty}
              <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" />
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
