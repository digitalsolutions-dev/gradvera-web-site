# Workstreams C + D — Bookings Embed & dataLayer Events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After a successful qualification-form submit, reveal the Microsoft Bookings calendar in place (lazy iframe + always-visible direct link, campaign `RefID`), and emit the acquisition model's §11.1 dataLayer events (`qualification_form_start`, `qualification_form_submit`, `qualified_lead`, `booking_widget_open`) — retiring `generate_lead` — on every demo page (EN/SL/HR; the future landing page inherits it because it reuses `DemoForm`).

**Architecture:** One new component `src/components/forms/BookingEmbed.astro` rendered inside `DemoForm.astro`'s success block (hidden until success; no third-party load before conversion). `DemoForm.astro`'s inline script owns the reveal (sets the iframe `src` exactly once, pushes `booking_widget_open`, scrolls into view) and the event pushes; it reads `qualified`/`score` from the `/api/lead` JSON response (contract v2). `SITE.bookingUrl` lives in `src/consts.ts`. `docs/lead-tracking-ga4.md` is rewritten to the new event model with the GTM dashboard steps (user action) and the §11.3 consent test matrix. e2e: `tests/e2e/lead-tracking.spec.mjs` becomes `tests/e2e/lead-events.spec.mjs` (dataLayer pushes + iframe/fallback behaviour). No server changes.

**Tech Stack:** Astro 5 static, TypeScript strict, i18n JSON ×3 (+ `_parts/mkt.en.json`), Playwright e2e against `dist/client` (API intercepted), `astro check` gate, Vitest untouched.

**Spec:** `docs/superpowers/specs/2026-08-18-inbound-acquisition-website-design.md` §6 (Workstream C) + §7 (Workstream D); decisions C1–C3, D1', D2', D4. Acquisition model `docs/confirmed-acquisition-model.md` §9, §11, §15.2.

## Global Constraints

- Every user-visible string lives in `src/i18n/{en,sl,hr}.json`; EN also in `src/i18n/_parts/mkt.en.json` (demo/booking keys). Same key at the same line across en/sl/hr; parts-sync one-liner after every i18n edit:
  `node -e 'const fs=require("fs");const en=JSON.parse(fs.readFileSync("src/i18n/en.json","utf8"));let bad=0;for(const f of fs.readdirSync("src/i18n/_parts")){const p=JSON.parse(fs.readFileSync("src/i18n/_parts/"+f,"utf8"));for(const [k,v] of Object.entries(p)){if(JSON.stringify(en[k])!==JSON.stringify(v)){bad++;console.log("MISMATCH",f,k);}}}console.log(bad?"parts OUT OF SYNC: "+bad:"parts in sync");process.exit(bad?1:0)'`
- Booking URL (acquisition model §9.1): `https://outlook.office.com/book/GradveraBookings@digitalsolutions.si/?ismsaljsauthenabled`; the campaign reference is appended with `&RefID=<ref>` (§9.3). `ref` = sanitized `utm_campaign` from first-touch attribution when present, else the page id `website-demo-<lang>` (decision C1). Sanitizer: lowercase, every run of chars outside `[a-z0-9_-]` → `-`, trim leading/trailing `-`, max 40 chars; empty → page id. **Never** put name/email/company/anything personal in the URL.
- The iframe has NO `src` until success (no third-party request before conversion); `src` is set exactly once. A direct link (`target="_blank" rel="noopener noreferrer"`) to the same URL is always visible in the success block (fallback for iframe-blocking browsers). Auto-reveal on success + `scrollIntoView` (decision C3).
- dataLayer events (decision D4 — doc names only; `generate_lead` is removed everywhere in `src/` and `tests/`):
  - `qualification_form_start` `{form_id:'gv-demo-form', locale, page}` — once per page load, on the first `input`/`change` inside the form.
  - `qualification_form_submit` `{form_id, locale, page, qualified:boolean, score:number}` — once, after a 2xx; `qualified`/`score` read from the response JSON (`false`/`0` if the body is not JSON).
  - `qualified_lead` `{form_id, locale, page, score}` — once, right after `qualification_form_submit`, only when `qualified === true`.
  - `booking_widget_open` `{form_id, locale, page, ref}` — once, when the iframe `src` is set.
  - No other events; no PII in any payload (no email/name/company).
