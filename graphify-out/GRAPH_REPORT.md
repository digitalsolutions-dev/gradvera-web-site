# Graph Report - gradvera-web-site  (2026-09-28)

## Corpus Check
- 26 files · ~124,194 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 773 nodes · 1411 edges · 59 communities (37 shown, 22 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.86)
- Token cost: 159,769 input · 0 output

## Community Hubs (Navigation)
- Lead Capture & Receiver Pipeline
- Routing, Slugs & Astro Config
- Qualification Form Plan & Scoring
- Design System & Brand Tokens
- Landing Page & Claims Policy
- NPM Dependencies
- CI Workflow
- Guide Articles & Structured Data
- i18n Helpers & Page Bodies
- Landing Page Sections
- Homepage Sections
- Google Ads Launch Model
- Site Interactions Script
- Acquisition Model Core
- E2E Harness Docs
- Readiness Checklist Rows
- Content & Landing E2E Specs
- Font Assets
- Header & CTA E2E Specs
- Demo Form E2E Specs
- Bookings Calendar Flow
- Qualification Form & Attribution
- Lead Response & Conversion Events
- SEO Component
- Ads Conversion & GTM Setup
- OG Images (HR/SL)
- Bookings Embed Plan
- TypeScript Config
- Launch Runbook & Evidence Log
- E2E Contract Checks
- Brand Mark Icons
- i18n Parity Spec
- Static Test Server
- OG Image (EN)
- Funnel Controls
- Monogram Assets
- Brand Identity
- robots.txt Route
- SL Home Page
- Localized Slugs Spec
- Playwright Config
- Elevation & Glow Rules
- Vitest Harness
- Acquisition Model Doc
- English-First Sales
- Go/No-Go Gates
- Netherlands First Market
- Phase 0 Foundation
- Phase 2 Conversion Validation
- Phase 3 Message Optimization
- Phase 4 Scale
- Pricing Review Value
- BookingEmbed Component
- Decision B1 Required Fields
- Decision B6 Contract v2
- Decision C1 RefID Sanitization
- Decision D2 Score to dataLayer
- parseLeadBody Function
- scoreLead Function

