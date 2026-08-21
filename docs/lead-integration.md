# Lead integration

How a demo / contact submission travels from the Gradvera marketing website to
the CRM, and how the **gtm-toolkit** receives it.

```
 browser form            website endpoint                 gtm-toolkit                     D365
 (DemoForm.astro)  ──►   POST /api/lead          ──►      inbound-lead webhook    ──►     Lead
   JSON               validate + normalize             verify HMAC + upsert_lead
                      HMAC-sign + forward              (optionally enroll smartlead)
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
  "company_website": ""                   // HONEYPOT — must stay empty (see below)
}
```

Attribution is captured on the first page of the browsing session from the URL
query (`gclid gbraid wbraid utm_*`), kept in `sessionStorage["gv_attr"]` (no
cookie, cleared when the tab closes; first touch wins) and merged into this
body on submit. Unknown keys are ignored server-side; an optional choice field
that is *present but not one of its enum values* is a validation error (400),
while an absent optional field is fine.

### Honeypot

`company_website` is a hidden field. Real visitors never see or fill it; bots
do. If it arrives **non-empty**, the endpoint returns `200 {"ok":true}` and
**silently drops** the lead — the bot believes it succeeded and nothing is
forwarded.

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
| Honeypot tripped                             | 200    | `{ "ok": true }`                     |
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
  large, `422` failed the lead contract, `5xx` outage): logged as
  `[lead] forward to GTM_LEAD_ENDPOINT rejected <status> <body-snippet>`;
- **the request never completed** (network/DNS error, or the **5 s timeout**
  aborting a hung receiver): logged as
  `[lead] forward to GTM_LEAD_ENDPOINT failed <err>`.

The forward is bounded by a **5 s timeout** (`AbortSignal.timeout`) so a slow or
hung receiver can never stall the visitor's request up to the function timeout.
Check the website function logs for the two lines above to tell the cases apart.

The front-end (`DemoForm.astro`) only checks `res.ok` (the HTTP status), so any
200 shows the success card. `qualified` / `score` (acquisition model §8.2 — see
`src/lib/leadScore.ts`; threshold 7) are returned so client-side analytics can
distinguish qualified leads (pushed as `qualification_form_submit` /
`qualified_lead`, see `lead-tracking-ga4.md`); they carry no
PII.

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
  `message` `min_length=1` contract holds and the D365 subject stays useful, e.g.
  `Main challenge: Pricing confidence · Method: Excel spreadsheets · Frequency: A few per month · Country: NL · Size: 30-99 · Role: Head of estimating · NDA: yes`
  (parts omitted when blank; `Demo request` if everything is blank).
- **`role` is the English label**, not the slug, so the v1 mapping `role → jobtitle`
  keeps producing readable values; the slug lives in `qualification.role`.
- The honeypot field and any extra browser fields are **stripped** — only the
  keys above are forwarded.
- **Receiver compatibility.** gtm-toolkit **accepts and persists this body as of
  its PR #145 (merged 2026-08-20)**: `WebsiteLead` parses the v2 keys (absent on
  v1 posts — fully backward compatible), the Lead **Topic** gains a
  `· <score> pts` / `· qualified` suffix, and a structured qualification +
  attribution block is appended under the visitor message on the Lead
  **description** (capped to D365's 2000-char Memo — the message is trimmed, the
  v2 block is kept). No new D365 columns. Note: the change is live only once the
  updated receiver image is deployed; a pre-#145 receiver still ignores the v2
  keys, in which case the synthesized `message` carries the qualification into
  the D365 subject.

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

The receiving end lives in the **gtm-toolkit** repo as the `gtm_toolkit.website`
module (mirrors the Smartlead webhook receiver: Starlette + HMAC, decoupled
queue + consumer — the public endpoint never blocks on D365).

**Endpoint — `POST /website/lead`**, run as a service (not a CLI):

```bash
# in gtm-toolkit; needs the [webhook] extra (starlette + uvicorn)
uvicorn --factory gtm_toolkit.website.webhook_receiver:build
```

Point the website's `GTM_LEAD_ENDPOINT` at the deployed URL, e.g.
`https://<toolkit-host>/website/lead`.

**Secret.** Set the toolkit's `WEBSITE_WEBHOOK_SECRET` to the **same value** as the
website's `GTM_LEAD_SECRET`. The receiver verifies `x-gradvera-signature` against
the **raw body** (constant-time), exactly as §2 requires (verify → then parse).
Bad/absent signature → `401`; body over 64 KB → `413`; unparseable JSON → `400`;
a body that fails the lead contract → `422`; valid → `200 {"status":"queued"}`.

**Write path.** The receiver returns fast (enqueues only). A separate scheduled
consumer performs the D365 write, idempotently:

```bash
gtm website consume            # dry-run (counts what would apply)
gtm website consume --apply    # create the D365 Account + Lead
```

Each lead becomes a D365 **Account** (deduped by company name + email-domain
fallback) and a **Lead** bound to it, owned by `GTM_DEFAULT_LEAD_OWNER_ID`,
`classify=False` (inbound skips the outbound role-bucket classifier). Mapping:
`fullName` → first/last, `company` → `companyname` (+ Account name), `email` →
`emailaddress1`, `phone` → `telephone1`, `role` → `jobtitle`; `source` + `message`
go onto the rep-visible Lead `subject` (`Website demo request — <company>: <msg>`,
truncated) while the **full** `message`, `locale`, `page` and `receivedAt` are
preserved in the durable queue envelope + the `website.consume.applied` log line.
**Idempotent** on `(email, receivedAt)` via a processed-key ledger. An email that
already exists as an Open Lead or active Contact is **skipped + logged** (a
hand-raise from a known prospect — inbound never clobbers a rep-managed record).
Smartlead enrollment of inbound demo requests is intentionally **not** automatic
(kept separate from cold outbound); wire it later if wanted.

Until the receiver is deployed and `GTM_LEAD_ENDPOINT` is set, leave it blank:
`/api/lead` validates and logs each lead (metadata only — no PII) and the site
keeps working.
