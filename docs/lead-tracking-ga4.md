# Lead conversion tracking (GA4 via GTM)

On a successful `/api/lead` POST, `DemoForm.astro` pushes to `window.dataLayer`:

```js
{ event: 'generate_lead', form_id: 'gv-demo-form', locale: 'en'|'sl'|'hr', page: 'book-a-demo' }
```

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
