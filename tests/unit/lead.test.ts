import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { POST } from '@/pages/api/lead';

// SAFETY: the local .env points GTM_LEAD_ENDPOINT at the real lead receiver
// (→ Dynamics 365). These tests must never forward a lead anywhere:
//  - `fetch` is replaced before any import runs, by a spy that throws, and every
//    test asserts it was never called;
//  - GTM_LEAD_ENDPOINT / GTM_LEAD_SECRET are stubbed empty after the route has
//    been imported (so no import-time env injection can override the stub), and
//    the no-endpoint log line is asserted, proving the route took that path.
const fetchSpy = vi.hoisted(() => {
  const spy = vi.fn(() => { throw new Error('network is disabled in unit tests'); });
  vi.stubGlobal('fetch', spy);
  return spy;
});

type Ctx = Parameters<typeof POST>[0];
const call = (body: unknown) =>
  POST({
    request: new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  } as unknown as Ctx);

const TRAP = 'autofilled-trap-value';
const valid = {
  fullName: 'Ada Lovelace', company: 'Analytical Engines BV', email: 'ada@analytical-engines.nl',
  country: 'NL', role: 'head-of-estimating', companySize: '30-99', mainChallenge: 'pricing-confidence',
  phone: '+31 6 1234', message: 'We bid ~30 jobs/mo', locale: 'en', page: 'book-a-demo',
};
const PII = [TRAP, valid.fullName, valid.company, valid.email, valid.phone, valid.message];

let warn: MockInstance<typeof console.warn>;
let log: MockInstance<typeof console.log>;

beforeEach(() => {
  vi.stubEnv('GTM_LEAD_ENDPOINT', '');
  vi.stubEnv('GTM_LEAD_SECRET', '');
  expect(import.meta.env.GTM_LEAD_ENDPOINT, 'no lead endpoint visible to the route').toBe('');
  expect(globalThis.fetch).toBe(fetchSpy);
  fetchSpy.mockClear();
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  log = vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  expect(fetchSpy, 'no network call, ever').not.toHaveBeenCalled();
  warn.mockRestore();
  log.mockRestore();
  vi.unstubAllEnvs();
});

describe('POST /api/lead — honeypot drop', () => {
  for (const field of ['hp_field', 'company_website'] as const) {
    it(`${field} filled on a valid form → exact {"ok":true}, one PII-free warn`, async () => {
      const res = await call({ ...valid, [field]: TRAP });
      expect(res.status).toBe(200);
      expect(await res.text()).toBe('{"ok":true}');
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toBe('[lead] honeypot tripped — submission dropped');
      expect(warn.mock.calls[0][1]).toStrictEqual({ field, wouldParse: true, locale: 'en', page: 'book-a-demo' });
      const logged = JSON.stringify(warn.mock.calls[0]);
      for (const v of PII) expect(logged).not.toContain(v);
      expect(log, 'dropped before the lead is logged or forwarded').not.toHaveBeenCalled();
    });
  }

  it('trap filled on an invalid form → exact {"ok":true}, warn carries only field + wouldParse:false', async () => {
    const res = await call({ ...valid, email: 'not-an-email', hp_field: TRAP });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('{"ok":true}');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][1]).toStrictEqual({ field: 'hp_field', wouldParse: false });
    const logged = JSON.stringify(warn.mock.calls[0]);
    for (const v of [...PII, 'not-an-email']) expect(logged).not.toContain(v);
  });
});

describe('POST /api/lead — normal success', () => {
  it('every success carries a boolean qualified and a numeric score (the client\'s drop rule depends on it)', async () => {
    const res = await call(valid);
    expect(res.status).toBe(200);
    const body: unknown = await res.json();
    expect(body).toMatchObject({ ok: true, forwarded: false });
    const { qualified, score } = body as { qualified: unknown; score: unknown };
    expect(typeof qualified).toBe('boolean');
    expect(typeof score).toBe('number');
    expect(warn).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toBe('[lead] captured (no GTM_LEAD_ENDPOINT configured)');
  });
});
