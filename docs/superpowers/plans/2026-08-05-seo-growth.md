# SEO Growth (GA4 lead event · localized slugs · content pages) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship three sequential PRs: (1) `generate_lead` dataLayer event on demo-form success, (2) localized SL/HR URL slugs with 308 redirects, (3) two keyword-cluster content pages in all three locales.

**Architecture:** All routing stays file-based Astro static. A new slug map (`src/i18n/slugs.ts`) becomes the single source of truth for per-locale URL segments, consumed by `localizePath`/`stripLocale` (on-page links + hreflang), by `astro.config.mjs` (sitemap alternates, priorities, 308 redirects). Content pages are thin page shells + one shared `GuideArticle` component fed from i18n dictionaries, exactly like existing pages.

**Tech Stack:** Astro 5 static + @astrojs/vercel, @astrojs/sitemap, flat-key JSON i18n, Playwright e2e (`npm run test:e2e`), `npm run check` gate.

## Global Constraints

- Gate battery = `npm run check` (0 errors) + `npm run test:e2e` (all pass). Both run green before every PR.
- Branch flow: short-lived `feat/*` branches → PR → CI green → merge `main` (per CLAUDE.md). Never commit to `main`.
- Marketing copy lives in `src/i18n/*.json`, never in `src/consts.ts` or hardcoded in components.
- Copy tone (PRODUCT.md): calm · precise · anti-hype; "show the work, don't claim it"; one conversion path (book a demo). WCAG 2.1 AA.
- `tests/` is excluded from tsconfig — e2e files are `.mjs`, never imported by src.
- Each PR folds in `/graphify --update` when it adds/moves routes, components, or docs (CLAUDE.md).
- SL/HR orthography: non-breaking space before `%`; decimal comma; currency symbol before number.
- Slugs (user-confirmed 2026-08-05): book-a-demo → sl+hr `rezervirajte-demo`; privacy-policy → sl `politika-zasebnosti`, hr `pravila-privatnosti`; content pages sl `gradbene-kalkulacije` / hr `gradevinske-kalkulacije` and sl `gradbeni-predracun` / hr `gradevinski-troskovnik`. ASCII-only slugs, no diacritics.
- GA4 is wired inside GTM (user confirmed a live GA4 config tag). Repo emits dataLayer events only; GTM tag setup is documented, not automated.

---

## PR 1 — `feat/lead-event-ga4`

### Task 1: `generate_lead` dataLayer push + e2e + doc

**Files:**
- Modify: `src/components/forms/DemoForm.astro` (success handler in the inline script, ~line 242)
- Test: `tests/e2e/lead-tracking.spec.mjs` (new)
- Create: `docs/lead-tracking-ga4.md`
- Modify: `docs/lead-integration.md` (one cross-reference line; verify file exists first — if absent, skip and note in report)

**Interfaces:**
- Produces: dataLayer event `{ event: 'generate_lead', form_id: 'gv-demo-form', locale: <'en'|'sl'|'hr'>, page: 'book-a-demo' }` pushed exactly once per successful `/api/lead` POST. PR 3's pages reuse nothing from this task.

- [ ] **Step 1: Write the failing e2e test**

`tests/e2e/lead-tracking.spec.mjs`:

```js
// GA4 lead conversion: a successful /api/lead POST must push a generate_lead
// event to window.dataLayer (GTM forwards it to GA4). The API is intercepted —
// the static preview server has no live endpoint.
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

const PAGES = [
  { path: '/book-a-demo/', locale: 'en' },
  { path: '/sl/book-a-demo/', locale: 'sl' },
];

for (const { path, locale } of PAGES) {
  test(`${path} pushes generate_lead on successful submit`, async ({ page }) => {
    await page.route('**/api/lead', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    );
    await gotoClean(page, path);
    await page.fill('#fn', 'Test Person');
    await page.fill('#co', 'Test Co');
    await page.fill('#em', 'test@example.com');
    await page.fill('#ms', 'Hello');
    await page.click('#gv-demo-form button[type="submit"]');
    await expect(page.locator('.form-ok')).toBeVisible();
    const events = await page.evaluate(() =>
      (window.dataLayer || []).filter((e) => e && e.event === 'generate_lead'),
    );
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      event: 'generate_lead',
      form_id: 'gv-demo-form',
      locale,
      page: 'book-a-demo',
    });
  });
}

test('failed submit pushes no generate_lead', async ({ page }) => {
  await page.route('**/api/lead', (route) => route.fulfill({ status: 500, body: '' }));
  await gotoClean(page, '/book-a-demo/');
  await page.fill('#fn', 'Test Person');
  await page.fill('#co', 'Test Co');
  await page.fill('#em', 'test@example.com');
  await page.fill('#ms', 'Hello');
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-net-err')).toBeVisible();
  const events = await page.evaluate(() =>
    (window.dataLayer || []).filter((e) => e && e.event === 'generate_lead'),
  );
  expect(events).toHaveLength(0);
});
```

Check `helpers.mjs` first: if `gotoClean` signature differs (extra args), adapt the calls, not the helper.

- [ ] **Step 2: Run it, verify it fails**

