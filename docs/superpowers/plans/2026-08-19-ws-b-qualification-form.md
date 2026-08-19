# Workstream B — Qualification Form, Lead Schema, Scoring & Attribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the demo form into the qualification form the acquisition model needs (§8.1 fields), compute the §8.2 lead score server-side and store it on the lead, carry §8.3 attribution (gclid/utm/landing/referrer/consent) from first touch to the lead record, and publish contract v2 for gtm-toolkit — without breaking the current lead path or the trilingual pages.

**Architecture:** Two new pure TypeScript modules under `src/lib/` (`leadScore.ts` — enums + `scoreLead()`; `leadPayload.ts` — body parsing/validation/normalization incl. attribution sanitizing, message synthesis, role slug→label) unit-tested with Vitest; `src/pages/api/lead.ts` shrinks to transport (honeypot, forward, response `{ok, forwarded, qualified, score}`). Client: `DemoForm.astro` gains the new fields (chips + country select, i18n ×3), `src/scripts/attribution.js` (bundled via `site.js`) stores first-touch attribution in `sessionStorage.gv_attr` and the form merges it into the POST. Privacy policy gains one paragraph. `docs/lead-integration.md` becomes contract v2. dataLayer event names are NOT touched here (Workstream D).

**Tech Stack:** Astro 5 (static + one on-demand route on Vercel), TypeScript strict (no `any`), Vitest (new, unit tests for `src/lib/**`), Playwright e2e against `dist/client` (API intercepted by `page.route`), `astro check` gate.

**Spec:** `docs/superpowers/specs/2026-08-18-inbound-acquisition-website-design.md` — §5 (Workstream B) is binding; §2 decisions B1–B6, D2, D3, D5 apply. Acquisition model: `docs/confirmed-acquisition-model.md` §8.

## Global Constraints

- Every user-visible string lives in `src/i18n/{en,sl,hr}.json`; EN is mirrored in `src/i18n/_parts/*.en.json` — **every EN edit goes in both** (`demo.form.*` → `_parts/mkt.en.json`; `privacy.*` → `_parts/legal.en.json`). Verify with the parts-sync one-liner after every i18n task:
  `node -e 'const fs=require("fs");const en=JSON.parse(fs.readFileSync("src/i18n/en.json","utf8"));let bad=0;for(const f of fs.readdirSync("src/i18n/_parts")){const p=JSON.parse(fs.readFileSync("src/i18n/_parts/"+f,"utf8"));for(const [k,v] of Object.entries(p)){if(JSON.stringify(en[k])!==JSON.stringify(v)){bad++;console.log("MISMATCH",f,k);}}}console.log(bad?"parts OUT OF SYNC: "+bad:"parts in sync");process.exit(bad?1:0)'`
- SL and HR files carry the same key at the same line as EN; new keys are inserted at the same position in all three. Trilingual parity: every EN string gets its SL + HR value in the same task (strings given below verbatim; HR listed in the PR body for later native pass — decision A6 pattern).
- Wire enum values (spec §5.2) are exact: `country` ∈ `NL BE DE DK SE NO FI AT SI HR EU-OTHER NON-EU`; `role` ∈ `company-director estimator head-of-estimating commercial-manager operations-manager project-manager other`; `companySize` ∈ `1-9 10-29 30-99 100-249 250+`; `estimatingMethod` ∈ `excel software mixed other`; `bidFrequency` ∈ `weekly monthly few-per-year rarely`; `mainChallenge` ∈ `pricing-confidence subcontractor-quotes historical-reuse management-visibility other`; `ndaWilling` ∈ `yes not-yet`.
- Required (client AND server): `fullName, email, company, country, role, companySize, mainChallenge`. Optional: `estimatingMethod, bidFrequency, ndaWilling, phone, message`.
- Scoring (spec §5.2): NL +2; role ∈ {company-director, project-manager, commercial-manager, head-of-estimating} +2; companySize ∈ {30-99, 100-249, 250+} +2; estimatingMethod ∈ {excel, mixed} +2; bidFrequency ∈ {weekly, monthly} +2; mainChallenge ∈ {pricing-confidence, subcontractor-quotes} +2; ndaWilling = yes +2; email domain ∈ FREEMAIL_DOMAINS −2. `qualified = score >= 7`. No −5 in code (human review).
- The top-level wire `role` stays a **human-readable English label** (gtm-toolkit v1 maps it to D365 `jobtitle`); the slug goes into `qualification.role`. Wire `message` must never be blank (gtm-toolkit `WebsiteLead.message` has `min_length=1`): synthesize from qualification when empty.
- Response body of `POST /api/lead` becomes `{ ok: true, forwarded: boolean, qualified: boolean, score: number }` on success; error shapes unchanged (`400 invalid`, `413`, `415`, honeypot `200 {ok:true}`).
- Attribution: read from `location.search` on every page; first-touch stored in `sessionStorage['gv_attr']` (JSON), never overwritten once a record with a click id exists; no cookies. Keys: `gclid gbraid wbraid utm_source utm_medium utm_campaign utm_term utm_content landingPage referrer at`. Values length-capped 256, charset `[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%-]` (URL-safe) — anything else dropped.
- dataLayer: keep the existing `generate_lead` push exactly as is (Workstream D renames). Do not add new events here.
- No `any`; `npm run check` 0 errors; `npm run test:unit` green; `npm run test:e2e` green. Vitest tests live in `tests/unit/` (excluded from `tsconfig`, like `tests/e2e/`).
- Do NOT touch: `docs/confirmed-acquisition-model.md` (WS-F), Bookings/embed (WS-C), event names (WS-D), landing page (WS-E). Do not change `lead-tracking-ga4.md` except the one line noting the new response fields (Task 6).
- Commit after every task (Conventional Commits, Co-Authored-By trailer). Branch `feat/ws-b-qualification-form` from `main` (7807bc3 or later), in an isolated worktree.

---

### Task 0: Worktree, baseline, Vitest harness

**Files:**
- Modify: `package.json` (scripts + devDependency), `package-lock.json`
- Create: `vitest.config.ts`, `tests/unit/README.md`
- Modify: `.github/workflows/ci.yml` (check job: add unit step), `CLAUDE.md` (Commands + "no test framework" sentence), `tests/e2e/README.md` (one sentence pointing to unit tests)

**Interfaces:**
- Produces: `npm run test:unit` (Vitest over `tests/unit/**/*.test.ts`), importable `@/lib/*` alias in tests.

- [ ] **Step 1: Worktree + branch**

Use the native worktree tool (EnterWorktree) or `git worktree add .claude/worktrees/ws-b -b feat/ws-b-qualification-form main`; `npm ci` inside it; confirm `git log --oneline -1` shows `7807bc3` or a later main.

