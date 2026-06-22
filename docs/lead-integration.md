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

---

## 1. Browser → `POST /api/lead`

Source: `src/components/forms/DemoForm.astro` (client) and
`src/pages/api/lead.ts` (server). `Content-Type: application/json`.

The browser posts the raw form fields:

```jsonc
{
  "fullName": "Ada Lovelace",      // required, non-empty
  "company":  "Analytical Engines",// required, non-empty
  "email":    "ada@example.com",   // required, must match a basic email regex
  "phone":    "+386 40 000 000",   // optional
  "role":     "Head of estimating",// optional (one of the form's <select> options)
  "message":  "We bid ~30 jobs/mo",// required, non-empty
  "locale":   "sl",                // optional, defaults to "en"
  "page":     "book-a-demo",       // optional, free-text origin hint
  "company_website": ""            // HONEYPOT — must stay empty (see below)
}
```

### Honeypot

`company_website` is a hidden field. Real visitors never see or fill it; bots
do. If it arrives **non-empty**, the endpoint returns `200 {"ok":true}` and
**silently drops** the lead — the bot believes it succeeded and nothing is
forwarded.

### Validation

`fullName`, `company`, `email`, `message` must be non-empty strings and `email`
must match `^[^\s@]+@[^\s@]+\.[^\s@]+$`. On failure:

```
HTTP 400
{ "ok": false, "error": "invalid" }
```

### Responses

| Situation                                   | Status | Body                                |
| ------------------------------------------- | ------ | ----------------------------------- |
| Valid lead, forwarded OK                     | 200    | `{ "ok": true, "forwarded": true }`  |
| Valid lead, forward threw (logged server-side) | 200  | `{ "ok": true, "forwarded": false }` |
| Valid lead, no endpoint configured (logged)  | 200    | `{ "ok": true, "forwarded": false }` |
| Honeypot tripped                             | 200    | `{ "ok": true }`                    |
| Missing/invalid field, or unparseable body   | 400    | `{ "ok": false, "error": "invalid" }`|
| `GET /api/lead`                              | 405    | `{ "error": "method not allowed" }`  |

`forwarded` is a **soft flag** for monitoring. The visitor always sees success
(HTTP 200) once the lead is valid, even if the downstream hand-off failed — we
never break the success UX over a transient toolkit outage. A `forwarded:false`
that should have been `true` indicates the toolkit was unreachable; check the
website function logs for `[lead] forward to GTM_LEAD_ENDPOINT failed`.

The front-end (`DemoForm.astro`) only checks `res.ok` (the HTTP status), so any
200 shows the success card.

---

## 2. Website → gtm-toolkit (the forwarded lead)

When `GTM_LEAD_ENDPOINT` is set, the endpoint normalizes the form into a stable
shape and POSTs **this exact JSON** as the request body:

```jsonc
{
  "source":     "gradvera-website",       // constant — identifies the channel
  "receivedAt": "2026-06-22T09:30:00.000Z",// server timestamp, ISO-8601 UTC
  "locale":     "sl",                      // "en" | "sl" | "hr"
  "page":       "book-a-demo",
  "fullName":   "Ada Lovelace",
  "company":    "Analytical Engines",
  "email":      "ada@example.com",
  "phone":      "+386 40 000 000",         // "" when not provided
  "role":       "Head of estimating",      // "" when not provided
  "message":    "We bid ~30 jobs/mo"
}
```

Field notes for the receiver:

- `source` is always `"gradvera-website"`.
- `receivedAt` is set by the website, not the browser.
- `phone` and `role` are always present as strings (`""` if the visitor left
  them blank).
- The honeypot field and any extra browser fields are **stripped** — only the
  keys above are forwarded.

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
