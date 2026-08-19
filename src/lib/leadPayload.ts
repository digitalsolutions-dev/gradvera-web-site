/**
 * Lead body → normalized Lead (contract v2, docs/lead-integration.md §2).
 * Pure: validation, enum membership, attribution sanitizing, message synthesis,
 * scoring. lead.ts is transport only (honeypot, forward, response).
 */
import {
  BID_FREQUENCIES, COMPANY_SIZES, COUNTRIES, ESTIMATING_METHODS, MAIN_CHALLENGES, NDA_WILLING, ROLES,
  isOneOf, scoreLead, type BidFrequency, type CompanySize, type Country, type EstimatingMethod,
  type MainChallenge, type NdaWilling, type Role,
} from './leadScore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** URL-safe charset for attribution values (RFC 3986 unreserved + reserved + % + space for decoded utm_term). */
const ATTR_SAFE_RE = /^[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=% -]*$/; // URL-safe + space (decoded utm_term)
const ATTR_MAX = 256;

export interface Qualification {
  country: string; role: string; companySize: string; mainChallenge: string;
  estimatingMethod: string; bidFrequency: string; ndaWilling: string;
}
export interface Attribution {
  gclid: string; gbraid: string; wbraid: string;
  utm_source: string; utm_medium: string; utm_campaign: string; utm_term: string; utm_content: string;
  landingPage: string; referrer: string; submissionPage: string; submittedAt: string;
  consent: 'accept' | 'reject' | 'unset';
}
/** A normalized, downstream-stable lead. Mirrors docs/lead-integration.md §2 (v2). */
export interface Lead {
  source: 'gradvera-website';
  receivedAt: string;
  locale: string;
  page: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  /** English label (gtm-toolkit v1 → D365 jobtitle); slug lives in qualification.role. */
  role: string;
  /** Never blank on the wire — synthesized from qualification when the visitor left it empty. */
  message: string;
  qualification: Qualification;
  attribution: Attribution;
  score: number;
  scoreReasons: string[];
  qualified: boolean;
}
export type ParseResult = { ok: true; lead: Lead } | { ok: false; error: 'invalid' };

export const ROLE_LABELS_EN: Record<Role, string> = {
  'company-director': 'Company director',
  'estimator': 'Estimator',
  'head-of-estimating': 'Head of estimating',
  'commercial-manager': 'Commercial manager',
  'operations-manager': 'Operations manager',
  'project-manager': 'Project manager',
  'other': 'Other',
};
const CHALLENGE_LABELS_EN: Record<MainChallenge, string> = {
  'pricing-confidence': 'Pricing confidence', 'subcontractor-quotes': 'Subcontractor quotes',
  'historical-reuse': 'Reusing historical estimates', 'management-visibility': 'Management visibility', 'other': 'Other',
};
const METHOD_LABELS_EN: Record<EstimatingMethod, string> = {
  excel: 'Excel spreadsheets', software: 'Dedicated software', mixed: 'Mix of both', other: 'Other',
};
const FREQUENCY_LABELS_EN: Record<BidFrequency, string> = {
  weekly: 'Weekly', monthly: 'A few per month', 'few-per-year': 'A few per year', rarely: 'Rarely',
};

/** Read a key as a trimmed, length-capped string, or '' when absent / not a string. */
function str(body: Record<string, unknown>, key: string, max = 2000): string {
  const v = body[key];
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}
/** Optional enum: '' when absent, the value when valid, null when present-but-invalid. */
function optEnum<T extends readonly string[]>(body: Record<string, unknown>, key: string, list: T): T[number] | '' | null {
  const v = str(body, key, 64);
  if (v === '') return '';
  return isOneOf(list, v) ? v : null;
}
function attr(body: Record<string, unknown>, key: string): string {
  const v = str(body, key, ATTR_MAX);
  return ATTR_SAFE_RE.test(v) ? v : '';
}

