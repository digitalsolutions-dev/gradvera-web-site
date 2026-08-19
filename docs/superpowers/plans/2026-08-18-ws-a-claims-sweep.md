# Workstream A — Claims & Terminology Sweep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every locale of gradvera.com compliant with the acquisition model's claims policy (§6.2, §7.1.1–§7.1.6): remove the unsupported "real results" section, soften guarantee verbs, state the Excel-only input and the guided-demo → NDA preview → annual-onboarding route, and disclose the Gradvera ↔ DIGITAL SOLUTIONS relationship.

**Architecture:** Copy-only workstream. Changes are i18n JSON edits (`src/i18n/{en,sl,hr}.json` + the EN `_parts/*.en.json` mirrors), one component removal (`Results.astro`), one footer line, one JSON-LD field, and a new Playwright spec `tests/e2e/claims.spec.mjs` that pins the new copy state against the built site. No new routes, no form/API changes (those are Workstream B+).

**Tech Stack:** Astro 5 static build, TypeScript strict, Playwright e2e (`npm run test:e2e`), `astro check` gate.

**Spec:** `docs/superpowers/specs/2026-08-18-inbound-acquisition-website-design.md` §4 (Workstream A) — read it first; the plan argues from it.

## Global Constraints

- Every user-visible string lives in `src/i18n/{en,sl,hr}.json`. EN is *also* mirrored in `src/i18n/_parts/*.en.json` — **every EN edit must be applied in both places** (there is no assembly script; parity is manual and checked by the one-liner in Task 0).
- SL and HR files have the **same key at the same line number** as EN (e.g. `results.eyebrow` at line 522 in all three). Use that to locate keys.
- Trilingual parity (PRODUCT.md principle 4): every EN copy change gets an SL and HR counterpart in the same task. HR strings must be listed under "HR native review" in the PR body (decision A6).
- Prohibited anywhere on the site after this workstream (spec §4 acceptance): `82%`, `5×`/`5x`, `95%` (except the GDPR "95/46/EC" citation), "Measured in Practice", "real results", "free trial", "protects your profits" and equivalents ("varuje vaš dobiček", "štiti vašu dobit"), and any copy implying the default demo runs on the prospect's own data.
- Qualitative outcomes stay: "faster", "more certainty", "catch risks before they become costly mistakes" (`cta2.h2`) are allowed (spec §4.4).
- No `any` in TypeScript; `npm run check` must stay green after every task.
- Commit after every task with a Conventional-Commit message; work on branch `feat/ws-a-claims-sweep` created from `main` (Task 0).
- Do NOT touch `docs/confirmed-acquisition-model.md` (amended in Workstream F) and do NOT change form fields or `lead.ts` (Workstream B).

---

### Task 0: Branch, baseline, parts-sync helper

**Files:**
- none created (shell only)

**Interfaces:**
- Produces: branch `feat/ws-a-claims-sweep`; a known-green baseline; the parts-sync one-liner used by every later task.

- [ ] **Step 1: Create the branch from main**

```bash
git checkout main && git pull --ff-only && git checkout -b feat/ws-a-claims-sweep
```

- [ ] **Step 2: Record the baseline gate**

Run: `npm run check`
Expected: `0 errors, 0 warnings` (hints allowed). If not green, STOP and report — do not build on a red baseline.

- [ ] **Step 3: Verify the parts-sync helper works on the untouched tree**

Run (this is the helper — reuse it verbatim in later tasks):

```bash
node -e '
const fs=require("fs");const en=JSON.parse(fs.readFileSync("src/i18n/en.json","utf8"));
let bad=0;for(const f of fs.readdirSync("src/i18n/_parts")){const p=JSON.parse(fs.readFileSync("src/i18n/_parts/"+f,"utf8"));
for(const [k,v] of Object.entries(p)){if(JSON.stringify(en[k])!==JSON.stringify(v)){bad++;console.log("MISMATCH",f,k);}}}
console.log(bad?"parts OUT OF SYNC: "+bad:"parts in sync");process.exit(bad?1:0)'
```

Expected: `parts in sync`, exit 0.

