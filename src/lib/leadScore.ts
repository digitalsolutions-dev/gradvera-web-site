/**
 * Lead qualification scoring — acquisition model §8.2 (initial default, to be
 * recalibrated on real lead data). Pure: no I/O, no Date, no env. The form's
 * wire values ARE these enum slugs; lead.ts validates membership with isOneOf
 * before scoring. The −5 "student / job-seeker / vendor" signal is a human
 * review action by design, not code.
 */
export const COUNTRIES = ['NL', 'BE', 'DE', 'DK', 'SE', 'NO', 'FI', 'AT', 'SI', 'HR', 'EU-OTHER', 'NON-EU'] as const;
export const ROLES = ['company-director', 'estimator', 'head-of-estimating', 'commercial-manager', 'operations-manager', 'project-manager', 'other'] as const;
export const COMPANY_SIZES = ['1-9', '10-29', '30-99', '100-249', '250+'] as const;
export const ESTIMATING_METHODS = ['excel', 'software', 'mixed', 'other'] as const;
export const BID_FREQUENCIES = ['weekly', 'monthly', 'few-per-year', 'rarely'] as const;
export const MAIN_CHALLENGES = ['pricing-confidence', 'subcontractor-quotes', 'historical-reuse', 'management-visibility', 'other'] as const;
export const NDA_WILLING = ['yes', 'not-yet'] as const;

export type Country = (typeof COUNTRIES)[number];
export type Role = (typeof ROLES)[number];
export type CompanySize = (typeof COMPANY_SIZES)[number];
export type EstimatingMethod = (typeof ESTIMATING_METHODS)[number];
export type BidFrequency = (typeof BID_FREQUENCIES)[number];
export type MainChallenge = (typeof MAIN_CHALLENGES)[number];
export type NdaWilling = (typeof NDA_WILLING)[number];

/** Consumer / free mailbox providers → −2 (personal email, no verifiable company). */
export const FREEMAIL_DOMAINS: ReadonlySet<string> = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.de', 'yahoo.fr', 'ymail.com',
  'hotmail.com', 'hotmail.co.uk', 'hotmail.de', 'hotmail.fr', 'hotmail.nl', 'outlook.com', 'live.com', 'live.nl', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com', 'pm.me',
  'gmx.com', 'gmx.de', 'gmx.net', 'web.de', 'mail.com', 'zoho.com', 'yandex.com', 'yandex.ru',
  'siol.net', 't-2.net', 'net.hr', 'ziggo.nl', 'kpnmail.nl', 'home.nl', 'planet.nl', 'xs4all.nl',
]);

export const QUALIFIED_THRESHOLD = 7;

const DECISION_ROLES: ReadonlySet<string> = new Set<Role>(['company-director', 'project-manager', 'commercial-manager', 'head-of-estimating']);
const LARGE_SIZES: ReadonlySet<string> = new Set<CompanySize>(['30-99', '100-249', '250+']);
const EXCEL_METHODS: ReadonlySet<string> = new Set<EstimatingMethod>(['excel', 'mixed']);
const RECURRING: ReadonlySet<string> = new Set<BidFrequency>(['weekly', 'monthly']);
const CORE_PAINS: ReadonlySet<string> = new Set<MainChallenge>(['pricing-confidence', 'subcontractor-quotes']);

export interface ScoreInput {
  email: string;
  country: Country | '';
  role: Role | '';
  companySize: CompanySize | '';
  estimatingMethod: EstimatingMethod | '';
  bidFrequency: BidFrequency | '';
  mainChallenge: MainChallenge | '';
  ndaWilling: NdaWilling | '';
}

export interface ScoreResult {
  score: number;
  /** Stable reason slugs in evaluation order — stored with the lead for analysis. */
  reasons: string[];
  qualified: boolean;
}

/** Type guard for the readonly enum arrays above ('' never matches). */
export function isOneOf<T extends readonly string[]>(list: T, v: string): v is T[number] {
  return v !== '' && (list as readonly string[]).includes(v);
}

/** True when the address's domain (or any parent domain) is a free mailbox provider. */
function isFreemail(email: string): boolean {
  const at = email.lastIndexOf('@');
  if (at < 0) return false;
  const parts = email.slice(at + 1).toLowerCase().split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    if (FREEMAIL_DOMAINS.has(parts.slice(i).join('.'))) return true;
  }
  return false;
}

export function scoreLead(input: ScoreInput): ScoreResult {
  let score = 0;
  const reasons: string[] = [];
  const add = (points: number, reason: string) => { score += points; reasons.push(reason); };

  if (input.country === 'NL') add(2, 'country-nl');
  if (DECISION_ROLES.has(input.role)) add(2, 'decision-role');
  if (LARGE_SIZES.has(input.companySize)) add(2, 'size-30-plus');
  if (EXCEL_METHODS.has(input.estimatingMethod)) add(2, 'excel-history');
  if (RECURRING.has(input.bidFrequency)) add(2, 'recurring-bids');
  if (CORE_PAINS.has(input.mainChallenge)) add(2, 'core-pain');
  if (input.ndaWilling === 'yes') add(2, 'nda-ready');
  if (isFreemail(input.email)) add(-2, 'freemail');

  return { score, reasons, qualified: score >= QUALIFIED_THRESHOLD };
}
