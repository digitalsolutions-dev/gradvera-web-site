# Lead integration

How a demo / contact submission travels from the Gradvera marketing website to
the CRM, and how the **gtm-toolkit** receives it.

```
 browser form            website endpoint                 gtm-toolkit (AWS Lambda)             D365
 (DemoForm.astro)  ──►   POST /api/lead          ──►      API Gateway → receiver Lambda
   JSON               validate + normalize                verify HMAC → SQS FIFO queue
                      HMAC-sign + forward                       │
                                                                ▼
                                                          consumer Lambda               ──►    Account + Lead
                                                          idempotency ledger → upsert
```

The website never talks to D365 directly. It validates, normalizes and signs
the lead, then forwards it to one HTTPS endpoint owned by the gtm-toolkit. The
toolkit is the only component holding CRM credentials.

Client-side conversion tracking for this form is documented in
[lead-tracking-ga4.md](lead-tracking-ga4.md).

---

## 1. Browser → `POST /api/lead`

Source: `src/components/forms/DemoForm.astro` (client) and
`src/pages/api/lead.ts` (server). `Content-Type: application/json`.

The browser posts the raw form fields (qualification form, contract **v2** —
acquisition model §8.1/§8.3; wire values for choice fields are the enum slugs
defined in `src/lib/leadScore.ts`):

```jsonc
{
  // ---- identity (required) ----
  "fullName":  "Ada Lovelace",            // required, non-empty
  "email":     "ada@analytical-engines.nl",// required, basic email regex
  "company":   "Analytical Engines BV",   // required, non-empty
  // ---- qualification (required unless noted) ----
  "country":   "NL",                      // required — NL BE DE DK SE NO FI AT SI HR EU-OTHER NON-EU
  "role":      "head-of-estimating",      // required — company-director estimator head-of-estimating commercial-manager operations-manager project-manager other
  "companySize": "30-99",                 // required — 1-9 10-29 30-99 100-249 250+
  "mainChallenge": "pricing-confidence",  // required — pricing-confidence subcontractor-quotes historical-reuse management-visibility other
  "estimatingMethod": "excel",            // optional — excel software mixed other
  "bidFrequency": "monthly",              // optional — weekly monthly few-per-year rarely
  "ndaWilling": "yes",                    // optional — yes not-yet
  "phone":     "+31 6 1234 5678",         // optional
  "message":   "We bid ~30 jobs/mo",      // optional free text ("Anything else?")
  // ---- context ----
  "locale":    "en",                      // optional, defaults to "en"
  "page":      "book-a-demo",             // optional, free-text origin hint
  // ---- first-touch attribution (optional; added by src/scripts/attribution.js) ----
  "gclid": "Cj0KCQ…", "gbraid": "", "wbraid": "",
  "utm_source": "google", "utm_medium": "cpc", "utm_campaign": "nl-estimating",
  "utm_term": "construction estimating software", "utm_content": "ad1",
  "landingPage": "/construction-estimating-software/",  // first page of the session
  "referrer": "https://www.google.com/",               // document.referrer on first touch
  "submissionPage": "/book-a-demo/",
  "submittedAt": "2026-08-19T09:59:50.000Z",           // browser clock — informational; receivedAt is authoritative
  "consent": "accept",                                 // accept | reject | unset (gv-consent cookie)
  "hp_field": ""                          // HONEYPOT (spam trap) — must stay empty (see below)
}
```

Attribution is captured on the first page of the browsing session from the URL
query (`gclid gbraid wbraid utm_*`), kept in `sessionStorage["gv_attr"]` (no
cookie, cleared when the tab closes; first touch wins) and merged into this
body on submit. Unknown keys are ignored server-side; an optional choice field
that is *present but not one of its enum values* is a validation error (400),
while an absent optional field is fine.

### Honeypot

`hp_field` is a spam trap: an input inside a `hidden` (`display:none`),
`aria-hidden` wrapper, labelled "Leave this field empty", `tabindex="-1"`,
`autocomplete="off"`. Real visitors never see, focus or fill it; bots that fill
every input do.

**Why `hidden` and a neutral name (2026-09-28).** The trap used to be
`company_website`, parked off-screen (`left:-9999px`). Browser autofill and
password managers ignore `autocomplete="off"`, fill off-screen fields and match
company/website wording, so a real visitor's saved company landed in the trap —
and the client, which early-returned on a filled trap, then silently did nothing
on submit. The trap is now unrendered, and neither its name nor its label uses
autofill-bait words (`tests/e2e/lead-form.spec.mjs` pins both).