## God Nodes (most connected - your core abstractions)
1. `construction-estimating-software (LP route)` - 30 edges
2. `Playwright E2E Browser Harness` - 25 edges
3. `useTranslations()` - 24 edges
4. `Section 19 Readiness Checklist (17 rows)` - 21 edges
5. `End-to-end / browser checks (Playwright) README` - 21 edges
6. `localizePath()` - 20 edges
7. `CLAUDE.md (project guidance doc)` - 18 edges
8. `Locale` - 17 edges
9. `absoluteUrl()` - 16 edges
10. `Confirmed Acquisition Model (doc, v1.1)` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Account matching by company name only (no domain fallback)` --semantically_similar_to--> `isFreemail()`  [INFERRED] [semantically similar]
  docs/lead-integration.md → src/lib/leadScore.ts
- `landing_page_view (GTM page-view trigger, no site code)` --conceptually_related_to--> `construction-estimating-software (LP route)`  [INFERRED]
  docs/lead-tracking-ga4.md → src/pages/construction-estimating-software/index.astro
- `Campaign settings (section 12.1: Search only, NL present-in, exact+phrase)` --references--> `construction-estimating-software (LP route)`  [EXTRACTED]
  docs/next-steps-to-launch.md → src/pages/construction-estimating-software/index.astro
- `Ad copy rules (section 12.4)` --semantically_similar_to--> `Claims policy (acquisition model §6.2/§7.1)`  [INFERRED] [semantically similar]
  docs/next-steps-to-launch.md → tests/e2e/README.md
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `localizePath()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Workstream B Tasks Implementing Spec** — docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_1, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_2, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_3, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_4 [EXTRACTED 1.00]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]
- **Claims Policy Enforcement Chain (task → regression spec → README catalog → policy doc)** — docs_superpowers_plans_2026_08_18_ws_a_claims_sweep_task_1_remove_results_section, tests_e2e_claims_spec_mjs, tests_e2e_readme_doc, docs_confirmed_acquisition_model_claims_policy [INFERRED 0.75]
- **Landing page verification (implementation task, e2e spec, unit test)** — docs_superpowers_plans_2026_08_19_ws_e_landing_page_task2_landing_copy_components, tests_e2e_readme_landing_spec, tests_unit_readme_i18n_test [INFERRED 0.75]
- **Bookings reveal + dataLayer events mechanism** — claude_lead_capture, docs_lead_tracking_ga4_doc, docs_superpowers_plans_2026_08_19_ws_cd_bookings_events_task_2 [INFERRED 0.85]
- **CI's two jobs (check, e2e) enforce the documented verification gates** — _github_workflows_ci_check_job, _github_workflows_ci_e2e_job [INFERRED 0.85]
- **Website lead pipeline (/api/lead -> gtm-toolkit Lambda -> D365)** — docs_lead_integration_api_lead, docs_lead_integration_forwarded_lead, docs_lead_integration_api_gateway, docs_lead_integration_receiver_lambda, docs_lead_integration_sqs_fifo, docs_lead_integration_consumer_lambda, docs_lead_integration_d365_lead [EXTRACTED 1.00]
- **hp_field honeypot defense across docs, code and tests** — docs_lead_integration_honeypot, src_lib_leadpayload_trippedhoneypot, src_lib_leadpayload_honeypotdroplog, docs_lead_tracking_ga4_honeypot_reply_handling, tests_e2e_readme_honeypot_checks, tests_unit_readme_lead_test, docs_acquisition_readiness_row_7 [INFERRED 0.95]
- **Phase-1 launch tracks gating the first campaign** — docs_next_steps_to_launch_track_a, docs_next_steps_to_launch_track_b, docs_next_steps_to_launch_track_c, docs_next_steps_to_launch_track_d, docs_next_steps_to_launch_track_e, docs_next_steps_to_launch_launch_gate, docs_acquisition_readiness_19_checklist [EXTRACTED 1.00]

## Communities (59 total, 22 thin omitted)

### Community 0 - "Lead Capture & Receiver Pipeline"
Cohesion: 0.05
Nodes (59): hp_field honeypot (server-side drop, PII-free log), Lead capture (/api/lead), gtm-toolkit v2 receiver (PR #145; v9 Fargate, Lambda since 2026-09-27), Row 8 - Test lead stored with UTM + click identifiers, API Gateway HTTP API (10 s timeout, 5 req/s throttle), POST /api/lead endpoint, Consumer Lambda (_ingest_lead), D365 Account + Lead write path and field mapping (+51 more)

### Community 1 - "Routing, Slugs & Astro Config"
Cohesion: 0.06
Nodes (41): LEGACY_SLUG_PATHS, redirects, EN-only acquisition landing route (/construction-estimating-software/), EN_ONLY_ROUTES (src/i18n/slugs.ts), _parts/lp.en.json (EN-only landing copy), Build-script redirect patch (patch-vercel-redirects.mjs), SEO Growth Implementation Plan (doc), Footer guide links (footer.explore.estGuide/bidGuide) (+33 more)

### Community 2 - "Qualification Form Plan & Scoring"
Cohesion: 0.07
Nodes (45): RFC-3986, Account matching by company name only (no domain fallback), Wire Enum Values (country/role/companySize/...), Global Constraints (i18n parity, enums, scoring, response shape), Scoring Table (+2/-2 signals, threshold 7), Task 1: leadScore.ts - Enums + scoreLead(), Task 3: DemoForm Qualification Fields, attr() (+37 more)

### Community 3 - "Design System & Brand Tokens"
Cohesion: 0.05
Nodes (43): Design context (impeccable: PRODUCT.md/DESIGN.md), Five UI design principles (restraint, show the work, credibility, trilingual parity, speed), The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star) (+35 more)

