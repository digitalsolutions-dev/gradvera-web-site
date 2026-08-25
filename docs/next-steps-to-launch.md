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
points at them and turns them into click-by-click steps. **If a step here ever
disagrees with the canonical doc, the canonical doc wins** — and fix this file.
When behaviour changes, change the model or the readiness log — not this file
(model §20).

## Where we are (as of 2026-08-24)

**8 of 17 rows ✅** — the whole website surface plus the lead pipeline end to end:

- Rows 1–4, 6–7 — website copy, LP, qualification form (PRs #74–#77, merged + prod-probed).
- Row 5 — LP product evidence shipped as coded reproductions (PR #82).
- Row 8 — lead pipeline **live and prod-verified**: site contract v2 → gtm-toolkit
  receiver image `v9` (Fargate) → D365 Lead with score suffix + qualification/
  attribution block. Deployed 2026-08-21.

**9 rows open — all of them are dashboard / sales-ops actions you own.** No
website work is left on the launch path.

> ⚠️ **Time-sensitive:** the site already ships the new events and **retired the
> old `generate_lead` conversion**. Until Track B (steps 1–5) is published, **no
> Google Ads lead conversion is being recorded at all** (`docs/lead-tracking-ga4.md`,
> "Interim measurement gap"). That makes **Track B the most urgent** of the open
> tracks — every day it's unpublished is a day of un-measured form submits.

## Ownership at a glance

| Track | Rows | Owner | Blocks launch? |
|---|---|---|---|
| A. LP reproductions | 5 | website (coded) | ✅ shipped |
| B. GTM / GA4 / Ads | 11, 12 | you (dashboard) | yes — **and measurement is dark until done** |
| C. Microsoft Bookings | 9, 10 | you (dashboard) | yes |
| D. Sales operations | 13, 14, 15, 16 | you | yes |
| E. Ads campaign approval | 17 | you | yes — final gate |

Tracks B–D are **independent of each other** — run them in parallel. Track E is
last: it is the go/no-go that consumes everything above.

## Critical path

```
A (reproductions) ✅┐
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

## Track A — LP reproductions (row 5) · website · ✅ DONE

**Shipped (PR #82).** Instead of raster screenshots, the LP `ProductEvidence`
section now renders **four coded app-window reproductions** — the four workflow
steps — reusing the homepage `winbar app`/`gv-screen` pattern. On-brand,
responsive, accessible, no capture step, no GDPR surface. Honestly framed as
illustrations (caption prefix "Illustration ·"), never as screenshots. Model
amended to v1.2 (§7.2.6/§7.3/§19).

> No user PNGs needed — this row is closed by the website.

---

## Track B — GTM / GA4 / Google Ads · you (dashboard) · ⚠️ do this first

**Goal:** make `qualification_form_submit` the one Google Ads conversion, fire
it exactly once, and verify it works under both consent choices.

**Source of truth:** `docs/lead-tracking-ga4.md` → "GTM container setup" (steps
1–7) and the "Consent & verification matrix" (§11.3, 7 rows). The event names
and parameters below are copied from there — **use those exact spellings.**

### Before you start — access you need

- **Edit access** to the site's existing **Google Tag Manager** container (the
  one that already holds the GA4 config tag).
- **Admin** on the **GA4 property** — you'll mark a key event. Use the **same
  Measurement ID** the existing GA4 config tag uses; don't create a new one.
- Access to the **Google Ads account** that is (or will be) linked to that GA4
  property, so you can import the conversion.
- **staging.gradvera.com** open in a browser — that's where you verify (same GTM
  container as production).

### Step 1 — Create the three new Data Layer Variables

In GTM → **Variables → User-Defined → New → Data Layer Variable**. Create one for
each, naming the *Data Layer Variable Name* exactly and the GTM variable as
shown:

| GTM variable name | Data Layer Variable Name |
|---|---|
| `DLV - qualified` | `qualified` |
| `DLV - score` | `score` |
| `DLV - ref` | `ref` |

(`DLV - form_id`, `DLV - locale`, `DLV - page` already exist — reuse them.)

### Step 2 — Create the four Custom-Event triggers

GTM → **Triggers → New → Trigger type: Custom Event**. The *Event name* must
match the dataLayer event **character-for-character**:

| Trigger name | Event name |
|---|---|
| `CE - qualification_form_start` | `qualification_form_start` |
| `CE - qualification_form_submit` | `qualification_form_submit` |
| `CE - qualified_lead` | `qualified_lead` |
| `CE - booking_widget_open` | `booking_widget_open` |

### Step 3 — Create the four GA4 Event tags

GTM → **Tags → New → Tag type: GA4 Event**. Select the same GA4 config /
Measurement ID as the existing config tag. One tag per event, *Event Name* =
the dataLayer event name, *Event Parameters* mapping to the DLVs, triggered by
its matching `CE -` trigger. Leave **Consent Settings at default** — Consent
Mode v2 gates them automatically (do **not** hand-force "no additional consent").

| Tag | Event Name | Parameters (name → value) | Trigger |
|---|---|---|---|
| `GA4 - qualification_form_start` | `qualification_form_start` | `form_id`→`{{DLV - form_id}}`, `locale`→`{{DLV - locale}}`, `page`→`{{DLV - page}}` | `CE - qualification_form_start` |
| `GA4 - qualification_form_submit` | `qualification_form_submit` | above **+** `qualified`→`{{DLV - qualified}}`, `score`→`{{DLV - score}}` | `CE - qualification_form_submit` |
| `GA4 - qualified_lead` | `qualified_lead` | `form_id`, `locale`, `page` **+** `score`→`{{DLV - score}}` | `CE - qualified_lead` |
| `GA4 - booking_widget_open` | `booking_widget_open` | `form_id`, `locale`, `page` **+** `ref`→`{{DLV - ref}}` | `CE - booking_widget_open` |

### Step 4 — Mark the key event

**GA4 Admin → Events (Key events).** Mark **`qualification_form_submit`** as a
key event. If it isn't listed yet, either submit the form once on staging so it
appears, or use "Create event" / the manual toggle. (You may also mark
`qualified_lead` — reporting only, not a conversion.)

### Step 5 — Import the one Google Ads conversion

**Google Ads → Goals → Conversions.** Link GA4 → Ads if not already linked, then
import **only** `qualification_form_submit` and set it as the **Primary**
conversion. **Do not** import or configure button clicks, page views, or
`booking_widget_open` as conversions.

### Step 6 — Retire the old `generate_lead` setup

Pause/delete the old trigger `CE - generate_lead`, the tag `GA4 - generate_lead`,
and unmark the `generate_lead` key event. Keep the historical data. (The site no
longer pushes `generate_lead`.)

### Step 7 — Publish and verify (this is row 11)

1. GTM → **Submit → Publish** the container version.
2. Open **Tag Assistant / GTM Preview** against **staging.gradvera.com** and walk
   the **§11.3 matrix** in `docs/lead-tracking-ga4.md` — all **7 rows**. Fill in
   **Date · Tester · Result** in that table; **that table is the log** (readiness
   row 11 just links to it).

### Step 8 — Confirm the Ads conversion once (this is row 12)

Matrix **rows 3 + 7 together** are the proof: row 3 = one conversion recorded on
an accepted submit; row 7 = **no second** conversion on reload. When both pass
and `generate_lead` is retired, row 12 is ✅.

**Done when:** §11.3 matrix filled (**row 11 ✅**); Ads shows exactly one
conversion per qualified submit with `generate_lead` retired (**row 12 ✅**).

**Gotchas.**
- The conversion is `qualification_form_submit` **only** — never button clicks,
  page views, or `booking_widget_open`.
- Consent-denied visitors still send **cookieless, modelled** pings by design;
  their counts in GA4 are partial on purpose (matrix note).
- Move optimisation deeper (to `qualified_lead` / offline imports) **only later**,
  once volume and manual reconciliation are reliable (§11.2 hierarchy).

---

## Track C — Microsoft Bookings · you (dashboard)

**Goal:** turn the already-embedded Bookings link into a branded, publicly
bookable demo page, then prove one booking can be traced back to its lead.

**Source of truth:** `docs/lead-tracking-ga4.md` → "Microsoft Bookings page
configuration (§9.2)" (8 rows). The embed + direct-link fallback already ship
(PR #76); only the Bookings page itself is unconfigured.

### Before you start — access you need

- A **Microsoft Bookings** licence and the ability to create/edit a Bookings
  **calendar** for Gradvera.
- The **Gradvera logo** and the short service description text.
- The privacy / DS-relationship wording (mirror what the site footer + LP trust
  section already say — see `docs/confirmed-acquisition-model.md` §3 / the LP
  trust copy).

### Step 1 — Configure the page (row 9)

In the Microsoft Bookings admin for this calendar, set each of the **§9.2
settings** and record who/when in **rows 1–7 of that table**:

1. **Branding** — upload the Gradvera logo, apply brand colour.
2. **Service** — title **"Gradvera estimating workflow demo"**, **30 min**
   duration, **15 min buffer** after.
3. **Description** — a short paragraph of what the meeting covers (discovery →
   relevant workflow → data/implementation → next step; mirrors demo §10.1).
4. **Trust wording** — disclose the **Gradvera / DIGITAL SOLUTIONS** relationship
   and add plain data-use / privacy wording.
5. **Public booking** — allow booking **without** requiring the visitor to sign
   in with an organizational Microsoft account.
6. **Emails + time zone** — enable **confirmation and reminder** emails; show the
   **customer's** time zone.
7. **Search indexing disabled** — so the Bookings page is not indexed by search
   engines.

### Step 2 — Make a test booking and match it (row 10)

1. On **production**, submit the demo form with a **test-lead email** you control
   (this reveals the embed).
2. From the embed, **book a slot** with that same email.
3. In **Microsoft Bookings**, find the booking **by that email** and confirm it
   matches the originating test lead.
4. Record it in **§9.2 row 8** and in readiness **row 10**.

**Done when:** §9.2 rows 1–7 filled (**row 9 ✅**); test booking found and matched
by email (**row 10 ✅**).

**Note:** the site **cannot** see a completed booking inside the Microsoft iframe
(cross-domain). Bookings are reconciled **manually by email** and the
booked/attended status is written into the lead register (measurement limit
§9.4). That's intended — don't try to add a site event for it.

---

## Track D — Sales operations · you

**Goal:** stand up the four repeatable sales artifacts/processes the campaign
feeds into. Each is set up **once**. Canonical detail:
`docs/confirmed-acquisition-model.md` §10 and §15.

### Before you start — what you're producing

A short **demo script**, an **NDA template + preview rulebook**, a **proposal
template**, and a **lead register** (spreadsheet or CRM) with an owner. None
require engineering.

### Row 13 — Demo rehearsed (§10.1)

Rehearse the **30-minute guided demo on the sample tenant**, structured as:

1. **Discovery — 5 min:** workflow, bid volume, team, historical data, main pain.
2. **Relevant workflow — 15 min:** show **only** the capabilities tied to the
   prospect's stated pain (pricing-confidence review, subcontractor quotes,
   historical-price reuse, or management visibility) — **not** a generic tour.
3. **Data & implementation — 5 min:** Excel files, knowledge-base requirement,
   security, NDA, annual onboarding.
4. **Next step — 5 min:** no-fit / commercial follow-up / qualified preview.

**Do after Row 16 exists**, so the rehearsal uses the real intake path.
**Done when:** rehearsal **date** recorded in readiness row 13.

### Row 14 — NDA + 20-file preview process (§10.2)

Write down the governance and where the NDA template lives:

- **≤ 20** Excel BoQ files per preview.
- **NDA signed before** any customer data is received.
- Offered **only after** commercial + technical qualification.
- **≤ 2** previews per week **company-wide**.
- Framed as **indicative** on a limited dataset — **no** promise it equals the
  full ~100-file setup.
- A clear **success question agreed before** work starts.
- **Human approval required** before a preview is offered.

**Done when:** the rulebook + NDA-template location are recorded (row 14).

### Row 15 — Annual-agreement requirement in sales materials (§10.3)

Make sure the **demo script and proposal template** state:

- A **signed annual agreement** is required before the full ~100-BoQ import.
- Onboarding terms/fee agreed commercially; Professional user gets setup guidance.
- A **14-day acceptance** period follows onboarding — **never** described as a
  free trial.
- Accept/delay/reject **reasons are recorded** for learning.

**Done when:** the annual requirement is reflected in the demo script + proposal
template (row 15).

### Row 16 — Lead operations running (§15)

Stand up the **lead register** with the **10 stages** and a response standard:

1. Stages: New submission → Qualified/unqualified → Demo booked → Attended/no-show
   → Opportunity/no-fit → NDA requested/signed → Preview approved/started/completed
   → Commercial offer → Annual agreement signed/lost → Onboarding started/accepted.
   **Every lost/unqualified lead gets a reason code.**
2. Name **one owner**.
3. **Response standard:** calendar offered immediately on submit; unbooked
   qualified leads get a **personal follow-up within one business day**; demo
   notes recorded the same day; preview requests get a capacity/fit decision
   before data is accepted.
4. Put a **weekly review** on the calendar (spend by theme, actual search terms +
   negatives added, form behaviour — §15.3).

**Done when:** register exists with stages + named owner + 1-business-day standard
+ weekly review, recorded in row 16.

**Done (all of D) when:** each of rows 13–16 carries **Date · Who · Evidence** in
the readiness log.

---

## Track E — Ads campaign approval (row 17) · you · FINAL GATE

**Do last** — it consumes A–D. Canonical detail:
`docs/confirmed-acquisition-model.md` §12 (launch model), §13 (phases/budget),
plus the "Google Ads" bullet in `docs/acquisition-readiness.md`.

### Before you start

Google Ads account access + Keyword Planner; Tracks B and C green (so the
conversion and the booking path actually work when traffic arrives).

### Step 1 — Keywords (validate in Keyword Planner, §12.2)

Start from these themes, then confirm real NL volume before setup:
construction estimating software · construction bid/tender estimating software ·
BoQ estimating + historical price management · construction bid-risk / estimate
review · subcontractor quotation management. **Don't** let generic "AI
construction" terms lead the budget (research intent, not buying intent).

### Step 2 — Negative keywords (§12.3)

Add negatives up front: jobs/salary/career · course/training/certification/
student · free/template/sample/PDF/download · calculator/formula/definition ·
residential/home-renovation quotes · unrelated bidding/auctions/gambling/
procurement notices · software-development / AI-dev services. Then **review
search-term reports frequently in the first two weeks** and expand negatives from
real traffic.

### Step 3 — Ad copy (§12.4)

- **Do:** name the construction-estimating context; lead with pricing review,
  historical-estimate reuse, or subcontractor transparency; CTA "Book a demo" or
  "See the workflow"; mention Excel history where it helps qualification; send
  every ad to the acquisition page.
- **Must not:** free trial · unsupported percentages or speed claims · imply
  customer adoption that doesn't exist · guaranteed savings/risk reduction ·
  "free customer-data analysis" as a blanket offer.

### Step 4 — Campaign settings (§12.1)

Final URL **`https://gradvera.com/construction-estimating-software/`**; display
path e.g. `gradvera.com/estimating-software/netherlands`. **Search only**;
**Netherlands**, location = **"present in"** (not "interested in"); **exact +
phrase** match; a few tightly-related ad groups. **No** Display, Performance Max,
broad match, or auto market-expansion during validation.

### Step 5 — Budget cap + stop conditions (§13, Phase 1)

- **Cap:** enough for ~**30–50 high-intent clicks**, provisionally **€500–€1,000**,
  over **2–3 weeks**. Budgets are **caps, not targets** — stop early on clearly
  negative evidence.
- **Continue** if search terms are relevant and qualified buying behaviour appears
  (≥70% relevant clicks, CTR normally ≥4%, form-starts visible, ≥1 credible
  qualified lead).
- **Revise** if terms are relevant but page/form engagement is weak.
- **Stop** if traffic stays mostly informational/irrelevant after keyword +
  negative-keyword corrections.
- Keep the **economic ceiling** in mind: pay **no more than 15–20% of first-year
  subscription** (~€4,788 base) to acquire a signed customer (§14).

**Done when:** keywords + negatives + ad copy + campaign settings + budget cap +
stop conditions are approved and recorded (**row 17 ✅**).

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
| A | 5 | LP reproductions | ✅ shipped (PR #82) |
| B | 11 | Consent matrix verified | ⬜ |
| B | 12 | Ads conversion once, `generate_lead` retired | ⬜ (**measurement dark until done**) |
| C | 9 | Bookings page configured | 🟡 embed live, page unconfigured |
| C | 10 | Test booking matched | ⬜ |
| D | 13 | Demo rehearsed | ⬜ |
| D | 14 | NDA + preview process | ⬜ |
| D | 15 | Annual agreement in sales materials | ⬜ |
| D | 16 | Lead operations running | ⬜ |
| E | 17 | Ads + budget approved (final gate) | ⬜ |
