import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { site, type Locale } from "@/config/site";

/**
 * Official logo — used EXACTLY as supplied (public/brand/logo.png), never
 * redrawn or altered. On dark surfaces it sits on a small white plate so the
 * original artwork reads correctly without modifying the file itself.
 */
export function Logo({
  locale,
  onPlate = false,
  className,
  imgClassName,
  priority = false,
}: {
  locale: Locale;
  onPlate?: boolean;
  className?: string;
  /** Override the rendered logo size (height + w-auto keeps the aspect ratio). */
  imgClassName?: string;
  priority?: boolean;
}) {
  const alt = site.name[locale];
  return (
    <Link
      href={`/${locale}`}
      aria-label={alt}
      className={cn("inline-flex items-center", className)}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center",
          onPlate && "rounded-lg bg-white p-1 shadow-sm",
        )}
      >
        <Image
          src="/brand/logo.png"
          alt={alt}
          width={1125}
          height={992}
          priority={priority}
          className={cn("w-auto", imgClassName ?? "h-11 sm:h-12")}
        />
      </span>
    </Link>
  );
}
