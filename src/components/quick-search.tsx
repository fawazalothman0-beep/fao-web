"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { Locale } from "@/config/site";
import type { Dict } from "@/i18n/dictionaries";
import type { Transaction, PropertyType } from "@/content/properties";

const TYPES: PropertyType[] = ["villa", "apartment", "floor", "land", "building", "shop", "office", "chalet"];

export function QuickSearch({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | "">("");
  const [type, setType] = useState<PropertyType | "">("");
  const [area, setArea] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (transaction) p.set("transaction", transaction);
    if (type) p.set("type", type);
    if (area.trim()) p.set("area", area.trim());
    const qs = p.toString();
    router.push(`/${locale}/properties${qs ? `?${qs}` : ""}`);
  };

  const control =
    "h-12 w-full rounded-lg border border-border bg-surface px-3.5 text-base text-content placeholder:text-content-subtle focus:border-primary focus:outline-2 focus:outline-primary/30";

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-2xl border border-border bg-surface p-4 shadow-lg sm:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <select
        aria-label={dict.properties.transaction}
        value={transaction}
        onChange={(e) => setTransaction(e.target.value as Transaction | "")}
        className={cn(control, "appearance-none pe-9")}
      >
        <option value="">{dict.transaction.all}</option>
        <option value="sale">{dict.transaction.sale}</option>
        <option value="rent">{dict.transaction.rent}</option>
      </select>
      <select
        aria-label={dict.properties.type}
        value={type}
        onChange={(e) => setType(e.target.value as PropertyType | "")}
        className={cn(control, "appearance-none pe-9")}
      >
        <option value="">{dict.ptype.villa ? dict.properties.any : ""}</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {dict.ptype[t]}
          </option>
        ))}
      </select>
      <input
        aria-label={dict.properties.area}
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder={dict.properties.area}
        className={control}
      />
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-on-primary transition-colors hover:bg-primary-hover"
      >
        <Icon name="search" className="h-5 w-5" />
        <span className="whitespace-nowrap">{dict.home.searchTitle}</span>
      </button>
    </form>
  );
}
