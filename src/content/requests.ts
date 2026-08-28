/**
 * Public client-request source — reads ONLY published requests from the FAO
 * internal system (Supabase), the single source of truth. Published requests
 * are sanitized server-side: they carry NO client identity, contact, or private
 * notes. Nothing here is fabricated; an empty inventory shows an empty state.
 */
import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

export type Purpose = "buy" | "rent";

export interface PublicRequest {
  ref: string;
  title: string | null;
  purpose: Purpose;
  category: string | null;
  type: string | null;
  governorate: string | null;
  area: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
  sizeMin: number | null;
  sizeMax: number | null;
  bedroomsMin: number | null;
  requirements: string | null;
  features: string[];
}

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

function mapRow(r: Record<string, unknown>): PublicRequest {
  return {
    ref: r.ref as string,
    title: (r.title as string) ?? null,
    purpose: (r.purpose as Purpose) ?? "buy",
    category: (r.category as string) ?? null,
    type: (r.type as string) ?? null,
    governorate: (r.governorate as string) ?? null,
    area: (r.area as string) ?? null,
    budgetMin: (r.budget_min as number) ?? null,
    budgetMax: (r.budget_max as number) ?? null,
    currency: (r.currency as string) ?? "KWD",
    sizeMin: (r.size_min as number) ?? null,
    sizeMax: (r.size_max as number) ?? null,
    bedroomsMin: (r.bedrooms_min as number) ?? null,
    requirements: (r.requirements as string) ?? null,
    features: (r.features as string[]) ?? [],
  };
}

export const getRequests = cache(async (): Promise<PublicRequest[]> => {
  const { data, error } = await db().rpc("list_published_requests");
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(mapRow);
});

export async function getRequest(ref: string): Promise<PublicRequest | undefined> {
  const { data, error } = await db().rpc("get_published_request", { p_ref: ref });
  if (error || !data) return undefined;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? mapRow(row as Record<string, unknown>) : undefined;
}