- No `any`; `npm run check` 0 errors; `npm run test:unit` still 18; e2e green. Only these files may change: `src/consts.ts`, `src/components/forms/{DemoForm,BookingEmbed}.astro`, the 4 i18n files, `tests/e2e/{helpers.mjs,lead-events.spec.mjs (renamed from lead-tracking.spec.mjs),claims.spec.mjs? (no)}`, `docs/lead-tracking-ga4.md`, `docs/lead-integration.md` (one cross-reference line), `tests/e2e/README.md`, `CLAUDE.md` (Analytics/Lead capture paragraphs), `graphify-out/*`.
- Do NOT touch `lead.ts`, `src/lib/*`, the landing page (WS-E), `docs/confirmed-acquisition-model.md` (WS-F).
- Commits: Conventional Commits + Co-Authored-By trailer; branch `feat/ws-cd-bookings-events` in an isolated worktree.

---

### Task 0: Worktree, baseline (controller)

- [ ] Worktree from `main` (≥ `2ae5520`), branch `feat/ws-cd-bookings-events`, `npm ci`.
- [ ] Baseline: `npm run check` 0 errors; `npm run test:unit` 18; `npm run test:e2e` 115 passed (record).

---

### Task 1: Booking URL const, i18n, `BookingEmbed.astro`, success-block markup (no behaviour yet)

**Files:**
- Modify: `src/consts.ts` (add `bookingUrl` to `SITE`)
- Create: `src/components/forms/BookingEmbed.astro`
- Modify: `src/components/forms/DemoForm.astro` (success block markup + import + `refId` prop)
- Modify: `src/i18n/en.json`, `src/i18n/_parts/mkt.en.json`, `src/i18n/sl.json`, `src/i18n/hr.json`
- Modify: `tests/e2e/helpers.mjs` (export `BOOKING_URL`), Create: `tests/e2e/lead-events.spec.mjs` via `git mv tests/e2e/lead-tracking.spec.mjs tests/e2e/lead-events.spec.mjs` then rewrite (Task 1 adds the static-markup tests; Task 2 adds the event tests)

**Interfaces:**
- Produces: `SITE.bookingUrl` (string); `BookingEmbed` props `{ lang: Locale; refId: string }` rendering `<div class="booking" data-base-src={SITE.bookingUrl} data-ref-default={refId}>` with `<p class="booking-intro">`, `<a class="booking-link" href={SITE.bookingUrl + '&RefID=' + refId} target="_blank" rel="noopener noreferrer">`, `<iframe class="booking-frame" title=… data-src-pending>` (no `src`), `<p class="booking-fallback">`; `DemoForm` prop `refId?: string` (default `website-demo-${lang}`); i18n keys `booking.intro`, `booking.open`, `booking.fallback`, `booking.frameTitle`; `demo.success.p` + `demo.page.steps[0]` updated.

- [ ] **Step 1: Write the failing e2e tests**