- [ ] **Step 2: Baseline gates (record outputs)**

Run: `npm run check` → expect `0 errors`. Run: `npm run test:e2e` → expect `102 passed` (takes 1–3 min; Chromium already installed; `npx playwright install chromium` once if not).

- [ ] **Step 3: Write the failing unit smoke test**

Create `tests/unit/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('unit harness', () => {
  it('runs TypeScript tests with the @/ alias available', async () => {
    const mod = await import('@/i18n/slugs');
    expect(Object.keys(mod.SLUGS)).toContain('book-a-demo');
  });
});
```

- [ ] **Step 4: Run it to verify it fails**

Run: `npm run test:unit`
Expected: `npm error Missing script: "test:unit"`.

- [ ] **Step 5: Install Vitest and wire it**

Run: `npm install -D vitest@^3` (pins a 3.x; record the exact version from package.json in your report).

Create `vitest.config.ts`:
```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Reuses Astro's Vite config so `@/` (tsconfig paths) and TS resolve exactly as
// in the site. Unit tests cover the pure modules under src/lib — the e2e
// harness (tests/e2e) runs against the static build and cannot reach the
// on-demand /api/lead route, so server-side logic is proven here.
export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
```

In `package.json` scripts add, after `"check"`:
```json
    "test:unit": "vitest run",
```

Create `tests/unit/README.md`:
```md
# Unit tests (Vitest)

`npm run test:unit` — Vitest over `tests/unit/**/*.test.ts`, using Astro's Vite
config (`vitest.config.ts`) so `@/` imports resolve like in the site.

Scope: the pure modules under `src/lib/` (lead scoring, lead payload parsing).
Anything that needs the built site or a browser belongs in `tests/e2e/`.
`tests/` is excluded from `tsconfig.json`, so these files never feed the
`astro check` gate; Vitest transpiles them itself.
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test:unit`
Expected: `1 passed`.

- [ ] **Step 7: CI + docs**

In `.github/workflows/ci.yml`, in the `check` job, directly after `- run: npm run check` add:
```yaml
      - run: npm run test:unit
```

In `CLAUDE.md`:
- Commands list: after the `npm run check` bullet add `- \`npm run test:unit\` — Vitest unit tests for the pure modules in \`src/lib/\` (\`tests/unit/\`); runs in CI next to \`astro check\``.
- Replace the sentence `- No test framework yet — \`astro check\` is the gate.` (Stack section) with `- \`astro check\` is the gate; Vitest covers \`src/lib/\` (\`npm run test:unit\`), Playwright covers the built site (\`npm run test:e2e\`).`
- In the paragraph starting `There is no unit-test framework.` change the first sentence to `Unit tests (Vitest) exist only for the pure modules in \`src/lib/\` — see \`tests/unit/README.md\`.` and keep the rest about the Playwright harness.
- Layout list: add `- \`src/lib/\` — pure, unit-tested helpers (\`leadScore.ts\`, \`leadPayload.ts\`).` after the `src/pages/api/lead.ts` bullet, and `\`src/scripts/site.js\` + \`attribution.js\`` where `site.js` is mentioned.

In `tests/e2e/README.md` top paragraph add one sentence: `Server-side logic (lead scoring/parsing) is covered by Vitest in \`tests/unit/\`, not here.`

- [ ] **Step 8: Gates + commit**

Run: `npm run check` (0 errors), `npm run test:unit` (1 passed).
```bash
git add package.json package-lock.json vitest.config.ts tests/unit .github/workflows/ci.yml CLAUDE.md tests/e2e/README.md
git commit -m "test: add Vitest unit harness for src/lib (tests/unit) + CI step

The e2e harness runs against the static build and cannot exercise the
on-demand /api/lead route; the pure lead-scoring / payload modules that
Workstream B adds need a unit seam. vitest.config.ts reuses Astro's Vite
config so @/ resolves like in the site.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 1: `src/lib/leadScore.ts` — enums + `scoreLead()`

**Files:**
- Create: `src/lib/leadScore.ts`
- Test: `tests/unit/leadScore.test.ts`
- Delete: `tests/unit/smoke.test.ts` (superseded)

**Interfaces:**
- Produces (exact exports):
```ts
export const COUNTRIES = ['NL','BE','DE','DK','SE','NO','FI','AT','SI','HR','EU-OTHER','NON-EU'] as const;
export const ROLES = ['company-director','estimator','head-of-estimating','commercial-manager','operations-manager','project-manager','other'] as const;
export const COMPANY_SIZES = ['1-9','10-29','30-99','100-249','250+'] as const;
export const ESTIMATING_METHODS = ['excel','software','mixed','other'] as const;
export const BID_FREQUENCIES = ['weekly','monthly','few-per-year','rarely'] as const;
export const MAIN_CHALLENGES = ['pricing-confidence','subcontractor-quotes','historical-reuse','management-visibility','other'] as const;
export const NDA_WILLING = ['yes','not-yet'] as const;
export type Country = typeof COUNTRIES[number]; // …and Role, CompanySize, EstimatingMethod, BidFrequency, MainChallenge, NdaWilling likewise
export const FREEMAIL_DOMAINS: ReadonlySet<string>;
export const QUALIFIED_THRESHOLD = 7;
export interface ScoreInput { email: string; country: Country | ''; role: Role | ''; companySize: CompanySize | ''; estimatingMethod: EstimatingMethod | ''; bidFrequency: BidFrequency | ''; mainChallenge: MainChallenge | ''; ndaWilling: NdaWilling | ''; }
export interface ScoreResult { score: number; reasons: string[]; qualified: boolean; }
export function scoreLead(input: ScoreInput): ScoreResult;
export function isOneOf<T extends readonly string[]>(list: T, v: string): v is T[number];
```
  `reasons` are stable slugs: `country-nl`, `decision-role`, `size-30-plus`, `excel-history`, `recurring-bids`, `core-pain`, `nda-ready`, `freemail`.

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/leadScore.test.ts`:
```ts
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
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:unit`
Expected: FAIL — `Failed to resolve import "@/lib/leadScore"`.

- [ ] **Step 3: Implement**

Create `src/lib/leadScore.ts`:
```ts
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
```

- [ ] **Step 4: Run tests → pass; delete smoke test**

