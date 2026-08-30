import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { OrgJsonLd } from "@/components/org-jsonld";
import { getDict } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);

  return (
    <div className="flex min-h-dvh flex-col">
      <OrgJsonLd locale={locale} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <WhatsAppFab locale={locale} />
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