`git mv tests/e2e/lead-tracking.spec.mjs tests/e2e/lead-events.spec.mjs` and replace its content with:
```js
// Lead events + Bookings embed (acquisition model §9, §11): the success block
// holds the Microsoft Bookings calendar (lazy iframe, src set only after a 2xx)
// and a direct link; dataLayer pushes follow the §11.1 names. API intercepted —
// the static server has no /api/lead.
import { test, expect } from '@playwright/test';
import { gotoClean, fillRequired, armLeadCapture, BOOKING_URL } from './helpers.mjs';

const PAGES = [
  { path: '/book-a-demo/', locale: 'en', ref: 'website-demo-en' },
  { path: '/sl/rezervirajte-demo/', locale: 'sl', ref: 'website-demo-sl' },
  { path: '/hr/rezervirajte-demo/', locale: 'hr', ref: 'website-demo-hr' },
];

for (const { path, locale, ref } of PAGES) {
  test(`${path} ships the booking block hidden, with a direct link and no iframe src before success`, async ({ page }) => {
    await gotoClean(page, path);
    const block = page.locator('.form-ok .booking');
    await expect(block).toHaveCount(1);
    await expect(page.locator('.form-ok')).toBeHidden();
    await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('href', `${BOOKING_URL}&RefID=${ref}`);
    await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('target', '_blank');
    await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('rel', /noopener/);
    expect(await page.locator('.form-ok iframe.booking-frame').getAttribute('src')).toBeNull();
    // no third-party request before conversion
    const requests = [];
    page.on('request', (r) => { if (r.url().includes('outlook.office.com')) requests.push(r.url()); });
    await page.waitForTimeout(300);
    expect(requests).toEqual([]);
  });
}
```
Append to `tests/e2e/helpers.mjs`, and make `armLeadCapture` stub the Bookings origin so no test ever loads the real calendar (offline-safe CI; the iframe `src` is still asserted):
```js
/** Microsoft Bookings page (acquisition model §9.1) — mirrors SITE.bookingUrl. */
export const BOOKING_URL = 'https://outlook.office.com/book/GradveraBookings@digitalsolutions.si/?ismsaljsauthenabled';

/** Serve a tiny stub for any outlook.office.com request (the success state embeds the calendar). */
export async function stubBookings(page) {
  await page.route('https://outlook.office.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>bookings stub</title>' }),
  );
}
```
and change `armLeadCapture` so its first statement is `await stubBookings(page);` (before the `/api/lead` route). The Task 2 failure-path test routes `/api/lead` itself and never reveals the iframe, so it needs no stub.

- [ ] **Step 2: Run → fail** (`npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/lead-events.spec.mjs` → `.form-ok .booking` count 0).

- [ ] **Step 3: `src/consts.ts`** — inside `SITE` after `themeColor`:
```ts
  /** Microsoft Bookings page (acquisition model §9.1). Campaign ref is appended as `&RefID=<ref>` — never personal data. */
  bookingUrl: 'https://outlook.office.com/book/GradveraBookings@digitalsolutions.si/?ismsaljsauthenabled',
```

- [ ] **Step 4: i18n** (insert after `demo.success.p` in all 4 files, same line; also CHANGE `demo.success.p` and `demo.page.steps[0]`):

EN (`en.json` + `_parts/mkt.en.json`):
```json
  "demo.success.p": "Pick a time below for your 30-minute guided demo — or we confirm one within one working day.",
  "booking.intro": "Choose a slot in the calendar:",
  "booking.open": "Open the booking page in a new tab",
  "booking.fallback": "If the calendar does not load, use the link above. Booking runs on Microsoft Bookings, operated for Gradvera by DIGITAL SOLUTIONS d.o.o.",
  "booking.frameTitle": "Book your Gradvera demo — Microsoft Bookings",
```
and `demo.page.steps[0]` → `"Send the form, then pick a time straight away."`

SL:
```json
  "demo.success.p": "Spodaj izberite termin za 30-minutno vodeno predstavitev — ali pa ga potrdimo v enem delovnem dnevu.",
  "booking.intro": "V koledarju izberite termin:",
  "booking.open": "Odprite stran za rezervacijo v novem zavihku",
  "booking.fallback": "Če se koledar ne naloži, uporabite zgornjo povezavo. Rezervacija poteka prek storitve Microsoft Bookings, ki jo za Gradvero upravlja DIGITAL SOLUTIONS d.o.o.",
  "booking.frameTitle": "Rezervirajte predstavitev Gradvere — Microsoft Bookings",
```
and `demo.page.steps[0]` → `"Izpolnite obrazec in takoj izberite termin."`

