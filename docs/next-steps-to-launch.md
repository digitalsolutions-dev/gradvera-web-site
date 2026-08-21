# Next steps to Phase-1 launch

**What this is.** The ordered path from where the site is now to opening the
first Google Search Ads campaign. The **gate** is
`docs/acquisition-readiness.md` (§19): the campaign opens only when all 17 rows
are ✅. This file adds what that flat table can't show — **sequence, ownership,
dependencies, and the done-criteria** for each remaining row — so the work can
be picked up in the right order.

This is a **sequencing/execution plan, not a source of truth for copy or
behaviour.** Canonical checklists live where they already live
(`docs/lead-tracking-ga4.md`, `docs/confirmed-acquisition-model.md`); this doc
points at them. When behaviour changes, change the model or the readiness log —
not this file (model §20).

## Where we are (2026-08-21)

**7 of 17 rows ✅** — the whole website surface plus the lead pipeline end to end:

- Rows 1–4, 6–7 — website copy, LP, qualification form (PRs #74–#77, merged + prod-probed).
- Row 8 — lead pipeline **live and prod-verified**: site contract v2 → gtm-toolkit
  receiver image `v9` (Fargate) → D365 Lead with score suffix + qualification/
  attribution block. Deployed 2026-08-21.

**10 rows open.** One is website (blocked on your assets); nine are
dashboard/sales-ops actions you own.

## Ownership at a glance

| Track | Rows | Owner | Blocks launch? |
|---|---|---|---|
| A. LP screenshots | 5 | you supply PNGs → I wire | yes (row 5) |
| B. GTM / GA4 / Ads | 11, 12 | you (dashboard) | yes |
| C. Microsoft Bookings | 9, 10 | you (dashboard) | yes |
| D. Sales operations | 13, 14, 15, 16 | you | yes |
| E. Ads campaign approval | 17 | you | yes — final gate |

Tracks A–D are **independent of each other** — run them in parallel. Track E is
last: it is the go/no-go that consumes everything above.

## Critical path

```
A (screenshots) ─┐
                 ├─► all four green ─► E (ads approved) ─► OPEN Phase-1 campaign
B GTM ─► consent │
   matrix (11) ──► Ads conversion (12) ─┤
                 │
C Bookings cfg ──► test booking (10) ───┤
   (9) ──────────┘                       │
                 │
D demo(13)+NDA(14)+annual(15)+register(16)┘
```

The only **internal ordering** that matters:

- **B: GTM setup (steps 1–6) → consent matrix (row 11) → Ads conversion (row 12).**
  Row 12 cannot be verified until row 11's matrix is run — the matrix is what
  proves the conversion fires once, under both consent states.
- **C: Bookings page config (row 9) → test booking (row 10).** Can't book
  against an unconfigured page.
- **D: register (row 16) should exist before the demo rehearsal (row 13)** so
  the rehearsal exercises the real intake path — but this is soft.

Everything else is parallelizable. Nothing in B/C/D depends on A.

---

## Track A — LP screenshots (row 5) · website

**Blocked on:** sample-tenant PNGs from you.
**When they arrive, I do:** drop them in `public/lp/`, fill the `SHOTS` array in
`src/pages/construction-estimating-software/index.astro` (captions auto-prefixed
"Sample data ·"), which un-hides `ProductEvidence`; small PR + CI + staging sync.
**Done when:** LP renders the real screenshots on prod; row 5 → ✅.

> Standing reminder — this is the one website item left. Hand me the PNGs and it ships same session.

---

## Track B — GTM / GA4 / Google Ads · you (dashboard)

**Source of truth:** `docs/lead-tracking-ga4.md` → "GTM container setup" (steps
1–7) and the "Consent & verification matrix" (§11.3, 7 rows).

1. **GTM container (steps 1–6).** New DLVs (`qualified`, `score`, `ref`), four
   Custom-Event triggers, four GA4 event tags, mark `qualification_form_submit`
   as the key event, import **only** `qualification_form_submit` into Ads as the
   primary conversion, then retire `generate_lead` (trigger + tag + key-event).
2. **Publish, then run the consent matrix (row 11)** in GTM Preview / Tag
   Assistant on **staging.gradvera.com**. Fill Date · Tester · Result for all 7
   rows in the §11.3 table (that table is the home of the log).
3. **Confirm the Ads conversion (row 12):** matrix rows 3 + 7 together prove one
   valid `qualification_form_submit` conversion, exactly once, no duplicate on
   reload.

**Done when:** §11.3 matrix filled (row 11 ✅); Ads shows one conversion per
qualified submit with `generate_lead` retired (row 12 ✅).

**Gotchas:** conversion is `qualification_form_submit` **only** — never button
clicks, page views, or `booking_widget_open`. Consent-denied visitors send
cookieless modelled pings by design (matrix note).

---

## Track C — Microsoft Bookings · you (dashboard)

**Source of truth:** `docs/lead-tracking-ga4.md` → "Microsoft Bookings page
configuration (§9.2)" (8 rows). The embed + direct-link fallback already ship
(PR #76); only the Bookings page itself is unconfigured.

1. **Configure the page (row 9):** logo/brand, service "Gradvera estimating
   workflow demo" 30 min / 15 min buffer, description, DS-relationship + privacy
   wording, public booking (no org MS account), confirmation/reminder emails +
   customer time zone, **search indexing disabled**. Record who/when in §9.2
   rows 1–7.
2. **Test booking (row 10):** book from the embed on prod with a test-lead email,
   find it in Bookings by that email, match to the originating lead. Record in
   §9.2 row 8 and readiness row 10.

**Done when:** §9.2 rows 1–7 filled (row 9 ✅); test booking matched (row 10 ✅).

**Note:** booking events are reconciled manually by email — no site event fires
from inside the iframe (measurement limit §9.4). That's intended.

---

## Track D — Sales operations · you

Canonical detail in `docs/confirmed-acquisition-model.md`. Each is a
process/artifact you stand up once.

- **Row 13 — demo rehearsed.** §10.1 30-minute structure on the sample tenant;
  record the rehearsal date. (Do after row 16 exists, so intake is real.)
- **Row 14 — NDA + preview process.** §10.2 governance: ≤20 files, NDA first,
  ≤2 previews/week, indicative-only, human approval; record the NDA template
  location.
- **Row 15 — annual-agreement requirement in sales materials.** §10.3; reflected
  in the demo script + proposal template.
- **Row 16 — lead operations running.** §15 stages 1–10 in the lead register;
  named owner; 1-business-day follow-up standard; weekly review.

**Done when:** each row carries Date · Who · Evidence in the readiness log.

---

## Track E — Ads campaign approval (row 17) · you · FINAL GATE

**Do last** — it consumes A–D. Canonical detail:
`docs/confirmed-acquisition-model.md` §12.2–12.4, §13, plus the "Google Ads"
bullet in `docs/acquisition-readiness.md`.

- Keyword research + negatives (§12.2–12.3); ad copy with **no** free-trial /
  percentage / speed claims (§12.4).
- Final URL `https://gradvera.com/construction-estimating-software/`, display
  path e.g. `gradvera.com/estimating-software/netherlands`.
- Search only, NL location "present in", exact + phrase match.
- **Phase-1 budget cap approved:** €500–€1,000 / 30–50 clicks / 2–3 weeks (§13),
  with stop conditions.

**Done when:** research + negatives + ad copy + budget cap + stop conditions
approved and recorded (row 17 ✅).

---

## The launch gate

When all 17 §19 rows are ✅ — **open the Phase-1 campaign.** Nothing opens it
earlier; the readiness log is the single place the "are we ready?" question is
answered (model §13, §19).

## After launch (not gating — parallel/after)

- **GSC:** request indexing for `/construction-estimating-software/`; at 2–3
  weeks check query→page overlap (homepage "construction cost estimating
  software" vs LP "construction estimating software") for cannibalization.
- **Open model decisions (§18):** onboarding fee + crediting, 14-day acceptance
  criteria, public pricing, second Nordic market, Dutch localization trigger,
  preview commercial terms, CRM/booking automation trigger, `gradvera.app` role,
  SURBL remediation. Resolve as the programme runs; none gate Phase-1.

## Quick status table (mirror of §19 — keep the readiness log authoritative)

| Track | Row | Item | Status |
|---|---|---|---|
| A | 5 | LP screenshots | ⬜ blocked on your PNGs |
| B | 11 | Consent matrix verified | ⬜ |
| B | 12 | Ads conversion once, `generate_lead` retired | ⬜ |
| C | 9 | Bookings page configured | 🟡 embed live, page unconfigured |
| C | 10 | Test booking matched | ⬜ |
| D | 13 | Demo rehearsed | ⬜ |
| D | 14 | NDA + preview process | ⬜ |
| D | 15 | Annual agreement in sales materials | ⬜ |
| D | 16 | Lead operations running | ⬜ |
| E | 17 | Ads + budget approved (final gate) | ⬜ |
