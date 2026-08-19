# Workstream E — Acquisition Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the indexed, English-only acquisition landing page `/construction-estimating-software/` (acquisition model §7.2 — 12 sections; geo "Netherlands" in title/H1/copy only), wired to the qualification form + Bookings embed, with correct SEO plumbing for an EN-only route (hreflang `en` + `x-default`, sitemap, language switcher), structured data, and internal links from the homepage, guides and footer.

**Architecture:** New route `src/pages/construction-estimating-software/index.astro` composing small components under `src/components/landing/` (one per §7.2 section) + `ProductEvidence.astro` (renders nothing until screenshots exist). Copy lives in `src/i18n/_parts/lp.en.json` mirrored into `en.json` (EN only — no SL/HR keys; the three internal-link labels ARE trilingual). EN-only route plumbing: `EN_ONLY_ROUTES` in `src/i18n/slugs.ts` consumed by `alternates()` (utils), the sitemap `serialize()` (astro.config), and `LangSwitch` (links to the locale homepage instead of a 404). `Header`/`BaseLayout` gain `ctaHref`; `DemoForm` gains a `page` prop. JSON-LD: `SoftwareApplication` + `FAQPage` + `BreadcrumbList` via `BaseLayout jsonLd`. e2e `landing.spec.mjs`; unit tests for `alternates()`.

**Tech Stack:** Astro 5 static, TS strict, Vitest (`tests/unit`), Playwright (`tests/e2e`), `astro check` gate, design tokens in `src/styles/gradvera-tokens.css` (reuse `.wrap .eyebrow .h-section .lede .btn .btn-primary .btn-lg .guide-faq` patterns).

**Spec:** `docs/superpowers/specs/2026-08-18-inbound-acquisition-website-design.md` §8 (Workstream E); decisions D1, D6, E1, E3–E7. Acquisition model §6.1 (messages), §6.2 (claims), §7.2 (sections), §3.1 (capabilities), §4.2 (wording of "value requiring pricing review").

## Global Constraints

- **Route:** `/construction-estimating-software/` — EN only, indexed, self-canonical; hreflang exactly `en` + `x-default` (both self); sitemap entry priority `0.9` with only `en` + `x-default` links; never listed under `/sl/` or `/hr/`. Header nav unchanged; LP header CTA → `#book-a-demo`.
- **Geo:** "Netherlands" appears in `<title>`, H1 sub-line/copy — NOT in the URL.
- **Claims policy (§6.2):** no numbers presented as results (no %, no ×, no "measured"), no "free trial", no customer names, no "guaranteed"; use "bid value requiring pricing review" / "value of low-confidence pricing items" (never "loss" or "exposure"); Excel BoQ is the supported input (no PDF/scan claims); screenshots labeled "Sample data"; AI explains how, not why to buy (§6.1). No price numbers (decision E5). Evaluation route: guided demo on sample data → optional NDA preview (≤20 Excel BoQs) → annual agreement + onboarding (~100 BoQs) → 14-day acceptance; "not a free trial".
- **Copy keys:** all LP strings under `lp.*` in `src/i18n/_parts/lp.en.json` AND `src/i18n/en.json` (same values; parts-sync one-liner must pass — it only compares keys present in parts, so EN-only keys are fine). The three trilingual link labels (`footer.explore.lp`, `guide.lpLink`, `helps.lpLink`) go in en/sl/hr (+ `_parts/layout.en.json`, `_parts/guides.en.json`, `_parts/intro.en.json` respectively) at the same line.
- **Form on LP:** `<DemoForm lang="en" page="construction-estimating-software" refId="website-lp" />` — hidden `page` input must carry that value (events + lead `page`), Bookings RefID default `website-lp`.
- **Meta:** title ≤ 60 chars, description ≤ 160 chars. JSON-LD: `SoftwareApplication` (no `offers`/price, no `aggregateRating`), `FAQPage` (from the FAQ items), `BreadcrumbList`. `Organization`/`WebSite` come from `SEO.astro` as on every page.
- **ProductEvidence:** `shots: {src, alt, caption}[]`; empty array → component renders nothing (no placeholder art); every caption prefixed "Sample data · ".
- **Design:** PRODUCT.md restraint; dark ink hero + alternating `--bg1`/`--bg2` sections; single amber accent; IBM Plex; reuse existing utility classes; every section ≤ 1 idea; anchors `#pricing-review`, `#subcontractor-quotes`, `#how-it-works`, `#faq`, `#book-a-demo`. No horizontal overflow at 360/768/1280; WCAG AA contrast (use existing tokens only).
- No `any`; `npm run check` 0 errors; `npm run test:unit` green (18 + new); e2e green. Touch only: `src/i18n/slugs.ts`, `src/i18n/utils.ts`, `astro.config.mjs`, `src/components/layout/{LangSwitch,Header}.astro`, `src/layouts/BaseLayout.astro`, `src/components/forms/DemoForm.astro` (page prop only), `src/components/landing/*` (new), `src/components/pages/HelpsIntro.astro`? → no: `src/components/sections/HelpsIntro.astro`, `src/components/pages/GuideArticle.astro`, `src/components/layout/Footer.astro`, `src/pages/construction-estimating-software/index.astro` (new), `src/i18n/{en,sl,hr}.json` + `_parts/{lp,layout,guides,intro}.en.json`, `tests/unit/i18n.test.ts` (new), `tests/e2e/{landing.spec.mjs (new),claims.spec.mjs,seo.spec.mjs,lang-picker.spec.mjs?,helpers.mjs}`, `tests/e2e/README.md`, `CLAUDE.md`, `graphify-out/*`. Do NOT touch `lead.ts`, `src/lib`, `docs/confirmed-acquisition-model.md` (WS-F).
- Commits: Conventional Commits + Co-Authored-By trailer; branch `feat/ws-e-landing-page` in an isolated worktree from `main` (≥ `f4467b3`).

