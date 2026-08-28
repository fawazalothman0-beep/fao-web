"use client";

import { useRef, useState } from "react";
import { Field, Input, Select, Textarea, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import type { Locale } from "@/config/site";
import type { Dict } from "@/i18n/dictionaries";
import type { PropertyType } from "@/content/properties";

const TYPES: PropertyType[] = ["villa", "apartment", "floor", "land", "building", "shop", "office", "chalet"];

type Variant = "owner" | "buyer" | "contact";

function SuccessPanel({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-success-soft bg-success-soft/60 p-8 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
        <Icon name="check" className="h-6 w-6" strokeWidth={2.5} />
      </span>
      <p className="max-w-md text-base font-medium text-content">{message}</p>
    </div>
  );
}

export function LeadForm({
  variant,
  locale,
  dict,
  reference,
}: {
  variant: Variant;
  locale: Locale;
  dict: Dict;
  reference?: string; // optional property/request reference this lead is about
}) {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const startedAt = useRef<number>(Date.now());
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));
  const l = locale;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        type: variant,
        source: `website:${variant}`,
        locale: l,
        ...(reference ? { reference } : {}),
        _ts: startedAt.current,
      };
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError(
          l === "ar"
            ? "تعذّر إرسال النموذج. يرجى المحاولة مرة أخرى."
            : "We couldn't submit the form. Please try again.",
        );
      }
    } catch {
      setError(
        l === "ar"
          ? "تعذّر الاتصال. تحقّق من الشبكة وحاول مرة أخرى."
          : "Connection failed. Check your network and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    const msg =
      variant === "owner" ? dict.owner.success : variant === "buyer" ? dict.buyer.success : dict.contact.success;
    return <SuccessPanel message={msg} />;
  }

  const req = dict.common.required;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot — hidden from humans; bots that fill it are silently dropped server-side. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          autoComplete="off"
          tabIndex={-1}
          value={values.company ?? ""}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>

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

      {error ? (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-2.5 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" size="lg" className={submitting ? "pointer-events-none opacity-70" : undefined}>
          {submitting
            ? dict.common.sending
            : variant === "owner"
              ? dict.owner.submit
              : variant === "buyer"
                ? dict.buyer.submit
                : dict.contact.submit}
          {!submitting ? <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" /> : null}
        </Button>
        <span className="text-xs text-content-subtle">
          <span className="text-primary">*</span> {req}
        </span>
      </div>
    </form>
  );
}
