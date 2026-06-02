# Sustain Plus — Unified Project (Merge Notes)

The two former Sustain Plus projects are now **merged into this single Next.js
application** (`SUSTAINPLUS-platform`). This is the source of truth.

## What was merged

| Former project | Repo | Status now |
|----------------|------|-----------|
| Static marketing site (`SUSTAINPLUS/`) — HTML/CSS/JS, EN + `ar/` | `zezo12322/Sustainpluseg` | **Superseded** — rebuilt as Next.js pages here |
| Nested platform copy (`SUSTAINPLUS/platform/`) | — | **Obsolete** — stale May-18 copy of the platform |
| AI consultation platform (`SUSTAINPLUS-platform/`) | `zezo12322/SUSTAINPLUS-platform` | **This repo** — host of everything |

The legacy `SUSTAINPLUS` repo can be archived; all live development happens here.

## Route map

The full bilingual marketing site lives at the root (EN) and under `/ar` (AR).
Every marketing route is statically prerendered.

| Route (EN) | Route (AR) | Purpose |
|------------|-----------|---------|
| `/` | `/ar` | Homepage (ESG/decarbonization design, hero photo) |
| `/about` | `/ar/about` | About — story, 4 pillars, values, team stats, `#clients` |
| `/services` | `/ar/services` | 6 services (ISO-tagged) + 4-step process |
| `/case-studies` | `/ar/case-studies` | Featured + 5 case studies, results band |
| `/insights` | `/ar/insights` | Filterable articles + newsletter signup |
| `/contact` | `/ar/contact` | Contact form (client) + details + FAQ + AI CTA |
| `/platform` | — | AI environmental consultation landing (was `/`), Arabic |
| `/pricing`, `/trust` | — | Platform marketing pages, Arabic |
| `/login`, `/register`, `/dashboard/*`, `/admin/*` | — | The app, Arabic |

`Get Consultation` CTAs across the marketing site point to `/platform`, which
funnels to `/register`. The header language switch (`usePathname`) jumps to the
**same page** in the other language.

## New code

Shared design system (`components/marketing/`):
- `marketing-header.tsx` — transparent→solid scroll header, mobile drawer,
  `<Link>` nav, per-page EN/AR switch via `usePathname`.
- `marketing-footer.tsx` — shared footer.
- `marketing-chrome.tsx` — `MarketingShell({ locale, children })`: the dir/lang/
  font wrapper + header + footer. Every marketing page wraps its content in this.
- `page-banner.tsx` — `PageBanner`: dark-green page hero (industrial photo +
  green directional fade), used as the first child of each subpage.
- `ui.tsx` — primitives: `Eyebrow`, `SectionEyebrow`, `SectionHeading`, `Card`,
  `IconBadge`.
- `marketing-home.tsx` — homepage (hero with photo, ISO badges, 4 pillars, stats
  bar, services + case study, insights, clients, contact CTA).
- `pages/{about,services,case-studies,insights,contact}.tsx` — one self-contained
  bilingual component per subpage (EN+AR content inside, picked by `locale`).

Content & routes:
- `lib/marketing.ts` — bilingual nav / footer / homepage content dictionary.
- `app/page.tsx` + `app/ar/page.tsx` → homepage.
- `app/{about,services,case-studies,insights,contact}/page.tsx` (+ `app/ar/...`)
  → subpages.
- `app/platform/page.tsx` — the relocated AI consultation landing.

The hero/banner photo is `public/images/hero/hero-industry.jpg` (Pexels, free
license — industrial complex amid greenery). Swap it by replacing that file.

## Bilingual approach

There is a single root `<html dir="rtl" lang="ar">` (the app is Arabic-first).
The marketing homepage overrides direction on its own wrapper
(`<div dir="ltr|rtl" lang="en|ar">`), so EN renders LTR and AR renders RTL
without disturbing the Arabic platform. Language toggle = route swap `/ ↔ /ar`.

## Fixes applied during the merge

- `middleware.ts` — added `/ar` and `/platform` to public routes, and a
  static-asset bypass (`*.png|jpg|svg|…`). Previously the middleware redirected
  `/logo-wide.png` to `/login`, which broke the logo (and made `next/image`
  return HTTP 400). Logos now use plain `<img>` for reliability.
- `next.config.ts` — `images.unoptimized: true`.
- Brand logo copied to `public/logo-wide.png` and `public/logo.png`.

## Real company content & detail pages

All marketing copy is grounded in **verified Sustain Plus data** (official site
`sustainplus-eg.com`, LinkedIn `sustain-plus-consultants`, Facebook). Source of
truth: `lib/company.ts` (contact, social, vision/mission/values, stats) plus
per-surface data files. No fabricated clients or figures.

Dynamic detail pages (statically prerendered, EN + AR):
- `lib/services-data.ts` → `/services/[slug]`: environmental-consulting,
  engineering-water-infrastructure, mining-exploration, permits-training.
- `lib/case-studies-data.ts` → `/case-studies/[slug]`: the 6 real projects
  (Oman ranking 145→50, Ras El Hekma desalination, Blue Ethanol, Ethydco EPD,
  ADNOC training, GSK training).
- `lib/insights-data.ts` → `/insights/[slug]`: 6 articles in the firm's real
  domains (ROO desalination, biogas cogeneration, LCA/EPD, EIA in Egypt,
  circular economy/RDF, decarbonization).

Detail components live in `components/marketing/pages/{service,case-study,insight}-detail.tsx`
and use the Next 15 async-`params` pattern + `generateStaticParams`. The About
and Contact pages and the homepage services/stats/case-study/insights were
rewritten from this real data.

## Assets / TODO

- `public/logo-wide.png` is the real brand wordmark.
- Hero, case-study, insight and client images currently use brand-gradient
  placeholders. Drop real photos into `public/images/` and wire them in
  `components/marketing/marketing-home.tsx` when available.
- The static site's About / Services / Projects / Contact pages were **not**
  ported one-to-one; the homepage now covers those as in-page sections
  (`#about`, `#services`, `#case-study`, `#insights`, `#clients`, `#contact`).
  Convert them to dedicated routes later if standalone pages are needed.
