import { describe, it, expect } from 'vitest';
import { scoreLead, isOneOf, COUNTRIES, QUALIFIED_THRESHOLD, type ScoreInput } from '@/lib/leadScore';

const base: ScoreInput = {
  email: 'ada@analytical-engines.nl', country: '', role: '', companySize: '',
  estimatingMethod: '', bidFrequency: '', mainChallenge: '', ndaWilling: '',
};

describe('scoreLead', () => {
  it('scores 0 and unqualified with nothing but a business email', () => {
    expect(scoreLead(base)).toEqual({ score: 0, reasons: [], qualified: false });
  });
  it('awards +2 per positive signal in spec order', () => {
    const r = scoreLead({ ...base, country: 'NL', role: 'project-manager', companySize: '30-99',
      estimatingMethod: 'excel', bidFrequency: 'monthly', mainChallenge: 'subcontractor-quotes', ndaWilling: 'yes' });
    expect(r.score).toBe(14);
    expect(r.reasons).toEqual(['country-nl','decision-role','size-30-plus','excel-history','recurring-bids','core-pain','nda-ready']);
    expect(r.qualified).toBe(true);
  });
  it('reaches the threshold on required fields alone (NL + role + size + pain)', () => {
    const r = scoreLead({ ...base, country: 'NL', role: 'company-director', companySize: '100-249', mainChallenge: 'pricing-confidence' });
    expect(r.score).toBe(8);
    expect(r.qualified).toBe(true);
  });
  it('does not award role points to estimator/operations-manager/other', () => {
    for (const role of ['estimator','operations-manager','other'] as const) {
      expect(scoreLead({ ...base, role }).score).toBe(0);
    }
  });
  it('treats mixed as Excel history and few-per-year/rarely as non-recurring', () => {
    expect(scoreLead({ ...base, estimatingMethod: 'mixed' }).reasons).toEqual(['excel-history']);
    expect(scoreLead({ ...base, bidFrequency: 'few-per-year' }).score).toBe(0);
    expect(scoreLead({ ...base, bidFrequency: 'rarely' }).score).toBe(0);
  });
  it('subtracts 2 for a freemail domain (case-insensitive, subdomain-aware)', () => {
    expect(scoreLead({ ...base, email: 'Ada@GMAIL.com', country: 'NL' })).toEqual({ score: 0, reasons: ['country-nl','freemail'], qualified: false });
    expect(scoreLead({ ...base, email: 'ada@mail.yahoo.co.uk' }).score).toBe(-2);
  });
  it('exposes the threshold and blank-tolerant enum guard', () => {
    expect(QUALIFIED_THRESHOLD).toBe(7);
    expect(isOneOf(COUNTRIES, 'NL')).toBe(true);
    expect(isOneOf(COUNTRIES, 'nl')).toBe(false);
    expect(isOneOf(COUNTRIES, '')).toBe(false);
  });
});
