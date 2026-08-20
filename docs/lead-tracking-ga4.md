# Lead events & conversion tracking (GA4 / Google Ads via GTM)

The demo form (`src/components/forms/DemoForm.astro`, on `/book-a-demo/`,
`/sl/rezervirajte-demo/`, `/hr/rezervirajte-demo/` and any page that embeds
`DemoForm`) pushes these events to `window.dataLayer` (acquisition model
§11.1). Every payload is campaign/qualification metadata only — never a name,
email or company.

| Event | When | Payload | Use |
|---|---|---|---|
| `qualification_form_start` | first `input`/`change` inside the form, once per page load | `{form_id:'gv-demo-form', locale, page}` | diagnostic (form engagement) |
| `qualification_form_submit` | `/api/lead` answered 2xx, once | `{form_id, locale, page, qualified:boolean, score:number}` | **primary Google Ads conversion**; GA4 key event |
| `qualified_lead` | right after `qualification_form_submit`, only when `qualified === true` (score ≥ 7, see `src/lib/leadScore.ts`) | `{form_id, locale, page, score}` | sales KPI; later Ads optimisation target |
| `booking_widget_open` | the Microsoft Bookings iframe `src` is set (success state), once | `{form_id, locale, page, ref}` (`ref` = campaign RefID, never PII) | diagnostic — **not** a conversion |

`landing_page_view` (§11.1) is a GTM page-view trigger on the acquisition
landing page — no site code. `demo_booked`, `demo_attended`, `qualified_opportunity`,
`preview_started`, `annual_agreement_signed`, `onboarding_accepted` live in the
lead register / CRM, not in the dataLayer (§9.4, §11.2).

Mechanics: the pushes happen client-side only after the API returns 2xx — the
honeypot and validation paths never fire them (the client early-returns on a
filled honeypot before `fetch`; a non-JS bot that POSTs `/api/lead` directly
gets `200` but runs no client script). A 4xx/5xx/network failure pushes nothing
and leaves the calendar unloaded. With `PUBLIC_GTM_ID` unset the pushes still
happen (inert). `qualified`/`score` come from the API response (contract v2,
`docs/lead-integration.md`); if the 2xx body is not JSON they fall back to
`false` / `0` and the calendar is still revealed. `generate_lead` (the
2026-08-05 event) is retired — nothing in `src/` pushes it any more.

> **Interim measurement gap.** As soon as this ships, `generate_lead` stops
> firing, so the existing GA4 key event / Ads conversion goes silent until the
> GTM steps below are published. Recommended order: publish steps 1–5 **before**
> merging (the new triggers are inert until the site pushes the events), merge,
> verify on staging (matrix below, step 7), then retire `generate_lead`
> (step 6). Until steps 1–5 are live, **no lead conversion is recorded**.

## Bookings embed and its measurement limit (§9.4)

On success the form reveals `BookingEmbed.astro`: a direct link to the
Microsoft Bookings page (always visible; fallback for iframe-blocking browsers)
and an iframe whose `src` is set only after the 2xx — so no third-party request
happens before conversion. URL = `SITE.bookingUrl` + `&RefID=<ref>`, where
`ref` is the sanitized first-touch `utm_campaign` (lowercase, `[a-z0-9_-]`,
≤ 40) or the page default `website-demo-<locale>`. Campaign-level only — never a
prospect's name/email/company (§9.3).

The site **cannot observe a completed booking** inside the cross-domain
Microsoft iframe. During validation: track `qualification_form_submit`
(conversion) and `booking_widget_open` (diagnostic), then **reconcile actual
bookings manually in Microsoft Bookings by the lead's email** and record
booked/attended status in the lead register. Automate (Power Automate / CRM /
offline conversion import) only when volume makes manual reconciliation
unreliable (§9.4).

## GTM container setup (one-time, dashboard — user action)

1. **Variables** — Data Layer Variables `DLV - form_id`, `DLV - locale`,
   `DLV - page` (exist), plus new `DLV - qualified`, `DLV - score`, `DLV - ref`.