### Community 4 - "Landing Page & Claims Policy"
Cohesion: 0.07
Nodes (37): landing/ components (LpHero...LpBook, ProductEvidence), Row 1 - Unsupported proof claims removed or reframed, Row 3 - Netherlands landing page live and quality-checked, Row 5 - Illustrative product-UI reproductions on the LP, Positioning & prohibited-claims policy (§6.2), EU hosting confirmed (§7.2.8), Netherlands landing-page structure (§7.2), Illustrative product-UI reproductions approach (v1.2) (+29 more)

### Community 5 - "NPM Dependencies"
Cohesion: 0.06
Nodes (34): astro, @astrojs/check, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, dependencies, astro, @astrojs/sitemap (+26 more)

### Community 6 - "CI Workflow"
Cohesion: 0.08
Nodes (33): System deps install is best-effort (continue-on-error), bounded to 3 minutes, check job: astro check + npm run test:unit on ubuntu-latest, Chromium install bounded/retried, not via apt --with-deps, concurrency group ci-${{ github.ref }} cancels superseded runs, .github/workflows/ci.yml — CI workflow, e2e job: Playwright browser checks, 20-minute timeout, e2e job capped at timeout-minutes: 20, Analytics / consent (GTM + Consent Mode) (+25 more)

### Community 7 - "Guide Articles & Structured Data"
Cohesion: 0.10
Nodes (23): absoluteUrl(), guideArticleLd(), localizePath(), breadcrumbLd, faqLd, t, breadcrumbLd, faqLd (+15 more)

### Community 8 - "i18n Helpers & Page Bodies"
Cohesion: 0.11
Nodes (18): i18n helpers (src/i18n/utils.ts), localizePath(path, lang) helper, useTranslations(lang) helper, isEmpty(), Locale, useTranslations(), l10n, strings() (+10 more)

### Community 9 - "Landing Page Sections"
Cohesion: 0.08
Nodes (15): consts.ts (brand facts, integration ids), t, t, t, COMPANY, GA4_ID, GTM_ID, GUIDE_DATES (+7 more)

### Community 10 - "Homepage Sections"
Cohesion: 0.12
Nodes (9): t, t, t, DEFAULT_LOCALE, DICTS, getLocaleFromPath(), isLocale(), LOCALES (+1 more)

### Community 11 - "Google Ads Launch Model"
Cohesion: 0.14
Nodes (23): Row 17 - Keywords, negatives, ads, budget cap, stop conditions approved, Google Search Ads launch model (§12), Paid-Acquisition Economic Ceiling (15–20%), ICP hypothesis (§4), Negative-keyword themes (§12.3), Phase 1 — Search-Quality Smoke Test, Ad copy rules (section 12.4), Campaign settings (section 12.1: Search only, NL present-in, exact+phrase) (+15 more)

### Community 12 - "Site Interactions Script"
Cohesion: 0.19
Nodes (19): applyScroll(), buildHero(), cross(), delayFor(), drawCap2(), drawConnectors(), init(), line() (+11 more)

### Community 13 - "Acquisition Model Core"
Cohesion: 0.14
Nodes (21): Acquisition model section (source-of-truth rule), Confirmed acquisition journey (§5), Required analytics events & conversion hierarchy (§11.1/§11.2), Lead attribution capture (§8.3), Attribution fields captured with every lead (§8.3), Consent & verification requirement (§11.3), Confirmed Acquisition Model (doc, v1.1), Operational lead score (§8.2) (+13 more)

### Community 14 - "E2E Harness Docs"
Cohesion: 0.23
Nodes (19): Playwright e2e harness (tests/e2e/), astro check type-safety gate, CI `e2e` job (.github/workflows/ci.yml), claims.spec.mjs, content-pages.spec.mjs, End-to-end / browser checks (Playwright) README, homepage.spec.mjs, i18n-parity.spec.mjs (+11 more)

