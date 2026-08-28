import Link from "next/link";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/config/site";
import type { Property } from "@/content/properties";
import type { Dict } from "@/i18n/dictionaries";

/** Branded placeholder — used instead of any fabricated property photo. */
export function PropertyMedia({ property, className }: { property: Property; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-900 to-navy-700",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 120 80" className="h-16 w-auto opacity-25" fill="none" stroke="white" strokeWidth="2">
        <rect x="30" y="26" width="18" height="44" />
        <rect x="52" y="14" width="20" height="56" />
        <rect x="76" y="34" width="16" height="36" />
        <path d="M30 70h62" strokeWidth="2.5" />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent,rgba(0,0,0,0.25))]" />
    </div>
  );
}

export function PropertyCard({
  property,
  locale,
  dict,
}: {
  property: Property;
  locale: Locale;
  dict: Dict;
}) {
  const href = `/${locale}/properties/${property.ref}`;
  const specs: string[] = [];
  if (property.bedrooms != null) specs.push(`${property.bedrooms} ${dict.common.bedrooms}`);
  if (property.bathrooms != null) specs.push(`${property.bathrooms} ${dict.common.bathrooms}`);
  if (property.size != null) specs.push(`${property.size} ${dict.common.sqm}`);

  return (
    <Link
      href={href}
      className="card-surface card-hover group flex flex-col overflow-hidden"
      aria-label={property.title[locale]}
    >
      <div className="relative">
        <PropertyMedia property={property} className="aspect-[16/10] w-full" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <Badge tone={property.transaction === "sale" ? "navy" : "blue"}>
            {dict.transaction[property.transaction]}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-content group-hover:text-primary-strong">
            {property.title[locale]}
          </h3>
          <p className="text-sm text-content-muted">
            {property.area[locale]} · {dict.ptype[property.type]}
          </p>
        </div>

        {specs.length ? (
          <p className="text-sm text-content-subtle">{specs.join(" · ")}</p>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="nums text-lg font-semibold text-content" dir="ltr">
            {property.price != null ? (
              <>
                {formatMoney(property.price, locale)}
                {property.transaction === "rent" ? (
                  <span className="text-sm font-normal text-content-subtle">{dict.common.perMonth}</span>
                ) : null}
              </>
            ) : (
              <span className="text-sm font-normal text-content-subtle">{dict.common.onRequest}</span>
            )}
          </span>
          <span className="text-sm font-medium text-primary group-hover:underline">
            {dict.common.viewDetails}
          </span>
        </div>
      </div>
    </Link>
  );
}
