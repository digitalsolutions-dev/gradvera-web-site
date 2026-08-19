# Inbound-acquisition website changes — design spec

**Date:** 2026-08-18
**Source of requirements:** `docs/confirmed-acquisition-model.md` (v1.0). This
spec maps its website-facing clauses (§6, §7, §8, §9, §11) onto concrete
changes in this repo, plus the one cross-repo dependency (gtm-toolkit).
**Status:** approved design, pending implementation plan.

## 1. Goal

Make `gradvera.com` ready for the Phase-0 gate of the acquisition model
(§13, §19): claims compliant, one indexed English acquisition landing page,
qualification form with lead scoring + attribution stored on the lead,
Microsoft Bookings embedded after form success, analytics events per §11.1 —
without regressing SL/HR parity, `astro check`, or the e2e harness.

Non-goals (deferred by the doc §17): video, calculator, Dutch page, CRM
automation, `gradvera.app`, cookie-based cross-session attribution.

## 2. Decisions locked (brainstorm + grill, 2026-08-18)

| # | Decision | Choice |
|---|---|---|
| D1 | LP route | New EN route, **indexed**, slug `/construction-estimating-software/` (market-neutral; "Netherlands" only in title/H1/copy so the page is reusable for the Nordic test; Ads display path carries geo) |
| D2 | Form scope | One shared trilingual `DemoForm` with new fields (SL/HR translated) |
| D3 | Lead score | Computed in `lead.ts`, stored on lead payload |
| D4 | dataLayer events | Doc §11.1 names only; `generate_lead` retired |
| D5 | Attribution carry | URL params on any page → `sessionStorage` first-touch → hidden fields |
| D6 | Screenshots | `ProductEvidence` component built; renders nothing until PNGs configured — no placeholder art in prod |
| A1 | Homepage `Results` | Remove now (all locales); `ProductEvidence` wired in later when assets exist |
| A2 | DS relationship | Footer sentence + `Organization.brand: {Brand: Gradvera}` schema (Organization node is already the legal entity) + LP trust section + demo-intro line |
| A3 | Excel-only | LP FAQ + demo-intro line + guides "received documentation" → "received Excel BoQ" |
| A4 | Onboarding route | LP "Evaluation process" section + demo-intro 3-step line (all locales) |
| A5 | Claim sweep | Numeric/"measured" claims **and** guarantee verbs (e.g. "protects your profits"); qualitative outcomes stay |
| A6 | SL/HR review | Draft in PR; user native-checks SL; HR flagged for later native pass |
| B1 | Required fields | name, email, company, country, role, companySize, mainChallenge required; estimatingMethod, bidFrequency, ndaWilling, phone, message optional |
| B2 | `message` | Optional "Anything else?" textarea |
| B3 | Country | Curated `<select>`, ISO-3166 alpha-2 values, ~12 + other; locale default SL→SI, HR→HR, EN→none |
| B4 | Enums | see §5.2 |
| B5 | Negatives | freemail domain list → −2 in code; −5 (student/job/vendor) human-only |
| B6 | Contract | Site synthesizes `message` when blank; adds nested keys additively; gtm-toolkit v2 PR persists them |
| C1 | Bookings RefID | `utm_campaign` sanitized `[a-z0-9_-]{1,40}` if present, else page id (`website-lp`, `website-demo-en/sl/hr`) |
| C2 | Bookings scope | All demo pages (EN/SL/HR) + LP |
| C3 | Reveal | Auto-load on form success, scroll into view; direct-link fallback always visible |
| D1' | Verification | e2e asserts dataLayer pushes; §11.3 consent matrix manual via GTM Preview, logged in readiness doc |
| D2' | Score → GTM | `lead.ts` returns `{ok, forwarded, qualified, score}`; client pushes `qualification_form_submit{qualified,score}` and `qualified_lead` when qualified |
| E3 | LP chrome | Full header/footer; sticky header CTA |
| E4 | LP form | Bottom `#book-a-demo` section; hero + sticky CTAs anchor to it |
| E5 | Price | Structure only (annual plans, Professional + Starter named users, onboarding agreed commercially, 14-day acceptance); no numbers |
| E7 | Internal links | Footer `explore` column (all locales), guides related-links, homepage HelpsIntro secondary link; header nav unchanged |
| F1 | Doc drift | Amend `confirmed-acquisition-model.md` → v1.1 in workstream F |

## 3. Workstreams and order

```
A claims/terminology  →  B form+lead+scoring+attribution  →  C bookings + D analytics (one PR)  →  E landing page  →  F readiness/doc/graph
```

Each = one short-lived branch → PR → CI (`astro check` + e2e) → squash-merge →
staging sync (CLAUDE.md). A is independent of B–E and unblocks Ads-policy
compliance; E composes B and C; F closes.

## 4. Workstream A — claims and terminology sweep