Run: `npm run test:unit` → `7 passed` (plus smoke). Then `git rm tests/unit/smoke.test.ts`; re-run → `7 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/leadScore.ts tests/unit/leadScore.test.ts tests/unit/smoke.test.ts
git commit -m "feat(lead): leadScore — §8.2 qualification enums and scoreLead()

Pure module: wire enums, freemail list, +2/−2 signals, threshold 7.
Unit-tested (Vitest). No API change yet.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: `src/lib/leadPayload.ts` + `lead.ts` refactor (contract v2 server side)

**Files:**
- Create: `src/lib/leadPayload.ts`
- Modify: `src/pages/api/lead.ts`
- Test: `tests/unit/leadPayload.test.ts`

**Interfaces:**
- Consumes: everything exported by `@/lib/leadScore`.
- Produces:
```ts
export interface Qualification { country: string; role: string; companySize: string; mainChallenge: string; estimatingMethod: string; bidFrequency: string; ndaWilling: string; }
export interface Attribution { gclid: string; gbraid: string; wbraid: string; utm_source: string; utm_medium: string; utm_campaign: string; utm_term: string; utm_content: string; landingPage: string; referrer: string; submissionPage: string; submittedAt: string; consent: 'accept' | 'reject' | 'unset'; }
export interface Lead { source: 'gradvera-website'; receivedAt: string; locale: string; page: string; fullName: string; company: string; email: string; phone: string; role: string; message: string; qualification: Qualification; attribution: Attribution; score: number; scoreReasons: string[]; qualified: boolean; }
export type ParseResult = { ok: true; lead: Lead } | { ok: false; error: 'invalid' };
export function parseLeadBody(body: Record<string, unknown>, receivedAt: Date): ParseResult;
export const ROLE_LABELS_EN: Record<Role, string>;
export function synthesizeMessage(q: Qualification): string;
```

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/leadPayload.test.ts`:
```ts
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
```

- [ ] **Step 2: Run → fail** (`Failed to resolve import "@/lib/leadPayload"`).

- [ ] **Step 3: Implement `src/lib/leadPayload.ts`**

```ts
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
```
- [ ] **Step 4: Run unit tests → pass** (`npm run test:unit` → 13 passed).

- [ ] **Step 5: Refactor `src/pages/api/lead.ts` to use it**

Replace the `Lead` interface, `str`, `EMAIL_RE`, the validation block and the "Build the normalized lead" block with:
```ts
import { parseLeadBody, type Lead } from '../../lib/leadPayload';
```
(keep `json()`, the size/content-type guards, honeypot, forward code). After the honeypot:
```ts
  // ---- Validate + normalize (pure; see src/lib/leadPayload.ts) ------------
  const parsed = parseLeadBody(body, new Date());
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, 400);
  const lead: Lead = parsed.lead;
  const verdict = { qualified: lead.qualified, score: lead.score };
```
and every success return becomes `json({ ok: true, forwarded: true, ...verdict }, 200)` / `json({ ok: true, forwarded: false, ...verdict }, 200)` (three sites: rejected, threw, no-endpoint). Update the header comment's step 2/3 to mention parseLeadBody and that the response carries `qualified`/`score` for client-side analytics. The no-endpoint log adds `qualified: lead.qualified, score: lead.score` (non-PII).

- [ ] **Step 6: Gates + commit**

Run: `npm run check` (0 errors — watch the `import type` vs value imports), `npm run test:unit` (13 passed).
```bash
git add src/lib/leadPayload.ts src/pages/api/lead.ts tests/unit/leadPayload.test.ts
git commit -m "feat(lead): parseLeadBody — contract v2 (qualification, attribution, score) + lead.ts on it

lead.ts is transport only now; validation/normalization/scoring live in the
pure, unit-tested src/lib/leadPayload.ts. Response carries qualified + score.
Wire role stays the English label; blank message is synthesized so the
gtm-toolkit v1 receiver (message min_length=1) never 422s.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: DemoForm — qualification fields (markup, i18n ×3, client validation)

**Files:**
- Modify: `src/components/forms/DemoForm.astro`
- Modify: `src/i18n/en.json`, `src/i18n/sl.json`, `src/i18n/hr.json`, `src/i18n/_parts/mkt.en.json`
- Modify: `tests/e2e/lead-tracking.spec.mjs` (fill the new required fields), `tests/e2e/claims.spec.mjs` (no change expected — verify)
- Create: `tests/e2e/lead-form.spec.mjs`

**Interfaces:**
- Consumes: enum slugs from `@/lib/leadScore` (import them in the Astro frontmatter so markup and server share one list).
- Produces: form field names `country role companySize mainChallenge estimatingMethod bidFrequency ndaWilling` (+ existing); element ids `#country`, error ids `err-country err-role err-size err-challenge`; helpers `fillRequired(page)` + `armLeadCapture(page)` in `tests/e2e/helpers.mjs` (reused by Task 4 and lead-tracking.spec).

- [ ] **Step 1: Write the failing e2e tests**

Append to `tests/e2e/helpers.mjs` (shared by lead-form + lead-tracking specs — never import one spec file from another, Playwright would register its tests twice):
```js
/** Fill every required demo-form field with fixed values (qualification form, WS-B). */
export async function fillRequired(page) {
  await page.fill('#fn', 'Test Person');
  await page.fill('#co', 'Test Co');
  await page.fill('#em', 'test@example.com');
  await page.selectOption('#country', 'NL');
  await page.check('input[name="role"][value="head-of-estimating"]');
  await page.check('input[name="companySize"][value="30-99"]');
  await page.check('input[name="mainChallenge"][value="pricing-confidence"]');
}

/** Intercept /api/lead (static server has none). Returns { body } — await `body` AFTER submitting. */
export async function armLeadCapture(page, reply = '{"ok":true,"forwarded":false,"qualified":true,"score":8}') {
  let resolve;
  const body = new Promise((r) => { resolve = r; });
  await page.route('**/api/lead', (route) => {
    resolve(route.request().postDataJSON());
    route.fulfill({ status: 200, contentType: 'application/json', body: reply });
  });
  return { body };
}
```

