import { describe, it, expect } from 'vitest';
import { parseLeadBody, synthesizeMessage, ROLE_LABELS_EN } from '@/lib/leadPayload';

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
