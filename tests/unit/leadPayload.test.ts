import { describe, it, expect } from 'vitest';
import { parseLeadBody, synthesizeMessage, trippedHoneypot, honeypotDropLog, ROLE_LABELS_EN } from '@/lib/leadPayload';

const NOW = new Date('2026-08-19T10:00:00.000Z');
const valid = {
  fullName: ' Ada Lovelace ', company: 'Analytical Engines BV', email: 'ada@analytical-engines.nl',
  country: 'NL', role: 'head-of-estimating', companySize: '30-99', mainChallenge: 'pricing-confidence',
  estimatingMethod: 'excel', bidFrequency: 'monthly', ndaWilling: 'yes',
  phone: '+31 6 1234', message: 'We bid ~30 jobs/mo', locale: 'en', page: 'book-a-demo',
  gclid: 'Cj0KCQ', utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'nl-estimating', utm_term: 'construction estimating software', utm_content: 'ad1',
  landingPage: '/construction-estimating-software/', referrer: 'https://www.google.com/', submissionPage: '/book-a-demo/', submittedAt: '2026-08-19T09:59:50.000Z', consent: 'accept',
};

describe('parseLeadBody', () => {
  it('normalizes a full valid body into a scored Lead', () => {
    const r = parseLeadBody(valid, NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.lead).toMatchObject({
      source: 'gradvera-website', receivedAt: '2026-08-19T10:00:00.000Z', locale: 'en', page: 'book-a-demo',
      fullName: 'Ada Lovelace', company: 'Analytical Engines BV', email: 'ada@analytical-engines.nl',
      phone: '+31 6 1234', role: 'Head of estimating', message: 'We bid ~30 jobs/mo',
      qualification: { country: 'NL', role: 'head-of-estimating', companySize: '30-99', mainChallenge: 'pricing-confidence', estimatingMethod: 'excel', bidFrequency: 'monthly', ndaWilling: 'yes' },
      attribution: { gclid: 'Cj0KCQ', gbraid: '', wbraid: '', utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'nl-estimating', utm_term: 'construction estimating software', utm_content: 'ad1', landingPage: '/construction-estimating-software/', referrer: 'https://www.google.com/', submissionPage: '/book-a-demo/', submittedAt: '2026-08-19T09:59:50.000Z', consent: 'accept' },
      score: 14, qualified: true,
    });
    expect(r.lead.scoreReasons).toContain('nda-ready');
  });
  it('rejects when a required field is missing or an enum is invalid', () => {
    for (const k of ['fullName', 'email', 'company', 'country', 'role', 'companySize', 'mainChallenge'] as const) {
      expect(parseLeadBody({ ...valid, [k]: '' }, NOW)).toEqual({ ok: false, error: 'invalid' });
    }
    expect(parseLeadBody({ ...valid, country: 'nl' }, NOW)).toEqual({ ok: false, error: 'invalid' });
    expect(parseLeadBody({ ...valid, estimatingMethod: 'abacus' }, NOW)).toEqual({ ok: false, error: 'invalid' });
    expect(parseLeadBody({ ...valid, email: 'not-an-email' }, NOW)).toEqual({ ok: false, error: 'invalid' });
  });
  it('accepts optional fields absent and synthesizes a non-empty message', () => {
    const { estimatingMethod, bidFrequency, ndaWilling, phone, message, ...required } = valid;
    const r = parseLeadBody(required, NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.lead.qualification).toMatchObject({ estimatingMethod: '', bidFrequency: '', ndaWilling: '' });
    expect(r.lead.phone).toBe('');
    expect(r.lead.message).toBe('Main challenge: Pricing confidence · Country: NL · Size: 30-99 · Role: Head of estimating');
    expect(r.lead.score).toBe(8);
    expect(r.lead.qualified).toBe(true);
  });
  it('sanitizes attribution: caps length, drops unsafe chars, defaults consent to unset', () => {
    const r = parseLeadBody({ ...valid, gclid: 'x'.repeat(300), utm_campaign: 'bad value<script>', consent: 'maybe' }, NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.lead.attribution.gclid).toHaveLength(256);
    expect(r.lead.attribution.utm_campaign).toBe('');
    expect(r.lead.attribution.consent).toBe('unset');
  });
  it('defaults locale to en and keeps phone/message within caps', () => {
    const r = parseLeadBody({ ...valid, locale: '', message: 'm'.repeat(5000) }, NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.lead.locale).toBe('en');
    expect(r.lead.message).toHaveLength(4000);
  });
});

describe('synthesizeMessage / ROLE_LABELS_EN', () => {
  it('omits blank parts and uses English labels', () => {
    expect(synthesizeMessage({ country: 'SI', role: 'estimator', companySize: '1-9', mainChallenge: 'other', estimatingMethod: '', bidFrequency: 'rarely', ndaWilling: '' }))
      .toBe('Main challenge: Other · Frequency: Rarely · Country: SI · Size: 1-9 · Role: Estimator');
    expect(ROLE_LABELS_EN['project-manager']).toBe('Project manager');
  });
});

