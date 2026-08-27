"use client";

import { useState } from "react";
import { Field, Input, Select, Textarea, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { buildLead } from "@/lib/handoff";
import type { Locale } from "@/config/site";
import type { Dict } from "@/i18n/dictionaries";
import type { PropertyType } from "@/content/properties";

const TYPES: PropertyType[] = ["villa", "apartment", "floor", "land", "building", "shop", "office", "chalet"];

type Variant = "owner" | "buyer" | "contact";

function SuccessPanel({
  message,
  href,
  ctaLabel,
}: {
  message: string;
  href?: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-success-soft bg-success-soft/60 p-8 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
        <Icon name="check" className="h-6 w-6" strokeWidth={2.5} />
      </span>
      <p className="max-w-md text-base font-medium text-content">{message}</p>
      {href ? (
        <Button href={href} variant="primary" target="_blank" rel="noopener noreferrer">
          {ctaLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function LeadForm({
  variant,
  locale,
  dict,
}: {
  variant: Variant;
  locale: Locale;
  dict: Dict;
}) {
  const [done, setDone] = useState<{ href?: string; message: string } | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));
  const l = locale;

  const subject =
    variant === "owner"
      ? `${dict.owner.title} — ${dict.nav.listProperty}`
      : variant === "buyer"
        ? `${dict.buyer.title}`
        : `${dict.contact.title} — ${dict.contact.formTitle}`;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields =
      variant === "owner"
        ? [
            { label: dict.owner.name, value: values.name ?? "" },
            { label: dict.owner.phone, value: values.phone ?? "" },
            { label: dict.owner.area, value: values.area ?? "" },
            { label: dict.owner.type, value: values.type ? dict.ptype[values.type as PropertyType] : "" },
            { label: dict.owner.transaction, value: values.transaction ? dict.transaction[values.transaction as "sale" | "rent"] : "" },
            { label: dict.owner.price, value: values.price ?? "" },
            { label: dict.owner.notes, value: values.notes ?? "" },
          ]
        : variant === "buyer"
          ? [
              { label: dict.buyer.name, value: values.name ?? "" },
              { label: dict.buyer.phone, value: values.phone ?? "" },
              { label: dict.buyer.areas, value: values.areas ?? "" },
              { label: dict.buyer.type, value: values.type ? dict.ptype[values.type as PropertyType] : "" },
              { label: dict.buyer.budget, value: values.budget ?? "" },
              { label: dict.buyer.size, value: values.size ?? "" },
              { label: dict.buyer.notes, value: values.notes ?? "" },
            ]
          : [
              { label: dict.contact.name, value: values.name ?? "" },
              { label: dict.contact.phone, value: values.phone ?? "" },
              { label: dict.contact.message, value: values.message ?? "" },
            ];

    const lead = buildLead(subject, fields);
    const successMsg =
      variant === "owner"
        ? lead
          ? dict.owner.success
          : dict.owner.successNoChannel
        : variant === "buyer"
          ? lead
            ? dict.buyer.success
            : dict.buyer.successNoChannel
          : lead
            ? dict.owner.success
            : dict.contact.noChannels;

    if (lead) {
      window.open(lead.href, "_blank", "noopener,noreferrer");
    }
    setDone({ href: lead?.href, message: successMsg });
  };

  if (done) {
    const cta = done.href ? (done.href.startsWith("https://wa.me") ? dict.common.whatsapp : dict.common.email) : "";
    return <SuccessPanel message={done.message} href={done.href} ctaLabel={cta} />;
  }

  const req = dict.common.required;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={variant === "owner" ? dict.owner.name : variant === "buyer" ? dict.buyer.name : dict.contact.name} htmlFor="name" required>
          <Input id="name" name="name" required autoComplete="name" value={values.name ?? ""} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label={variant === "owner" ? dict.owner.phone : variant === "buyer" ? dict.buyer.phone : dict.contact.phone} htmlFor="phone" required>
          <Input id="phone" name="phone" required inputMode="tel" dir="ltr" autoComplete="tel" value={values.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
        </Field>
      </div>

      {variant === "owner" ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={dict.owner.area} htmlFor="area">
              <Input id="area" name="area" value={values.area ?? ""} onChange={(e) => set("area", e.target.value)} />
            </Field>
            <Field label={dict.owner.type} htmlFor="type">
              <Select id="type" name="type" value={values.type ?? ""} onChange={(e) => set("type", e.target.value)}>
                <option value="">{dict.properties.any}</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{dict.ptype[t]}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={dict.owner.transaction} htmlFor="transaction">
              <Select id="transaction" name="transaction" value={values.transaction ?? ""} onChange={(e) => set("transaction", e.target.value)}>
                <option value="">{dict.transaction.all}</option>
                <option value="sale">{dict.transaction.sale}</option>
                <option value="rent">{dict.transaction.rent}</option>
              </Select>
            </Field>
            <Field label={dict.owner.price} htmlFor="price">
              <Input id="price" name="price" inputMode="numeric" dir="ltr" value={values.price ?? ""} onChange={(e) => set("price", e.target.value)} />
            </Field>
          </div>
          <Field label={dict.owner.notes} htmlFor="notes" hint={dict.common.optional}>
            <Textarea id="notes" name="notes" placeholder={dict.owner.notesPlaceholder} value={values.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
          </Field>
        </>
      ) : null}

      {variant === "buyer" ? (
        <>
          <Field label={dict.buyer.areas} htmlFor="areas">
            <Input id="areas" name="areas" placeholder={dict.buyer.areasPlaceholder} value={values.areas ?? ""} onChange={(e) => set("areas", e.target.value)} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label={dict.buyer.type} htmlFor="type">
              <Select id="type" name="type" value={values.type ?? ""} onChange={(e) => set("type", e.target.value)}>
                <option value="">{dict.properties.any}</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{dict.ptype[t]}</option>
                ))}
              </Select>
            </Field>
            <Field label={dict.buyer.budget} htmlFor="budget">
              <Input id="budget" name="budget" inputMode="numeric" dir="ltr" value={values.budget ?? ""} onChange={(e) => set("budget", e.target.value)} />
            </Field>
            <Field label={dict.buyer.size} htmlFor="size">
              <Input id="size" name="size" inputMode="numeric" dir="ltr" value={values.size ?? ""} onChange={(e) => set("size", e.target.value)} />
            </Field>
          </div>
          <Field label={dict.buyer.notes} htmlFor="notes" hint={dict.common.optional}>
            <Textarea id="notes" name="notes" placeholder={dict.buyer.notesPlaceholder} value={values.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
          </Field>
        </>
      ) : null}

      {variant === "contact" ? (
        <Field label={dict.contact.message} htmlFor="message" required>
          <Textarea id="message" name="message" required value={values.message ?? ""} onChange={(e) => set("message", e.target.value)} />
        </Field>
      ) : null}

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" size="lg">
          {variant === "owner" ? dict.owner.submit : variant === "buyer" ? dict.buyer.submit : dict.contact.submit}
          <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" />
        </Button>
        <span className="text-xs text-content-subtle">
          <span className="text-primary">*</span> {req}
        </span>
      </div>
    </form>
  );
}