Create `tests/e2e/lead-form.spec.mjs`:
```js
// Qualification form (acquisition model §8.1): required fields + enum wire
// values + optional fields, per locale, asserted on the intercepted POST body.
import { test, expect } from '@playwright/test';
import { gotoClean, fillRequired, armLeadCapture } from './helpers.mjs';

const DEMO = [
  { path: '/book-a-demo/', locale: 'en' },
  { path: '/sl/rezervirajte-demo/', locale: 'sl' },
  { path: '/hr/rezervirajte-demo/', locale: 'hr' },
];

for (const { path, locale } of DEMO) {
  test(`${path} posts the qualification fields with wire enum values`, async ({ page }) => {
    const cap = await armLeadCapture(page);
    await gotoClean(page, path);
    await fillRequired(page);
    await page.check('input[name="estimatingMethod"][value="mixed"]');
    await page.check('input[name="bidFrequency"][value="monthly"]');
    await page.check('input[name="ndaWilling"][value="yes"]');
    await page.click('#gv-demo-form button[type="submit"]');
    await expect(page.locator('.form-ok')).toBeVisible();
    expect(await cap.body).toMatchObject({
      locale, page: 'book-a-demo', fullName: 'Test Person', company: 'Test Co', email: 'test@example.com',
      country: 'NL', role: 'head-of-estimating', companySize: '30-99', mainChallenge: 'pricing-confidence',
      estimatingMethod: 'mixed', bidFrequency: 'monthly', ndaWilling: 'yes',
    });
  });

  test(`${path} blocks submit until country, role, size and challenge are chosen`, async ({ page }) => {
    let posted = false;
    await page.route('**/api/lead', (route) => { posted = true; route.fulfill({ status: 200, body: '{"ok":true}' }); });
    await gotoClean(page, path);
    await page.fill('#fn', 'Test Person');
    await page.fill('#co', 'Test Co');
    await page.fill('#em', 'test@example.com');
    await page.click('#gv-demo-form button[type="submit"]');
    await expect(page.locator('#err-country')).toBeVisible();
    await expect(page.locator('#err-role')).toBeVisible();
    await expect(page.locator('#err-size')).toBeVisible();
    await expect(page.locator('#err-challenge')).toBeVisible();
    expect(posted).toBe(false);
    // message is optional now: no error for it
    await expect(page.locator('#err-ms')).toBeHidden();
  });
}

test('/book-a-demo/ optional fields may be left blank and message is optional', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await gotoClean(page, '/book-a-demo/');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  const b = await cap.body;
  expect(b.message ?? '').toBe('');
  expect(b.estimatingMethod).toBeUndefined();
  expect(b.phone ?? '').toBe('');
});
```

Modify `tests/e2e/lead-tracking.spec.mjs`: import `fillRequired` from `./helpers.mjs` and replace the four `page.fill` lines in both tests with `await fillRequired(page);` (keep `#ms` fill out — message optional; the failure test keeps its route to 500).

- [ ] **Step 2: Run → fail**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/lead-form.spec.mjs`
Expected: failures on `#country` not found / `input[name="companySize"]` not found.

- [ ] **Step 3: i18n — add keys (EN in `en.json` AND `_parts/mkt.en.json`; SL; HR)**

Insert directly after `"demo.form.roleOther"` (same position in all three files + the part). Also **change** existing `demo.form.message` / `demo.form.messagePlaceholder`.

EN:
```json
  "demo.form.roleProjectManager": "Project manager",
  "demo.form.country": "Country",
  "demo.form.countryPlaceholder": "Select your country",
  "demo.form.countryNL": "Netherlands",
  "demo.form.countryBE": "Belgium",
  "demo.form.countryDE": "Germany",
  "demo.form.countryDK": "Denmark",
  "demo.form.countrySE": "Sweden",
  "demo.form.countryNO": "Norway",
  "demo.form.countryFI": "Finland",
  "demo.form.countryAT": "Austria",
  "demo.form.countrySI": "Slovenia",
  "demo.form.countryHR": "Croatia",
  "demo.form.countryEUOTHER": "Other EU country",
  "demo.form.countryNONEU": "Outside the EU",
  "demo.form.size": "Company size (employees)",
  "demo.form.size1_9": "1–9",
  "demo.form.size10_29": "10–29",
  "demo.form.size30_99": "30–99",
  "demo.form.size100_249": "100–249",
  "demo.form.size250": "250+",
  "demo.form.challenge": "Main challenge",
  "demo.form.challengePricing": "Pricing confidence",
  "demo.form.challengeSubs": "Subcontractor quotes",
  "demo.form.challengeHistory": "Reusing historical estimates",
  "demo.form.challengeMgmt": "Management visibility",
  "demo.form.challengeOther": "Other",
  "demo.form.method": "How do you estimate today?",
  "demo.form.methodExcel": "Excel spreadsheets",
  "demo.form.methodSoftware": "Dedicated software",
  "demo.form.methodMixed": "Mix of both",
  "demo.form.methodOther": "Other",
  "demo.form.frequency": "How often do you bid?",
  "demo.form.frequencyWeekly": "Weekly",
  "demo.form.frequencyMonthly": "A few per month",
  "demo.form.frequencyFewPerYear": "A few per year",
  "demo.form.frequencyRarely": "Rarely",
  "demo.form.nda": "Could you share historical Excel BoQs under NDA?",
  "demo.form.ndaYes": "Yes",
  "demo.form.ndaNotYet": "Not yet",
```
and change:
```json
  "demo.form.message": "Anything else?",
  "demo.form.messagePlaceholder": "e.g. the kind of projects you bid on, or a question for the demo",
```

SL:
```json
  "demo.form.roleProjectManager": "Vodja projektov",
  "demo.form.country": "Država",
  "demo.form.countryPlaceholder": "Izberite državo",
  "demo.form.countryNL": "Nizozemska",
  "demo.form.countryBE": "Belgija",
  "demo.form.countryDE": "Nemčija",
  "demo.form.countryDK": "Danska",
  "demo.form.countrySE": "Švedska",
  "demo.form.countryNO": "Norveška",
  "demo.form.countryFI": "Finska",
  "demo.form.countryAT": "Avstrija",
  "demo.form.countrySI": "Slovenija",
  "demo.form.countryHR": "Hrvaška",
  "demo.form.countryEUOTHER": "Druga država EU",
  "demo.form.countryNONEU": "Zunaj EU",
  "demo.form.size": "Velikost podjetja (zaposleni)",
  "demo.form.size1_9": "1–9",
  "demo.form.size10_29": "10–29",
  "demo.form.size30_99": "30–99",
  "demo.form.size100_249": "100–249",
  "demo.form.size250": "250+",
  "demo.form.challenge": "Glavni izziv",
  "demo.form.challengePricing": "Zanesljivost cen",
  "demo.form.challengeSubs": "Ponudbe podizvajalcev",
  "demo.form.challengeHistory": "Ponovna uporaba preteklih kalkulacij",
  "demo.form.challengeMgmt": "Pregled za vodstvo",
  "demo.form.challengeOther": "Drugo",
  "demo.form.method": "Kako danes pripravljate kalkulacije?",
  "demo.form.methodExcel": "Excel preglednice",
  "demo.form.methodSoftware": "Namenska programska oprema",
  "demo.form.methodMixed": "Kombinacija obojega",
  "demo.form.methodOther": "Drugo",
  "demo.form.frequency": "Kako pogosto oddajate ponudbe?",
  "demo.form.frequencyWeekly": "Tedensko",
  "demo.form.frequencyMonthly": "Nekaj na mesec",
  "demo.form.frequencyFewPerYear": "Nekaj na leto",
  "demo.form.frequencyRarely": "Redko",
  "demo.form.nda": "Bi lahko pod NDA delili pretekle popise del v Excelu?",
  "demo.form.ndaYes": "Da",
  "demo.form.ndaNotYet": "Še ne",
```
and change:
```json
  "demo.form.message": "Še kaj?",
  "demo.form.messagePlaceholder": "npr. vrste projektov, za katere oddajate ponudbe, ali vprašanje za predstavitev",
```

