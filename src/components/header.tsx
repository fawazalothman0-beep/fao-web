"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { LangSwitcher } from "@/components/lang-switcher";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Locale } from "@/config/site";
import type { Dict } from "@/i18n/dictionaries";

interface NavItem {
  href: string;
  label: string;
}

export function Header({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const base = `/${locale}`;
  const nav: NavItem[] = [
    { href: `${base}`, label: dict.nav.home },
    { href: `${base}/properties`, label: dict.nav.properties },
    { href: `${base}/services`, label: dict.nav.services },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];
  const isActive = (href: string) =>
    href === base ? pathname === base || pathname === `${base}/` : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
        <Logo locale={locale} priority />

        <nav className="hidden items-center gap-1 lg:flex" aria-label={dict.nav.menu}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(n.href)
                  ? "text-primary-strong"
                  : "text-content-muted hover:text-content hover:bg-surface-sunken",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher locale={locale} className="hidden sm:inline-flex" />
          <Button href={`${base}/list-your-property`} size="md" className="hidden md:inline-flex">
            {dict.nav.listProperty}
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-content lg:hidden"
            aria-label={open ? dict.nav.close : dict.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Burger open={open} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-surface lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-base font-medium",
                  isActive(n.href) ? "bg-surface-sunken text-primary-strong" : "text-content",
                )}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button href={`${base}/list-your-property`} variant="secondary" onClick={() => setOpen(false)}>
                {dict.nav.listProperty}
              </Button>
              <Button href={`${base}/buyer-requirement`} onClick={() => setOpen(false)}>
                {dict.nav.buyerRequest}
              </Button>
            </div>
            <div className="mt-2">
              <LangSwitcher locale={locale} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden>
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-transform",
          open && "top-1/2 -translate-y-1/2 rotate-45",
        )}
      />
      <span
        className={cn(
          "absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded bg-current transition-opacity",
          open && "opacity-0",
        )}
      />
      <span
        className={cn(
          "absolute inset-x-0 bottom-0 h-0.5 rounded bg-current transition-transform",
          open && "bottom-1/2 translate-y-1/2 -rotate-45",
        )}
      />
    </span>
  );
}