- [ ] **Step 4: Confirm the e2e harness runs (one spec only, to warm the build)**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/homepage.spec.mjs`
Expected: all passed. (First run builds `dist/`; takes 1–3 min.) If Chromium missing: `npx playwright install chromium` once.

---

### Task 1: Remove the "Measured in Practice" Results section

**Files:**
- Delete: `src/components/sections/Results.astro`
- Modify: `src/components/pages/HomeSections.astro` (import line 12, usage line 29)
- Modify: `src/i18n/en.json` (keys `results.*` lines 522–528, key `a11y.to` line 4)
- Modify: `src/i18n/sl.json` (same lines), `src/i18n/hr.json` (same lines)
- Modify: `src/i18n/_parts/flow.en.json` (lines 54–60 `results.*`)
- Modify: `src/i18n/_parts/*.en.json` wherever `a11y.to` lives (find with grep in Step 5)
- Modify: `src/styles/site.css` (lines ~458–467 `.results`, `.metrics`, `.metric`), `src/styles/site-polish.css` (line ~131 `.metric .ms`)
- Create: `tests/e2e/claims.spec.mjs`

**Interfaces:**
- Produces: `tests/e2e/claims.spec.mjs` — the workstream's regression spec; later tasks append tests to it.

- [ ] **Step 1: Write the failing e2e test**

Create `tests/e2e/claims.spec.mjs`:

```js
// Claims policy (docs/confirmed-acquisition-model.md §6.2, §7.1): the built
// site must not carry unsupported "measured results", free-trial wording, or
// copy implying the default demo runs on the prospect's own data. Positive
// checks pin the required disclosures (Excel-only input, DS relationship,
// guided-demo route). Runs against dist/ like every other spec here.
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

const HOME = ['/', '/sl/', '/hr/'];

// Visible text of the page minus script/style, collapsed whitespace.
async function bodyText(page) {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('script,style,noscript').forEach((n) => n.remove());
    return (clone.textContent || '').replace(/\s+/g, ' ');
  });
}

for (const path of HOME) {
  test(`${path} carries no "measured results" section`, async ({ page }) => {
    await gotoClean(page, path);
    expect(await page.locator('section.results').count()).toBe(0);
    const text = await bodyText(page);
    for (const banned of ['Measured in Practice', 'Izmerjeno v praksi', 'Izmjereno u praksi', '82%', '82 %', '5×', '95%', '95 %']) {
      expect(text, `found banned claim "${banned}" on ${path}`).not.toContain(banned);
    }
  });
}
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs`
Expected: 3 failures — `expect(received).toBe(expected)` with `section.results` count `1`.

- [ ] **Step 3: Remove the component and its usage**

```bash
git rm src/components/sections/Results.astro
```

In `src/components/pages/HomeSections.astro` delete line 12 (`import Results from '../sections/Results.astro';`) and line 29 (`<Results lang={lang} />`). Resulting tail of the file:

```astro
<HowItWorks lang={lang} />
<Outcomes lang={lang} />
<Cta2 lang={lang} />
```

- [ ] **Step 4: Delete the `results.*` keys in all three locales and the EN part**

In each of `src/i18n/en.json`, `src/i18n/sl.json`, `src/i18n/hr.json` delete these seven lines (they are consecutive, lines 522–528 in each file):

```
  "results.eyebrow": ...,
  "results.h2": ...,
  "results.lede": ...,
  "results.m1l": ...,
  "results.m1s": ...,
  "results.m2l": ...,
  "results.m3l": ...,
```

Watch the trailing comma on the line *before* the block: if `results.m3l` was the last key in the object, the previous key now needs its trailing comma removed. Validate each file afterwards:

```bash
for f in src/i18n/en.json src/i18n/sl.json src/i18n/hr.json src/i18n/_parts/flow.en.json; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8'));console.log('ok $f')"; done
```

Delete the same seven keys from `src/i18n/_parts/flow.en.json` (lines 54–60).

- [ ] **Step 5: Remove the now-unused `a11y.to` key**

`a11y.to` was only consumed by `Results.astro` (verify: `grep -rn "a11y.to" src` must show only the three JSON files and, possibly, one `_parts` file). Delete the `"a11y.to"` line from `en.json`, `sl.json`, `hr.json` and from whichever `_parts/*.en.json` contains it (`grep -ln '"a11y.to"' src/i18n/_parts/*.json`). Re-run the JSON validation loop from Step 4.

- [ ] **Step 6: Remove dead CSS**

In `src/styles/site.css` delete the block that starts at `.results {` and ends after the last `.metric ...` rule (roughly lines 458–467; also any `@media` rules further down that mention `.metrics` or `.metric` — find with `grep -n "\.results\|\.metrics\|\.metric" src/styles/site.css`). In `src/styles/site-polish.css` delete the `.metric .ms` selector (line ~131) — if it is part of a comma-separated selector list, remove only that selector and its trailing comma. Confirm nothing else references them:

```bash
grep -rn "\.results\b\|\.metrics\b\|\.metric\b\|results-to" src tests | grep -v claims.spec.mjs
```

Expected: no output.

- [ ] **Step 7: Type-check and parts-sync**

Run: `npm run check` → `0 errors`.
Run the parts-sync helper from Task 0 Step 3 → `parts in sync`.

- [ ] **Step 8: Run the e2e test to verify it passes**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs tests/e2e/homepage.spec.mjs tests/e2e/i18n-parity.spec.mjs`
Expected: all passed.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(claims): remove unsupported 'Measured in Practice' results section

The 82% / 5x / 95% figures are not measured customer results and may not be
presented as such (acquisition model §6.2, §7.1.1). Drops Results.astro, its
i18n keys (EN/SL/HR + parts), dead CSS, and adds tests/e2e/claims.spec.mjs
to pin the claims policy against the built site.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Disclose the Gradvera ↔ DIGITAL SOLUTIONS relationship (footer + schema)

**Files:**
- Modify: `src/components/layout/Footer.astro` (lines 43–46 `.foot-bottom` block)
- Modify: `src/components/seo/SEO.astro` (`organizationLd`, lines 64–79)
- Modify: `src/i18n/en.json`, `src/i18n/sl.json`, `src/i18n/hr.json` (new key next to `footer.bottom.copyright`, line 218)
- Modify: `src/i18n/_parts/layout.en.json` (line 23 area)
- Modify: `tests/e2e/claims.spec.mjs` (append), `tests/e2e/seo.spec.mjs` (append)

**Interfaces:**
- Produces: i18n key `footer.bottom.product` (string) in all locales; `Organization` JSON-LD gains `brand: { '@type': 'Brand', name: 'Gradvera' }`.

- [ ] **Step 1: Write the failing e2e tests**

Append to `tests/e2e/claims.spec.mjs`:

```js
const PRODUCT_LINE = {
  '/': 'Gradvera is a product of DIGITAL SOLUTIONS d.o.o.',
  '/sl/': 'Gradvera je produkt podjetja DIGITAL SOLUTIONS d.o.o.',
  '/hr/': 'Gradvera je proizvod tvrtke DIGITAL SOLUTIONS d.o.o.',
};

for (const [path, line] of Object.entries(PRODUCT_LINE)) {
  test(`${path} footer discloses the DIGITAL SOLUTIONS relationship`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 }); // narrowest layout: the new line must not overflow
    await gotoClean(page, path);
    await expect(page.locator('footer .foot-bottom')).toContainText(line);
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows, `horizontal overflow on ${path} at 390px`).toBe(false);
  });
}
```

Append to `tests/e2e/seo.spec.mjs` (it already imports `test`, `expect`, and navigates pages — add a standalone test at the end of the file):

```js
test('Organization JSON-LD names Gradvera as the DIGITAL SOLUTIONS brand', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  const blocks = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent || ''));
  const org = blocks.map((b) => JSON.parse(b)).find((o) => o['@type'] === 'Organization');
  expect(org, 'Organization JSON-LD present').toBeTruthy();
  expect(org.name).toBe('DIGITAL SOLUTIONS d.o.o.');
  expect(org.brand).toEqual({ '@type': 'Brand', name: 'Gradvera' });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs tests/e2e/seo.spec.mjs`
Expected: 3 footer failures (`toContainText`) + 1 schema failure (`org.brand` undefined).

- [ ] **Step 3: Add the i18n key in all locales**

Insert directly after the `"footer.bottom.copyright"` line (line 218 in each file):

`src/i18n/en.json` and `src/i18n/_parts/layout.en.json`:
```json
  "footer.bottom.product": "Gradvera is a product of DIGITAL SOLUTIONS d.o.o.",
```
`src/i18n/sl.json`:
```json
  "footer.bottom.product": "Gradvera je produkt podjetja DIGITAL SOLUTIONS d.o.o.",
```
`src/i18n/hr.json`:
```json
  "footer.bottom.product": "Gradvera je proizvod tvrtke DIGITAL SOLUTIONS d.o.o.",
```

- [ ] **Step 4: Render it in the footer**

In `src/components/layout/Footer.astro` replace the `.foot-bottom` block:

```astro
    <div class="foot-bottom">
      <span class="cc">{t('footer.bottom.copyright')}</span>
      <span class="legal"><a href={localizePath('/privacy-policy/', lang)}>{t('footer.bottom.privacy')}</a></span>
    </div>
```
with
```astro
    <div class="foot-bottom">
      <span class="cc">{t('footer.bottom.copyright')} <span class="product-of">{t('footer.bottom.product')}</span></span>
      <span class="legal"><a href={localizePath('/privacy-policy/', lang)}>{t('footer.bottom.privacy')}</a></span>
    </div>
```
and add inside the existing `<style is:global>` of `Footer.astro`:
```css
  /* Corporate-relationship disclosure (acquisition model §7.1.4) sits under the
     copyright as a quieter second line on narrow screens, inline on wide. */
  .foot-bottom .product-of { display: block; color: var(--on-ink-2); margin-top: 4px; }
  @media (min-width: 720px) { .foot-bottom .product-of { display: inline; margin: 0 0 0 10px; } }