HR:
```json
  "demo.form.roleProjectManager": "Voditelj projekata",
  "demo.form.country": "Država",
  "demo.form.countryPlaceholder": "Odaberite državu",
  "demo.form.countryNL": "Nizozemska",
  "demo.form.countryBE": "Belgija",
  "demo.form.countryDE": "Njemačka",
  "demo.form.countryDK": "Danska",
  "demo.form.countrySE": "Švedska",
  "demo.form.countryNO": "Norveška",
  "demo.form.countryFI": "Finska",
  "demo.form.countryAT": "Austrija",
  "demo.form.countrySI": "Slovenija",
  "demo.form.countryHR": "Hrvatska",
  "demo.form.countryEUOTHER": "Druga država EU-a",
  "demo.form.countryNONEU": "Izvan EU-a",
  "demo.form.size": "Veličina tvrtke (zaposlenici)",
  "demo.form.size1_9": "1–9",
  "demo.form.size10_29": "10–29",
  "demo.form.size30_99": "30–99",
  "demo.form.size100_249": "100–249",
  "demo.form.size250": "250+",
  "demo.form.challenge": "Glavni izazov",
  "demo.form.challengePricing": "Pouzdanost cijena",
  "demo.form.challengeSubs": "Ponude podizvođača",
  "demo.form.challengeHistory": "Ponovna upotreba povijesnih troškovnika",
  "demo.form.challengeMgmt": "Uvid za upravu",
  "demo.form.challengeOther": "Drugo",
  "demo.form.method": "Kako danas izrađujete troškovnike?",
  "demo.form.methodExcel": "Excel tablice",
  "demo.form.methodSoftware": "Namjenski softver",
  "demo.form.methodMixed": "Kombinacija oboje",
  "demo.form.methodOther": "Drugo",
  "demo.form.frequency": "Koliko često šaljete ponude?",
  "demo.form.frequencyWeekly": "Tjedno",
  "demo.form.frequencyMonthly": "Nekoliko mjesečno",
  "demo.form.frequencyFewPerYear": "Nekoliko godišnje",
  "demo.form.frequencyRarely": "Rijetko",
  "demo.form.nda": "Biste li pod NDA-om mogli podijeliti povijesne troškovnike u Excelu?",
  "demo.form.ndaYes": "Da",
  "demo.form.ndaNotYet": "Još ne",
```
and change:
```json
  "demo.form.message": "Još nešto?",
  "demo.form.messagePlaceholder": "npr. vrste projekata za koje šaljete ponude ili pitanje za demonstraciju",
```

Validate JSON + parts-sync after editing.

- [ ] **Step 4: DemoForm markup**

In the frontmatter replace the `roles` block with:
```ts
import { ROLES, COUNTRIES, COMPANY_SIZES, MAIN_CHALLENGES, ESTIMATING_METHODS, BID_FREQUENCIES, NDA_WILLING } from '../../lib/leadScore';

// Chip/select options: wire value = enum slug (validated server-side), label = i18n.
const roleLabel: Record<(typeof ROLES)[number], string> = {
  'company-director': t('demo.form.roleCompanyDirector'), 'estimator': t('demo.form.roleEstimator'),
  'head-of-estimating': t('demo.form.roleHeadOfEstimating'), 'commercial-manager': t('demo.form.roleCommercialManager'),
  'operations-manager': t('demo.form.roleOperationsManager'), 'project-manager': t('demo.form.roleProjectManager'), 'other': t('demo.form.roleOther'),
};
const countryLabel: Record<(typeof COUNTRIES)[number], string> = {
  NL: t('demo.form.countryNL'), BE: t('demo.form.countryBE'), DE: t('demo.form.countryDE'), DK: t('demo.form.countryDK'),
  SE: t('demo.form.countrySE'), NO: t('demo.form.countryNO'), FI: t('demo.form.countryFI'), AT: t('demo.form.countryAT'),
  SI: t('demo.form.countrySI'), HR: t('demo.form.countryHR'), 'EU-OTHER': t('demo.form.countryEUOTHER'), 'NON-EU': t('demo.form.countryNONEU'),
};
const sizeLabel: Record<(typeof COMPANY_SIZES)[number], string> = {
  '1-9': t('demo.form.size1_9'), '10-29': t('demo.form.size10_29'), '30-99': t('demo.form.size30_99'), '100-249': t('demo.form.size100_249'), '250+': t('demo.form.size250'),
};
const challengeLabel: Record<(typeof MAIN_CHALLENGES)[number], string> = {
  'pricing-confidence': t('demo.form.challengePricing'), 'subcontractor-quotes': t('demo.form.challengeSubs'),
  'historical-reuse': t('demo.form.challengeHistory'), 'management-visibility': t('demo.form.challengeMgmt'), 'other': t('demo.form.challengeOther'),
};
const methodLabel: Record<(typeof ESTIMATING_METHODS)[number], string> = {
  excel: t('demo.form.methodExcel'), software: t('demo.form.methodSoftware'), mixed: t('demo.form.methodMixed'), other: t('demo.form.methodOther'),
};
const frequencyLabel: Record<(typeof BID_FREQUENCIES)[number], string> = {
  weekly: t('demo.form.frequencyWeekly'), monthly: t('demo.form.frequencyMonthly'), 'few-per-year': t('demo.form.frequencyFewPerYear'), rarely: t('demo.form.frequencyRarely'),
};
const ndaLabel: Record<(typeof NDA_WILLING)[number], string> = { yes: t('demo.form.ndaYes'), 'not-yet': t('demo.form.ndaNotYet') };
// Locale default for the country select (SL → SI, HR → HR, EN → none).
const defaultCountry = lang === 'sl' ? 'SI' : lang === 'hr' ? 'HR' : '';
```