HR:
```json
  "demo.success.p": "U nastavku odaberite termin za 30-minutnu vođenu demonstraciju — ili ćemo ga potvrditi u jednom radnom danu.",
  "booking.intro": "U kalendaru odaberite termin:",
  "booking.open": "Otvorite stranicu za rezervaciju u novoj kartici",
  "booking.fallback": "Ako se kalendar ne učita, upotrijebite gornju poveznicu. Rezervacija se obavlja putem usluge Microsoft Bookings kojom za Gradveru upravlja DIGITAL SOLUTIONS d.o.o.",
  "booking.frameTitle": "Rezervirajte demonstraciju Gradvere — Microsoft Bookings",
```
and `demo.page.steps[0]` → `"Pošaljite obrazac i odmah odaberite termin."`

- [ ] **Step 5: `src/components/forms/BookingEmbed.astro`**
```astro
---
// Microsoft Bookings calendar for the demo-form success state (acquisition
// model §9). Rendered hidden inside .form-ok; the iframe has NO src until the
// form script reveals it (no third-party request before conversion). The
// direct link is always present as the fallback for iframe-blocking browsers.
// `refId` is the campaign-level reference (never personal data) appended as
// &RefID=; the form script may override it with a sanitized utm_campaign.
import { useTranslations, type Locale } from '../../i18n/utils';
import { SITE } from '../../consts';
interface Props { lang: Locale; refId: string }
const { lang, refId } = Astro.props;
const t = useTranslations(lang);
const href = `${SITE.bookingUrl}&RefID=${refId}`;
---
<div class="booking" data-base-src={SITE.bookingUrl} data-ref-default={refId}>
  <p class="booking-intro">{t('booking.intro')}</p>
  <p class="booking-linkrow"><a class="booking-link" href={href} target="_blank" rel="noopener noreferrer">{t('booking.open')} ↗</a></p>
  <iframe class="booking-frame" title={t('booking.frameTitle')} referrerpolicy="strict-origin-when-cross-origin" allow="clipboard-write"></iframe>
  <p class="booking-fallback">{t('booking.fallback')}</p>
</div>

<style is:global>
  .form-ok .booking { margin-top: 26px; text-align: left; }
  .form-ok .booking-intro { color: var(--on-ink); font-weight: 600; margin: 0 0 8px; }
  .form-ok .booking-linkrow { margin: 0 0 12px; }
  .form-ok .booking-link { color: var(--amber); font: 500 13px/1.4 var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; }
  .form-ok .booking-link:hover { text-decoration: underline; }
  .form-ok .booking-frame { display: block; width: 100%; height: 720px; border: 1px solid var(--ink-hair-2); border-radius: 12px; background: #fff; }
  .form-ok .booking-frame:not([src]) { display: none; }
  .form-ok .booking-fallback { margin: 10px 0 0; font-size: 12.5px; line-height: 1.55; color: var(--on-ink-2); max-width: none; }
  @media (max-width: 560px) { .form-ok .booking-frame { height: 640px; border-radius: 8px; } }
</style>
```

- [ ] **Step 6: `DemoForm.astro` markup** — frontmatter: `import BookingEmbed from './BookingEmbed.astro';`, `interface Props { lang: Locale; path?: string; refId?: string }`, `const { lang, refId = \`website-demo-${lang}\` } = Astro.props;`. In the `.form-ok` block, after `<p>{t('demo.success.p')}</p>` add `<BookingEmbed lang={lang} refId={refId} />`. Keep the existing `tabindex="-1"`/`role="status"` on `.form-ok`.

- [ ] **Step 7: Gates** — JSON valid, parts-sync, `npm run check` 0 errors; `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/lead-events.spec.mjs tests/e2e/lead-form.spec.mjs tests/e2e/claims.spec.mjs` → pass (claims.spec's DEMO_PAGES must still hold: "Excel", "sample data"/"annual"/"14-day" etc. — `demo.page.steps[0]` change doesn't affect them).

