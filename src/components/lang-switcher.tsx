"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { type Locale, otherLocale } from "@/config/site";

export function LangSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const target = otherLocale(locale);

  const swap = () => {
    const parts = pathname.split("/");
    parts[1] = target; // replace locale segment
    router.push(parts.join("/") || `/${target}`);
  };

  return (
    <button
      type="button"
      onClick={swap}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-content transition-colors hover:border-content-subtle hover:bg-surface-sunken",
        className,
      )}
      aria-label={target === "ar" ? "التبديل إلى العربية" : "Switch to English"}
    >
      {target === "ar" ? "العربية" : "EN"}
    </button>
  );
}