---

### Task 0: Worktree + baseline (controller)

- [ ] Worktree/branch; `npm ci`; `npm run check` 0 errors; `npm run test:unit` 18; `npm run test:e2e` 123 (record).

---

### Task 1: EN-only route plumbing (slugs, alternates, sitemap, LangSwitch, Header/BaseLayout `ctaHref`, DemoForm `page`)

**Files:**
- Modify: `src/i18n/slugs.ts`, `src/i18n/utils.ts`, `astro.config.mjs`, `src/components/layout/LangSwitch.astro`, `src/components/layout/Header.astro`, `src/layouts/BaseLayout.astro`, `src/components/forms/DemoForm.astro`
- Create: `tests/unit/i18n.test.ts`

**Interfaces:**
- Produces: `EN_ONLY_ROUTES: ReadonlySet<string>` + `isEnOnlyPath(canonicalPath: string): boolean` in `slugs.ts`; `alternates(path)` returns `[{hreflang:'en'},{hreflang:'x-default'}]` for EN-only paths; sitemap links likewise + priority 0.9; `LangSwitch` links to `localizePath('/', lang)` when `isEnOnlyPath(path)`; `Header` prop `ctaHref?: string` (default `localizePath('/book-a-demo/', lang)`), `BaseLayout` prop `ctaHref?: string` passed through; `DemoForm` prop `page?: string` (default `'book-a-demo'`) bound to the hidden input.

- [ ] **Step 1: Failing unit tests** — create `tests/unit/i18n.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { alternates, localizePath } from '@/i18n/utils';
import { EN_ONLY_ROUTES, isEnOnlyPath } from '@/i18n/slugs';

describe('EN-only routes', () => {
  it('declares the landing page as EN-only', () => {
    expect(EN_ONLY_ROUTES.has('construction-estimating-software')).toBe(true);
    expect(isEnOnlyPath('/construction-estimating-software/')).toBe(true);
    expect(isEnOnlyPath('/book-a-demo/')).toBe(false);
    expect(isEnOnlyPath('/')).toBe(false);
  });
  it('alternates() emits only en + x-default for an EN-only path, both self', () => {
    expect(alternates('/construction-estimating-software/')).toEqual([
      { hreflang: 'en', path: '/construction-estimating-software/' },
      { hreflang: 'x-default', path: '/construction-estimating-software/' },
    ]);
  });
  it('alternates() is unchanged for trilingual paths', () => {
    const alts = alternates('/book-a-demo/');
    expect(alts.map((a) => a.hreflang)).toEqual(['en', 'sl', 'hr', 'x-default']);
    expect(alts[1].path).toBe('/sl/rezervirajte-demo/');
  });
  it('localizePath still localizes the EN-only slug verbatim (callers must guard with isEnOnlyPath)', () => {
    expect(localizePath('/construction-estimating-software/', 'sl')).toBe('/sl/construction-estimating-software/');
  });
});
```
Run `npm run test:unit` → fails (`EN_ONLY_ROUTES` not exported).