- [ ] **Step 8: Commit** `feat(booking): BookingEmbed in the demo success block (hidden, no src; direct link with RefID); booking copy EN/SL/HR` (trailer).

---

### Task 2: Reveal + dataLayer events (`DemoForm.astro` script) and event e2e

**Files:**
- Modify: `src/components/forms/DemoForm.astro` (inline script only)
- Modify: `tests/e2e/lead-events.spec.mjs` (append); `tests/e2e/helpers.mjs` unchanged here (`armLeadCapture(page, reply)` already takes the reply body and, since Task 1, stubs the Bookings origin)

**Interfaces:**
- Produces: dataLayer events per Global Constraints; iframe `src` = `data-base-src + '&RefID=' + ref`; `window.__gvRef` not needed.

- [ ] **Step 1: Failing e2e tests** — append:
```js
const SUBMIT_OK = '{"ok":true,"forwarded":false,"qualified":true,"score":8}';
const SUBMIT_UNQUALIFIED = '{"ok":true,"forwarded":false,"qualified":false,"score":4}';

async function events(page, name) {
  return page.evaluate((n) => (window.dataLayer || []).filter((e) => e && e.event === n), name);
}

for (const { path, locale, ref } of PAGES) {
  test(`${path} pushes qualification_form_start once on first interaction`, async ({ page }) => {
    await gotoClean(page, path);
    expect(await events(page, 'qualification_form_start')).toHaveLength(0);
    await page.fill('#fn', 'A');
    await page.fill('#co', 'B');
    await page.selectOption('#country', 'NL');
    const ev = await events(page, 'qualification_form_start');
    expect(ev).toHaveLength(1);
    expect(ev[0]).toMatchObject({ event: 'qualification_form_start', form_id: 'gv-demo-form', locale, page: 'book-a-demo' });
  });

  test(`${path} qualified submit → form_submit + qualified_lead + booking_widget_open, iframe src set once, no generate_lead`, async ({ page }) => {
    const cap = await armLeadCapture(page, SUBMIT_OK);
    await gotoClean(page, path);
    await fillRequired(page);
    await page.click('#gv-demo-form button[type="submit"]');
    await expect(page.locator('.form-ok')).toBeVisible();
    await cap.body;
    const submit = await events(page, 'qualification_form_submit');
    expect(submit).toHaveLength(1);
    expect(submit[0]).toMatchObject({ form_id: 'gv-demo-form', locale, page: 'book-a-demo', qualified: true, score: 8 });
    const ql = await events(page, 'qualified_lead');
    expect(ql).toHaveLength(1);
    expect(ql[0]).toMatchObject({ form_id: 'gv-demo-form', locale, page: 'book-a-demo', score: 8 });
    const open = await events(page, 'booking_widget_open');
    expect(open).toHaveLength(1);
    expect(open[0]).toMatchObject({ form_id: 'gv-demo-form', locale, page: 'book-a-demo', ref });
    expect(await events(page, 'generate_lead')).toHaveLength(0);
    const frame = page.locator('.form-ok iframe.booking-frame');
    await expect(frame).toHaveAttribute('src', `${BOOKING_URL}&RefID=${ref}`);
    await expect(frame).toBeVisible();
    // order: submit → qualified_lead → booking_widget_open
    const order = await page.evaluate(() => (window.dataLayer || []).map((e) => e && e.event).filter((n) => ['qualification_form_submit', 'qualified_lead', 'booking_widget_open'].includes(n)));
    expect(order).toEqual(['qualification_form_submit', 'qualified_lead', 'booking_widget_open']);
  });
}

test('/book-a-demo/ unqualified submit → form_submit with qualified:false, no qualified_lead, calendar still opens', async ({ page }) => {
  await armLeadCapture(page, SUBMIT_UNQUALIFIED);
  await gotoClean(page, '/book-a-demo/');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  expect((await events(page, 'qualification_form_submit'))[0]).toMatchObject({ qualified: false, score: 4 });
  expect(await events(page, 'qualified_lead')).toHaveLength(0);
  expect(await events(page, 'booking_widget_open')).toHaveLength(1);
});

test('/book-a-demo/ utm_campaign becomes the sanitized RefID; direct link follows', async ({ page }) => {
  await armLeadCapture(page, SUBMIT_OK);
  await gotoClean(page, '/book-a-demo/?utm_source=google&utm_campaign=NL%20Est%20%2F%20Pricing!');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  await expect(page.locator('.form-ok iframe.booking-frame')).toHaveAttribute('src', `${BOOKING_URL}&RefID=nl-est-pricing`);
  await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('href', `${BOOKING_URL}&RefID=nl-est-pricing`);
  expect((await events(page, 'booking_widget_open'))[0]).toMatchObject({ ref: 'nl-est-pricing' });
});

test('/book-a-demo/ failed submit pushes no events and keeps the iframe unloaded', async ({ page }) => {
  await page.route('**/api/lead', (route) => route.fulfill({ status: 500, body: '' }));
  await gotoClean(page, '/book-a-demo/');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-net-err')).toBeVisible();
  expect(await events(page, 'qualification_form_submit')).toHaveLength(0);
  expect(await events(page, 'booking_widget_open')).toHaveLength(0);
  expect(await page.locator('.form-ok iframe.booking-frame').getAttribute('src')).toBeNull();
});
```
(`armLeadCapture(page, reply)` already accepts a `reply` string — second param.)