2. **Triggers** (Custom Event, exact names):
   `CE - qualification_form_start`, `CE - qualification_form_submit`,
   `CE - qualified_lead`, `CE - booking_widget_open`.
3. **GA4 Event tags** (one per trigger, same measurement ID as the config tag):
   event name = dataLayer event name; parameters `form_id`, `locale`, `page`
   (+ `qualified`, `score` on submit; `score` on qualified_lead; `ref` on
   booking_widget_open). Consent: default settings (Consent Mode v2 gates
   automatically).
4. **Key event** — GA4 Admin → Events: mark `qualification_form_submit` as a key
   event (create with code, no default value, once per event). Optionally
   `qualified_lead` too (reporting only).
5. **Google Ads conversion** — link GA4 → Ads and import **only**
   `qualification_form_submit` as the primary conversion (§11.2). Do **not**
   configure button clicks, page views or `booking_widget_open` as conversions.
   Move optimisation to `qualified_lead` / offline imports only once volume and
   reconciliation are reliable (§11.2 hierarchy).
6. **Retire the old setup** — pause/delete trigger `CE - generate_lead`, tag
   `GA4 - generate_lead`, and unmark the `generate_lead` key event (the site no
   longer pushes it). Keep the historical data.
7. Publish; verify in GTM Preview on staging (below).

## Consent & verification matrix (§11.3 — manual, GTM Preview / Tag Assistant)

e2e (`tests/e2e/lead-events.spec.mjs`) proves the dataLayer pushes are correct
and fire exactly once; what GTM/GA4/Ads do with them under Consent Mode must be
verified by hand on **staging.gradvera.com** (same container) after each GTM
change. Record Date · Tester · Result per row **here** (this table is the
home of the log; `docs/acquisition-readiness.md` §19 rows 11–12 link to it):

| # | Scenario | Expect | Date | Tester | Result |
|---|---|---|---|---|---|
| 1 | Page load, no consent choice yet | GTM loads; GA4 config sends cookieless pings only (gcs=G100); no marketing cookies | | | |
| 2 | Reject, then submit the form | `qualification_form_submit` tag fires in Consent Mode "denied" (cookieless, modelled); no ad cookies | | | |
| 3 | Accept, then submit the form | GA4 event with parameters; Ads conversion recorded once; no duplicate | | | |
| 4 | Submit → success → calendar revealed | `booking_widget_open` fires once with `ref`; no conversion counted for it | | | |
| 5 | Land with `?gclid=…&utm_campaign=…`, navigate, submit | lead record carries attribution (contract v2); `ref` = sanitized utm_campaign | | | |
| 6 | Across the booking flow (iframe) | no site event fires from inside the iframe; booking reconciled manually by email | | | |
| 7 | Reload after submit | no second `qualification_form_submit` | | | |

Note: consent-denied visitors send cookieless pings under Consent Mode v2;
counts in GA4 are modelled/partial by design.

## Microsoft Bookings page configuration (§9.2 — user action)

The embed goes live with this PR; the page itself is configured in Microsoft
Bookings (not in this repo). Record who/when **here** (`docs/acquisition-readiness.md` §19 rows 9–10 link to this table):

| # | Setting | Done (date · by) |
|---|---|---|
| 1 | Gradvera logo + brand styling | |
| 2 | Service title "Gradvera estimating workflow demo", 30 min, 15 min buffer | |
| 3 | Short description of what the meeting covers | |
| 4 | Gradvera / DIGITAL SOLUTIONS relationship disclosed; data-use / privacy wording | |
| 5 | Public booking without an organizational Microsoft account | |
| 6 | Confirmation + reminder emails enabled; customer time zone shown | |
| 7 | Search indexing disabled | |
| 8 | Test booking made from the embed and matched to the originating test lead by email (§19) | |

## History

- **2026-08-05** — `generate_lead` push + GTM trigger `CE - generate_lead`, tag
  `GA4 - generate_lead`, DLVs `locale`/`form_id`/`page`; verified end-to-end in
  GTM Preview (property `G-ET67VW5468`). **Superseded 2026-08-19** by the event
  model above (site side shipped; dashboard steps 1–7 pending — fill in the
  date when done).
