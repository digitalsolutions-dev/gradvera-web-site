/**
 * POST /api/lead — inbound demo / contact lead capture.
 *
 * This is the website's only on-demand-rendered route (every page is static).
 * The browser (src/components/forms/DemoForm.astro) POSTs the form as JSON.
 *
 * Flow:
 *   1. Honeypot — DemoForm's hidden `hp_field` (the legacy `company_website`
 *      name is still honoured; see `trippedHoneypot`). Bots fill it, humans
 *      don't. If filled we drop the lead and reply a bare 200 `{ok:true}` (the
 *      bot thinks it won; the absent `qualified` tells the client no conversion
 *      happened), logging one PII-free line so wrongly-dropped real visitors
 *      (browser autofill) stay visible.
 *   2. Validate + normalize with `parseLeadBody` (src/lib/leadPayload.ts) — the
 *      required marketing fields, the qualification enums, and the sanitized
 *      attribution. This route is transport only; the contract lives there.
 *   3. That same pure step scores the lead (src/lib/leadScore.ts). The `qualified`
 *      and `score` verdict rides back in the response so the client can fire the
 *      right analytics event; it is never a reason to reject a submission.
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
import { honeypotDropLog, parseLeadBody, trippedHoneypot, type Lead } from '../../lib/leadPayload';

export const prerender = false;

/**
 * Max time to wait on the downstream hand-off before aborting it (ms). The
 * receiver's first request after idle takes ~5.6–6.7 s (cold start, as reported
 * by the gtm-toolkit side on 2026-09-28) and its API gateway allows 10 s; 9 s
 * keeps those leads `forwarded:true` while staying under the gateway limit.
 * This function itself may run 15 s (`maxDuration` in astro.config.mjs), which
 * leaves headroom after the abort to log and reply.
 */
const FORWARD_TIMEOUT_MS = 9_000;

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
    const raw: unknown = await request.json();
    if (typeof raw !== 'object' || raw === null) {
      return json({ ok: false, error: 'invalid' }, 400);
    }
    body = raw as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // ---- Honeypot — accept and discard ---------------------------------------
  // A real visitor never sees the hidden trap; bots fill it. Return a 200 so
  // the bot believes it succeeded, but do nothing — except log which trap fired
  // (never its value or any personal field) so autofill false positives show.
  const now = new Date();
  const trap = trippedHoneypot(body);
  if (trap) {
    console.warn('[lead] honeypot tripped — submission dropped', honeypotDropLog(trap, body, now));
    return json({ ok: true }, 200);
  }

  // ---- Validate + normalize (pure; see src/lib/leadPayload.ts) ------------
  const parsed = parseLeadBody(body, now);
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, 400);
  const lead: Lead = parsed.lead;
  const verdict = { qualified: lead.qualified, score: lead.score };

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
        // Bound the hand-off: the visitor waits on this response synchronously.
        // A warm toolkit returns fast (it only enqueues), but a cold start can
        // take several seconds — see FORWARD_TIMEOUT_MS. Abort a slow/hung
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
        return json({ ok: true, forwarded: false, ...verdict }, 200);
      }
      return json({ ok: true, forwarded: true, ...verdict }, 200);
    } catch (err) {
      // Network failure, DNS, or the timeout aborting the request. Never lose
      // the lead UX: log server-side, still 200 the visitor, but flag the soft
      // failure so ops/monitoring can pick up the dropped hand-off.
      console.error('[lead] forward to GTM_LEAD_ENDPOINT failed', err);
      return json({ ok: true, forwarded: false, ...verdict }, 200);
    }
  }

  // No downstream configured yet (pre-launch). Log only non-PII metadata —
  // never the lead's personal data (GDPR data-minimisation). Wire
  // GTM_LEAD_ENDPOINT (or LEAD_NOTIFY_EMAIL) before launch so leads are not lost.
  console.log('[lead] captured (no GTM_LEAD_ENDPOINT configured)', {
    locale: lead.locale,
    page: lead.page,
    receivedAt: lead.receivedAt,
    qualified: lead.qualified,
    score: lead.score,
  });
  return json({ ok: true, forwarded: false, ...verdict }, 200);
};

export const GET: APIRoute = () =>
  json({ error: 'method not allowed' }, 405);