- [ ] **Step 2: Run → fail** (events absent; `generate_lead` present).

- [ ] **Step 3: Script changes in `DemoForm.astro`**

Add near the top of the IIFE (after `var ok = …`):
```js
    var booking = ok ? ok.querySelector('.booking') : null;
    var formId = 'gv-demo-form';
    var ctx = { locale: (form.querySelector('input[name="locale"]') || {}).value || '', page: (form.querySelector('input[name="page"]') || {}).value || '' };
    function push(ev) { window.dataLayer = window.dataLayer || []; window.dataLayer.push(ev); }
    // First interaction → qualification_form_start (once per page load).
    var started = false;
    function onStart() { if (started) return; started = true; push({ event: 'qualification_form_start', form_id: formId, locale: ctx.locale, page: ctx.page }); }
    form.addEventListener('input', onStart, true);
    form.addEventListener('change', onStart, true);
    // Campaign ref for Bookings: sanitized utm_campaign (first touch) else the page default. Never personal data.
    function sanitizeRef(v) {
      var s = String(v || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
      return s;
    }
    function bookingRef(attr) {
      var def = booking ? (booking.getAttribute('data-ref-default') || '') : '';
      var c = attr && attr.utm_campaign ? sanitizeRef(attr.utm_campaign) : '';
      return c || def;
    }
    var revealed = false;
    function revealBooking(ref) {
      if (!booking || revealed) return;
      revealed = true;
      var base = booking.getAttribute('data-base-src') || '';
      var url = base + '&RefID=' + encodeURIComponent(ref);
      var link = booking.querySelector('.booking-link');
      if (link) link.setAttribute('href', url);
      var frame = booking.querySelector('iframe.booking-frame');
      if (frame) frame.setAttribute('src', url);
      push({ event: 'booking_widget_open', form_id: formId, locale: ctx.locale, page: ctx.page, ref: ref });
      try { booking.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* older browsers */ }
    }
```
In the submit handler keep the attribution merge, but capture the attribution object for the ref: change `var attr = window.gvAttribution();` so the variable is declared before the try (`var attr = null;` above; inside try `attr = window.gvAttribution();`). Replace the `.then(function (res) { … })` success branch with:
```js
        .then(function (res) {
          if (!res.ok) throw new Error('request failed');
          return res.json().catch(function () { return {}; });
        })
        .then(function (body) {
          var qualified = !!(body && body.qualified === true);
          var score = body && typeof body.score === 'number' ? body.score : 0;
          push({ event: 'qualification_form_submit', form_id: formId, locale: ctx.locale, page: ctx.page, qualified: qualified, score: score });
          if (qualified) push({ event: 'qualified_lead', form_id: formId, locale: ctx.locale, page: ctx.page, score: score });
          form.style.display = 'none';
          if (ok) { ok.classList.add('show'); ok.focus(); }
          revealBooking(bookingRef(attr));
        })
```
(the `.catch` stays as is — it runs for `!res.ok` and for network errors; a JSON parse failure never rejects because of the inner `.catch`). Delete the `generate_lead` push. `sanitizeRef('NL Est / Pricing!')` → `nl-est-pricing` (verify in the e2e).