- [ ] **Step 2: `src/i18n/slugs.ts`** — append:
```ts
/**
 * Canonical first-segments that exist in EN only (no SL/HR page). Consumers:
 * utils.alternates() (hreflang en + x-default only), astro.config sitemap
 * serialize() (same + priority 0.9), LangSwitch (links to the locale home
 * instead of a 404). Add a segment here the moment an EN-only route is created.
 */
export const EN_ONLY_ROUTES: ReadonlySet<string> = new Set(['construction-estimating-software']);

/** True when a canonical (locale-stripped) path's first segment is EN-only. */
export function isEnOnlyPath(canonicalPath: string): boolean {
  const first = canonicalPath.split('/').filter(Boolean)[0];
  return first !== undefined && EN_ONLY_ROUTES.has(first);
}
```
- [ ] **Step 3: `src/i18n/utils.ts`** — import `isEnOnlyPath` from `./slugs` (it already imports `SLUGS`/`REVERSE` — check the import line) and change `alternates()`:
```ts
export function alternates(canonicalPath: string): { hreflang: string; path: string }[] {
  // EN-only routes (slugs.ts EN_ONLY_ROUTES): no SL/HR siblings → only en + x-default, both self.
  if (isEnOnlyPath(canonicalPath)) {
    const self = localizePath(canonicalPath, DEFAULT_LOCALE);
    return [
      { hreflang: LOCALE_META[DEFAULT_LOCALE].htmlLang, path: self },
      { hreflang: 'x-default', path: self },
    ];
  }
  const list = LOCALES.map((lang) => ({ hreflang: LOCALE_META[lang].htmlLang, path: localizePath(canonicalPath, lang) }));
  list.push({ hreflang: 'x-default', path: localizePath(canonicalPath, DEFAULT_LOCALE) });
  return list;
}
```
- [ ] **Step 4: `astro.config.mjs` serialize** — import `EN_ONLY_ROUTES` alongside `SLUGS, REVERSE`; after computing `canonical`/`canonSegs`:
```js
        const enOnly = canonSegs.length > 0 && EN_ONLY_ROUTES.has(canonSegs[0]);
        item.priority = canonical === '/' ? 1.0 : canonical.startsWith('/privacy') ? 0.3 : enOnly ? 0.9 : 0.8;
        ...
        item.links = enOnly
          ? [
              { lang: 'en', url: url.origin + canonical },
              { lang: 'x-default', url: url.origin + canonical },
            ]
          : [ /* existing four */ ];
```
- [ ] **Step 5: `LangSwitch.astro`** — where it builds each locale href from `path` (grep `localizePath(` in the file), use: `const target = isEnOnlyPath(path) ? localizePath('/', l) : localizePath(path, l);` (import `isEnOnlyPath` from `'../../i18n/slugs'`). Keep hreflang attributes on those anchors consistent with the target.
- [ ] **Step 6: `Header.astro`** — `interface Props { lang: Locale; path?: string; ctaHref?: string }`; `const { lang, path, ctaHref } = Astro.props;` and the CTA anchor `href={ctaHref ?? localizePath('/book-a-demo/', lang)}`. `BaseLayout.astro`: add `ctaHref?: string` to Props + destructure + `<Header lang={lang} path={path} ctaHref={ctaHref} />`. Check `MobileNav.astro` for its own Book-a-demo link — if it exists, leave it (it points to `/book-a-demo/`, fine).
- [ ] **Step 7: `DemoForm.astro`** — `interface Props { lang: Locale; path?: string; refId?: string; page?: string }`; `const { lang, refId = \`website-demo-${lang}\`, page = 'book-a-demo' } = Astro.props;`; hidden input `<input type="hidden" name="page" value={page}>`.
- [ ] **Step 8: Gates** — `npm run test:unit` (22 passed), `npm run check` 0 errors, `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/lang-picker.spec.mjs tests/e2e/seo.spec.mjs tests/e2e/localized-slugs.spec.mjs tests/e2e/lead-events.spec.mjs` (all pass — nothing visible changes yet).
- [ ] **Step 9: Commit** `feat(i18n): EN-only route plumbing — EN_ONLY_ROUTES, alternates/sitemap en+x-default, LangSwitch→home; Header/BaseLayout ctaHref; DemoForm page prop` (trailer).

---

### Task 2: Landing copy (`lp.*`), components, route, JSON-LD

**Files:**
- Create: `src/i18n/_parts/lp.en.json`; Modify: `src/i18n/en.json` (append the same keys at the end, before the closing brace — EN only)
- Create: `src/components/landing/LpHero.astro`, `LpWhoFor.astro`, `LpPains.astro`, `LpSteps.astro`, `ProductEvidence.astro`, `LpCapabilities.astro`, `LpTrust.astro`, `LpEvaluation.astro`, `LpCommercial.astro`, `LpFaq.astro`, `LpBook.astro`
- Create: `src/pages/construction-estimating-software/index.astro`
- Create: `tests/e2e/landing.spec.mjs`

**Interfaces:**
- Consumes: `DemoForm` `page`/`refId` props; `BaseLayout` `ctaHref`; `BookingEmbed` (inside DemoForm).
- Produces: route + anchors; `ProductEvidence` props `{ shots: { src: string; alt: string; caption: string }[] }`; `lp.*` keys.

- [ ] **Step 1: Failing e2e** — create `tests/e2e/landing.spec.mjs`:
```js
// Acquisition landing page (acquisition model §7.2): EN-only indexed route,
// hreflang en+x-default only, JSON-LD, anchors, form wired with page/refId,
// no product-evidence placeholder, no horizontal overflow, claims-safe copy.
import { test, expect } from '@playwright/test';
import { gotoClean, VIEWPORTS, fillRequired, armLeadCapture, BOOKING_URL } from './helpers.mjs';

const LP = '/construction-estimating-software/';

test('LP: 200, H1, title/description limits, canonical + hreflang en/x-default only', async ({ page }) => {
  const res = await page.goto(LP, { waitUntil: 'load' });
  expect(res.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText(/construction estimating software/i);
  const title = await page.title();
  expect(title.length).toBeLessThanOrEqual(60);
  expect(title).toMatch(/Netherlands/);
  const desc = await page.getAttribute('meta[name="description"]', 'content');
  expect(desc.length).toBeLessThanOrEqual(160);
  expect(await page.getAttribute('link[rel="canonical"]', 'href')).toBe(`https://gradvera.com${LP}`);
  const alts = await page.$$eval('link[rel="alternate"][hreflang]', (els) => els.map((e) => [e.getAttribute('hreflang'), e.getAttribute('href')]));
  expect(alts).toEqual([['en', `https://gradvera.com${LP}`], ['x-default', `https://gradvera.com${LP}`]]);
  expect(await page.locator('meta[name="robots"][content*="noindex"]').count()).toBe(0);
});

