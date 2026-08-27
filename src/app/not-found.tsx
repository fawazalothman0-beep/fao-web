import Link from "next/link";
import { site } from "@/config/site";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-surface-sunken px-6 text-center">
      <span className="nums text-6xl font-bold text-content-subtle">404</span>
      <div className="flex flex-col gap-1">
        <p className="text-xl font-semibold text-content">الصفحة غير موجودة</p>
        <p className="text-sm text-content-muted">Page not found</p>
      </div>
      <div className="flex gap-3">
        <Link
          href={`/${site.defaultLocale}`}
          className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-on-primary hover:bg-primary-hover"
        >
          العودة إلى الرئيسية
        </Link>
        <Link
          href="/en"
          className="inline-flex h-11 items-center rounded-lg border border-border-strong bg-surface px-5 text-sm font-medium text-content hover:bg-surface-sunken"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