- [ ] **Step 4: Run → pass** (`lead-events.spec.mjs`, `lead-form.spec.mjs`, `claims.spec.mjs`, `homepage.spec.mjs`); `grep -rn "generate_lead" src tests` → only comments, if any (prefer none — update the header comment in DemoForm if it mentions it); `npm run check` 0 errors.

- [ ] **Step 5: Commit** `feat(events): §11.1 dataLayer events + Bookings reveal on success; retire generate_lead` (trailer).

---

### Task 3: Docs, README, CLAUDE.md, graphify, PR (controller)

- [ ] `docs/lead-tracking-ga4.md` — rewrite: (1) the four events with payloads and when they fire; (2) GTM container setup: triggers `CE - qualification_form_start/submit`, `CE - qualified_lead`, `CE - booking_widget_open`; tags GA4 Event per trigger with DLVs `form_id locale page qualified score ref`; **Google Ads conversion = `qualification_form_submit` only** (§11.2 — never clicks/page views/booking opens); mark `qualification_form_submit` as GA4 key event; retire/pause `CE - generate_lead` + `GA4 - generate_lead` and the old key event; (3) §11.3 consent test matrix as a checklist (before choice / reject / accept / on submit / on reveal / with gclid+utm / across booking flow) with columns Date · Tester · Result — e2e covers dataLayer pushes only; (4) measurement limitation (§9.4): cross-domain iframe — reconcile bookings manually by email; (5) "As built" section → note the 2026-08-05 `generate_lead` config is superseded once the dashboard steps are done (user action, date to be filled).
- [ ] `docs/lead-integration.md`: in §1 Responses paragraph, replace "(wired in the analytics workstream)" with "(pushed as `qualification_form_submit` / `qualified_lead`, see `lead-tracking-ga4.md`)".
- [ ] `tests/e2e/README.md`: replace the `lead-tracking.spec.mjs` row with `lead-events.spec.mjs` (events + booking block + RefID sanitizing + failure path); mention `BOOKING_URL` helper.
- [ ] `CLAUDE.md`: Lead capture paragraph — add "On success the form reveals the Microsoft Bookings calendar (`BookingEmbed.astro`, lazy iframe + direct link, `RefID` = campaign ref) and pushes `qualification_form_start/submit`, `qualified_lead`, `booking_widget_open` to the dataLayer (`docs/lead-tracking-ga4.md`)." Layout: `forms/DemoForm` → `forms/{DemoForm,BookingEmbed}`.
- [ ] Gates (controller): `npm run check`, `npm run test:unit`, `npm run test:e2e`, parts-sync, `grep -rn generate_lead src tests` → 0.
- [ ] `/graphify --update` (new component; renamed spec); `grep -c users_katarov graphify-out/graph.json` → 0.
- [ ] Commit docs + graph; push; PR `feat(booking+events): Bookings embed on success + §11.1 dataLayer events (workstreams C+D)` with: summary, **GTM dashboard to-do list for the user** (new triggers/tags/DLVs, Ads conversion, pause generate_lead), test evidence, SL check + HR review lists (`booking.*`, `demo.success.p`, `demo.page.steps[0]`), note on manual booking reconciliation. Merge-commit after CI + SL check; staging sync.