test('LP: JSON-LD carries SoftwareApplication (no offers/ratings), FAQPage, BreadcrumbList', async ({ page }) => {
  await page.goto(LP, { waitUntil: 'load' });
  const blocks = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent || '{}')));
  const types = blocks.map((b) => b['@type']);
  expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList']));
  const app = blocks.find((b) => b['@type'] === 'SoftwareApplication');
  expect(app.name).toBe('Gradvera');
  expect(app.applicationCategory).toBe('BusinessApplication');
  expect(app.offers).toBeUndefined();
  expect(app.aggregateRating).toBeUndefined();
  const faq = blocks.find((b) => b['@type'] === 'FAQPage');
  expect(faq.mainEntity.length).toBeGreaterThanOrEqual(6);
});

test('LP: sections + anchors present, header CTA targets #book-a-demo, no ProductEvidence placeholder', async ({ page }) => {
  await gotoClean(page, LP);
  for (const id of ['pricing-review', 'subcontractor-quotes', 'how-it-works', 'faq', 'book-a-demo']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator('header .nav-cta a.btn-primary')).toHaveAttribute('href', '#book-a-demo');
  await expect(page.locator('.product-evidence')).toHaveCount(0);
  await expect(page.locator('#gv-demo-form input[name="page"]')).toHaveValue('construction-estimating-software');
  await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('href', `${BOOKING_URL}&RefID=website-lp`);
});

test('LP: language switcher links to the locale homepages (no SL/HR LP)', async ({ page }) => {
  await gotoClean(page, LP);
  const hrefs = await page.$$eval('header .nav-cta a[hreflang]', (els) => els.map((e) => [e.getAttribute('hreflang'), e.getAttribute('href')]));
  expect(hrefs).toEqual(expect.arrayContaining([['sl', '/sl/'], ['hr', '/hr/']]));
});

for (const [name, vp] of Object.entries({ mobile: { width: 360, height: 780 }, tablet: { width: 768, height: 1024 }, desktop: VIEWPORTS.desktop })) {
  test(`LP: no horizontal overflow at ${name}`, async ({ page }) => {
    await page.setViewportSize(vp);
    await gotoClean(page, LP);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });
}

test('LP: claims-safe copy (no % / × / free trial / loss wording; Excel + sample data + pricing review present)', async ({ page }) => {
  await gotoClean(page, LP);
  const text = await page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style,noscript').forEach((n) => n.remove()); return (c.textContent || '').replace(/\s+/g, ' '); });
  for (const banned of ['%', '×', 'free trial', 'Free trial', 'expected loss', 'financial exposure', 'guaranteed', 'Measured in Practice']) expect(text, `found "${banned}"`).not.toContain(banned);
  for (const must of ['Excel', 'sample data', 'pricing review', 'Netherlands', 'DIGITAL SOLUTIONS']) expect(text, `missing "${must}"`).toContain(must);
});