Markup — after the email/phone `.field-row`, REPLACE the existing role fieldset and message field with (order: country → role → size → challenge → method → frequency → NDA → message):
```astro
  <div class="field">
    <label for="country">{t('demo.form.country')} <span class="req" aria-hidden="true">*</span></label>
    <select id="country" name="country" required aria-required="true" aria-describedby="err-country" autocomplete="country">
      <option value="" disabled selected={defaultCountry === ''}>{t('demo.form.countryPlaceholder')}</option>
      {COUNTRIES.map((c) => (<option value={c} selected={c === defaultCountry}>{countryLabel[c]}</option>))}
    </select>
    <p class="field-error" id="err-country" role="alert" hidden></p>
  </div>
  <fieldset class="field chip-field" data-required>
    <legend>{t('demo.form.role')} <span class="req" aria-hidden="true">*</span></legend>
    <div class="chips">
      {ROLES.map((r) => (
        <label class="chip"><input type="radio" name="role" value={r} aria-describedby="err-role"><span class="chip-tick" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M20 6L9 17l-5-5"/></svg></span><span class="chip-lbl">{roleLabel[r]}</span></label>
      ))}
    </div>
    <p class="field-error" id="err-role" role="alert" hidden></p>
  </fieldset>
  <fieldset class="field chip-field" data-required>
    <legend>{t('demo.form.size')} <span class="req" aria-hidden="true">*</span></legend>
    <div class="chips">
      {COMPANY_SIZES.map((s) => (
        <label class="chip"><input type="radio" name="companySize" value={s} aria-describedby="err-size"><span class="chip-tick" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M20 6L9 17l-5-5"/></svg></span><span class="chip-lbl">{sizeLabel[s]}</span></label>
      ))}
    </div>
    <p class="field-error" id="err-size" role="alert" hidden></p>
  </fieldset>
  <fieldset class="field chip-field" data-required>
    <legend>{t('demo.form.challenge')} <span class="req" aria-hidden="true">*</span></legend>
    <div class="chips">
      {MAIN_CHALLENGES.map((c) => (
        <label class="chip"><input type="radio" name="mainChallenge" value={c} aria-describedby="err-challenge"><span class="chip-tick" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M20 6L9 17l-5-5"/></svg></span><span class="chip-lbl">{challengeLabel[c]}</span></label>
      ))}
    </div>
    <p class="field-error" id="err-challenge" role="alert" hidden></p>
  </fieldset>
  <fieldset class="field chip-field">
    <legend>{t('demo.form.method')} <span class="opt">({t('demo.form.optional')})</span></legend>
    <div class="chips">
      {ESTIMATING_METHODS.map((m) => (
        <label class="chip"><input type="radio" name="estimatingMethod" value={m}><span class="chip-tick" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M20 6L9 17l-5-5"/></svg></span><span class="chip-lbl">{methodLabel[m]}</span></label>
      ))}
    </div>
  </fieldset>
  <fieldset class="field chip-field">
    <legend>{t('demo.form.frequency')} <span class="opt">({t('demo.form.optional')})</span></legend>
    <div class="chips">
      {BID_FREQUENCIES.map((f) => (
        <label class="chip"><input type="radio" name="bidFrequency" value={f}><span class="chip-tick" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M20 6L9 17l-5-5"/></svg></span><span class="chip-lbl">{frequencyLabel[f]}</span></label>
      ))}
    </div>
  </fieldset>
  <fieldset class="field chip-field">
    <legend>{t('demo.form.nda')} <span class="opt">({t('demo.form.optional')})</span></legend>
    <div class="chips">
      {NDA_WILLING.map((n) => (
        <label class="chip"><input type="radio" name="ndaWilling" value={n}><span class="chip-tick" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M20 6L9 17l-5-5"/></svg></span><span class="chip-lbl">{ndaLabel[n]}</span></label>
      ))}
    </div>
  </fieldset>
  <div class="field">
    <label for="ms">{t('demo.form.message')} <span class="opt">({t('demo.form.optional')})</span></label>
    <textarea id="ms" name="message" rows="3" placeholder={t('demo.form.messagePlaceholder')}></textarea>
  </div>
```
CSS: rename `.role-field` → `.chip-field` in the existing style block (same rules), and add:
```css
  .form-card select { width: 100%; min-height: 44px; }
  .chip-field .field-error { margin-top: 9px; }
```
(If `.field select` is not already styled like inputs in `site.css`, copy the `.field input` rule for `select` in this block — check `grep -n "\.field input" src/styles/site.css` and mirror background/border/color/padding/font.)

- [ ] **Step 5: Client validation**

In the inline script replace the `REQUIRED` / `ERR_ID` / `fieldEl` / `validateField` logic:
```js
    // Required set mirrors the server (src/lib/leadPayload.ts).
    var REQUIRED = ['fullName', 'company', 'email', 'country', 'role', 'companySize', 'mainChallenge'];
    var ERR_ID = { fullName: 'err-fn', company: 'err-co', email: 'err-em', country: 'err-country', role: 'err-role', companySize: 'err-size', mainChallenge: 'err-challenge' };
    var RADIO = { role: true, companySize: true, mainChallenge: true };

    function fieldEl(name) { return form.querySelector('[name="' + name + '"]'); }
    function fieldValue(name) {
      if (RADIO[name]) { var c = form.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ''; }
      var el = fieldEl(name); return el ? (el.value || '').trim() : '';
    }
    function markInvalid(name, on) {
      var el = errEl(name);
      if (el) { el.hidden = !on; }
      if (RADIO[name]) {
        var fs = form.querySelector('input[name="' + name + '"]'); fs = fs && fs.closest('fieldset');
        if (fs) { if (on) fs.setAttribute('aria-invalid', 'true'); else fs.removeAttribute('aria-invalid'); }
      } else {
        var input = fieldEl(name);
        if (input) { if (on) { input.setAttribute('aria-invalid', 'true'); input.classList.add('invalid'); } else { input.removeAttribute('aria-invalid'); input.classList.remove('invalid'); } }
      }
    }
    function setError(name, msg) { var el = errEl(name); if (el) el.textContent = msg; markInvalid(name, true); }
    function clearError(name) { var el = errEl(name); if (el) el.textContent = ''; markInvalid(name, false); }
    function validateField(name) {
      var v = fieldValue(name);
      if (!v) { setError(name, reqMsg); return false; }
      if (name === 'email' && !EMAIL_RE.test(v)) { setError(name, emailMsg); return false; }
      clearError(name);
      return true;
    }
    // Text/select fields validate on blur + live after flagged; radio groups clear on change.
    for (var k = 0; k < REQUIRED.length; k++) {
      (function (name) {
        if (RADIO[name]) {
          var radios = form.querySelectorAll('input[name="' + name + '"]');
          for (var j = 0; j < radios.length; j++) radios[j].addEventListener('change', function () { validateField(name); });
          return;
        }
        var input = fieldEl(name);
        if (!input) return;
        input.addEventListener('blur', function () { validateField(name); });
        input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', function () {
          if (input.getAttribute('aria-invalid') || input.tagName === 'SELECT') validateField(name);
        });
      })(REQUIRED[k]);
    }
```
In the submit handler the `firstInvalid` focus target for radio groups should be the first radio of that group: `if (!firstInvalid) firstInvalid = RADIO[REQUIRED[r]] ? form.querySelector('input[name="' + REQUIRED[r] + '"]') : fieldEl(REQUIRED[r]);`. The harvest loop already skips unchecked radios — keep it; add `if (f.tagName === 'SELECT' && !f.value) continue;` so an unselected country never posts `""` (it is required anyway). Add CSS `.chip-field[aria-invalid="true"] .chip { border-color: var(--danger-on-ink-border); }`.