```

- [ ] **Step 5: Add the brand to the Organization schema**

In `src/components/seo/SEO.astro`, inside `organizationLd` (after `alternateName: COMPANY.brand,`) add:

```ts
  brand: { '@type': 'Brand', name: COMPANY.brand },
```

(`COMPANY.brand === 'Gradvera'` in `src/consts.ts`.) Do not change `name` — the Organization stays the legal entity; the brand relation is what expresses "product of".

- [ ] **Step 6: Gates**

Run: `npm run check` → `0 errors`. Parts-sync helper → `parts in sync`.

- [ ] **Step 7: Run the e2e tests to verify they pass**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs tests/e2e/seo.spec.mjs`
Expected: all passed (the footer test itself asserts no horizontal overflow at 390px).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(claims): disclose Gradvera as a DIGITAL SOLUTIONS product (footer + Organization brand)

Acquisition model §7.1.4. Footer line in EN/SL/HR; Organization JSON-LD gains
brand: Gradvera. E2E pins both.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Soften guarantee verbs (`helps.lede`, `outcomes.p2`)

**Files:**
- Modify: `src/i18n/en.json` (`helps.lede` line 403, `outcomes.p2` ~line 430), `src/i18n/sl.json`, `src/i18n/hr.json` (same keys)
- Modify: `src/i18n/_parts/intro.en.json` (line 44 `helps.lede`), `src/i18n/_parts/flow.en.json` (line 48 `outcomes.p2`)
- Modify: `tests/e2e/claims.spec.mjs` (append)

