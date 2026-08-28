import { NextRequest, NextResponse } from "next/server";

/**
 * Lead submission endpoint for the owner ("list your property"), buyer requirement,
 * and contact forms. Server-side only — no dependency on the visitor's email client.
 *
 * - Validation (type, name, phone; length + shape checks)
 * - Honeypot field (`company`) + minimum fill-time → silently drop bots
 * - Best-effort in-memory rate limit per IP
 * - Durable persistence to Vercel Blob when configured (BLOB_READ_WRITE_TOKEN),
 *   otherwise a structured server log (documented fallback in README). Leads are
 *   retrievable by the site owner in Vercel → Storage → Blob (folder `leads/`).
 * - No secrets are ever returned to the client.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadType = "owner" | "buyer" | "contact";
const TYPES: LeadType[] = ["owner", "buyer", "contact"];

// Allowed lead fields (everything else is ignored). Values are trimmed + length-capped.
const FIELDS = [
  "name", "phone", "email", "area", "areas", "type", "transaction",
  "price", "budget", "size", "notes", "message",
] as const;

const MAX_LEN = 2000;
const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX_LEN) : "");

// ---- best-effort per-IP rate limit (per warm instance) ----
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // guard against unbounded growth
  return arr.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Honeypot + timing: silently accept (200) so bots don't learn, but drop the lead.
  const honeypot = clean(body.company);
  const startedAt = Number(body._ts) || 0;
  const tooFast = startedAt > 0 && Date.now() - startedAt < 2500;
  if (honeypot || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const type = clean(body.type) as LeadType;
  if (!TYPES.includes(type)) {
    return NextResponse.json({ ok: false, error: "invalid_type" }, { status: 400 });
  }

  const name = clean(body.name);
  const phone = clean(body.phone);
  const message = clean(body.message);

  // Minimal required-field validation per form type.
  const errors: string[] = [];
  if (name.length < 2 || name.length > 80) errors.push("name");
  if (!/^[+()\d\s-]{5,20}$/.test(phone)) errors.push("phone");
  if (type === "contact" && message.length < 2) errors.push("message");
  if (errors.length) {
    return NextResponse.json({ ok: false, error: "validation", fields: errors }, { status: 422 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const lead: Record<string, string> = { type };
  for (const f of FIELDS) {
    const v = clean(body[f]);
    if (v) lead[f] = v;
  }
  const record = {
    ...lead,
    receivedAt: new Date().toISOString(),
    ip,
    userAgent: (req.headers.get("user-agent") || "").slice(0, 300),
  };

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      // Unguessable path (random suffix) so lead PII is not enumerable; retrieve
      // via the authenticated Vercel dashboard (Storage → Blob → leads/).
      const key = `leads/${record.receivedAt.replace(/[:.]/g, "-")}.json`;
      await put(key, JSON.stringify(record, null, 2), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: true,
      });
    } else {
      // Documented fallback: durable-enough structured log (Vercel runtime logs).
      console.info("[lead]", JSON.stringify(record));
    }
  } catch (err) {
    console.error("[lead] persistence failed:", err instanceof Error ? err.message : err);
    // Still return success to the visitor; the submission was received server-side.
  }

  return NextResponse.json({ ok: true });
}