- [ ] **Step 6: Run tests**

Run: `npx playwright test -c tests/e2e/playwright.config.mjs tests/e2e/lead-form.spec.mjs tests/e2e/lead-tracking.spec.mjs tests/e2e/claims.spec.mjs tests/e2e/header-responsive.spec.mjs`
Expected: all passed. Also `npm run check` 0 errors (the `Record<(typeof ROLES)[number], string>` maps must be complete or astro check fails — that is the point).

- [ ] **Step 7: Commit**

```bash
git add src/components/forms/DemoForm.astro src/i18n tests/e2e/helpers.mjs tests/e2e/lead-form.spec.mjs tests/e2e/lead-tracking.spec.mjs
git commit -m "feat(form): qualification fields — country, role, size, challenge (required); method, frequency, NDA, message (optional)

Wire values are the leadScore enum slugs; labels are i18n EN/SL/HR (+parts).
Client validation mirrors the server required set; chip groups flag the
fieldset. message is now optional. e2e: lead-form.spec pins the POST body
per locale; lead-tracking.spec fills the new required fields.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Attribution capture (`src/scripts/attribution.js`) + form merge

**Files:**
- Create: `src/scripts/attribution.js`
- Modify: `src/scripts/site.js` (import at top), `src/components/forms/DemoForm.astro` (merge into payload)
- Test: `tests/e2e/lead-form.spec.mjs` (append)

**Interfaces:**
- Produces: `window.gvAttribution()` → object with the attribution keys (strings) incl. `consent`; `sessionStorage['gv_attr']` JSON `{gclid,…,landingPage,referrer,at}`.

- [ ] **Step 1: Failing e2e tests** — append to `tests/e2e/lead-form.spec.mjs`:
```js
test('attribution: click id + utm on the landing page survive navigation to the form and ride the POST', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await gotoClean(page, '/?gclid=Cj0TEST&utm_source=google&utm_medium=cpc&utm_campaign=nl-est&utm_term=construction%20estimating%20software');
  await page.click('header a[href*="book-a-demo"]');
  await expect(page).toHaveURL(/\/book-a-demo\/$/);
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  const b = await cap.body;
  expect(b).toMatchObject({ gclid: 'Cj0TEST', utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'nl-est', utm_term: 'construction estimating software', landingPage: '/', submissionPage: '/book-a-demo/', consent: 'unset' });
  expect(typeof b.submittedAt).toBe('string');
  expect(b.submittedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
});

test('attribution: first touch wins; a later visit without a click id does not overwrite', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await gotoClean(page, '/book-a-demo/?gclid=FIRST&utm_campaign=one');
  await gotoClean(page, '/book-a-demo/?utm_campaign=two');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  expect(await cap.body).toMatchObject({ gclid: 'FIRST', utm_campaign: 'one' });
});