**Interfaces:**
- none (copy only)

- [ ] **Step 1: Write the failing e2e test**

Append to `tests/e2e/claims.spec.mjs`:

```js
const GUARANTEE_PHRASES = {
  '/': ['protects your profits', 'protect profits'],
  '/sl/': ['varuje vaš dobiček', 'varujte dobiček'],
  '/hr/': ['štiti vašu dobit', 'štitite dobit'],
};

for (const [path, phrases] of Object.entries(GUARANTEE_PHRASES)) {
  test(`${path} makes no profit-guarantee claim`, async ({ page }) => {
    await gotoClean(page, path);
    const text = (await bodyText(page)).toLowerCase();
    for (const p of phrases) expect(text, `found "${p}" on ${path}`).not.toContain(p.toLowerCase());
  });
}
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs`
Expected: 3 new failures (`found "protects your profits"…` etc.).

- [ ] **Step 3: Replace the strings (exact values)**

`helps.lede` — EN (`en.json` **and** `_parts/intro.en.json`):
```
The way your team estimates doesn't need to change. What changes is the support behind it. Gradvera is construction estimating software that shows you margin and pricing risk on every estimate before the client confirms it — not after the project is done.
```
SL:
```
Načina, kako vaša ekipa pripravlja kalkulacije, ni treba spreminjati. Spremeni se podpora v ozadju. Gradvera je programska oprema za gradbene kalkulacije, ki vam pri vsaki ponudbi pokaže maržo in cenovna tveganja, še preden jo naročnik potrdi — ne šele po koncu projekta.
```
HR:
```
Način na koji vaš tim izrađuje troškovnike ne mora se mijenjati. Mijenja se podrška koja stoji iza toga. Gradvera je softver za izradu građevinskih troškovnika koji vam na svakom troškovniku pokazuje maržu i cjenovne rizike prije nego što ga klijent potvrdi — a ne nakon što je projekt gotov.
```