test('LP: form submits with page=construction-estimating-software and reveals Bookings with RefID=website-lp', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await gotoClean(page, LP);
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  expect((await cap.body).page).toBe('construction-estimating-software');
  await expect(page.locator('.form-ok iframe.booking-frame')).toHaveAttribute('src', `${BOOKING_URL}&RefID=website-lp`);
});
```
Run → fails (404 / h1 count 0). (The LangSwitch test selector assumes the switcher anchors carry `hreflang` attributes — check `LangSwitch.astro`; if they don't, assert on the anchors inside the switcher by their locale label instead and state it in the report.)

- [ ] **Step 2: Copy — create `src/i18n/_parts/lp.en.json`** (and append the same keys to `en.json` before the final `}`; keep `en.json` valid JSON — the file is a flat object, add a leading comma as needed):
```json
{
  "lp.seo.title": "Construction Estimating Software | Netherlands | Gradvera",
  "lp.seo.desc": "Construction estimating software for Dutch contractors: review pricing confidence and prepare consistent bids from your historical Excel BoQs. Book a demo.",
  "lp.hero.eyebrow": "For construction estimating teams in the Netherlands",
  "lp.hero.h1": "Construction estimating software that uses your historical estimates",
  "lp.hero.sub": "Review pricing confidence, reuse relevant knowledge from past bids, and prepare more consistent construction bids — starting from the Excel bills of quantities you already have.",
  "lp.hero.cta": "Book a demo",
  "lp.hero.cta2": "See the workflow",
  "lp.who.eyebrow": "Who it is for",
  "lp.who.h2": "Teams that bid regularly and keep their history in Excel",
  "lp.who.p": "Contractors and estimating teams in the Netherlands with recurring tender and bid work, historical bills of quantities in Excel, and enough past estimates to build a meaningful knowledge base. Decision-makers: directors, project managers, commercial managers and estimating leads.",
  "lp.who.pts": [
    "Recurring tenders, bids and cost estimates",
    "Historical BoQs stored mainly in Excel",
    "A need for pricing-confidence review, historical-price reuse or subcontractor transparency"
  ],
  "lp.pain1.eyebrow": "Pricing confidence",
  "lp.pain1.h2": "See which bid items still need a pricing review before you submit",
  "lp.pain1.p1": "Every bid contains items priced from thin evidence — a rough unit rate, an old quote, a guess under deadline. Gradvera flags them and shows the total bid value represented by low-confidence pricing items, so the team reviews what matters before the offer leaves the office.",
  "lp.pain1.p2": "“Value requiring pricing review” means the total value of low-confidence items. It is not an estimate of expected loss.",
  "lp.pain2.eyebrow": "Subcontractor quotations",
  "lp.pain2.h2": "One overview of subcontractor requests and quotations",
  "lp.pain2.p1": "Requests go out by email, quotes come back in every format, and the comparison lives in someone's inbox. Gradvera centralizes subcontractor requests and quotations against the bid items they belong to — comparable with each other and with what you paid before.",
  "lp.steps.eyebrow": "How it works",
  "lp.steps.h2": "From Excel BoQ to a reviewed bid in four steps",
  "lp.steps.items": [
    { "h": "Import", "p": "Upload the Excel bill of quantities you received. Excel is the supported input today." },
    { "h": "Structure and match", "p": "Line items are normalized and matched against your historical estimates; the structure and suggested items come from your own past projects." },
    { "h": "Review", "p": "Historical price recommendations with source projects and confidence, plus a review of items whose pricing still needs attention." },
    { "h": "Prepare and manage", "p": "Subcontractor requests, offer-revision comparison, company margins and norms, and management visibility into estimating activity." }
  ],
  "lp.evidence.eyebrow": "Product evidence",
  "lp.evidence.h2": "Real screens from the sample tenant",
  "lp.evidence.note": "All screenshots show sample data, not a customer case.",
  "lp.caps.eyebrow": "Capabilities",
  "lp.caps.h2": "What is operational today",
  "lp.caps.items": [
    "Excel BoQ import",
    "Line-item normalization and matching",
    "Estimate-structure suggestions and suggested line items",
    "Historical price recommendations with source-project and confidence explanations",
    "Price and cost risk review",
    "Subcontractor quote requests and subcontractor portal",
    "Offer-revision comparison",
    "Margins and norms",
    "Management analytics",
    "Multi-user permissions and multilanguage application support"
  ],
  "lp.caps.note": "Supported input: Excel BoQ files. AI helps match, suggest and explain — the estimator decides.",
  "lp.trust.eyebrow": "Data and trust",
  "lp.trust.h2": "Your company's data stays yours",
  "lp.trust.pts": [
    "Tenant isolation: your historical estimates are never shared across companies.",
    "Your data is used only to serve your own recommendations.",
    "GDPR-compliant processing in the EU; see the privacy policy.",
    "An NDA is available before any customer-specific preview."
  ],
  "lp.trust.company": "Gradvera is a product of DIGITAL SOLUTIONS d.o.o., Ljubljana (EU).",
  "lp.eval.eyebrow": "Evaluation process",
  "lp.eval.h2": "A guided route, not a free trial",
  "lp.eval.items": [
    { "h": "Guided demo", "p": "30 minutes on sample data, focused on the part of your workflow that matters most." },
    { "h": "Optional preview", "p": "After qualification and an NDA, an indicative preview on up to 20 of your Excel BoQs — limited data, so lower-confidence recommendations than the full setup." },
    { "h": "Annual onboarding", "p": "With an annual agreement we import roughly 100 historical BoQs to build your knowledge base, followed by a 14-day acceptance period." }
  ],
  "lp.commercial.eyebrow": "Commercial context",
  "lp.commercial.h2": "Annual plans, named users",
  "lp.commercial.p": "Gradvera is licensed per named user on annual plans — a Professional licence for estimating leads and Starter licences for estimators. Onboarding is agreed commercially; pricing is discussed once we know your setup.",
  "lp.faq.eyebrow": "FAQ",
  "lp.faq.h2": "Questions before a demo",
  "lp.faq.items": [
    { "q": "How much historical data do we need?", "a": "About 100 historical BoQ documents give a useful knowledge base; a typical document has more than 100 line items. They do not have to come from one project type. A 20-file preview is possible, but indicative only." },
    { "q": "Which file formats are supported?", "a": "Excel BoQ files. PDF, scanned documents and unrestricted document ingestion are not available today." },
    { "q": "Is there a free trial?", "a": "No. The product's value depends on your historical data and onboarding, so an empty account would misrepresent it. The route is a guided demo, an optional NDA-covered preview, then annual onboarding with a 14-day acceptance period." },
    { "q": "How long does onboarding take?", "a": "Import is largely automated; validation and correction take up to about ten minutes per BoQ. The team receives setup guidance during onboarding." },
    { "q": "How is our data protected?", "a": "Each company runs in its own tenant; data is never shared across companies and is processed in the EU under the GDPR. An NDA is available before any preview." },
    { "q": "Which languages does the application support?", "a": "The application is multilanguage. Sales and onboarding are currently conducted in English." }
  ],
  "lp.book.eyebrow": "Book a demo",
  "lp.book.h2": "See the workflow on sample data",
  "lp.book.p": "Send the form, then pick a time straight away. 30 minutes, no obligation, nothing to prepare.",
  "lp.breadcrumb": "Construction estimating software"
}
```
Validate both files; run the parts-sync one-liner (it must print `parts in sync`).

- [ ] **Step 3: Components** (all `interface Props { lang: Locale }` unless noted; `const t = useTranslations(lang)`; `<style is:global>` blocks scoped by a unique class; reuse `.wrap`, `.eyebrow`, `.h-section`, `.lede`, `.btn`):

`LpHero.astro` — `<section class="lp-hero"><div class="wrap"><p class="eyebrow">{t('lp.hero.eyebrow')}</p><h1>{t('lp.hero.h1')}</h1><p class="lede lp-hero-sub">{t('lp.hero.sub')}</p><div class="lp-hero-ctas"><a class="btn btn-primary btn-lg" href="#book-a-demo">{t('lp.hero.cta')} <span class="arr" aria-hidden="true">→</span></a><a class="btn btn-ghost-ink btn-lg" href="#how-it-works">{t('lp.hero.cta2')}</a></div></div></section>`; CSS: `.lp-hero{background:var(--ink);color:var(--on-ink);padding:calc(74px + clamp(56px,9vh,110px)) 0 clamp(56px,8vh,96px)} .lp-hero h1{font-weight:600;font-size:clamp(32px,4.6vw,58px);line-height:1.04;letter-spacing:-.022em;max-width:900px;margin:16px 0 0} .lp-hero .lp-hero-sub{color:var(--on-ink-2);max-width:720px;margin-top:22px} .lp-hero-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}`.

`LpWhoFor.astro` — `<section class="lp-who"><div class="wrap"><p class="eyebrow">…</p><h2 class="h-section">…</h2><p class="lede">{t('lp.who.p')}</p><ul class="lp-pts">{pts.map(s => <li>{s}</li>)}</ul></div></section>`; CSS `.lp-who{background:var(--bg1);padding:var(--sec) 0} .lp-pts{margin:22px 0 0;padding-left:1.2em;color:var(--fg2);max-width:720px;line-height:1.6}`.

`LpPains.astro` — two `<section>`s: `id="pricing-review" class="lp-pain"` (bg2) with eyebrow/h2/p1 and `<p class="lp-note">{t('lp.pain1.p2')}</p>`; `id="subcontractor-quotes" class="lp-pain"` (bg1) with eyebrow/h2/p1. CSS `.lp-pain{padding:var(--sec) 0} .lp-pain.alt{background:var(--bg2)} .lp-pain .lede{max-width:760px;margin-top:18px} .lp-note{margin-top:14px;font-size:14px;color:var(--fg3, var(--fg2));max-width:720px}`.

`LpSteps.astro` — `<section id="how-it-works" class="lp-steps">` eyebrow/h2 + `<ol class="lp-steps-list">{items.map((it,i) => <li><span class="lp-step-n" aria-hidden="true">{i+1}</span><div><h3>{it.h}</h3><p>{it.p}</p></div></li>)}</ol>`; CSS grid 4 cols → 2 → 1 (`@media (max-width:900px)` 2 cols, `560px` 1 col), numbered amber badges (copy `.demo .step-n` look: 26px circle, `rgba(232,144,28,0.14)`, amber mono digit).

`ProductEvidence.astro` — `interface Props { lang: Locale; shots: { src: string; alt: string; caption: string }[] }`; `if (shots.length === 0) return;` pattern: render conditionally (`{shots.length > 0 && (<section class="product-evidence">…</section>)}`); eyebrow/h2/note; `<ul class="pe-grid">{shots.map(s => <li><figure><img src={s.src} alt={s.alt} loading="lazy" width="1200" height="750" /><figcaption>Sample data · {s.caption}</figcaption></figure></li>)}</ul>`; CSS 2-col grid, `img{width:100%;height:auto;border:1px solid var(--border2);border-radius:12px}`.

`LpCapabilities.astro` — `<section class="lp-caps">` eyebrow/h2 + `<ul class="lp-caps-grid">` (2–3 cols, check-icon li like `DemoIntro .pts`) + `<p class="lp-note">{t('lp.caps.note')}</p>`.

`LpTrust.astro` — `<section class="lp-trust">` (ink background like cta1 without the glow): eyebrow/h2 + `<ul class="lp-trust-pts">` + `<p class="lp-trust-company">{t('lp.trust.company')}</p>` with a link to `/privacy-policy/` on "privacy policy"? keep plain; add `<a class="lp-link" href={localizePath('/privacy-policy/', lang)}>Privacy policy →</a>`.

`LpEvaluation.astro` — `<section class="lp-eval">` eyebrow/h2 + `<ol class="lp-eval-steps">` 3 items like LpSteps (reuse the same CSS classes `lp-steps-list`/`lp-step-n` by rendering the same markup — to avoid duplication, implement one shared component `LpNumberedList.astro` with `items: {h:string;p:string}[]` used by both LpSteps and LpEvaluation; LpSteps/LpEvaluation then only wrap it with section/eyebrow/h2).

`LpCommercial.astro` — `<section class="lp-commercial">` eyebrow/h2/p (short; bg2).

`LpFaq.astro` — `<section id="faq" class="lp-faq guide-faq">` eyebrow/h2 + `{items.map(it => <details><summary>{it.q}<span class="arr" aria-hidden="true">+</span></summary><p>{it.a}</p></details>)}` — reuse the `.guide-faq` styles (they are `is:global` in `GuideArticle.astro` and therefore only present on guide pages → COPY the 6 `.guide-faq` rules from `GuideArticle.astro:107-115` into `LpFaq.astro`'s style block under the class `.lp-faq` so the LP does not depend on GuideArticle being on the page).

`LpBook.astro` — `<section id="book-a-demo" class="demo standalone lp-book"><div class="wrap"><div class="demo-grid"><div class="demo-intro"><p class="eyebrow">…</p><h2>…</h2><p>{t('lp.book.p')}</p></div><div><DemoForm lang={lang} page="construction-estimating-software" refId="website-lp" /></div></div></div></section>`; CSS: `.lp-book{min-height:auto;padding:var(--sec) 0}` (overrides `.demo.standalone`'s `min-height:100vh; padding-top:120px`).

- [ ] **Step 4: Route `src/pages/construction-estimating-software/index.astro`**:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { useTranslations, absoluteUrl, type Locale } from '../../i18n/utils';
import { COMPANY } from '../../consts';
import LpHero from '../../components/landing/LpHero.astro';
import LpWhoFor from '../../components/landing/LpWhoFor.astro';
import LpPains from '../../components/landing/LpPains.astro';
import LpSteps from '../../components/landing/LpSteps.astro';
import ProductEvidence from '../../components/landing/ProductEvidence.astro';
import LpCapabilities from '../../components/landing/LpCapabilities.astro';
import LpTrust from '../../components/landing/LpTrust.astro';
import LpEvaluation from '../../components/landing/LpEvaluation.astro';
import LpCommercial from '../../components/landing/LpCommercial.astro';
import LpFaq from '../../components/landing/LpFaq.astro';
import LpBook from '../../components/landing/LpBook.astro';

const lang: Locale = 'en';
const t = useTranslations(lang);
const site = Astro.site;
const PATH = '/construction-estimating-software/';
const url = absoluteUrl(PATH, site);

/** Screenshots from the stable sample tenant (acquisition model §7.1.8). Empty until the PNGs land — the section renders nothing. */
const SHOTS: { src: string; alt: string; caption: string }[] = [];

const faq: { q: string; a: string }[] = t('lp.faq.items');
const softwareLd = {
  '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: COMPANY.brand, url,
  applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
  description: t('lp.seo.desc'), inLanguage: 'en',
  provider: { '@type': 'Organization', name: COMPANY.legalName, url: absoluteUrl('/', site) },
  featureList: (t('lp.caps.items') as string[]).join(', '),
};
const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
const breadcrumbLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: t('nav.home'), item: absoluteUrl('/', site) },
  { '@type': 'ListItem', position: 2, name: t('lp.breadcrumb'), item: url },
] };
---
<BaseLayout lang={lang} path={PATH} title={t('lp.seo.title')} description={t('lp.seo.desc')} ctaHref="#book-a-demo" jsonLd={[softwareLd, faqLd, breadcrumbLd]}>
  <LpHero lang={lang} />
  <LpWhoFor lang={lang} />
  <LpPains lang={lang} />
  <LpSteps lang={lang} />
  <ProductEvidence lang={lang} shots={SHOTS} />
  <LpCapabilities lang={lang} />
  <LpTrust lang={lang} />
  <LpEvaluation lang={lang} />
  <LpCommercial lang={lang} />
  <LpFaq lang={lang} />
  <LpBook lang={lang} />
</BaseLayout>
```
(`t()` returns `any` by design in this repo (`utils.ts:59`); keep the explicit type annotations on arrays as above so `astro check` stays strict-clean.)

