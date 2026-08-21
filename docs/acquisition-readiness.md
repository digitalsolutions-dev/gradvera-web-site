# Acquisition readiness — evidence log (acquisition model §19)

**Purpose.** The Phase-0 gate (`docs/confirmed-acquisition-model.md` §13, §19): the
first Google Search campaign opens only when every row below is ✅ with evidence.
Website rows carry the PR / commit / test that proves them; dashboard and
operational rows are **user actions** — fill in Date · Who · Evidence when done.
Keep this file current; it is the single place the "are we ready?" question is
answered.

Status key: ✅ done (evidence linked) · 🟡 partly / pending a dependency · ⬜ open.

## §19 checklist

| # | Readiness item (§19) | Owner | Status | Evidence / where | Done (date · who) |
|---|---|---|---|---|---|
| 1 | Unsupported proof claims removed or transparently reframed | website | ✅ | PR #74 (WS-A): Results section removed, guarantee verbs softened; `tests/e2e/claims.spec.mjs` pins it | 2026-08-19 · Claude (controller) — merged + prod-probed |
| 2 | Free-trial messaging removed | website | ✅ | PR #74; `claims.spec` bans affirmative "free trial" on demo pages; LP states "not a free trial" (PR #77) | 2026-08-19 · Claude (controller) — merged + prod-probed |
| 3 | Netherlands landing page live and quality-checked | website | ✅ | PR #77 (WS-E): `/construction-estimating-software/` — indexed, hreflang en + x-default, sitemap 0.9, JSON-LD, e2e `landing.spec.mjs` (135-test suite green); prod-verified after merge | 2026-08-19 · Claude (controller) — merged + prod-probed |
| 4 | Page explains Excel support and the guided evaluation route | website | ✅ | PR #74 (demo intro, guides), PR #77 (LP §7.2 sections 5, 7, 9, 11) | 2026-08-19 · Claude (controller) — merged + prod-probed |
| 5 | Real product screenshots from the sample tenant present | user → website | ⬜ | Drop PNGs into `public/lp/` and fill `SHOTS` in `src/pages/construction-estimating-software/index.astro` (captions auto-prefixed "Sample data ·"); `ProductEvidence` stays hidden until then  | |
| 6 | Gradvera / DIGITAL SOLUTIONS relationship clear | website | ✅ | PR #74: footer line on every page + `Organization.brand`; LP trust section + Bookings fallback copy (PR #76/#77) | 2026-08-19 · Claude (controller) — merged + prod-probed |
| 7 | Qualification form collects the required fit + attribution data | website | ✅ | PR #75 (WS-B): `DemoForm` fields (§8.1 — method/frequency/NDA optional, see model v1.1), `src/lib/leadPayload.ts`, `tests/unit/*`, `tests/e2e/lead-form.spec.mjs` | 2026-08-19 · Claude (controller) — merged + prod-probed |
| 8 | A test lead is stored correctly with UTM and click identifiers | user (+ gtm-toolkit) | ✅ | Site sends contract v2 (`docs/lead-integration.md` §2); gtm-toolkit accepts + persists it (its PR #145, merged 2026-08-20). Receiver image `v9` deployed to Fargate 2026-08-21 (both services stable; signed smoke 200/401). Prod test lead with `gclid=TEST` / `utm_campaign=test` submitted via `POST /api/lead` → forwarded → consumed (`leads: 1, account_created: 1, created: 1`) → D365 Lead carries Topic suffix `· 14 pts · qualified` + qualification/attribution block (gclid TEST, UTM test/test/test, landing page, consent) | 2026-08-21 · Claude (controller) — deployed + prod-verified |
| 9 | Microsoft Bookings branded, embedded, direct-link fallback | website + user | 🟡 | Embed + fallback live (PR #76); **Bookings page configuration is a user action** — §9.2 checklist in `docs/lead-tracking-ga4.md` | |
| 10 | A test booking can be matched to the originating lead | user | ⬜ | Make one booking from the embed on prod with a test lead email; find it in Microsoft Bookings by that email; record in the §9.2 table in `docs/lead-tracking-ga4.md` (row 8) and here  | |
| 11 | Consent + analytics verified under accept and reject | user | ⬜ | §11.3 matrix (7 rows) in `docs/lead-tracking-ga4.md` — run in GTM Preview / Tag Assistant on staging, record Date · Tester · Result per row  | |
| 12 | Google Ads conversion records one valid form conversion exactly once | user | ⬜ | GTM steps 1–5 in `docs/lead-tracking-ga4.md` (conversion = `qualification_form_submit` only); verify on staging (consent matrix); then retire `generate_lead` (step 6)  | |
| 13 | Sample-tenant demo stable and rehearsed | user | ⬜ | §10.1 30-minute structure; record rehearsal date  | |
| 14 | NDA handling and the 20-file preview process ready | user | ⬜ | §10.2 governance (≤20 files, NDA first, ≤2/week, indicative only, human approval); NDA template location  | |
| 15 | Annual-agreement requirement for full onboarding reflected in sales materials | user | ⬜ | §10.3; demo script + proposal template  | |
| 16 | Lead stages, owner, response standard, weekly review operating | user | ⬜ | §15 stages 1–10 in the lead register; owner named; 1-business-day follow-up standard  | |
| 17 | Keyword research, negatives, ads, budget cap, stop conditions approved | user | ⬜ | §12.2–12.4, §13 Phase 1 cap (€500–€1,000 / 30–50 clicks, 2–3 weeks)  | |

## Dashboard & operational checklists (user actions)

- **GTM / GA4 / Ads** — `docs/lead-tracking-ga4.md` → "GTM container setup" steps 1–7 and the **Consent & verification matrix** (copy the rows here when done, or link the filled table).
- **Microsoft Bookings page** — `docs/lead-tracking-ga4.md` → "Microsoft Bookings page configuration (§9.2)" 8 rows.
- **Google Search Console** — request indexing for `/construction-estimating-software/`; after 2–3 weeks check query→page for homepage ↔ LP overlap ("construction cost estimating software" vs "construction estimating software").
- **Google Ads** — final URL = `https://gradvera.com/construction-estimating-software/`, display path e.g. `gradvera.com/estimating-software/netherlands`; Search only, NL location "present in", exact + phrase match, themes §12.2, negatives §12.3; no free-trial / percentage / speed claims (§12.4).
- **gtm-toolkit v2** — ✅ merged (gtm-toolkit PR #145, 2026-08-20) **and deployed** (receiver image `v9`, Fargate, 2026-08-21): `WebsiteLead` v2 fields + Topic score suffix + description block (see `docs/lead-integration.md` §2 "Receiver compatibility"); end-to-end prod-verified via row 8's test lead.

## Website deliverables shipped (Phase 0, §13)

| Workstream | PR | Merged | What |
|---|---|---|---|
| A claims & terminology | #74 | 2026-08-19 | Results section removed, DS relationship, guarantee verbs softened, Excel/sample-data/annual-route copy, `claims.spec` |
| B qualification form, scoring, attribution | #75 | 2026-08-19 | §8.1 fields, `leadScore`/`leadPayload` (contract v2), sessionStorage attribution, privacy p3, Vitest harness |
| C+D Bookings embed + events | #76 | 2026-08-19 | `BookingEmbed` (lazy iframe + link, RefID), §11.1 dataLayer events, `generate_lead` retired, `lead-tracking-ga4.md` |
| E landing page | #77 | 2026-08-19 | `/construction-estimating-software/`, EN-only route plumbing, internal links |
| F readiness + doc v1.1 | this PR | — | this file, acquisition-model v1.1, spec alignment |

## Open decisions carried from the model (§18) — unchanged

Onboarding fee + crediting; 14-day acceptance criteria; public pricing (LP shows structure only); second Nordic market; Dutch localization trigger; preview commercial terms; CRM/booking automation trigger; `gradvera.app` role; SURBL remediation timing.