**Confirmed mechanism (Chrome's own autofill engine, via CDP `Autofill.trigger`).**
Chrome classified `company_website` as *Company name* (`autofillInferred` —
`autocomplete="off"` ignored), so with two Company-name fields it split the form
into two autofill sections at the repeat, and the trap (first in the DOM) shared
a section with Full name. Autofill from Full name therefore filled only the trap
and `fullName`. The rule: never give a hidden or decoy field a name or label a
browser can map to a contact or address type — keep the trap unclassifiable. The
e2e group `spam trap vs Chrome autofill` pins this on the real engine (trap
empty with no autofill type; one section fills every contact field).

**The server decides.** The client no longer inspects the trap: it validates
the visible fields and POSTs the body, trap included. `/api/lead` treats the
body as tripped when `hp_field` **or the legacy `company_website`** (pages cached
before the rename, bots that scraped the old form) is a non-empty string
(`trippedHoneypot` in `src/lib/leadPayload.ts`). A tripped body gets
`200 {"ok":true}` and is **dropped** — never turned into a lead, never forwarded —
and the function logs one line:

```
[lead] honeypot tripped — submission dropped { field, wouldParse, locale?, page? }
```

`field` is the trap that fired; `wouldParse` says whether the rest of the body
would have passed validation (`true` hints at a real visitor whose browser filled
the trap); the normalized `locale` / `page` are added only when `wouldParse` is
`true`, and only as the values DemoForm sends (`en`/`sl`/`hr`;
`book-a-demo`/`construction-estimating-software`) — any other text is logged as
`other`. Never the trap's value or any personal field (`honeypotDropLog`,
unit-tested).

**Client on the drop reply.** Every real success carries a boolean `qualified`;
the drop reply does not. A 2xx body with `ok === true` and no boolean `qualified`
still shows the success card and the booking calendar (a wrongly trapped visitor
can still book), but pushes **no** `qualification_form_submit` /
`qualified_lead` — `booking_widget_open` still fires. See
[lead-tracking-ga4.md](lead-tracking-ga4.md).

### Validation

`src/lib/leadPayload.ts` (`parseLeadBody`, unit-tested in `tests/unit/`).
Required: `fullName`, `email` (regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`), `company`,
`country`, `role`, `companySize`, `mainChallenge` — the four choice fields must be
exact enum values. Optional choice fields must be valid when present. Attribution
values are trimmed, capped at 256 chars and must match the URL-safe charset
(Unicode letters/digits, `._~:/?#[]@!$&'()*+,;=%`, space) — otherwise they are
stored as `""`. `consent` is coerced to `accept | reject | unset`. On failure:

```
HTTP 400
{ "ok": false, "error": "invalid" }
```

### Responses

| Situation                                    | Status | Body                                 |
| -------------------------------------------- | ------ | ------------------------------------ |
| Valid lead, toolkit accepted (2xx)           | 200    | `{ "ok": true, "forwarded": true,  "qualified": bool, "score": n }` |
| Valid lead, toolkit rejected (non-2xx)       | 200    | `{ "ok": true, "forwarded": false, "qualified": bool, "score": n }` |
| Valid lead, forward threw / timed out        | 200    | `{ "ok": true, "forwarded": false, "qualified": bool, "score": n }` |
| Valid lead, no endpoint configured (logged)  | 200    | `{ "ok": true, "forwarded": false, "qualified": bool, "score": n }` |
| Honeypot tripped (dropped; logged, no PII)   | 200    | `{ "ok": true }`                     |
| Payload over 16 KB                           | 413    | `{ "ok": false, "error": "too_large" }` |
| Non-JSON `Content-Type`                      | 415    | `{ "ok": false, "error": "unsupported_media_type" }` |
| Missing/invalid field, or unparseable body   | 400    | `{ "ok": false, "error": "invalid" }` |
| `GET /api/lead`                              | 405    | `{ "error": "method not allowed" }`  |

`forwarded` is a **soft flag** for monitoring. The visitor always sees success
(HTTP 200) once the lead is valid, even if the downstream hand-off failed — we
never break the success UX over a transient toolkit outage. `forwarded:true`
means the toolkit answered **2xx** (it enqueued the lead); it does **not** by
itself prove the lead reached D365 — that happens later in the consumer (see
below). A `forwarded:false` that should have been `true` means one of:

- **the toolkit rejected it** (non-2xx — e.g. `401` bad/absent HMAC, `413` too
  large, `422` failed the lead contract, `429` API Gateway throttle, `5xx`
  outage): logged as
  `[lead] forward to GTM_LEAD_ENDPOINT rejected <status> <body-snippet>`;
- **the request never completed** (network/DNS error, or the **9 s timeout**
  aborting a hung receiver): logged as
  `[lead] forward to GTM_LEAD_ENDPOINT failed <err>`.

The forward is bounded by a **9 s timeout** (`FORWARD_TIMEOUT_MS`,
`AbortSignal.timeout`) so a slow or hung receiver can never stall the visitor's
request up to the function timeout. It was 5 s until 2026-09-28: the receiver
Lambda's first request after idle (cold start) takes ~5.6–6.7 s (as reported by
the gtm-toolkit side on 2026-09-28), which the 5 s bound aborted and reported as
`forwarded:false`. The receiver's API Gateway integration allows 10 s
(gtm-toolkit `deploy/terraform/apigw.tf`), so 9 s keeps cold-start leads
`forwarded:true` while staying under that limit. The website function itself is
pinned to a **15 s** max duration (`vercel({ maxDuration: 15 })` in
`astro.config.mjs`, allowed on every Vercel plan) so it outlives the 9 s abort
with room to log and reply — the plan default can be as low as 10 s.
Check the website function logs for the two lines above to tell the cases apart.