`outcomes.p2` — EN (`en.json` **and** `_parts/flow.en.json`):
```
Make better pricing decisions with a clear view of costs and margin on every item.
```
SL:
```
Sprejemajte boljše cenovne odločitve z jasnim pregledom stroškov in marže pri vsaki postavki.
```
HR:
```
Donosite bolje odluke o cijenama uz jasan pregled troškova i marže na svakoj stavci.
```

- [ ] **Step 4: Sweep for any other guarantee wording**

Run:
```bash
grep -rniE "guarantee|guaranteed|ensure(s)? (your )?(profit|margin)|protect(s)? (your )?(profit|margin)|jamč|zagotavlja(mo)? dobiček|varuj|štiti(te)? (vašu )?dobit" src/i18n/*.json src/i18n/_parts/*.json | grep -viE "privacy\.|gdpr|zaščit|zaštit"
```
Expected: no output. If a hit appears, rewrite it in the same qualitative spirit (show/see/review, not protect/guarantee) in all three locales and note it in the commit body.

- [ ] **Step 5: Gates**

Run: `npm run check` → `0 errors`. Parts-sync helper → `parts in sync`.

- [ ] **Step 6: Run the e2e test to verify it passes**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs`
Expected: all passed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(claims): soften profit-guarantee wording to qualitative outcomes

'protects your profits' / 'protect profits' -> 'shows margin and pricing risk'
(EN/SL/HR + parts). Acquisition model §6.2 forbids guaranteed margin claims.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Pin the Excel-BoQ input in the guides (body + CTA copy)

**Files:**
- Modify: `src/i18n/en.json` (`guide.bid.sections[4].ps[0]` ~line 305, `guide.est.cta.p` line 398, `guide.bid.cta.p`), `src/i18n/sl.json`, `src/i18n/hr.json` (same keys)
- Modify: `src/i18n/_parts/guides.en.json` (same keys; `guide.est.cta.p` at line 137)
- Modify: `tests/e2e/claims.spec.mjs` (append)

**Interfaces:**
- none (copy only)

- [ ] **Step 1: Write the failing e2e test**

Append to `tests/e2e/claims.spec.mjs`:

```js
const GUIDE_PAGES = [
  { path: '/construction-bid-estimate/', excel: 'Excel', own: 'from your own documents' },
  { path: '/sl/gradbeni-izracun/', excel: 'Excel', own: 'iz vaših dokumentov' },
  { path: '/hr/gradevinski-troskovnik/', excel: 'Excel', own: 'iz vaše dokumentacije' },
];