Run: `npm run test:e2e -- lead-tracking`
Expected: FAIL — `expect(events).toHaveLength(1)` receives 0 (no push exists yet). Build must succeed.

- [ ] **Step 3: Implement the push in DemoForm.astro**

In the inline script's fetch `.then` success branch (currently `form.style.display = 'none'; if (ok) {...}`), add before hiding the form:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'generate_lead',
  form_id: 'gv-demo-form',
  locale: data.locale || '',
  page: data.page || '',
});
```

`data` is the already-harvested field object (contains hidden inputs `locale` and `page`). The `window.dataLayer = window.dataLayer || []` guard matters: with `PUBLIC_GTM_ID` unset (local/CI builds) Analytics.astro renders nothing and dataLayer is undefined.

- [ ] **Step 4: Run the spec, verify it passes**

Run: `npm run test:e2e -- lead-tracking`
Expected: 3 passed.

- [ ] **Step 5: Write `docs/lead-tracking-ga4.md`**

```markdown
# Lead conversion tracking (GA4 via GTM)

On a successful `/api/lead` POST, `DemoForm.astro` pushes to `window.dataLayer`:

​```js
{ event: 'generate_lead', form_id: 'gv-demo-form', locale: 'en'|'sl'|'hr', page: 'book-a-demo' }
​```

The push happens client-side only after the API returns 2xx (the honeypot and
validation paths never fire it). With `PUBLIC_GTM_ID` unset the push still
happens (inert — nothing consumes it).

## GTM container setup (one-time, dashboard)

1. **Trigger** — Triggers → New → *Custom Event*, event name `generate_lead`.
   Name: `CE — generate_lead`.
2. **Tag** — Tags → New → *Google Analytics: GA4 Event*. Measurement ID: reuse
   the existing GA4 config tag's ID. Event name: `generate_lead`. Event
   parameters: `locale` → `{{DLV - locale}}`, `form_id` → `{{DLV - form_id}}`,
   `page` → `{{DLV - page}}` (create the three Data Layer Variables).
   Trigger: `CE — generate_lead`. Consent: default settings (Consent Mode v2
   gates it automatically).
3. **Key event** — GA4 Admin → Events → mark `generate_lead` as *key event*.
4. Publish the container. Verify in GTM Preview: submit the staging demo form,
   confirm the tag fires and the event lands in GA4 DebugView.

Note: consent-denied visitors send cookieless pings under Consent Mode v2;
counts in GA4 are modeled/partial by design.
```

(Strip the zero-width escapes around the inner code fence when writing the real file.)

- [ ] **Step 6: Cross-reference from `docs/lead-integration.md`**

If the file exists, add at the end of its intro section: `Client-side conversion tracking for this form is documented in [lead-tracking-ga4.md](lead-tracking-ga4.md).`

- [ ] **Step 7: Graphify update**

Run: `/graphify --update` (new doc node). Then per memory `graphify-absolute-id-quirk`: `grep -rn "users_katarov" graphify-out/graph.json` — canonicalize any absolute-path ids before committing.

- [ ] **Step 8: Full gates + commit**

Run: `npm run check` (expect 0 errors) and `npm run test:e2e` (expect all pass, 69 total).

```bash
git add -A
git commit -m "feat(analytics): push generate_lead to dataLayer on demo-form success"
```

---

## PR 2 — `feat/localized-slugs`

### Task 2: Slug map + localized routing helpers

**Files:**
- Create: `src/i18n/slugs.ts`
- Modify: `src/i18n/utils.ts` (`localizePath`, `stripLocale`)
- Test: `tests/e2e/localized-slugs.spec.mjs` (new)

**Interfaces:**
- Produces: `SLUGS: Record<string, { sl: string; hr: string }>` keyed by canonical (EN) path segment; `REVERSE: { sl: Record<string,string>, hr: Record<string,string> }` mapping localized segment → canonical. `localizePath('/book-a-demo/', 'sl')` → `/sl/rezervirajte-demo/`; `stripLocale('/sl/rezervirajte-demo/')` → `/book-a-demo/`. Task 3 (config) and Task 4 (page dirs) consume both.

- [ ] **Step 1: Create `src/i18n/slugs.ts`**

```ts
/**
 * Per-locale URL slugs for canonical (EN) route segments. Single source of
 * truth consumed by i18n/utils.ts (links, hreflang) AND astro.config.mjs
 * (sitemap alternates, priorities, 308 redirects). ASCII only — no diacritics
 * in URLs. A segment absent here keeps its canonical form in every locale.
 */
export const SLUGS: Record<string, { sl: string; hr: string }> = {
  'book-a-demo': { sl: 'rezervirajte-demo', hr: 'rezervirajte-demo' },
  'privacy-policy': { sl: 'politika-zasebnosti', hr: 'pravila-privatnosti' },
};