The front-end (`DemoForm.astro`) shows the success card on any 2xx (`res.ok`).
`qualified` / `score` (acquisition model §8.2 — see `src/lib/leadScore.ts`;
threshold 7) are returned so client-side analytics can distinguish qualified
leads (pushed as `qualification_form_submit` / `qualified_lead`, see
`lead-tracking-ga4.md`); they carry no PII. A 2xx body with `ok:true` but no
boolean `qualified` (the honeypot reply) pushes neither — see **Honeypot** above;
a 2xx with a non-JSON body still pushes `qualification_form_submit` with
`qualified:false, score:0`.

---

## 2. Website → gtm-toolkit (the forwarded lead)

When `GTM_LEAD_ENDPOINT` is set, the endpoint normalizes the form into a stable
shape (contract **v2**) and POSTs **this exact JSON** as the request body:

```jsonc
{
  // ---- v1 keys (unchanged shape — the v1 receiver keeps working) ----
  "source":     "gradvera-website",        // constant — identifies the channel
  "receivedAt": "2026-08-19T10:00:00.000Z",// server timestamp, ISO-8601 UTC (authoritative)
  "locale":     "en",                      // "en" | "sl" | "hr"
  "page":       "book-a-demo",
  "fullName":   "Ada Lovelace",
  "company":    "Analytical Engines BV",
  "email":      "ada@analytical-engines.nl",
  "phone":      "+31 6 1234 5678",         // "" when not provided
  "role":       "Head of estimating",      // ENGLISH LABEL (→ D365 jobtitle); the slug is in qualification.role
  "message":    "We bid ~30 jobs/mo",      // NEVER blank — synthesized when the visitor left it empty (see below)
  // ---- v2 keys ----
  "qualification": {
    "country": "NL", "role": "head-of-estimating", "companySize": "30-99",
    "mainChallenge": "pricing-confidence", "estimatingMethod": "excel",
    "bidFrequency": "monthly", "ndaWilling": "yes"        // "" for optional fields left blank
  },
  "attribution": {
    "gclid": "Cj0KCQ…", "gbraid": "", "wbraid": "",
    "utm_source": "google", "utm_medium": "cpc", "utm_campaign": "nl-estimating",
    "utm_term": "construction estimating software", "utm_content": "ad1",
    "landingPage": "/construction-estimating-software/", "referrer": "https://www.google.com/",
    "submissionPage": "/book-a-demo/", "submittedAt": "2026-08-19T09:59:50.000Z",
    "consent": "accept"                                   // accept | reject | unset
  },
  "score": 14,                              // §8.2 sum (−2 … 14)
  "scoreReasons": ["country-nl","decision-role","size-30-plus","excel-history","recurring-bids","core-pain","nda-ready"],
  "qualified": true                         // score >= 7
}
```

Field notes for the receiver:

- `source` is always `"gradvera-website"`; `receivedAt` is set by the website.
- `phone`, `role`, `message` and every `qualification`/`attribution` member are
  always present as strings (`""` when blank) — except `consent`, which is one of
  the three literals.