test('attribution: consent state is read from the gv-consent cookie', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await page.goto('/book-a-demo/', { waitUntil: 'load' });
  await page.click('[data-consent="accept"]');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  expect((await cap.body).consent).toBe('accept');
});
```
(Check the header CTA selector: `Header.astro:25` renders `<a class="btn btn-primary" href=…/book-a-demo/>`; if `header a[href*="book-a-demo"]` matches more than one element use `header .nav-cta a`.)

- [ ] **Step 2: Run → fail** (body lacks `gclid` / `consent`).

- [ ] **Step 3: Implement `src/scripts/attribution.js`**
```js
// First-touch campaign attribution (acquisition model §8.3). Runs on every
// page (imported by site.js). Reads click ids + UTM params from the URL once,
// stores the FIRST touch of the session in sessionStorage (no cookie, cleared
// when the tab closes), and exposes window.gvAttribution() for the demo form.
// Values are length-capped here and re-validated server-side (leadPayload.ts).
(function () {
  var KEY = 'gv_attr';
  var PARAMS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var MAX = 256;

  function read() {
    try { var raw = window.sessionStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function write(rec) {
    try { window.sessionStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) { /* storage blocked: attribution degrades to none */ }
  }
  function hasClickId(rec) { return !!(rec && (rec.gclid || rec.gbraid || rec.wbraid)); }

  function capture() {
    var qs = new URLSearchParams(window.location.search);
    var rec = { landingPage: window.location.pathname, referrer: (document.referrer || '').slice(0, MAX), at: new Date().toISOString() };
    var any = false;
    for (var i = 0; i < PARAMS.length; i++) {
      var v = qs.get(PARAMS[i]);
      if (v) { rec[PARAMS[i]] = v.slice(0, MAX); any = true; }
    }
    var existing = read();
    // First touch wins: keep an existing record that has a click id or any UTM;
    // only create/replace when nothing useful is stored yet.
    if (!existing) { write(rec); return; }
    if (!hasClickId(existing) && !existing.utm_source && !existing.utm_campaign && any) { write(rec); }
  }

  function consentState() {
    var m = document.cookie.match(/(?:^|;\s*)gv-consent=([^;]+)/);
    if (!m) return 'unset';
    var v = decodeURIComponent(m[1]);
    return v === 'accept' || v === 'reject' ? v : 'unset';
  }

  window.gvAttribution = function () {
    var rec = read() || {};
    var out = {};
    for (var i = 0; i < PARAMS.length; i++) out[PARAMS[i]] = rec[PARAMS[i]] || '';
    out.landingPage = rec.landingPage || '';
    out.referrer = rec.referrer || '';
    out.submissionPage = window.location.pathname;
    out.submittedAt = new Date().toISOString();
    out.consent = consentState();
    return out;
  };

  capture();
})();
```
Check what value `CookieConsent.astro` writes for `gv-consent` (`grep -n "setCookie('gv-consent'" src/components/marketing/CookieConsent.astro`) — if it stores `accepted`/`rejected` or a JSON, map it to `accept`/`reject` in `consentState()` accordingly and say so in the report.

Add to the top of `src/scripts/site.js`: `import './attribution.js';`.

In `DemoForm.astro` submit handler, after the harvest loop:
```js
      // ---- First-touch attribution (src/scripts/attribution.js) ----
      if (typeof window.gvAttribution === 'function') {
        var attr = window.gvAttribution();
        for (var a in attr) if (Object.prototype.hasOwnProperty.call(attr, a) && attr[a]) data[a] = attr[a];
      }
```

- [ ] **Step 4: Run → pass** (`lead-form.spec.mjs` all, plus `lead-tracking.spec.mjs`, `homepage.spec.mjs`); `npm run check` 0 errors.

- [ ] **Step 5: Commit**
```bash
git add src/scripts/attribution.js src/scripts/site.js src/components/forms/DemoForm.astro tests/e2e/lead-form.spec.mjs
git commit -m "feat(attribution): first-touch gclid/utm in sessionStorage, merged into the lead POST

No cookies: session-scoped sessionStorage, first touch wins, consent state
read from gv-consent. Server re-validates every value (leadPayload.ts).

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Privacy policy — form data + session attribution storage (EN/SL/HR)

**Files:**
- Modify: `src/i18n/en.json`, `src/i18n/_parts/legal.en.json`, `src/i18n/sl.json`, `src/i18n/hr.json` (new key `privacy.inquiry.p3` after `privacy.inquiry.p2`)
- Modify: `src/components/sections/PrivacyBody.astro` (render `p3` after `p2`)
- Test: `tests/e2e/claims.spec.mjs` append (privacy pages contain the new paragraph)

- [ ] **Step 1: Failing test** — append to `tests/e2e/claims.spec.mjs`:
```js
const PRIVACY = [
  { path: '/privacy-policy/', must: 'session storage' },
  { path: '/sl/politika-zasebnosti/', must: 'sejni shrambi' },
  { path: '/hr/pravila-privatnosti/', must: 'pohrani sesije' },
];
for (const { path, must } of PRIVACY) {
  test(`${path} discloses form qualification data and session attribution storage`, async ({ page }) => {
    await gotoClean(page, path);
    expect(await bodyText(page)).toContain(must);
  });
}
```
- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: Strings** (insert after `privacy.inquiry.p2` in all three + `_parts/legal.en.json`):

EN: `"privacy.inquiry.p3": "The demo request form asks for your name, business email, company, country, role and approximate company size, and optionally how you estimate today, how often you bid, whether you could share historical Excel BoQs under NDA, and a phone number. We use these answers only to prepare a relevant demo and to route your request. To understand which campaign brought you to us, the website keeps the campaign parameters of the page you first arrived on (for example gclid or utm_campaign) in your browser's session storage for the duration of the browsing session — no cookie is set — and stores them with your request when you submit the form.",`

SL: `"privacy.inquiry.p3": "V obrazcu za predstavitev vas vprašamo po imenu, poslovnem e-naslovu, podjetju, državi, vlogi in približni velikosti podjetja, neobvezno pa še, kako danes pripravljate kalkulacije, kako pogosto oddajate ponudbe, ali bi lahko pod NDA delili pretekle popise del v Excelu, in po telefonski številki. Odgovore uporabimo izključno za pripravo ustrezne predstavitve in usmeritev vašega povpraševanja. Da bi vedeli, katera kampanja vas je pripeljala k nam, spletno mesto za čas brskalne seje hrani parametre kampanje strani, na katero ste prišli najprej (na primer gclid ali utm_campaign), v sejni shrambi brskalnika — piškotek se ne nastavi — in jih ob oddaji obrazca shrani skupaj z vašim povpraševanjem.",`

HR: `"privacy.inquiry.p3": "U obrascu za demonstraciju tražimo vaše ime, poslovnu e-adresu, tvrtku, državu, ulogu i približnu veličinu tvrtke, a neobvezno i kako danas izrađujete troškovnike, koliko često šaljete ponude, biste li pod NDA-om mogli podijeliti povijesne troškovnike u Excelu te telefonski broj. Te odgovore koristimo isključivo za pripremu relevantne demonstracije i usmjeravanje vašeg upita. Kako bismo znali koja vas je kampanja dovela do nas, web-mjesto tijekom trajanja sesije pregledavanja čuva parametre kampanje stranice na koju ste prvo stigli (npr. gclid ili utm_campaign) u pohrani sesije preglednika — kolačić se ne postavlja — i pohranjuje ih uz vaš upit kada pošaljete obrazac.",`

`PrivacyBody.astro`: after `<p>{t('privacy.inquiry.p2')}</p>` add `<p>{t('privacy.inquiry.p3')}</p>`.

- [ ] **Step 4: Run → pass** (`claims.spec.mjs`, `content-pages.spec.mjs`); parts-sync; `npm run check`.
- [ ] **Step 5: Commit**
```bash
git add src/i18n src/components/sections/PrivacyBody.astro tests/e2e/claims.spec.mjs
git commit -m "feat(privacy): disclose qualification fields + session-storage campaign attribution (EN/SL/HR)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Contract v2 docs, gates, graphify, PR

**Files:**
- Modify: `docs/lead-integration.md` (§1 request body, §2 forwarded lead, responses table, receiver notes), `docs/lead-tracking-ga4.md` (one line: response now carries `qualified`/`score`; events unchanged until WS-D), `tests/e2e/README.md` (rows for `lead-form.spec.mjs`; update `lead-tracking` row), `graphify-out/*`

- [ ] **Step 1: `docs/lead-integration.md` §1** — replace the request JSON example with the v2 body (all §8.1 fields + attribution keys, comments marking required/optional/enum), state the required set, the enum values (copy the Global Constraints list), and that unknown keys are ignored and the honeypot stripped. Responses table: success rows now `{ "ok": true, "forwarded": true|false, "qualified": true|false, "score": n }`.
- [ ] **Step 2: §2 forwarded lead** — show the v2 JSON (top-level v1 fields unchanged + `qualification{}`, `attribution{}`, `score`, `scoreReasons[]`, `qualified`), and notes: `role` stays the English label; `message` synthesized when blank (format + example); v1 receiver ignores the new keys (`extra="ignore"`) — **gtm-toolkit follow-up**: extend `WebsiteLead` + envelope + D365 mapping (score/qualified → Lead fields, attribution → description/notes); until then the synthesized `message` carries qualification into the D365 subject.
- [ ] **Step 3: e2e README rows**: `lead-form.spec.mjs` — qualification fields (required set, enum wire values, optional blanks) + attribution (first touch, navigation, consent) on the intercepted POST; update `lead-tracking` row ("fills the qualification required set").
- [ ] **Step 4: Gates (controller re-runs):** `npm run check` 0 errors; `npm run test:unit` all passed; `npm run test:e2e` all passed; parts-sync; `grep -rn "generate_lead" src` still exactly the one push (unchanged).
- [ ] **Step 5: `/graphify --update`** (new `src/lib/*`, `attribution.js`, tests) — orchestrator; `grep -c users_katarov graphify-out/graph.json` → 0.
- [ ] **Step 6: Commit docs + graph; push; PR** `feat(lead): qualification form, lead scoring, first-touch attribution (workstream B)` — body: summary, test evidence (unit + e2e counts), **SL native check** + **HR native review** lists (every new `demo.form.*` and `privacy.inquiry.p3` string), gtm-toolkit follow-up note, "dataLayer events unchanged (WS-D)". After CI green + user SL check: merge-commit (multi-commit), staging sync.