for (const { path, excel, own } of GUIDE_PAGES) {
  test(`${path} states Excel BoQ input and no own-documents demo promise`, async ({ page }) => {
    await gotoClean(page, path);
    const text = await bodyText(page);
    expect(text).toContain(excel);
    expect(text, `found "${own}" on ${path}`).not.toContain(own);
  });
}
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs`
Expected: 3 new failures on the `own` phrase (`toContain(excel)` may already pass — the guides mention Excel elsewhere; that is fine).

- [ ] **Step 3: Replace the guide body sentence (`guide.bid.sections[4].ps[0]`)**

Only the first clause changes; keep the rest of the paragraph verbatim.

EN (`en.json` **and** `_parts/guides.en.json`) — replace
`Gradvera proposes the structure of the estimate from the documents you were sent — trade groups and items already in place — so`
with
`Gradvera proposes the structure of the estimate from the Excel bill of quantities you were sent — trade groups and items already in place — so`

SL — replace
`Gradvera iz prejete dokumentacije predlaga strukturo izračuna — sklope in postavke — zato`
with
`Gradvera iz prejetega popisa del v Excelu predlaga strukturo izračuna — sklope in postavke — zato`

HR — replace
`Gradvera iz primljene dokumentacije predlaže strukturu troškovnika — s već postavljenim grupama i stavkama — pa`
with
`Gradvera iz primljenog troškovnika u Excelu predlaže strukturu troškovnika — s već postavljenim grupama i stavkama — pa`

- [ ] **Step 4: Replace the two guide CTA paragraphs (guided demo on sample data, Excel input)**

`guide.est.cta.p` — EN (`en.json` **and** `_parts/guides.en.json`):
```
In a 30-minute guided demo we walk through the estimating workflow on sample data — historical price suggestions, pricing review and subcontractor quotes — and discuss how it maps to your Excel BoQs.
```
SL:
```
Na 30-minutni vodeni predstavitvi na vzorčnih podatkih pokažemo potek kalkulacije — predloge cen iz zgodovine, pregled cen in ponudbe podizvajalcev — ter se pogovorimo, kako se to prenese na vaše popise del v Excelu.
```
HR:
```
Na 30-minutnoj vođenoj demonstraciji na oglednim podacima prolazimo kroz tijek izrade troškovnika — prijedloge cijena iz povijesti, pregled cijena i ponude podizvođača — i razgovaramo kako se to preslikava na vaše troškovnike u Excelu.
```

`guide.bid.cta.p` — EN (`en.json` **and** `_parts/guides.en.json`):
```
In a 30-minute guided demo we build the structure of a bid from a sample Excel bill of quantities and show how suggested prices and the pricing review work — then discuss your own Excel history.
```
SL:
```
Na 30-minutni vodeni predstavitvi sestavimo strukturo ponudbe iz vzorčnega popisa del v Excelu in pokažemo, kako delujejo predlagane cene in pregled cen — nato se pogovorimo o vaši zgodovini v Excelu.
```
HR:
```
Na 30-minutnoj vođenoj demonstraciji složimo strukturu ponude iz oglednog troškovnika u Excelu i pokažemo kako rade predložene cijene i pregled cijena — zatim razgovaramo o vašoj povijesti u Excelu.
```

- [ ] **Step 5: Gates**

Run: `npm run check` → `0 errors`. Parts-sync helper → `parts in sync`.

- [ ] **Step 6: Run the e2e test to verify it passes**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs tests/e2e/content-pages.spec.mjs`
Expected: all passed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(claims): pin Excel BoQ input and sample-data demo in guide copy

Guides no longer imply arbitrary 'documents' import or a demo on the
prospect's own files (acquisition model §3.1, §7.1.5, §10.1). EN/SL/HR + parts.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Book-a-demo page — guided demo on sample data, Excel input, evaluation route

**Files:**
- Modify: `src/i18n/en.json` (`demo.page.h2` 197, `demo.page.intro` 198, `demo.page.steps` 200–204, `demo.page.reassure` 205–208, `demo.success.p` 215, `seo.demo.desc` 531), `src/i18n/sl.json`, `src/i18n/hr.json` (same keys/lines)
- Modify: `src/i18n/_parts/mkt.en.json` (`demo.page.*`, `demo.success.p`), `src/i18n/_parts/intro.en.json` (line 50 `seo.demo.desc`)
- Modify: `tests/e2e/claims.spec.mjs` (append)

**Interfaces:**
- Consumes: `DemoIntro.astro` renders `demo.page.steps` (array of 3) and `demo.page.reassure` (array) — keep both as arrays; `steps` must stay exactly 3 items (numbered 1–3 in the UI).
- Produces: nothing new; Workstream C will replace the success block but reuses `demo.success.h3`/`demo.success.p`.

- [ ] **Step 1: Write the failing e2e test**

Append to `tests/e2e/claims.spec.mjs`:

```js
const DEMO_PAGES = [
  { path: '/book-a-demo/', must: ['Excel', 'sample data', 'annual', '14-day'], mustNot: ['on your own offers', 'On your own offers'] },
  { path: '/sl/rezervirajte-demo/', must: ['Excel', 'vzorčnih podatkih', 'letn', '14-dnevn'], mustNot: ['na primeru svojih ponudb', 'Na primeru vaših ponudb'] },
  { path: '/hr/rezervirajte-demo/', must: ['Excel', 'oglednim podacima', 'godišnj', '14-dnevn'], mustNot: ['s vašim ponudama', 'Uz vaše ponude'] },
];

for (const { path, must, mustNot } of DEMO_PAGES) {
  test(`${path} sets guided-demo / Excel / annual-onboarding expectations`, async ({ page }) => {
    await gotoClean(page, path);
    const text = await bodyText(page);
    for (const m of must) expect(text, `missing "${m}" on ${path}`).toContain(m);
    for (const n of mustNot) expect(text, `found "${n}" on ${path}`).not.toContain(n);
    // The numbered "what happens next" list must keep exactly three steps.
    expect(await page.locator('.demo-steps ol li').count()).toBe(3);
  });
}
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs`
Expected: 3 new failures (`missing "sample data"` / `found "on your own offers"` etc.).