- **`message` is never blank.** When the visitor leaves the optional textarea
  empty the website synthesizes a qualification digest so the v1 receiver's
  `message` `min_length=1` contract holds and the D365 Lead notes stay useful, e.g.
  `Main challenge: Pricing confidence · Method: Excel spreadsheets · Frequency: A few per month · Country: NL · Size: 30-99 · Role: Head of estimating · NDA: yes`
  (parts omitted when blank; `Demo request` if everything is blank).
- **`role` is the English label**, not the slug, so the v1 mapping `role → jobtitle`
  keeps producing readable values; the slug lives in `qualification.role`.
- The honeypot fields (`hp_field`, legacy `company_website`) and any extra
  browser fields are **stripped** — only the keys above are forwarded.
- **Receiver compatibility.** gtm-toolkit **accepts and persists this body as of
  its PR #145 (merged 2026-08-20)**: `WebsiteLead` parses the v2 keys (absent on
  v1 posts — fully backward compatible), the Lead **Topic** gains a
  `· <score> pts` / `· qualified` suffix, and a structured qualification +
  attribution block is appended under the visitor message on the Lead
  **description** (capped to D365's 2000-char Memo — the message is trimmed, the
  v2 block is kept). No new D365 columns. **Live in production since 2026-08-21**
  (end-to-end verified with a prod test lead — see
  `docs/acquisition-readiness.md` row 8; then receiver image `v9` on Fargate).
  Since **2026-09-27** the receiver runs on **AWS Lambda** (gtm-toolkit v1.32.0)
  — the same receiver/consumer code, with the Account rules tightened in v1.32.1
  and v1.32.3; see [gtm-toolkit receiver](#gtm-toolkit-receiver-implemented)
  below. A pre-#145
  receiver ignored the v2 keys, which is why the synthesized `message` also
  carries the qualification.

### Headers

```
content-type: application/json
x-gradvera-signature: sha256=<hex>      # present only when GTM_LEAD_SECRET is set
```

### HMAC signature

When `GTM_LEAD_SECRET` is configured, the website signs the request:

```
sig = HMAC_SHA256(secret = GTM_LEAD_SECRET, message = <exact JSON body bytes>)
header = "x-gradvera-signature: sha256=" + hex(sig)
```

Critical: the HMAC is computed over the **exact serialized JSON body** that is
sent on the wire (the string produced by `JSON.stringify(lead)`). The receiver
**must verify against the raw request body bytes**, not against a re-serialized
parse of the JSON — re-serializing can reorder keys or change whitespace and
will break verification. Read the raw body, verify, *then* parse.

If `GTM_LEAD_SECRET` is **not** set, no signature header is sent. For
production the secret must always be set so the receiver can reject forgeries.

Reference verification (Python, constant-time):

```python
import hmac, hashlib

def verify(raw_body: bytes, header: str | None, secret: str) -> bool:
    if not header or not header.startswith("sha256="):
        return False
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, header[len("sha256="):])
```

---

## 3. Environment variables

Set on the website (Vercel). See `.env.example`.

| Var                  | Scope        | Meaning                                                                 |
| -------------------- | ------------ | ----------------------------------------------------------------------- |
| `GTM_LEAD_ENDPOINT`  | server-only  | Public HTTPS URL of the gtm-toolkit inbound-lead receiver. Blank = log-only (no forward). |
| `GTM_LEAD_SECRET`    | server-only  | Shared secret for HMAC-SHA256 signing. Must match the toolkit's secret. Blank = no signature header. |

Neither is `PUBLIC_`-prefixed, so neither is ever exposed to client JS — they
are read only inside the serverless `/api/lead` function.

---

## gtm-toolkit receiver (implemented)

The receiving end lives in the **gtm-toolkit** repo (`src/gtm_toolkit/website/`)
and has run on **AWS Lambda since 2026-09-27** (gtm-toolkit v1.32.0; before that a
Fargate task). Operator guide: gtm-toolkit `deploy/README.md`; infrastructure:
`deploy/terraform/`. The public endpoint only verifies and enqueues; a separate
consumer does the D365 write, so a Dataverse hiccup never fails the website's
request.

```
GTM_LEAD_ENDPOINT = https://leads.gradvera.com/website/lead
  → Cloudflare (proxied CNAME) → API Gateway HTTP API — route POST /website/lead,
      10 s integration timeout, throttle 5 req/s (burst 20)
  → receiver Lambda  (website/lambda_receiver.py) — verify HMAC → validate →
      SQS FIFO send → 200 {"status":"queued"}
  → SQS FIFO queue — one message group, so exactly one D365 writer;
      3 failed receives → DLQ
  → consumer Lambda  (website/lambda_consumer.py) — idempotency ledger →
      consumer._ingest_lead → D365 Account + Lead
```

**Secret.** The toolkit's `WEBSITE_WEBHOOK_SECRET` (an SSM SecureString under
`/gtm/website/receiver/`, read at cold start) must equal the website's
`GTM_LEAD_SECRET`. The receiver verifies `x-gradvera-signature` against the
**raw body** (HMAC-SHA256, constant-time, `sha256=` prefix), exactly as §2
requires (verify → then parse). It is HMAC-only — there is no `?token=` fallback.