describe('parseLeadBody — edge cases', () => {
  it('rejects a legacy label string as role (v1 form) instead of crashing', () => {
    expect(parseLeadBody({ ...valid, role: 'Head of estimating' }, NOW)).toEqual({ ok: false, error: 'invalid' });
  });
  it('keeps consent=reject and maps unknown values to unset', () => {
    const r = parseLeadBody({ ...valid, consent: 'reject' }, NOW);
    expect(r.ok && r.lead.attribution.consent).toBe('reject');
  });
  it('synthesizes "Demo request" when the qualification digest is empty', () => {
    expect(synthesizeMessage({ country: '', role: '', companySize: '', mainChallenge: '', estimatingMethod: '', bidFrequency: '', ndaWilling: '' })).toBe('Demo request');
  });
  it('caps attribution length before the charset check (a bad char beyond 256 is cut away)', () => {
    const r = parseLeadBody({ ...valid, utm_content: 'a'.repeat(256) + '<script>' }, NOW);
    expect(r.ok && r.lead.attribution.utm_content).toBe('a'.repeat(256));
  });
  it('keeps Unicode letters in decoded utm_term (SL/HR campaigns)', () => {
    const r = parseLeadBody({ ...valid, utm_term: 'ocena stroškov gradnje' }, NOW);
    expect(r.ok && r.lead.attribution.utm_term).toBe('ocena stroškov gradnje');
  });
});

describe('trippedHoneypot', () => {
  it('returns null for an empty body', () => {
    expect(trippedHoneypot({})).toBeNull();
  });
  it('names the current trap field when it holds a value', () => {
    expect(trippedHoneypot({ hp_field: 'x' })).toBe('hp_field');
  });
  it('still catches the legacy company_website trap (cached pages, scraped forms)', () => {
    expect(trippedHoneypot({ company_website: 'x' })).toBe('company_website');
  });
  it('ignores empty strings', () => {
    expect(trippedHoneypot({ hp_field: '', company_website: '' })).toBeNull();
  });
  it('ignores non-string values', () => {
    expect(trippedHoneypot({ hp_field: 1, company_website: true })).toBeNull();
    expect(trippedHoneypot({ hp_field: null, company_website: { a: 'x' } })).toBeNull();
    expect(trippedHoneypot({ hp_field: ['x'] })).toBeNull();
  });
});

describe('parseLeadBody — trap fields never reach the Lead', () => {
  it('drops hp_field / company_website from a valid body (fields are whitelisted)', () => {
    const r = parseLeadBody({ ...valid, hp_field: 'Acme BV', company_website: 'acme.example' }, NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const wire = JSON.stringify(r.lead);
    expect(r.lead).not.toHaveProperty('hp_field');
    expect(r.lead).not.toHaveProperty('company_website');
    expect(wire).not.toContain('hp_field');
    expect(wire).not.toContain('company_website');
    expect(wire).not.toContain('Acme BV');
    expect(wire).not.toContain('acme.example');
  });
});

describe('honeypotDropLog — the one line lead.ts logs for a dropped submission', () => {
  it('a fully valid trapped form logs field + wouldParse + normalized locale/page, nothing else', () => {
    expect(honeypotDropLog('hp_field', { ...valid, hp_field: 'Acme BV' }, NOW))
      .toEqual({ field: 'hp_field', wouldParse: true, locale: 'en', page: 'book-a-demo' });
  });
  it('an unparseable trapped body logs only field + wouldParse:false', () => {
    expect(honeypotDropLog('company_website', { ...valid, email: 'nope', company_website: 'x' }, NOW))
      .toEqual({ field: 'company_website', wouldParse: false });
  });
  it('never carries the trap value or any personal field', () => {
    const line = JSON.stringify(honeypotDropLog('hp_field', { ...valid, hp_field: 'Acme BV' }, NOW));
    for (const v of ['Acme BV', 'Ada Lovelace', 'Analytical Engines BV', 'ada@analytical-engines.nl', '+31 6 1234', 'We bid ~30 jobs/mo', 'Cj0KCQ']) {
      expect(line).not.toContain(v);
    }
  });
  it('passes the locale/page values DemoForm actually sends through unchanged', () => {
    for (const locale of ['en', 'sl', 'hr']) {
      for (const page of ['book-a-demo', 'construction-estimating-software']) {
        expect(honeypotDropLog('hp_field', { ...valid, locale, page, hp_field: 'x' }, NOW))
          .toEqual({ field: 'hp_field', wouldParse: true, locale, page });
      }
    }
  });
  it('logs a free-text page (an email address, log-injection text) as "other"', () => {
    for (const page of ['bot@spam.example', 'book-a-demo\n[lead] forged line', 'BOOK-A-DEMO', '']) {
      const log = honeypotDropLog('hp_field', { ...valid, page, hp_field: 'x' }, NOW);
      expect(log).toEqual({ field: 'hp_field', wouldParse: true, locale: 'en', page: 'other' });
      expect(JSON.stringify(log)).not.toContain('spam.example');
    }
  });
  it('logs an unknown locale as "other"', () => {
    for (const locale of ['xx', 'de', 'EN', 'e\u0000n']) {
      expect(honeypotDropLog('hp_field', { ...valid, locale, hp_field: 'x' }, NOW))
        .toEqual({ field: 'hp_field', wouldParse: true, locale: 'other', page: 'book-a-demo' });
    }
  });
});