/** localized segment → canonical segment, per locale. */
export const REVERSE: Record<'sl' | 'hr', Record<string, string>> = { sl: {}, hr: {} };
for (const [canonical, bySlug] of Object.entries(SLUGS)) {
  REVERSE.sl[bySlug.sl] = canonical;
  REVERSE.hr[bySlug.hr] = canonical;
}
```

- [ ] **Step 2: Rework `localizePath` and `stripLocale` in `src/i18n/utils.ts`**

Import at top: `import { SLUGS, REVERSE } from './slugs';`

Replace `localizePath`. NOTE (arch review): the `lang === DEFAULT_LOCALE` early return does NOT narrow `lang` under strict TS (DEFAULT_LOCALE is annotated `Locale`, not the literal) — the explicit `as 'sl' | 'hr'` cast below is required or `astro check` fails with TS7053:

```ts
/** Build a localized URL path from a canonical path, translating slug segments. */
export function localizePath(canonicalPath: string, lang: Locale): string {
  let p = canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath;
  if (lang === DEFAULT_LOCALE) return p;
  const l = lang as 'sl' | 'hr';
  // Split off #hash / ?query so segment mapping never touches them (hardening —
  // today all callers append hashes AFTER localizePath).
  const cut = p.search(/[#?]/);
  const suffix = cut === -1 ? '' : p.slice(cut);
  let path = cut === -1 ? p : p.slice(0, cut);
  const hadTrailing = path.endsWith('/');
  const segs = path.split('/').filter(Boolean).map((s) => SLUGS[s]?.[l] ?? s);
  path = `/${l}` + (segs.length ? '/' + segs.join('/') : '') + (hadTrailing || segs.length === 0 ? '/' : '');
  return path + suffix;
}
```

Replace `stripLocale` (keep its doc comment; preserve the file-like/hash guard — `stripLocale('/sl/foo.png')` must stay `'/foo.png'`, never `'/foo.png/'`):

```ts
/** Strip the locale prefix → canonical path, reverse-translating slug segments. */
export function stripLocale(pathname: string): string {
  let p = pathname.startsWith('/') ? pathname : '/' + pathname;
  const first = p.replace(/^\/+/, '').split('/')[0];
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    const lang = first as 'sl' | 'hr';
    const rest = p.replace(/^\/+/, '').split('/').slice(1);
    const segs = rest.filter(Boolean).map((s) => REVERSE[lang][s] ?? s);
    p = '/' + segs.join('/');
  }
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) {
    if (!/[.#?]/.test(p.split('/').pop() || '')) p += '/';
  }
  return p === '//' ? '/' : p;
}
```

- [ ] **Step 3: `npm run check`** — expect 0 errors (nothing else changed yet; EN behavior identical, SL/HR links now emit localized slugs that 404 until Task 4 renames the dirs — that is expected mid-branch state, do not "fix" it).

- [ ] **Step 4: Commit**

```bash
git add src/i18n/slugs.ts src/i18n/utils.ts
git commit -m "feat(i18n): slug map + localized localizePath/stripLocale"
```

### Task 3: Sitemap + redirects in astro.config.mjs + trailing-slash patch script

**Files:**
- Modify: `astro.config.mjs`, `package.json` (build script)
- Create: `scripts/patch-vercel-redirects.mjs`

**Interfaces:**
- Consumes: `SLUGS`, `REVERSE` from `src/i18n/slugs.ts` (verified: Astro loads the config via Vite `ssrLoadModule`, which resolves the extensionless `.ts` import — no fallback needed).
- Produces: 308 redirects `/sl/book-a-demo/ → /sl/rezervirajte-demo/`, `/hr/book-a-demo/ → /hr/rezervirajte-demo/`, `/sl/privacy-policy/ → /sl/politika-zasebnosti/`, `/hr/privacy-policy/ → /hr/pravila-privatnosti/` matching BOTH slash variants; sitemap entries carrying correct per-locale `xhtml:link` alternates + `x-default`.

**CRITICAL context (arch review, verified against installed packages):** Astro strips the trailing slash from redirect keys (`astro/dist/core/routing/manifest/create.js:227`) and the Vercel adapter compiles the route as `^/sl/book-a-demo$` — which does NOT match the indexed trailing-slash URL `/sl/book-a-demo/`, and the adapter disables fallback redirect HTML (`build.redirects: false`). Without the patch script below, the renamed URLs 404 in production. The patch rewrites each emitted redirect `src` to `^/sl/book-a-demo/?$`.

- [ ] **Step 1: Add imports and a redirects block** (note the JSDoc — `astro.config.mjs` has `// @ts-check` and IS type-checked by the gate; without these annotations `astro check` fails with ts7006/ts7053):

```js
import { SLUGS, REVERSE } from './src/i18n/slugs';

// 308s from the old (canonical-slug) SL/HR URLs — they are indexed; a permanent
// redirect transfers the signal. ONLY launch-era paths: pages created after the
// slug map existed never served a canonical-slug URL. NOTE: Astro+adapter emit
// these as slash-less matchers; scripts/patch-vercel-redirects.mjs (run by the
// build script) widens them to match the trailing-slash URLs Google indexed.
const LEGACY_SLUG_PATHS = ['book-a-demo', 'privacy-policy'];
/** @type {Record<string, {status: 308, destination: string}>} */
const redirects = {};
for (const canonical of LEGACY_SLUG_PATHS) {
  for (const lang of /** @type {('sl'|'hr')[]} */ (['sl', 'hr'])) {
    const localized = SLUGS[canonical]?.[lang];
    if (localized && localized !== canonical) {
      redirects[`/${lang}/${canonical}/`] = { status: 308, destination: `/${lang}/${localized}/` };
    }
  }
}
```

Pass `redirects` in `defineConfig({ ..., redirects })`.

- [ ] **Step 1b: Create `scripts/patch-vercel-redirects.mjs` and wire it into the build**

```js
// Widens the Vercel redirect matchers emitted for astro.config `redirects`:
// Astro strips trailing slashes from redirect keys and @astrojs/vercel compiles
// `^/sl/book-a-demo$`, which misses the indexed trailing-slash URL. Rewrites
// each such route to `^/sl/book-a-demo/?$`. Fails loudly if nothing matched so
// a silent regression cannot ship.
import { readFileSync, writeFileSync } from 'node:fs';

const cfgPath = new URL('../.vercel/output/config.json', import.meta.url);
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
let patched = 0;
for (const route of cfg.routes ?? []) {
  const loc = route.headers && route.headers.Location;
  if (route.status === 308 && typeof loc === 'string' && loc.startsWith('/') &&
      typeof route.src === 'string' && route.src.endsWith('$') && !route.src.endsWith('/?$')) {
    route.src = route.src.slice(0, -1) + '/?$';
    patched++;
  }
}
if (patched === 0) throw new Error('patch-vercel-redirects: no redirect routes found — did astro.config redirects change?');
writeFileSync(cfgPath, JSON.stringify(cfg));
console.log(`patch-vercel-redirects: widened ${patched} route(s)`);
```

In `package.json`: `"build": "astro build && node scripts/patch-vercel-redirects.mjs"`. Vercel runs the package.json `build` script (no `vercel.json` exists to override it) — but this MUST be confirmed post-merge with a live curl of `https://gradvera.com/sl/book-a-demo/` expecting 308 (delivery-summary open item; if it 404s, the Vercel dashboard build command is pinned to `astro build` and must be changed to `npm run build`).

- [ ] **Step 2: Replace the sitemap i18n/serialize config**

Remove the `i18n:` block from the `sitemap()` options (its same-path grouping breaks with per-locale slugs) and replace `serialize` so alternates come from the slug map:

```js
serialize(item) {
  const url = new URL(item.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const locale = parts[0] === 'sl' || parts[0] === 'hr' ? parts[0] : 'en';
  const rest = locale === 'en' ? parts : parts.slice(1);
  const canonSegs = rest.map((s) => (locale === 'en' ? s : (REVERSE[locale][s] ?? s)));
  const canonical = '/' + canonSegs.join('/') + (canonSegs.length ? '/' : '');
  item.priority = canonical === '/' ? 1.0 : canonical.startsWith('/privacy') ? 0.3 : 0.8;
  const localized = (lang) =>
    lang === 'en'
      ? canonical
      : `/${lang}` + (canonSegs.length ? '/' + canonSegs.map((s) => SLUGS[s]?.[lang] ?? s).join('/') : '') + '/';
  item.links = [
    { lang: 'en', url: url.origin + localized('en') },
    { lang: 'sl', url: url.origin + localized('sl') },
    { lang: 'hr', url: url.origin + localized('hr') },
    { lang: 'x-default', url: url.origin + localized('en') },
  ];
  return item;
}
```

Keep the existing `filter` and `lastmod` options unchanged.

- [ ] **Step 3: Build; verify config output**

Run: `npm run build`, then inspect `.vercel/output/config.json` — the four redirect routes must be present with status 308 and `/?$`-widened `src` matchers (the patch script's "widened 4 route(s)" line must appear in the build output). Inspect the sitemap XML: the `<xhtml:link>` alternates must already use localized SL/HR slugs. NOTE: `<loc>` values still show `/sl/book-a-demo/` at this point — the page dirs are renamed only in Task 4; do NOT "fix" that here. Paste the observations into the task report.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json scripts/patch-vercel-redirects.mjs
git commit -m "feat(seo): slug-aware sitemap alternates + 308 redirects for renamed SL/HR routes"
```

### Task 4: Rename page dirs + update e2e specs

**Files:**
- Rename: `src/pages/sl/book-a-demo/` → `src/pages/sl/rezervirajte-demo/`; `src/pages/hr/book-a-demo/` → `src/pages/hr/rezervirajte-demo/`; `src/pages/sl/privacy-policy/` → `src/pages/sl/politika-zasebnosti/`; `src/pages/hr/privacy-policy/` → `src/pages/hr/pravila-privatnosti/`
- Modify: `tests/e2e/lang-picker.spec.mjs` (lines ~47–51), `tests/e2e/lead-tracking.spec.mjs` (SL path)
- Test: `tests/e2e/localized-slugs.spec.mjs` (new)

**Interfaces:**
- Consumes: `localizePath`/`stripLocale` from Task 2; redirects from Task 3.

- [ ] **Step 1: Write the failing spec**

`tests/e2e/localized-slugs.spec.mjs`:

```js
// Localized SL/HR slugs: pages serve at the new URLs, on-page hreflang pairs
// them with EN, and the Vercel routing config 308s the old URLs.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

const PAGES = [
  { url: '/sl/rezervirajte-demo/', canonicalEn: '/book-a-demo/' },
  { url: '/hr/rezervirajte-demo/', canonicalEn: '/book-a-demo/' },
  { url: '/sl/politika-zasebnosti/', canonicalEn: '/privacy-policy/' },
  { url: '/hr/pravila-privatnosti/', canonicalEn: '/privacy-policy/' },
];

for (const { url, canonicalEn } of PAGES) {
  test(`${url} serves 200 with hreflang pointing at ${canonicalEn}`, async ({ page }) => {
    const res = await gotoClean(page, url);
    if (res) expect(res.status()).toBe(200);
    const enAlt = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(enAlt).toHaveAttribute('href', `https://gradvera.com${canonicalEn}`);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', `https://gradvera.com${url}`);
  });
}

test('old SL/HR URLs 308-redirect, matching BOTH slash variants', () => {
  const cfgPath = ROOT + '.vercel/output/config.json';
  expect(existsSync(cfgPath), 'vercel build output config missing').toBe(true);
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  const redirects = (cfg.routes || []).filter((r) => r.status === 308 && r.headers?.Location?.startsWith('/'));
  const CASES = [
    { old: '/sl/book-a-demo', dest: '/sl/rezervirajte-demo/' },
    { old: '/hr/book-a-demo', dest: '/hr/rezervirajte-demo/' },
    { old: '/sl/privacy-policy', dest: '/sl/politika-zasebnosti/' },
    { old: '/hr/privacy-policy', dest: '/hr/pravila-privatnosti/' },
  ];
  for (const { old, dest } of CASES) {
    const route = redirects.find((r) => r.headers.Location === dest);
    expect(route, `no 308 route targeting ${dest}`).toBeTruthy();
    // Compile the emitted matcher: it must match the slash-less AND the
    // trailing-slash form — Google indexed the trailing-slash URLs.
    const re = new RegExp(route.src);
    expect(re.test(old), `${route.src} should match ${old}`).toBe(true);
    expect(re.test(old + '/'), `${route.src} should match ${old}/ (indexed form)`).toBe(true);
  }
});

test('sitemap lists localized slugs with full alternate sets', () => {
  const xml = readFileSync(ROOT + 'dist/client/sitemap-0.xml', 'utf8');
  expect(xml).toContain('/sl/rezervirajte-demo/');
  expect(xml).toContain('/hr/pravila-privatnosti/');
  expect(xml).not.toContain('/sl/book-a-demo/');
});
```

If `gotoClean` returns no response object, drop the status assertion line and rely on the locator assertions (adapt to the helper's actual contract). If the sitemap lives at a different dist path, locate it with `find dist -name 'sitemap-0.xml'` and fix the path.

- [ ] **Step 2: Run: `npm run test:e2e -- localized-slugs`** — expect FAIL (pages 404 at new URLs until the rename).

- [ ] **Step 3: `git mv` the four dirs** (exact commands):

```bash
git mv src/pages/sl/book-a-demo src/pages/sl/rezervirajte-demo
git mv src/pages/hr/book-a-demo src/pages/hr/rezervirajte-demo
git mv src/pages/sl/privacy-policy src/pages/sl/politika-zasebnosti
git mv src/pages/hr/privacy-policy src/pages/hr/pravila-privatnosti
```

No content edits inside the moved files: their `path` prop is canonical (`/book-a-demo/`, `/privacy-policy/`) and stays.

- [ ] **Step 4: Update `tests/e2e/lang-picker.spec.mjs`** — the hreflang href expectations at ~47–51 become `/sl/rezervirajte-demo/` and `/hr/rezervirajte-demo/`. Update the SL entry in `tests/e2e/lead-tracking.spec.mjs` to `{ path: '/sl/rezervirajte-demo/', locale: 'sl' }`. Grep for any other `book-a-demo`/`privacy-policy` literals in `tests/`: `grep -rn "book-a-demo\|privacy-policy" tests/` and update those that reference SL/HR URLs (EN references stay).

- [ ] **Step 5: Run: `npm run test:e2e -- localized-slugs lang-picker lead-tracking`** — expect all pass.

- [ ] **Step 6: Full gates**

Run: `npm run check` (0 errors) and `npm run test:e2e` (all pass).

- [ ] **Step 7: Graphify + docs + commit**

`/graphify --update` (moved routes) + `grep -rn "users_katarov" graphify-out/graph.json` canonicalization. Update `CLAUDE.md` Layout section: the sentence "Each locale has `index`, `book-a-demo/`, `privacy-policy/`" gains "(SL/HR use localized slugs — see `src/i18n/slugs.ts`)".

```bash
git add -A
git commit -m "feat(i18n): localized SL/HR route slugs with 308 redirects"
```

---

## PR 3 — `feat/content-pages`

### Task 5: Slug entries + GuideArticle component + i18n keys (cluster 1: kalkulacije)

**Files:**
- Modify: `src/i18n/slugs.ts` (two new entries)
- Create: `src/components/pages/GuideArticle.astro`
- Modify: `src/i18n/en.json`, `src/i18n/sl.json`, `src/i18n/hr.json` (namespace `guide.est.*`)
- Create: `src/pages/construction-cost-estimation/index.astro`, `src/pages/sl/gradbene-kalkulacije/index.astro`, `src/pages/hr/gradevinske-kalkulacije/index.astro`

**Interfaces:**
- Consumes: `SLUGS` mechanism from Task 2; `BaseLayout` props (`lang`, `path`, `title`, `description`, `jsonLd`).
- Produces: `GuideArticle.astro` with `Props { lang: Locale; ns: string }` reading keys `guide.<ns>.eyebrow|h1|lede|sections|faqTitle|faq|cta.h2|cta.p|cta.btn`, where `sections` = `[{ h: string, ps: string[] }]` and `faq` = `[{ q: string, a: string }]`. Task 6 reuses it with `ns: 'bid'`.

- [ ] **Step 1: Add slug entries**

In `src/i18n/slugs.ts` SLUGS:

```ts
  'construction-cost-estimation': { sl: 'gradbene-kalkulacije', hr: 'gradevinske-kalkulacije' },
  'construction-bid-estimate': { sl: 'gradbeni-predracun', hr: 'gradevinski-troskovnik' },
```

(Task 3's `LEGACY_SLUG_PATHS` list deliberately does NOT grow — these pages never served canonical-slug SL/HR URLs, so no redirects.)

- [ ] **Step 2: Create `GuideArticle.astro`**

```astro
---
import { useTranslations, localizePath, type Locale } from '../../i18n/utils';
interface Props { lang: Locale; ns: string }
const { lang, ns } = Astro.props;
const t = useTranslations(lang);
const k = (s: string) => t(`guide.${ns}.${s}`);
const sections: { h: string; ps: string[] }[] = k('sections');
const faq: { q: string; a: string }[] = k('faq');
const demoHref = localizePath('/book-a-demo/', lang);
---
<article class="guide">
  <header class="guide-hero">
    <div class="wrap">
      <p class="eyebrow">{k('eyebrow')}</p>
      <h1>{k('h1')}</h1>
      <p class="lede">{k('lede')}</p>
    </div>
  </header>
  <div class="wrap guide-body">
    {sections.map((s) => (
      <section>
        <h2>{s.h}</h2>
        {s.ps.map((p) => <p>{p}</p>)}
      </section>
    ))}
    <section class="guide-faq">
      <h2>{k('faqTitle')}</h2>
      {faq.map((f) => (
        <details>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
    <aside class="guide-cta">
      <h2>{k('cta.h2')}</h2>
      <p>{k('cta.p')}</p>
      <a class="btn btn-primary" href={demoHref}>{k('cta.btn')} <span aria-hidden="true">→</span></a>
    </aside>
  </div>
</article>

<style is:global>
  .guide-hero { padding: 150px 0 46px; }
  .guide-hero .eyebrow { font: 500 12px/1 var(--font-mono); text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--amber); margin: 0 0 14px; }
  .guide-hero h1 { color: var(--on-ink); font-weight: 600; max-width: 21ch; }
  .guide-hero .lede { color: var(--on-ink-2); max-width: 62ch; margin-top: 16px; font-size: 17px; line-height: 1.6; }
  .guide-body { max-width: 760px; padding-bottom: 90px; }
  .guide-body section { margin-top: 42px; }
  .guide-body h2 { color: var(--on-ink); font-weight: 600; font-size: 24px; margin: 0 0 14px; }
  .guide-body p { color: var(--on-ink-2); line-height: 1.65; margin: 0 0 12px; max-width: none; }
  .guide-faq details { border-bottom: 1px solid var(--ink-hair-2); padding: 14px 0; }
  .guide-faq summary { color: var(--on-ink); font-weight: 500; cursor: pointer; }
  .guide-faq details p { margin-top: 10px; }
  .guide-cta { margin-top: 56px; border: 1px solid var(--ink-hair-2); border-radius: 14px;
    padding: 30px; background: var(--ink); }
  .guide-cta h2 { color: var(--on-ink); font-weight: 600; font-size: 22px; margin: 0 0 8px; }
  .guide-cta p { color: var(--on-ink-2); margin: 0 0 18px; }
</style>
```

Design gate: before styling, re-read `DESIGN.md` + `PRODUCT.md` and reuse token variables (`--amber`, `--on-ink`, `--ink-hair-2`, `--font-mono`) — the block above is the starting point; align spacing/typography with `src/styles/site.css` conventions where they differ.

- [ ] **Step 3: Author the dictionary content (namespace `guide.est`)**

Add to all three dictionaries. Also mirror the EN keys into a new `src/i18n/_parts/guides.en.json` fragment (the EN dictionary is authored in `_parts/` by convention — no script consumes them, but the fragments must not silently drift). This is authored copy, not translation of boilerplate — write it natively per language, tone calm/precise/anti-hype. **Content brief** (binding):

- Keyword targets — SL: *gradbene kalkulacije, program za gradbene kalkulacije, kalkulacija gradbenih del, gradbene kalkulacije excel*; HR: *građevinske kalkulacije, program za građevinske kalkulacije, kalkulacija građevinskih radova*; EN: *construction cost estimation software*. Primary keyword in h1, lede, ≥2 section headings, naturally (no stuffing).
- `eyebrow`: category label (SL "Gradbene kalkulacije", HR "Građevinske kalkulacije", EN "Construction cost estimation").
- `h1`: benefit-framed, ≤65 chars, contains primary keyword.
- `lede`: 2 sentences, what the page teaches + who it's for (estimators, commercial managers in construction SMEs).
- `sections`: exactly 5, each `h` an H2 with 2–3 paragraphs (`ps`), total 600–900 words per language: (1) what a gradbena kalkulacija covers — items, quantities, unit prices, overheads, margin; (2) why Excel breaks down — version chaos, no price history, silent formula errors (respectful to Excel users, "show the work" evidence style); (3) unit prices from your own history — tie to Gradvera's suggested-unit-price capability; (4) risk review before the offer goes out — tie to Gradvera's risk-review capability; (5) from kalkulacija to confirmed offer — process view, subcontractor comparison tie-in.
- `faqTitle` + `faq`: exactly 4 Q&As, each answer ≤60 words, drawn from real search intents (price of software, Excel import, who it's for, how long adoption takes). No invented statistics, no fabricated customer claims — capability descriptions only.
- `cta.h2|p|btn`: one path — book a demo. Btn label reuses each language's existing demo CTA verb style (check `nav`/`footer.explore.bookDemo` values in the dictionaries for register).
- SEO keys: `seo.est.title` (≤60 chars, primary keyword + Gradvera), `seo.est.desc` (140–160 chars) in all three dictionaries.

- [ ] **Step 4: Create the three page shells**

`src/pages/sl/gradbene-kalkulacije/index.astro` (EN and HR analogous — EN at `src/pages/construction-cost-estimation/index.astro` with `lang='en'`, HR at `src/pages/hr/gradevinske-kalkulacije/index.astro` with `lang='hr'`; all three use `path="/construction-cost-estimation/"`):

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import GuideArticle from '../../../components/pages/GuideArticle.astro';
import { useTranslations, localizePath, absoluteUrl, type Locale } from '../../../i18n/utils';

const lang: Locale = 'sl';
const t = useTranslations(lang);
const site = Astro.site;

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: (t('guide.est.faq') as { q: string; a: string }[]).map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: t('nav.home'), item: absoluteUrl(localizePath('/', lang), site) },
    { '@type': 'ListItem', position: 2, name: t('guide.est.eyebrow'), item: absoluteUrl(localizePath('/construction-cost-estimation/', lang), site) },
  ],
};
---
<BaseLayout
  lang={lang}
  path="/construction-cost-estimation/"
  title={t('seo.est.title')}
  description={t('seo.est.desc')}
  ogType="article"
  jsonLd={[breadcrumbLd, faqLd]}
>
  <GuideArticle lang={lang} ns="est" />
</BaseLayout>
```

(EN page imports use `../../` depth — adjust relative paths per location. The `t('guide.est.faq') as ...` cast: `t()` returns `any`, so a plain assignment also works; match file style.)

- [ ] **Step 5: Run `npm run check`** — 0 errors expected.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(content): construction cost estimation guide page (EN/SL/HR)"
```

### Task 6: Cluster 2 (predračun/troškovnik) pages

**Files:**
- Modify: `src/i18n/en.json`, `sl.json`, `hr.json` (namespace `guide.bid.*`, `seo.bid.*`)
- Create: `src/pages/construction-bid-estimate/index.astro`, `src/pages/sl/gradbeni-predracun/index.astro`, `src/pages/hr/gradevinski-troskovnik/index.astro`

**Interfaces:**
- Consumes: `GuideArticle` (`ns: 'bid'`), slug entries already added in Task 5.

- [ ] **Step 1: Author `guide.bid.*` + `seo.bid.*` content** — same structural contract as Task 5 Step 3 (incl. the `_parts/guides.en.json` mirror for the EN keys). Content brief (binding): keyword targets — SL: *gradbeni izračun, gradbene kalkulacije, gradbeni predračun, izdelava predračuna, predračun gradbenih del* (primary term renamed predračun→izračun after launch per #52; *gradbene kalkulacije* appended 2026-08-11 as a secondary term — bid guide's primary label stays *gradbeni izračun*, old predračun equity retained via the live 308 redirect); HR: *građevinski troškovnik, izrada troškovnika, troškovnik građevinskih radova*; EN: *construction bid estimate*. Sections (5): (1) what a predračun/troškovnik contains and who reads it (investor, bank, nadzor); (2) postavke/stavke structure — units, quantities, norms; (3) pricing the items — from history vs. from catalogs, margins and overheads; (4) common mistakes that lose bids — missing items, stale prices, arithmetic slips; (5) faster predračun without losing control — Gradvera flow tie-in (structure proposal → suggested prices → risk review → offer). FAQ 4 Q&As, same rules. NOTE (HR): the open native-speaker question on "stavaka" (memory: gradvera-open-followups) — use "stavke/stavaka" consistently with the existing hr.json dictionary usage; flag any new uses in the report.
- [ ] **Step 2: Create the three page shells** — copy Task 5 Step 4's shell exactly, replacing `est` → `bid`, path → `/construction-bid-estimate/`, and per-locale dirs/langs per the Files list.
- [ ] **Step 3: Run `npm run check`** — 0 errors.
- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(content): construction bid estimate guide page (EN/SL/HR)"
```

### Task 7: Footer links + e2e + graphify + docs

**Files:**
- Modify: `src/components/layout/Footer.astro`, `src/i18n/en.json`, `sl.json`, `hr.json` (keys `footer.explore.estGuide`, `footer.explore.bidGuide`)
- Test: `tests/e2e/content-pages.spec.mjs` (new)
- Modify: `CLAUDE.md` (Layout section route list), `graphify-out/` (via `/graphify --update`)

- [ ] **Step 1: Write the failing spec**

`tests/e2e/content-pages.spec.mjs`:

```js
// Guide pages: serve 200 in all locales, carry FAQPage JSON-LD, correct
// hreflang triplet, and are reachable from the footer.
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

const PAGES = [
  { url: '/construction-cost-estimation/', lang: 'en', proof: 'Gradvera' },
  { url: '/sl/gradbene-kalkulacije/', lang: 'sl', proof: 'kalkulacij' },
  { url: '/hr/gradevinske-kalkulacije/', lang: 'hr', proof: 'kalkulacij' },
  { url: '/construction-bid-estimate/', lang: 'en', proof: 'Gradvera' },
  { url: '/sl/gradbeni-predracun/', lang: 'sl', proof: 'predračun' },
  { url: '/hr/gradevinski-troskovnik/', lang: 'hr', proof: 'troškovnik' },
];

for (const { url, proof } of PAGES) {
  test(`${url} serves with FAQPage schema and full hreflang`, async ({ page }) => {
    await gotoClean(page, url);
    await expect(page.locator('article.guide h1')).toBeVisible();
    const body = await page.textContent('body');
    expect(body.toLowerCase()).toContain(proof.toLowerCase());
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((s) => s.includes('"FAQPage"'))).toBe(true);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);
    await expect(page.locator('.guide-cta a.btn')).toBeVisible();
  });
}

test('footer links to both guides in every locale', async ({ page }) => {
  for (const home of ['/', '/sl/', '/hr/']) {
    await gotoClean(page, home);
    const hrefs = await page.locator('.foot-links a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs.join(' ')).toMatch(/construction-cost-estimation|gradbene-kalkulacije|gradevinske-kalkulacije/);
    expect(hrefs.join(' ')).toMatch(/construction-bid-estimate|gradbeni-predracun|gradevinski-troskovnik/);
  }
});
```

- [ ] **Step 2: Run: `npm run test:e2e -- content-pages`** — footer test FAILS (links absent); page tests should pass from Tasks 5–6.
- [ ] **Step 3: Add footer links** — in `Footer.astro`'s `.foot-links` list, after the three anchor links, before the bookDemo link:

```astro
          <li><a href={localizePath('/construction-cost-estimation/', lang)}>{t('footer.explore.estGuide')}</a></li>
          <li><a href={localizePath('/construction-bid-estimate/', lang)}>{t('footer.explore.bidGuide')}</a></li>
```

Add `footer.explore.estGuide` / `footer.explore.bidGuide` to the three dictionaries (short noun labels matching each page's eyebrow register).

- [ ] **Step 4: Run: `npm run test:e2e -- content-pages`** — all pass.
- [ ] **Step 5: Full gates** — `npm run check` (0 errors) + `npm run test:e2e` (all pass).
- [ ] **Step 6: Graphify + docs** — `/graphify --update` (6 new routes, 1 new component, new dictionary namespaces) + `users_katarov` grep canonicalization. `CLAUDE.md` Layout section: extend the locale route list with the two guide routes. Sitemap/SEO need no doc change (mechanism documented in PR 2).
- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(content): footer links + e2e coverage for guide pages"
```

---

## Self-review + architecture-review notes (applied 2026-08-05)

- Architecture review verdict was `revise-plan`; all findings are folded in above: trailing-slash redirect patch (Critical), TS narrowing in `localizePath`, JSDoc in `astro.config.mjs` (`// @ts-check` makes the gate type-check it), Task 3 evidence rewording, `stripLocale` file-like guard kept, `_parts` mirror, staging sync below.
- Hash-suffix split in `localizePath` is *hardening only*: every current caller appends `#…` AFTER `localizePath` (Header.astro:10, Footer.astro:18–20, Hero.astro:35, DemoIntro.astro:14); `NAV_ITEMS` in consts.ts has no consumers. Don't build verification on the hash path.
- `stripLocale` currently has zero callers in src — the lang picker's slug-awareness comes from `localizePath(path, loc)` with the canonical `path` prop (BaseLayout → Header/MobileNav). The rewrite still lands for correctness of the exported helper.
- Sitemap i18n block removal is deliberate (same-path grouping is wrong under localized slugs); the `xhtml` namespace is emitted regardless of the i18n option, and on-page hreflang (SEO.astro via `alternates()`) becomes slug-aware the moment Task 2 lands.
- PR 1's SL test path intentionally uses the pre-rename URL; Task 4 Step 4 updates it. Sequencing is PR 1 → PR 2 → PR 3, each merged before the next branches.
- e2e count baseline: 66 before PR 1 (verified via playwright --list); each PR's "all pass" claim must state the new total.
- **After each PR merges to main:** sync staging per CLAUDE.md — `git checkout staging && git merge main && git push && git checkout main`.