- [ ] **Step 5: Gates** — `npm run check` 0 errors; `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/landing.spec.mjs tests/e2e/seo.spec.mjs tests/e2e/homepage.spec.mjs tests/e2e/lead-events.spec.mjs` → pass; title length ≤60 (the given title is 57), description ≤160 (given 155 — verify with `node -e`).
- [ ] **Step 6: Commit** `feat(lp): acquisition landing page /construction-estimating-software/ — 12 sections, EN copy, SoftwareApplication/FAQPage/Breadcrumb JSON-LD, form page/refId` (trailer).

---

### Task 3: Internal links (footer, guides, homepage) + claims spec + sitemap assertion

**Files:**
- Modify: `src/components/layout/Footer.astro`, `src/components/pages/GuideArticle.astro`, `src/components/sections/HelpsIntro.astro`
- Modify: `src/i18n/{en,sl,hr}.json`, `src/i18n/_parts/{layout,guides,intro}.en.json`
- Modify: `tests/e2e/claims.spec.mjs` (LP to the banned-claims loop), `tests/e2e/seo.spec.mjs` (sitemap LP entry), `tests/e2e/landing.spec.mjs` (links present)

- [ ] **Step 1: Failing tests** — append to `tests/e2e/landing.spec.mjs`:
```js
test('internal links: footer (3 locales), guides related block, homepage HelpsIntro point at the LP', async ({ page }) => {
  for (const home of ['/', '/sl/', '/hr/']) {
    await gotoClean(page, home);
    await expect(page.locator(`footer a[href="${LP}"]`)).toHaveCount(1);
  }
  await gotoClean(page, '/');
  await expect(page.locator(`#helps a[href="${LP}"]`)).toHaveCount(1);
  for (const guide of ['/construction-bid-estimate/', '/sl/gradbeni-izracun/', '/hr/gradevinski-troskovnik/']) {
    await gotoClean(page, guide);
    await expect(page.locator(`.guide-related a[href="${LP}"]`)).toHaveCount(1);
  }
});
```
Append to `tests/e2e/seo.spec.mjs` (inside or after the existing Sitemap describe):
```js
test('sitemap lists the EN-only landing page with priority 0.9 and only en + x-default alternates', async ({ request }) => {
  const xml = await (await request.get('/sitemap-0.xml')).text();
  const entry = xml.split('<url>').find((u) => u.includes('/construction-estimating-software/</loc>'));
  expect(entry).toBeTruthy();
  expect(entry).toContain('<priority>0.9</priority>');
  expect(entry).toContain('hreflang="en"');
  expect(entry).toContain('hreflang="x-default"');
  expect(entry).not.toContain('hreflang="sl"');
  expect(entry).not.toContain('/sl/construction-estimating-software/');
});
```
In `tests/e2e/claims.spec.mjs`, add `'/construction-estimating-software/'` to `HOME` (the "no measured results" loop) — the LP must carry none of the banned numerals/phrases.
Run → fail (links absent; sitemap entry present but alternates wrong only if Task 1 missed — it shouldn't).

- [ ] **Step 2: i18n (3 locales + parts; insert at the same line in en/sl/hr):**
- after `footer.explore.bookDemo` → `footer.explore.lp`: EN `"Construction estimating software"` (+ `_parts/layout.en.json`), SL `"Programska oprema za gradbene kalkulacije (EN)"`, HR `"Softver za građevinske troškovnike (EN)"`.
- after `guide.related` (find it) → `guide.lpLink`: EN `"See the software: construction estimating software for contractors"` (+ `_parts/guides.en.json`), SL `"Oglejte si programsko opremo (v angleščini)"`, HR `"Pogledajte softver (na engleskom)"`.
- after `helps.lede` → `helps.lpLink`: EN `"How the software works, step by step"` (+ `_parts/intro.en.json`), SL `"Kako deluje programska oprema, korak za korakom (EN)"`, HR `"Kako softver radi, korak po korak (EN)"`.
- [ ] **Step 3: Markup** — Footer: add `<li><a href="/construction-estimating-software/">{t('footer.explore.lp')}</a></li>` after the bookDemo li (literal EN path — no `localizePath`). GuideArticle: in the `.guide-related` nav, after the sibling link add `<a class="guide-related-lp" href="/construction-estimating-software/" hreflang="en">{t('guide.lpLink')} <span class="arr" aria-hidden="true">→</span></a>` (render the nav even when `related` is null? `related` is always set for est/bid; keep inside the existing `{related && …}` block). HelpsIntro: after the lede `<p>` add `<p class="helps-lplink"><a href="/construction-estimating-software/" hreflang="en">{t('helps.lpLink')} <span class="arr" aria-hidden="true">→</span></a></p>` with a small style (mono uppercase 12.5px like `.consent-link`).
- [ ] **Step 4: Gates** — parts-sync; `npm run check`; `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/landing.spec.mjs tests/e2e/seo.spec.mjs tests/e2e/claims.spec.mjs tests/e2e/content-pages.spec.mjs tests/e2e/homepage.spec.mjs tests/e2e/i18n-parity.spec.mjs` → pass (i18n-parity checks every `t()` key exists in all three dictionaries — the `lp.*` keys are used only on the EN page; if that spec walks components globally and flags `lp.*` as missing in SL/HR, exempt the `lp.` prefix in that spec with a one-line comment explaining EN-only routes, and report it).
- [ ] **Step 5: Commit** `feat(lp): internal links to the landing page (footer ×3, guides related block, homepage HelpsIntro); claims + sitemap assertions` (trailer).

---

### Task 4: Docs, graphify, PR (controller)

- [ ] `CLAUDE.md`: Layout — add the route to the `src/pages/` bullet ("plus the EN-only acquisition landing page `construction-estimating-software/` — see `src/i18n/slugs.ts` `EN_ONLY_ROUTES`"), add `landing/` to the components list, `_parts/lp.en.json` note (EN-only part). `tests/e2e/README.md`: `landing.spec.mjs` row; `tests/unit/README.md`: mention `i18n.test.ts`.
- [ ] Gates (controller): check, unit, e2e, parts-sync; `grep -n "construction-estimating-software" dist/client/sitemap-0.xml`.
- [ ] `/graphify --update`; `users_katarov` = 0.
- [ ] Commit docs+graph; push; PR `feat(lp): acquisition landing page /construction-estimating-software/ (workstream E)` with: summary, SEO notes (indexed, hreflang en/x-default, sitemap 0.9, JSON-LD), screenshots TODO (drop PNGs into `public/lp/` + fill `SHOTS`), SL/HR check list (3 link labels), test evidence. Merge-commit after CI + SL check; staging sync; GSC: request indexing for the LP (user).