**Scope:** `src/i18n/{en,sl,hr}.json` + `_parts/*.en.json`, `Footer.astro`,
`SEO.astro`, `HomeSections.astro`, `DemoIntro.astro`, guide sections.

1. Remove `<Results>` from `HomeSections.astro`; delete `Results.astro` and
   all `results.*` keys (7 per locale). Keep `Outcomes → Cta2` rhythm.
2. Footer: `footer.bottom.copyright` becomes two lines — copyright + "Gradvera
   is a product of DIGITAL SOLUTIONS d.o.o." (new key `footer.bottom.product`,
   3 locales).
3. `SEO.astro` `organizationLd` (already `name: DIGITAL SOLUTIONS d.o.o.`,
   `alternateName: Gradvera`) gains `brand: { '@type': 'Brand', name: 'Gradvera' }`
   — expresses "product of" without inventing a second Organization node.
   Keep `WebSite.publisher` as is.
4. Guarantee-verb softening (EN first, SL/HR mirrored): `helps.lede`
   ("protects your profits…" → "shows margin risk before you commit"),
   `cta2.h2` stays unchanged (qualitative: "faster / more certainty / catch
   risks before they become costly mistakes" is an outcome, not a guarantee), any other
   "guarantee/ensure/protect profit" phrasing found by grep. Qualitative
   outcomes ("faster", "more consistent") stay per §6.3.
5. Excel pin: guides `…from received documentation` → `…from the received
   Excel BoQ` (EN/SL/HR). Demo intro (all locales) new line: "Bring your
   Excel BoQs — that is the supported input today."
6. Onboarding route line in demo intro (all locales): "Guided demo → optional
   NDA preview → annual onboarding with a 14-day acceptance period."
7. `footer.about.body` "AI-powered…" stays (AI as how, not why — §6.1 tolerates).

**Acceptance:** `grep -rniE "82%|5×|5x|95%|measured in practice|real results|free trial|protects your profits" src/i18n` → 0 hits (excluding GDPR "95/46/EC" and guide prose that isn't a claim); `npm run check` green; e2e green; homepage renders without Results in all 3 locales; HR strings listed in PR body for native pass.

## 5. Workstream B — qualification form, lead schema, scoring, attribution

### 5.1 Form (`src/components/forms/DemoForm.astro`)

Field order (required marked *):
`fullName*`, `email*`, `company*`, `country*` (select), `role*` (chips, +
`project-manager`), `companySize*` (chips), `mainChallenge*` (chips),
`estimatingMethod` (chips), `bidFrequency` (chips), `ndaWilling` (chips),
`phone`, `message` (optional textarea "Anything else?"). Honeypot + hidden
`locale`, `page` unchanged. Attribution is merged into the JSON payload at submit by the form script (§5.4) — no hidden inputs.

Client validation extended for the new required fields (same `.field-error`
pattern). Chips reuse existing `.chip` styles.

### 5.2 Enums (values are the wire strings)

| Field | Values | Score |
|---|---|---|
| `country` | `NL BE DE DK SE NO FI AT SI HR EU-OTHER NON-EU` | `NL` +2 |
| `role` | `company-director estimator head-of-estimating commercial-manager operations-manager project-manager other` | director / PM / commercial / head-of-estimating +2 |
| `companySize` | `1-9 10-29 30-99 100-249 250+` | ≥30 bands +2 |
| `estimatingMethod` | `excel software mixed other` | `excel`/`mixed` +2 |
| `bidFrequency` | `weekly monthly few-per-year rarely` | `weekly`/`monthly` +2 |
| `mainChallenge` | `pricing-confidence subcontractor-quotes historical-reuse management-visibility other` | first two +2 |
| `ndaWilling` | `yes not-yet` | `yes` +2 |
| email domain | in `FREEMAIL_DOMAINS` (~25) | −2 |

`qualified = score >= 7`. −5 (student/job/vendor) is a human-review action, not code.
Existing role labels keep their i18n keys; chip values become slugs. On the wire, `lead.ts` maps the role slug back to its **English label** for the existing top-level `role` field (gtm-toolkit v1 maps `role → D365 jobtitle`, must stay human-readable) and puts the slug into `qualification.role`.

### 5.3 `src/pages/api/lead.ts`

- `Lead` type gains: `qualification: {country, role, companySize, mainChallenge, estimatingMethod, bidFrequency, ndaWilling}` (strings, `''` when absent), `attribution: {gclid, gbraid, wbraid, utm_source, utm_medium, utm_campaign, utm_term, utm_content, landingPage, referrer, submissionPage, submittedAt, consent}` (strings, `''` when absent; `consent` ∈ `accept|reject|unset`), `score: number`, `scoreReasons: string[]`, `qualified: boolean`.
- Validation: required set per §5.1; enum membership for chip fields (invalid → 400); attribution values length-capped (≤256) and character-filtered to the URL-safe set (RFC 3986 unreserved + reserved + `%` + space for decoded `utm_term`; anything else → `''`); `message` optional.
- `message` synthesis when blank: `Main challenge: <label> · <method> · <frequency> · <country> · <size>` (English labels; keeps gtm-toolkit v1 `min_length=1` satisfied and D365 subject informative).
- Pure `scoreLead(input): {score, reasons, qualified}` in `src/lib/leadScore.ts` and `parseLeadBody()` in `src/lib/leadPayload.ts`, unit-tested with Vitest (`tests/unit/`, `npm run test:unit` — the e2e harness cannot reach the on-demand `/api/lead` route); `lead.ts` becomes transport only.
- Response: `{ ok: true, forwarded: boolean, qualified: boolean, score: number }`.

### 5.4 Attribution capture (`src/scripts/attribution.js`, bundled via `site.js`)

- On every page load: parse `location.search` for `gclid gbraid wbraid utm_source utm_medium utm_campaign utm_term utm_content`; if any present **or** no stored record yet, write `sessionStorage['gv_attr'] = {…params, landingPage: pathname, referrer: document.referrer, at: ISO}` — first-touch, never overwritten within the session once set with a click id.
- On form submit: merge stored record + `submissionPage`, `submittedAt`, `consent` (from cookie `gv-consent`) into payload.
- No cookies; session-scoped; documented as functional storage in privacy policy (new paragraph, 3 locales) alongside the list of new form fields collected.

### 5.5 Contract + cross-repo

- `docs/lead-integration.md` §1/§2 → contract v2 (new keys, response body, enum tables, synthesis rule). Note: gtm-toolkit v1 ignores extra keys (`extra="ignore"`), so site can ship first.
- gtm-toolkit follow-up (separate repo/PR, tracked in readiness doc): extend `WebsiteLead` + envelope + D365 mapping (score/qualification → Lead fields or description; attribution → description/notes; `message` may be synthesized).

**Acceptance:** `npm run check`; e2e: fill + submit form on `/book-a-demo/` with `?gclid=x&utm_campaign=t` on landing → intercepted `/api/lead` request contains attribution + qualification; response has `qualified/score`; blank message path returns 200; SL/HR forms render all fields with translations.

## 6. Workstream C — Bookings embed (`src/components/forms/BookingEmbed.astro`)

- Props: `lang`, `refId` (page id); component reads `sessionStorage.gv_attr.utm_campaign` at reveal time and prefers it (sanitized) over `refId`.
- `SITE.bookingUrl` in `consts.ts` = `https://outlook.office.com/book/GradveraBookings@digitalsolutions.si/?ismsaljsauthenabled`; final src = `bookingUrl + '&RefID=' + ref`.
- Markup inside form-success block: intro line ("Pick a time — 30 min guided demo"), fallback `<a href target=_blank rel="noopener noreferrer">Open booking page</a>`, `<iframe title loading="lazy" data-src>` (no `src` until reveal), min-height 720px desktop / 100svh mobile-ish, `referrerpolicy="strict-origin-when-cross-origin"`.
- Reveal on success: set `src`, `dataLayer.push({event:'booking_widget_open', ref})`, `scrollIntoView`. Fires once.
- Placed on `/book-a-demo/`, `/sl/rezervirajte-demo/`, `/hr/rezervirajte-demo/`, LP. Copy keys `booking.*` in 3 locales.

**Acceptance:** e2e: after successful submit, iframe `src` set exactly once with `RefID=`; fallback link visible; no iframe network before submit.

## 7. Workstream D — analytics events + docs + e2e (same PR as C)

- `DemoForm.astro`: `qualification_form_start` on first `input`/`change` (once); `qualification_form_submit {form_id, locale, page, qualified, score}` on 2xx; `qualified_lead {form_id, locale, page, score}` when `qualified`. Remove `generate_lead`.
- `booking_widget_open {ref}` from C. `landing_page_view` = GTM page-path trigger, no code.
- `docs/lead-tracking-ga4.md` rewrite: events table (§11.1 subset that is client-observable), GTM trigger/tag names (`CE - qualification_form_submit` etc.), Ads conversion = `qualification_form_submit` **only** (§11.2 rule), consent-matrix checklist (§11.3) with columns date/tester/result. GTM dashboard edits are user actions listed explicitly.
- e2e spec `tests/e2e/lead-events.spec.ts`: dataLayer contains each event exactly once with expected params; `generate_lead` absent.

## 8. Workstream E — landing page

**Route:** `src/pages/construction-estimating-software/index.astro`, EN only, indexed, self-canonical.

**EN-only routes plumbing:** `src/i18n/slugs.ts` exports `EN_ONLY_ROUTES = new Set(['construction-estimating-software'])`; `alternates()` in `utils.ts` returns `[en, x-default]` for those; `astro.config.mjs` `serialize()` emits only `en` + `x-default` links and skips them from SL/HR sitemap alternates; priority 0.9. `SEO.astro` needs no new prop (uses `alternates()`).

**Sections (§7.2), components under `src/components/landing/`:**
1. `LpHero` — H1 "Construction estimating software for contractors in the Netherlands" (tune ≤ ~70 chars), sub-line = §6.1 primary message, CTA → `#book-a-demo`.
2. `LpWhoFor` — teams with recurring bids + historical Excel estimates.
3. `LpPainPricing` (`#pricing-review`) — "bid value requiring pricing review" wording (§4.2 caveat, never "loss/exposure").
4. `LpPainSubs` (`#subcontractor-quotes`) — fragmented quotations.
5. `HowItWorks` reuse or `LpHowItWorks` — import Excel → structure/match → review → prepare/manage (`#how-it-works`).
6. `ProductEvidence` — `shots: {src, alt, caption}[]`; empty → renders nothing; every caption prefixed "Sample data".
7. `LpCapabilities` — §3.1 list, workflow-phrased.
8. `LpTrust` — tenant isolation, data use, GDPR, NDA availability, DS relationship line.
9. `LpEvaluation` — demo → optional NDA 20-file preview → annual agreement + onboarding (~100 BoQs) → 14-day acceptance. "Not a free trial."
10. `LpCommercial` — per E5.
11. `LpFaq` (`#faq`) — data volume (~100 BoQs), Excel support, onboarding, security, preview, languages (app is multilanguage; sales in English).
12. `LpBook` (`#book-a-demo`) — `DemoForm` + `BookingEmbed`, `page="construction-estimating-software"`, refId `website-lp`.

**Copy:** `src/i18n/_parts/lp.en.json` keys `lp.*`, assembled into `en.json` (follow existing parts convention). No SL/HR keys.

**SEO:** title ≤60 (e.g. "Construction Estimating Software | Netherlands | Gradvera" — tune), description ≤160 mentioning Excel BoQ + pricing review + demo. JSON-LD via `SEO.astro jsonLd`: `SoftwareApplication` (`applicationCategory: BusinessApplication`, `operatingSystem: Web`, no `offers` price), `FAQPage` from §11 items, `BreadcrumbList`. Internal links per E7. OG image: default EN.

**Header:** header is already fixed (`.hdr`, `site.css:79`) with a "Book a demo" CTA (`Header.astro:25`) linking to `/book-a-demo/`. LP passes a new optional `ctaHref` prop to `Header` so the CTA points to `#book-a-demo` on the LP; default unchanged elsewhere.

**Acceptance:** `npm run check`; e2e: no horizontal overflow at 360/768/1280, anchors resolve, form + booking work on LP; built HTML: exactly 2 hreflang links (`en`, `x-default`), sitemap entry has no `sl`/`hr` links, JSON-LD types present; Lighthouse-ish sanity (static, no new third-party before conversion).

## 9. Workstream F — readiness, doc, graph

- `docs/acquisition-readiness.md`: §19 checklist as table with Evidence / PR / Date / Verifier; items owned by user (GTM config, Bookings branding, sample tenant, NDA process, keyword research) marked "external".
- `docs/confirmed-acquisition-model.md` → v1.1: §8.1 mark method/frequency/NDA/message optional (+ why: paid-traffic friction; scoring still reaches 7 on required fields), §7.1.7 slug + geo-in-copy, §11 response body + event names as built, changelog block.
- CLAUDE.md layout list: new route, `components/landing/`, `forms/BookingEmbed`, `lib/leadScore.ts`, `scripts/attribution.js`, new docs.
- `/graphify --update` folded into E's PR (structural change), verify no `users_katarov` absolute ids.

## 10. Testing strategy (per PR)

- `npm run check` (gate) + `npm run test:e2e` locally and in CI; new e2e specs listed in §5–8.
- HTML greps on `dist/` for claims (A), hreflang/sitemap (E), JSON-LD (A, E).
- Manual: GTM Preview consent matrix (D), test booking reconciled to test lead by email (§19), SL native check (A/B/C strings).
- Verification is done by the orchestrator re-running gates and reading output — subagent reports are claims (CLAUDE.md discipline).

## 11. Risks / open items

- gtm-toolkit v2 not deployed → attribution/score not persisted in D365 until then (still in site logs? no — lead.ts logs metadata only). Mitigation: synthesized `message` carries qualification into D365 subject from day 1; toolkit PR tracked in readiness doc.
- Screenshots external; LP ships without evidence section until PNGs arrive (E6).
- SL/HR native review lag (A6) — HR flagged.
- Ads/GTM/Bookings dashboard config are user actions; site cannot verify them — readiness doc records who/when.