**Receiver responses** (`process_webhook` in `website/webhook_receiver.py`):
body over 64 KiB → `413`; bad/absent signature → `401`; unparseable JSON or a
non-object → `400`; a body that fails the `WebsiteLead` contract → `422`
(nothing queued); valid → `200 {"status":"queued"}`. A queue or cold-start
configuration failure → `500 {"status":"error"}`; above the throttle, API
Gateway answers `429` itself. Any non-2xx shows up on the website as
`forwarded:false` (§1).

**Write path** (`_ingest_lead` in `website/consumer.py`), per lead:

1. **Known person — no new Lead.** An **Open Lead** with that email is not
   rewritten; its `dso_handraise` flag is set so the rep sees the inbound
   hand-raise (the new message is not written to D365). An **active Contact**
   with that email is skipped and logged. Nothing else is written in either case.
2. **Account — matched by company name only.** One exact-name lookup
   (`name eq '<company>'`, company capped at 160 chars). The email domain is
   **never** a match key — there is no domain fallback (a free-mail host would
   merge unrelated companies); for a non-free-mail domain it is only a
   `websiteurl` hint, written when a new Account is created.
   - no match → **create** the Account (name + `websiteurl` hint);
   - Active match → **bind it as-is**: website input never modifies an existing
     Account — no rename, no `websiteurl` overwrite (v1.32.1);
   - deactivated match → **reactivate** it, state only (`statecode` 0 /
     `statuscode` 1, never a visitor-supplied value), and bind it (v1.32.3,
     commit `23831f5`). If D365 refuses the flip, the Lead is still created and
     bound to the inactive Account. An Active namesake wins over a deactivated one.
3. **Lead** created and bound to that Account, owned by
   `GTM_DEFAULT_LEAD_OWNER_ID`, `classify=False` (inbound skips the outbound
   role-bucket classifier), Product Interest = Gradvera (`WEBSITE_PRODUCT_INTEREST`).

Mapping: `fullName` → `firstname` (first word) / `lastname` (the rest; a one-word
name fills both), `company` → `companyname` (+ Account `name`), `email` →
`emailaddress1`, `phone` → `telephone1`, `role` → `jobtitle`. The rep-visible
Topic (`subject`) is `Website demo request — <company>` plus the v2
`· <score> pts` / `· qualified` suffix (≤ 250 chars). The visitor `message`,
verbatim, goes on the Lead `description` (notes) with the v2 qualification +
attribution block under it (2000-char cap: the message is trimmed and marked
`… [message truncated]`, the block is kept). Every other visitor string is cut to
its measured D365 column width. A lead D365 can never accept — an email over 100
chars, or a placeholder company (`Unknown`, `n/a`, `none`, any case) — is not
retried; it goes to the DLQ.

**Idempotent** on `(email, receivedAt)`: the receiver derives the SQS
deduplication id from it, and the consumer's DynamoDB ledger (SHA-256 of the key
only — no PII — 90-day TTL) makes a replay a no-op. **Failures:** a deterministic
failure (bad envelope, the unacceptable leads above, a D365 400/413) reaches the
DLQ within seconds; a transient one (auth, 429, 5xx, timeout) is retried about
every 30 min, 3 receives, then DLQ (14-day retention, alarmed). There is no
Smartlead enrollment on this path (gtm-toolkit's Smartlead integration was
decommissioned 2026-09-26).

**Local / manual path.** The same code runs without AWS:
`uvicorn --factory gtm_toolkit.website.webhook_receiver:build` (needs the
`[webhook]` extra) serves `POST /website/lead` into a file queue, and
`gtm website consume` (dry-run; `--apply` writes) drains it. Production does not
use it.

With `GTM_LEAD_ENDPOINT` blank, `/api/lead` validates and logs each lead
(metadata only — no PII) and the site keeps working.
