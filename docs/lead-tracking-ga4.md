# Lead conversion tracking (GA4 via GTM)

On a successful `/api/lead` POST, `DemoForm.astro` pushes to `window.dataLayer`:

```js
{ event: 'generate_lead', form_id: 'gv-demo-form', locale: 'en'|'sl'|'hr', page: 'book-a-demo' }
```

The push happens client-side only after the API returns 2xx (the honeypot and
validation paths never fire it — these are two different mechanisms: the
client script early-returns on a filled honeypot before ever calling `fetch`,
while a non-JS bot that POSTs `/api/lead` directly gets a `200` response but
never runs the client-side script, so the push never fires either way). With
`PUBLIC_GTM_ID` unset the push still happens (inert — nothing consumes it).

Since the qualification form (contract v2, see `lead-integration.md`) the API
response also carries `qualified` / `score` (acquisition model §8.2). They are
not yet pushed to the dataLayer — the event model (`qualification_form_submit`,
`qualified_lead`, `booking_widget_open`, retiring `generate_lead`) is the
analytics workstream's change; until then `generate_lead` fires exactly as
before.

## GTM container setup (one-time, dashboard)

1. **Trigger** — Triggers → New → *Custom Event*, event name `generate_lead`.
   Name: `CE - generate_lead`.
2. **Tag** — Tags → New → *Google Analytics: GA4 Event*. Measurement ID: reuse
   the existing GA4 config tag's ID. Event name: `generate_lead`. Event
   parameters: `locale` → `{{DLV - locale}}`, `form_id` → `{{DLV - form_id}}`,
   `page` → `{{DLV - page}}` (create the three Data Layer Variables).
   Trigger: `CE - generate_lead`. Consent: default settings (Consent Mode v2
   gates it automatically).
3. **Key event** — GA4 Admin → Events → mark `generate_lead` as *key event*.
4. Publish the container. Verify in GTM Preview: submit the staging demo form,
   confirm the tag fires and the event lands in GA4 DebugView.

Note: consent-denied visitors send cookieless pings under Consent Mode v2;
counts in GA4 are modeled/partial by design.

## As built (configured + verified 2026-08-05)

Live in the production container / GA4 property `G-ET67VW5468`:

- Trigger `CE - generate_lead` (Custom Event), tag `GA4 - generate_lead`
  (GA4 Event), variables `DLV - locale` / `DLV - form_id` / `DLV - page`.
- `generate_lead` registered as a **GA4 key event** via *Create event → Create
  with code* (no default value, counted once per event).
- Verified end-to-end in GTM Preview: form submit → tag fired → hit sent to
  `G-ET67VW5468`, confirmed in Tag Assistant ("Hits sent") and GA4.
- Reporting home: GA4 → Reports → Engagement → Key events (locale/form_id/page
  arrive as event parameters).
