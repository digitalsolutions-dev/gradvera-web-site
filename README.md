# Gradvera — marketing website

Marketing site for **Gradvera**, the AI construction-estimating software by
**DIGITAL SOLUTIONS d.o.o.** (Ljubljana, Slovenia). Trilingual (EN / SL / HR),
static-first, with a single on-demand lead-capture endpoint.

Voice is calm and anti-hype: sentence-case headings, no exclamation marks, and
the product name **Gradvera** is never translated.

---

## Stack

| Layer       | Choice                                                                 |
| ----------- | --------------------------------------------------------------------- |
| Framework   | [Astro 5](https://astro.build) — static output, per-route opt-in SSR  |
| Language    | TypeScript (`astro/tsconfigs/strict`)                                  |
| i18n        | Built-in Astro i18n routing — **EN** at `/`, **SL** at `/sl/`, **HR** at `/hr/` |
| Hosting     | [Vercel](https://vercel.com) via `@astrojs/vercel`                    |
| Fonts       | Self-hosted **IBM Plex** Sans + Mono via `@fontsource/*`               |
| Analytics   | Google Tag Manager (GA4 inside GTM), loaded off-thread with `@astrojs/partytown`, consent-gated |
| Sitemap     | `@astrojs/sitemap` (i18n-aware) → `sitemap-index.xml`                  |

Output is `static` (see `astro.config.mjs`); the Vercel adapter lets individual
routes opt into on-demand rendering with `export const prerender = false`. Only
`/api/lead` does this — every page ships as pre-rendered HTML for SEO and Core
Web Vitals.

---

## Dev commands

```bash
npm install        # install dependencies
npm run dev        # local dev server (http://localhost:4321)
npm run build      # production build to dist/
npm run preview    # preview the production build locally
npm run check      # astro check — type + content validation (run before pushing)
```

---

## Environment

Copy `.env.example` to `.env` and fill it in. Vars prefixed `PUBLIC_` are
exposed to client JS (Astro convention); everything else is server-only and
read inside the `/api/lead` serverless function.

| Var                  | Public | Purpose                                                                 |
| -------------------- | :----: | ----------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`    |   ●    | Canonical origin (no trailing slash). Bakes into canonical URLs, hreflang, OG tags, sitemap and robots. **Confirm the real domain before launch.** |
| `PUBLIC_GTM_ID`      |   ●    | GTM container id (GA4 lives inside GTM). Blank disables analytics entirely. |
| `PUBLIC_GA4_ID`      |   ●    | Optional direct GA4 Measurement id (only if loading GA4 outside GTM).   |
| `GTM_LEAD_ENDPOINT`  |        | gtm-toolkit inbound-lead URL. Blank = `/api/lead` validates + logs only. |
| `GTM_LEAD_SECRET`    |        | Shared secret for HMAC-SHA256 lead signing.                             |
| `LEAD_NOTIFY_EMAIL`  |        | Optional fallback notification address for each lead.                   |

See `.env.example` for the authoritative list and inline notes.

---

## i18n model

- Content lives in flat-keyed JSON dictionaries: `src/i18n/en.json`,
  `src/i18n/sl.json`, `src/i18n/hr.json`. Keys are dot paths (e.g.
  `hero.h1.l1`); values may be strings or arrays/objects.
- English is assembled from per-section parts in `src/i18n/_parts/*.en.json`
  and merged into `src/i18n/en.json`. Author English copy in the `_parts`
  files, not directly in `en.json`.
- Helpers live in `src/i18n/utils.ts`:
  - `useTranslations(lang)` → `t('ns.key')`. `t()` falls back to English, then
    to the raw key, so a missing SL/HR string degrades gracefully.
  - `localizePath(path, lang)` → prefixes a canonical (locale-stripped) path
    for the active locale (`/sl/…`, `/hr/…`, or `/` for EN).
- Routing is configured in `astro.config.mjs` (`prefixDefaultLocale: false`,
  `redirectToDefaultLocale: false`).
- **Translate** only human-readable marketing copy. **Leave** illustrative
  in-product mockup text (sample item names, prices, demo UI chrome, table
  headers inside the `.gv-*/.pp-*/.rk-*/.sc-*/.po-*` panels) inline in English —
  the design intentionally shows mixed-language mockups.

---

## Design-asset provenance

The design-origin stylesheets (`gradvera-tokens.css`, `site.css`,
`cap1-screens.css`, `cap-screens.css`) and `site.js` came **verbatim** from the
Claude Design project. They now live under `src/styles/` and `src/scripts/`
(moved out of `public/assets/` so Astro/Vite bundles, minifies, and fingerprints
them for immutable caching — one hashed `<link>`/`<script>` instead of six raw
files). `site-polish.css` is the local corrections layer, imported **last** so
its overrides win. `public/assets/` keeps only the SVG monograms. The canonical
design markup lives in `.source/*.html` (staged, not served) and the components
reproduce it exactly.

**Fidelity rules** (see `CLAUDE.md`): preserve every class, id, `data-*`,
inline `style=""` and inline `<svg>` exactly. Do not rename, add, drop, or
reorder classes/ids; do not restructure the DOM. The CSS and JS target the
design's exact selectors, so any drift breaks the layout or the interactive
blueprint screens.

One deliberate change from the original export: the Google Fonts hotlink was
**stripped** in favour of self-hosted **IBM Plex** Sans + Mono via
`@fontsource/*` (privacy, performance, no third-party request on first paint).

---

## Analytics & consent

- GTM is loaded only when `PUBLIC_GTM_ID` is set, and runs **off the main
  thread** via Partytown (`forward: ['dataLayer.push', 'gtag']`) to protect
  Core Web Vitals — see `src/components/marketing/Analytics.astro`.
- **Consent Mode v2** defaults everything to `denied` (ads + analytics storage)
  before GTM loads; `functionality_storage` / `security_storage` are granted.
- `src/components/marketing/CookieConsent.astro` renders the consent banner. A
  visitor's choice is stored in a `gv-consent` cookie and replayed on the next
  visit via `gtag('consent', 'update', …)`. The banner links to the localized
  privacy policy.

---

## Lead capture

The demo / contact form (`src/components/forms/DemoForm.astro`) POSTs JSON to
**`POST /api/lead`** (`src/pages/api/lead.ts`, the only on-demand route). The
endpoint:

1. Drops bot submissions via a `company_website` honeypot (silent 200).
2. Validates the required fields (`fullName`, `company`, `email`, `message`).
3. Normalizes the lead and, when `GTM_LEAD_ENDPOINT` is set, forwards it to the
   gtm-toolkit **HMAC-SHA256 signed** (`x-gradvera-signature: sha256=<hex>`).
4. Always returns `200` to the visitor on a valid lead — a downstream outage is
   logged server-side but never breaks the success UX.

When `GTM_LEAD_ENDPOINT` is blank, leads are validated and logged (Vercel
function logs) so the site works before the toolkit endpoint exists. Full
contract and the gtm-toolkit receiver spec: **`docs/lead-integration.md`**.

`robots.txt` is generated from `src/pages/robots.txt.ts` (allows all, disallows
`/api/`, points to the sitemap index).

---

## Project layout

```
.source/             Canonical design HTML (staged, not served)
public/assets/        SVG monograms (static images)
public/og/            Open Graph images (EN + per-locale SL/HR SVG→PNG)
scripts/             render-og.mjs — regenerates the OG PNGs from the SVGs
src/
  styles/            Design-origin CSS (Vite-bundled): tokens, site, cap*, site-polish
  scripts/           site.js — interactions (Vite-bundled)
  components/         Sections, layout, forms, marketing, seo
  i18n/               en/sl/hr.json + _parts/*.en.json + utils.ts
  layouts/            BaseLayout.astro
  pages/
    api/lead.ts       Lead capture endpoint (prerender = false)
    robots.txt.ts     Generated robots.txt
  consts.ts           Brand / company facts, integration ids
docs/
  lead-integration.md Lead contract + gtm-toolkit TODO
```

---

## Before launch

- [ ] **Confirm `PUBLIC_SITE_URL`** is the real production domain (gradvera.com?
      gradvera.si?) — it bakes into canonical URLs, hreflang, OG tags, sitemap
      and robots.
- [ ] **Set `PUBLIC_GTM_ID`** to the production GTM container (and verify GA4 +
      Consent Mode fire correctly through the consent banner).
- [ ] **Wire `GTM_LEAD_ENDPOINT`** (and `GTM_LEAD_SECRET`) to the gtm-toolkit
      inbound-lead receiver — see the "gtm-toolkit TODO" in
      `docs/lead-integration.md`. Until then leads are log-only.
- [ ] **Legal review of the SL / HR privacy copy** (and all translated strings)
      by a native speaker.
- [x] **OG images** — `public/og/gradvera-og{,-sl,-hr}.png` (1200×630; EN
      referenced by `src/consts.ts`, SL/HR wired per locale in `SEO.astro`) are
      generated from the sibling SVGs. Regenerate after brand/tagline changes
      with `node scripts/render-og.mjs` (Playwright Chromium + real IBM Plex).
- [ ] **Make the www → apex redirect permanent** — Vercel currently answers
      `www.gradvera.com` with a **307 (temporary)** redirect to `gradvera.com`
      (verified 2026-07-10). In Vercel → Project → Settings → Domains, set the
      `www` redirect to **permanent (308)** so search engines consolidate the
      canonical host instead of re-checking it.
- [ ] Run `npm run check` and a production `npm run build` clean.