/** Human-readable qualification digest — keeps gtm-toolkit v1's non-empty `message` contract. */
export function synthesizeMessage(q: Qualification): string {
  const parts: string[] = [];
  if (isOneOf(MAIN_CHALLENGES, q.mainChallenge)) parts.push(`Main challenge: ${CHALLENGE_LABELS_EN[q.mainChallenge]}`);
  if (isOneOf(ESTIMATING_METHODS, q.estimatingMethod)) parts.push(`Method: ${METHOD_LABELS_EN[q.estimatingMethod]}`);
  if (isOneOf(BID_FREQUENCIES, q.bidFrequency)) parts.push(`Frequency: ${FREQUENCY_LABELS_EN[q.bidFrequency]}`);
  if (q.country) parts.push(`Country: ${q.country}`);
  if (q.companySize) parts.push(`Size: ${q.companySize}`);
  if (isOneOf(ROLES, q.role)) parts.push(`Role: ${ROLE_LABELS_EN[q.role]}`);
  if (q.ndaWilling === 'yes') parts.push('NDA: yes');
  return parts.join(' · ') || 'Demo request';
}

export function parseLeadBody(body: Record<string, unknown>, receivedAt: Date): ParseResult {
  const fullName = str(body, 'fullName', 200);
  const company = str(body, 'company', 200);
  const email = str(body, 'email', 254);
  if (!fullName || !company || !email || !EMAIL_RE.test(email)) return { ok: false, error: 'invalid' };

  const country = str(body, 'country', 16);
  const role = str(body, 'role', 64);
  const companySize = str(body, 'companySize', 16);
  const mainChallenge = str(body, 'mainChallenge', 64);
  if (!isOneOf(COUNTRIES, country) || !isOneOf(ROLES, role) || !isOneOf(COMPANY_SIZES, companySize) || !isOneOf(MAIN_CHALLENGES, mainChallenge)) {
    return { ok: false, error: 'invalid' };
  }
  const estimatingMethod = optEnum(body, 'estimatingMethod', ESTIMATING_METHODS);
  const bidFrequency = optEnum(body, 'bidFrequency', BID_FREQUENCIES);
  const ndaWilling = optEnum(body, 'ndaWilling', NDA_WILLING);
  if (estimatingMethod === null || bidFrequency === null || ndaWilling === null) return { ok: false, error: 'invalid' };

  const qualification: Qualification = { country, role, companySize, mainChallenge, estimatingMethod, bidFrequency, ndaWilling };
  const consentRaw = str(body, 'consent', 16);
  const attribution: Attribution = {
    gclid: attr(body, 'gclid'), gbraid: attr(body, 'gbraid'), wbraid: attr(body, 'wbraid'),
    utm_source: attr(body, 'utm_source'), utm_medium: attr(body, 'utm_medium'), utm_campaign: attr(body, 'utm_campaign'),
    utm_term: attr(body, 'utm_term'), utm_content: attr(body, 'utm_content'),
    landingPage: attr(body, 'landingPage'), referrer: attr(body, 'referrer'), submissionPage: attr(body, 'submissionPage'),
    submittedAt: attr(body, 'submittedAt'),
    consent: consentRaw === 'accept' || consentRaw === 'reject' ? consentRaw : 'unset',
  };
  const { score, reasons, qualified } = scoreLead({
    email, country: country as Country, role: role as Role, companySize: companySize as CompanySize,
    estimatingMethod: estimatingMethod as EstimatingMethod | '', bidFrequency: bidFrequency as BidFrequency | '',
    mainChallenge: mainChallenge as MainChallenge, ndaWilling: ndaWilling as NdaWilling | '',
  });
  const message = str(body, 'message', 4000) || synthesizeMessage(qualification);

  return {
    ok: true,
    lead: {
      source: 'gradvera-website',
      receivedAt: receivedAt.toISOString(),
      locale: str(body, 'locale', 8) || 'en',
      page: str(body, 'page', 64),
      fullName, company, email,
      phone: str(body, 'phone', 64),
      role: ROLE_LABELS_EN[role],
      message,
      qualification, attribution,
      score, scoreReasons: reasons, qualified,
    },
  };
}
