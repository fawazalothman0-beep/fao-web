"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { Locale } from "@/config/site";
import type { Dict } from "@/i18n/dictionaries";
import type { PropertyType, Category } from "@/content/properties";

const TYPES: PropertyType[] = ["villa", "apartment", "floor", "land", "building", "shop", "office", "chalet"];
const CATS: Category[] = ["residential", "commercial", "land", "investment"];

export function PropertyFilters({ locale, dict }: { locale: Locale; dict: Dict }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(sp.toString());
      if (value) p.set(key, value);
      else p.delete(key);
      router.push(`${pathname}${p.toString() ? `?${p}` : ""}`, { scroll: false });
    },
    [router, pathname, sp],
  );

  const control =
    "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-content focus:border-primary focus:outline-2 focus:outline-primary/30";
  const hasFilters = ["transaction", "category", "type", "area", "maxPrice"].some((k) => sp.get(k));

  return (
    <div className="card-surface flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-content">
          <Icon name="search" className="h-4 w-4 text-content-muted" />
          {dict.properties.filters}
        </span>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-sm font-medium text-primary hover:underline"
          >
            {dict.properties.clear}
          </button>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-content-muted">{dict.properties.transaction}</span>
          <select
            className={cn(control, "appearance-none pe-8")}
            value={sp.get("transaction") ?? ""}
            onChange={(e) => setParam("transaction", e.target.value)}
          >
            <option value="">{dict.transaction.all}</option>
            <option value="sale">{dict.transaction.sale}</option>
            <option value="rent">{dict.transaction.rent}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-content-muted">{dict.category.all}</span>
          <select
            className={cn(control, "appearance-none pe-8")}
            value={sp.get("category") ?? ""}
            onChange={(e) => setParam("category", e.target.value)}
          >
            <option value="">{dict.category.all}</option>
            {CATS.map((c) => (
              <option key={c} value={c}>
                {dict.category[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-content-muted">{dict.properties.type}</span>
          <select
            className={cn(control, "appearance-none pe-8")}
            value={sp.get("type") ?? ""}
            onChange={(e) => setParam("type", e.target.value)}
          >
            <option value="">{dict.properties.any}</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {dict.ptype[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-content-muted">{dict.properties.area}</span>
          <input
            className={control}
            defaultValue={sp.get("area") ?? ""}
            placeholder={dict.properties.any}
            onKeyDown={(e) => {
              if (e.key === "Enter") setParam("area", (e.target as HTMLInputElement).value);
            }}
            onBlur={(e) => setParam("area", e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