- [ ] **Step 3: Replace the EN strings (`en.json` and `_parts/mkt.en.json`; `seo.demo.desc` also in `_parts/intro.en.json`)**

```json
  "demo.page.h2": "See the Gradvera estimating workflow.",
  "demo.page.intro": "A 30-minute guided demo on sample data, focused on the part of your workflow that matters most — pricing review, subcontractor quotes, or reusing your own historical estimates. Excel BoQ files are the supported input today.",
  "demo.page.steps": [
    "Send the form, then pick a time straight away.",
    "30-minute guided demo on sample data, shaped around your team's workflow.",
    "If it fits: an optional NDA-covered preview on up to 20 of your Excel BoQs, then annual onboarding with a 14-day acceptance period."
  ],
  "demo.page.reassure": [
    "No obligation",
    "Sample data — nothing to prepare",
    "Excel BoQ input"
  ],
  "demo.success.p": "We'll be in touch shortly to confirm your guided demo.",
  "seo.demo.desc": "Book a 30-minute guided demo of Gradvera's construction estimating workflow on sample data — pricing review, historical prices, subcontractor quotes. Excel BoQ input.",
```

(`seo.demo.desc` is 156 characters — under the 160 limit; keep it so.)

- [ ] **Step 4: Replace the SL strings (`sl.json`)**

```json
  "demo.page.h2": "Oglejte si potek kalkulacije v Gradveri.",
  "demo.page.intro": "30-minutna vodena predstavitev na vzorčnih podatkih, osredotočena na tisti del vašega dela, ki šteje največ — pregled cen, ponudbe podizvajalcev ali ponovna uporaba lastnih preteklih kalkulacij. Podprt vhod so danes popisi del v Excelu.",
  "demo.page.steps": [
    "Izpolnite obrazec in takoj izberite termin.",
    "30-minutna vodena predstavitev na vzorčnih podatkih, prilagojena načinu dela vaše ekipe.",
    "Če se ujema: neobvezen predogled pod NDA na do 20 vaših popisih del v Excelu, nato letna uvedba s 14-dnevnim prevzemnim obdobjem."
  ],
  "demo.page.reassure": [
    "Brez obveznosti",
    "Vzorčni podatki — nič za pripraviti",
    "Vhod: popisi del v Excelu"
  ],
  "demo.success.p": "Kmalu se vam oglasimo in potrdimo vodeno predstavitev.",
  "seo.demo.desc": "Rezervirajte 30-minutno vodeno predstavitev poteka gradbene kalkulacije v Gradveri na vzorčnih podatkih — pregled cen, zgodovina cen, ponudbe podizvajalcev. Vhod: Excel.",
```

- [ ] **Step 5: Replace the HR strings (`hr.json`)**

```json
  "demo.page.h2": "Pogledajte tijek izrade troškovnika u Gradveri.",
  "demo.page.intro": "30-minutna vođena demonstracija na oglednim podacima, usmjerena na dio vašeg rada koji je najvažniji — pregled cijena, ponude podizvođača ili ponovna upotreba vlastitih povijesnih troškovnika. Podržani ulaz danas su troškovnici u Excelu.",
  "demo.page.steps": [
    "Pošaljite obrazac i odmah odaberite termin.",
    "30-minutna vođena demonstracija na oglednim podacima, prilagođena načinu rada vašeg tima.",
    "Ako odgovara: neobvezni pregled pod NDA-om na do 20 vaših troškovnika u Excelu, zatim godišnje uvođenje s 14-dnevnim razdobljem prihvaćanja."
  ],
  "demo.page.reassure": [
    "Bez obveze",
    "Ogledni podaci — ništa za pripremiti",
    "Ulaz: troškovnici u Excelu"
  ],
  "demo.success.p": "Uskoro ćemo vam se javiti kako bismo potvrdili vođenu demonstraciju.",
  "seo.demo.desc": "Rezervirajte 30-minutnu vođenu demonstraciju tijeka izrade građevinskog troškovnika u Gradveri na oglednim podacima — pregled cijena, povijest cijena, ponude podizvođača. Ulaz: Excel.",
```

