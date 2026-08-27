# Fawaz Al Othman Real Estate — Website

The official public website for **Fawaz Al Othman Real Estate** (فواز العثمان العقارية),
a Kuwait real-estate company. Bilingual (Arabic-first RTL + English LTR), built to sit in the
same visual family as the PropOS product design system.

- **Domain:** fawazalothmanre.com
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- **Fonts:** Inter (Latin) + IBM Plex Sans Arabic — self-hosted via `next/font`
- **Design system:** derived from PropOS tokens (navy/white, PropOS blue `#1c7cff` accent,
  restrained gold), same type scale, radii and subtle shadows — see `src/app/globals.css`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /ar
npm run build && npm start
```

## Pages

Home · Properties (filterable) · Property detail · Services · List your property (owner form) ·
Buyer requirement (form) · About · Contact. Localised under `/[locale]` (`ar` | `en`).

## Content & configuration

- **Company facts / contact channels:** `src/config/site.ts`. Contact fields left `null` are
  intentionally blank until a **verified** value is provided — the UI only renders channels that
  have a real value, so nothing fabricated is shown. Forms hand off via WhatsApp (if a number is
  set) or email; add the verified WhatsApp number / phone / address here to activate them.
- **Property inventory:** `src/content/properties.ts` — a typed, CMS-ready module. Current entries
  are `sample: true` (illustrative, badged, no fabricated photos). Replace with verified inventory,
  or swap this module for a CMS/DB fetch without touching the components.
- **Copy (AR/EN):** `src/i18n/dictionaries.ts`.

## SEO

Semantic HTML, per-page metadata (AR/EN), canonical + `hreflang` alternates, Open Graph + Twitter,
generated `sitemap.xml` and `robots.txt`, `RealEstateAgent` + `RealEstateListing` JSON-LD, and a
generated OG image (`/opengraph-image`).

## Logo

The official logo (`public/brand/logo.png`) is used **exactly as supplied** — never redrawn,
recoloured or regenerated. On dark surfaces it sits on a white plate so the original artwork reads
correctly without altering the file.

## Deploy

Deploys as a standard Next.js SSR app on **Vercel** (zero-config) or **Netlify** (`netlify.toml`
with `@netlify/plugin-nextjs`). Point `fawazalothmanre.com` (+ `www`, canonically redirected) at the
deployment and enable HTTPS.
