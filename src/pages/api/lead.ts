/**
 * POST /api/lead — inbound demo / contact lead capture.
 *
 * This is the website's only on-demand-rendered route (every page is static).
 * The browser (src/components/forms/DemoForm.astro) POSTs the form as JSON.
 *
 * Flow:
 *   1. Honeypot — a hidden `company_website` field; bots fill it, humans don't.
 *      If present we silently 200 (the bot thinks it won; we drop the lead).
 *   2. Validate the required marketing fields.
 *   3. Normalize into a stable lead object.
 *   4. If GTM_LEAD_ENDPOINT is configured, forward it to the gtm-toolkit
 *      inbound-lead service, HMAC-SHA256 signed over the exact JSON body, with
 *      a bounded timeout. Forwarding failures — a network/DNS error, the
 *      timeout aborting, or a non-2xx status (the toolkit rejecting the lead) —
 *      are logged but never surfaced to the visitor: we always return 200 so
 *      the lead UX (the success card) is never broken. A soft `forwarded` flag
 *      tells the caller whether the hand-off actually succeeded (2xx), so
 *      monitoring can catch dropped leads.
 *   5. If no endpoint is configured we just log the lead server-side.
 *
 * Dependency-free, fully typed (the request body is narrowed from
 * Record<string, unknown> — no `any`). See docs/lead-integration.md.
 */
import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Max time to wait on the downstream hand-off before aborting it (ms). */
const FORWARD_TIMEOUT_MS = 5_000;

/** A normalized, downstream-stable lead. Mirrors docs/lead-integration.md. */
interface Lead {
  source: 'gradvera-website';
  receivedAt: string;
  locale: string;
  page: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  role: string;
  message: string;
}

/** Read a key as a trimmed, length-capped string, or '' when absent / not a string. */
function str(body: Record<string, unknown>, key: string, max = 2000): string {
  const v = body[key];
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // ---- Reject oversized payloads (abuse / DoS amplification guard) ----------
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > 16_000) {
    return json({ ok: false, error: 'too_large' }, 413);
  }
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return json({ ok: false, error: 'unsupported_media_type' }, 415);
  }

  // ---- Parse JSON body -----------------------------------------------------
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== 'object' || parsed === null) {
      return json({ ok: false, error: 'invalid' }, 400);
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // ---- Honeypot — silently accept and discard ------------------------------
  // A real visitor never sees the hidden `company_website` field; bots fill it.
  // Return a 200 so the bot believes it succeeded, but do nothing.
  if (typeof body.company_website === 'string' && body.company_website.length > 0) {
    return json({ ok: true }, 200);
  }

  // ---- Validate required marketing fields ----------------------------------
  const fullName = str(body, 'fullName', 200);
  const company = str(body, 'company', 200);
  const email = str(body, 'email', 254);
  const message = str(body, 'message', 4000);

  if (
    !fullName ||
    !company ||
    !email ||
    !message ||
    email.length > 254 ||
    !EMAIL_RE.test(email)
  ) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // ---- Build the normalized lead -------------------------------------------
  const lead: Lead = {
    source: 'gradvera-website',
    receivedAt: new Date().toISOString(),
    locale: str(body, 'locale') || 'en',
    page: str(body, 'page'),
    fullName,
    company,
    email,
    phone: str(body, 'phone'),
    role: str(body, 'role'),
    message,
  };

  // ---- Forward to the gtm-toolkit (or log when not configured) -------------
  const endpoint = import.meta.env.GTM_LEAD_ENDPOINT;
  const secret = import.meta.env.GTM_LEAD_SECRET;

  if (endpoint) {
    // Endpoint configured but no signing secret: the receiver requires a valid
    // HMAC and 401s every unsigned request, so the lead is silently dropped.
    // Surface this loudly — a missing/blank GTM_LEAD_SECRET in prod is the most
    // likely cause of a stream of forwarded:false, and it is otherwise invisible.
    if (!secret) {
      console.error(
        '[lead] GTM_LEAD_ENDPOINT is set but GTM_LEAD_SECRET is missing — the ' +
          'forward will be rejected (401 invalid_signature) and the lead dropped. ' +
          'Set GTM_LEAD_SECRET to the receiver’s shared secret.',
      );
    }
    // Sign the EXACT bytes we send so the receiver can verify them verbatim.
    const payload = JSON.stringify(lead);
    const sig = secret
      ? crypto.createHmac('sha256', secret).update(payload).digest('hex')
      : '';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(sig ? { 'x-gradvera-signature': 'sha256=' + sig } : {}),
        },
        body: payload,
        // Bound the hand-off: the visitor waits on this response synchronously,
        // and the toolkit returns fast (it only enqueues). Abort a slow/hung
        // receiver so we never stall the request up to the function timeout.
        signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
      });
      // `fetch` resolves for ANY HTTP status — a 4xx/5xx means the toolkit
      // *rejected* the lead (bad HMAC → 401, contract fail → 422, outage → 5xx),
      // not that it accepted it. Only a 2xx is a real hand-off; anything else is
      // a dropped lead we must flag, not paper over with forwarded:true.
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        console.error(
          '[lead] forward to GTM_LEAD_ENDPOINT rejected',
          res.status,
          detail.slice(0, 500),
        );
        return json({ ok: true, forwarded: false }, 200);
      }
      return json({ ok: true, forwarded: true }, 200);
    } catch (err) {
      // Network failure, DNS, or the timeout aborting the request. Never lose
      // the lead UX: log server-side, still 200 the visitor, but flag the soft
      // failure so ops/monitoring can pick up the dropped hand-off.
      console.error('[lead] forward to GTM_LEAD_ENDPOINT failed', err);
      return json({ ok: true, forwarded: false }, 200);
    }
  }

  // No downstream configured yet (pre-launch). Log only non-PII metadata —
  // never the lead's personal data (GDPR data-minimisation). Wire
  // GTM_LEAD_ENDPOINT (or LEAD_NOTIFY_EMAIL) before launch so leads are not lost.
  console.log('[lead] captured (no GTM_LEAD_ENDPOINT configured)', {
    locale: lead.locale,
    page: lead.page,
    receivedAt: lead.receivedAt,
  });
  return json({ ok: true, forwarded: false }, 200);
};

export const GET: APIRoute = () =>
  json({ error: 'method not allowed' }, 405);