### Community 15 - "Readiness Checklist Rows"
Cohesion: 0.14
Nodes (20): Section 19 Readiness Checklist (17 rows), Row 13 - Sample-tenant demo stable and rehearsed, Row 14 - NDA handling + 20-file preview process ready, Row 15 - Annual-agreement requirement in sales materials, Row 16 - Lead stages, owner, response standard, weekly review, Row 2 - Free-trial messaging removed, Row 4 - Excel support + guided evaluation route explained, Row 6 - Gradvera / DIGITAL SOLUTIONS relationship clear (+12 more)

### Community 16 - "Content & Landing E2E Specs"
Cohesion: 0.20
Nodes (8): PAGES, BOOKING_URL, gotoClean(), VIEWPORTS, ENDONYMS, PAGES, bundledCss(), expectPreloadsResolveAndMatchCss()

### Community 17 - "Font Assets"
Cohesion: 0.12
Nodes (7): t, jsonLd, t, ../styles/cap1-screens.css, ../styles/cap-screens.css, ../styles/gradvera-tokens.css, ../styles/site.css

### Community 18 - "Header & CTA E2E Specs"
Cohesion: 0.15
Nodes (14): DEMO_PAGES, LOCALES, armLeadCapture(), boxOf(), rectsOverlap(), stubBookings(), Adding a check (spec authoring convention), armLeadCapture (+6 more)

### Community 19 - "Demo Form E2E Specs"
Cohesion: 0.17
Nodes (13): DISCLOSURE_PAGES, FORM_PAGES, checkChip(), fillRequired(), openOptional(), DEMO, TRAP_BANNED, checkChip (+5 more)

### Community 20 - "Bookings Calendar Flow"
Cohesion: 0.24
Nodes (12): Microsoft Bookings calendar reveal (BookingEmbed), Row 10 - Test booking matched to originating lead, Row 9 - Microsoft Bookings configured (branded, embedded, fallback), Website deliverables shipped (Phase 0, WS A-F), RefID Booking Attribution, BookingEmbed (lazy iframe + RefID), Microsoft Bookings page configuration checklist (section 9.2), Lead events & conversion tracking (GA4 / Google Ads via GTM) (+4 more)

### Community 21 - "Qualification Form & Attribution"
Cohesion: 0.21
Nodes (10): Row 7 - Qualification form collects fit + attribution data (incl. 2026-09-28 honeypot fix), Qualification form & required fields (§8.1), Browser request body, contract v2 (section 8.1/8.3), First-touch attribution (sessionStorage gv_attr), DemoForm component (qualification form), gv-consent cookie, capture(), hasClickId() (+2 more)

### Community 22 - "Lead Response & Conversion Events"
Cohesion: 0.27
Nodes (12): Client handling of drop reply (ok:true without boolean qualified), POST /api/lead response matrix (qualified + score), booking_widget_open event, Bookings embed measurement limit (section 9.4, manual reconciliation), Client dataLayer conversion events (section 11.1), Honeypot reply: success + calendar, no conversion push, landing_page_view (GTM page-view trigger, no site code), qualification_form_start event (+4 more)

### Community 23 - "SEO Component"
Cohesion: 0.17
Nodes (11): altLocales, alts, canonical, ogAltLocales, ogImage, organizationLd, string, structuredData (+3 more)

### Community 24 - "Ads Conversion & GTM Setup"
Cohesion: 0.33
Nodes (11): Row 11 - Consent + analytics verified (accept & reject), Row 12 - Google Ads records one valid conversion exactly once, Conversion Hierarchy, Google Ads primary conversion rule (qualification_form_submit only), generate_lead (2026-08-05 event, retired 2026-08-19), GTM container setup steps (1-7), Interim measurement gap, Consent & verification matrix (section 11.3, 7 rows) (+3 more)