- [ ] **Step 6: Check meta-description lengths (SEO limits: title ≤60, description ≤160)**

Run:
```bash
node -e 'for (const l of ["en","sl","hr"]) { const d=require("./src/i18n/"+l+".json"); console.log(l, "seo.demo.desc", d["seo.demo.desc"].length); }'
```
Expected: every value ≤ 160. If over, trim the trailing clause ("Vhod: Excel." / "Ulaz: Excel.") first.

- [ ] **Step 7: Gates**

Run: `npm run check` → `0 errors`. Parts-sync helper → `parts in sync`. JSON validation loop from Task 1 Step 4 over `en.json sl.json hr.json _parts/mkt.en.json _parts/intro.en.json`.

- [ ] **Step 8: Run the e2e tests to verify they pass**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/claims.spec.mjs tests/e2e/lead-tracking.spec.mjs tests/e2e/seo.spec.mjs`
Expected: all passed (`lead-tracking` still fills `#ms` and expects `.form-ok` — untouched here).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(claims): book-a-demo copy = guided demo on sample data, Excel input, annual route

Replaces 'demo on your own offers' expectation with the confirmed journey
(§10.1): sample-data guided demo -> optional NDA 20-file preview -> annual
onboarding + 14-day acceptance. EN/SL/HR + parts; e2e pins it.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Full gates, docs, PR

**Files:**
- Modify: `tests/e2e/README.md` (spec table)
- Modify: `graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md` (via `/graphify --update`, orchestrator-run)

**Interfaces:**
- none

- [ ] **Step 1: Site-wide banned-claims grep on source**

Run:
```bash
grep -rniE "82%|82 %|5×|5x |95%|95 %|measured in practice|real results|izmerjeno v praksi|izmjereno u praksi|free trial|brezplačn(i|a|o) preizkus|besplatn(i|a|o) prob|protects your profits|varuje vaš dobiček|štiti vašu dobit|own offers|svojih ponudb|vašim ponudama" src/i18n src/components src/consts.ts | grep -viE "95/46/EC|privacy\." 
```
Expected: no output. Any hit = fix in the task it belongs to (copy in all three locales), re-run.

- [ ] **Step 2: Site-wide banned-claims grep on the build**

Run:
```bash
npm run build >/dev/null && grep -rlE "Measured in Practice|Izmerjeno v praksi|Izmjereno u praksi|protects your profits|on your own offers" dist/client | head
```
Expected: no output.

- [ ] **Step 3: Add the spec row to the e2e README**

In `tests/e2e/README.md` spec table add:

```
| `claims.spec.mjs` | Claims policy (acquisition model §6.2/§7.1): no measured-results / profit-guarantee / own-data-demo copy; Excel input, DS-relationship footer line, sample-data guided demo + annual route present (EN/SL/HR) |
```

- [ ] **Step 4: Full verification (orchestrator re-runs these; subagent output is a claim)**

Run: `npm run check` → `0 errors`.
Run: `npm run test:e2e` → all passed (whole suite; `i18n-parity`, `seo`, `content-pages`, `homepage` must still be green).

- [ ] **Step 5: Knowledge graph (orchestrator, not subagent)**

Run the `/graphify --update` skill (structural change: `Results.astro` removed). Then `grep -c users_katarov graphify-out/graph.json` → `0` (see memory: canonicalize absolute ids if not).

- [ ] **Step 6: Commit docs + graph**

```bash
git add tests/e2e/README.md graphify-out/graph.json graphify-out/GRAPH_REPORT.md
git commit -m "chore: e2e README row for claims spec + graphify update after Results removal

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 7: Push and open the PR (orchestrator; needs `gh auth switch -u digitalsolutions-dev`, restore after)**

PR title: `feat(claims): align site copy with confirmed acquisition model (workstream A)`

PR body must contain:
- Summary of the five copy changes + spec/plan links.
- **HR native review** list: every HR string changed in Tasks 2–5 (key + new value), per decision A6.
- **SL native check** list for the user (same keys).
- Test evidence: `npm run check` and `npm run test:e2e` output summary lines.

After CI is green and the user has SL-checked: squash-merge, delete branch, sync staging (`git checkout staging && git merge main && git push && git checkout main`).