### Community 25 - "OG Images (HR/SL)"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 26 - "Bookings Embed Plan"
Cohesion: 0.22
Nodes (10): Microsoft Bookings embed spec (§9), BookingEmbed.astro component (plan spec), Workstreams C+D plan — Bookings Embed & dataLayer Events, RefID sanitizer spec (lowercase, [a-z0-9_-], ≤40), DemoForm reveal logic (iframe src once, scrollIntoView), Task 0: Worktree, baseline, Task 1: Booking URL const, i18n, BookingEmbed markup, Task 2: Reveal + dataLayer events script (+2 more)

### Community 27 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 28 - "Launch Runbook & Evidence Log"
Cohesion: 0.28
Nodes (9): Acquisition Readiness - Evidence Log (section 19), Open decisions carried from the model (section 18), gradvera.app Booking Domain Deferred, gradvera.com SURBL Listing Risk, Next Steps to Phase-1 Launch (runbook), After launch (GSC indexing, cannibalization check, open decisions), Canonical doc wins (runbook is how-to, not source of truth), Critical path (B/C/D parallel -> E -> campaign) (+1 more)

### Community 29 - "E2E Contract Checks"
Cohesion: 0.28
Nodes (9): BOOKING_URL, Bookings embed + RefID contract, Claims policy (acquisition model §6.2/§7.1), §11.1 dataLayer qualification events, First-touch attribution (gclid/utm), Spam-trap checks (hp_field unrendered, no autofill bait, filled trap never kills submit), landing.spec.mjs, lead-events.spec.mjs (+1 more)

### Community 30 - "Brand Mark Icons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 31 - "i18n Parity Spec"
Cohesion: 0.33
Nodes (4): LOCAL_PROOF, LOCALIZED_COMPONENTS, ROOT, SENTINELS

### Community 32 - "Static Test Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 33 - "OG Image (EN)"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 34 - "Funnel Controls"
Cohesion: 0.67
Nodes (3): 20-file NDA customer-specific preview cap (§10.2), Provisional funnel controls (§14), Qualified demo → booking as primary conversion (§2.5, §11.2)

### Community 35 - "Monogram Assets"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 36 - "Brand Identity"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

## Knowledge Gaps
- **199 isolated node(s):** `CompanySize`, `Country`, `NdaWilling`, `ScoreResult`, `base` (+194 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 253 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `construction-estimating-software (LP route)` connect `Landing Page Sections` to `Routing, Slugs & Astro Config`, `Landing Page & Claims Policy`, `Guide Articles & Structured Data`, `i18n Helpers & Page Bodies`, `Homepage Sections`, `Google Ads Launch Model`, `Font Assets`, `Lead Response & Conversion Events`, `E2E Contract Checks`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `CLAUDE.md (project guidance doc)` connect `CI Workflow` to `Lead Capture & Receiver Pipeline`, `Routing, Slugs & Astro Config`, `Design System & Brand Tokens`, `Landing Page & Claims Policy`, `Acquisition Model Core`, `E2E Harness Docs`, `Bookings Embed Plan`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `Playwright E2E Browser Harness` connect `E2E Harness Docs` to `Header & CTA E2E Specs`, `Demo Form E2E Specs`, `E2E Contract Checks`, `CI Workflow`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `CompanySize`, `Country`, `NdaWilling` to the rest of the system?**
  _199 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Lead Capture & Receiver Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.053410893707033315 - nodes in this community are weakly interconnected._
- **Should `Routing, Slugs & Astro Config` be split into smaller, more focused modules?**
  _Cohesion score 0.05957767722473605 - nodes in this community are weakly interconnected._
- **Should `Qualification Form Plan & Scoring` be split into smaller, more focused modules?**
  _Cohesion score 0.06509803921568627 - nodes in this community are weakly interconnected._