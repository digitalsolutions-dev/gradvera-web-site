# Graph Report - gradvera-web-site  (2026-09-01)

## Corpus Check
- 14 files · ~120,187 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 707 nodes · 1153 edges · 87 communities (41 shown, 43 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 91 edges (avg confidence: 0.83)
- Token cost: 69,461 input · 0 output

## Community Hubs (Navigation)
- Lead Capture & Scoring
- Playwright E2E Specs
- E2E Test Harness & Gates
- Core Utils & Page Composition
- SEO & i18n Routing
- Acquisition Model & Launch Phases
- Design Spec & Readiness Docs
- SEO Content Guide Pages
- Hero Animation Script
- OG Images (SL/HR)
- Cluster Pages & Guide Schema
- NPM Dependencies
- Lead Events & GTM Setup
- Project Guidance & Readiness
- Locale Home Pages
- Acquisition Model & Lead Contract
- Claims Policy & Workstream Plans
- Landing Page Workstream & Deploy Policy
- Social Listening & SEO Strategy
- Privacy Policy Pages
- Site Overview & Analytics
- Brand Identity & OG Assets (Locales)
- Claims Policy & Workstream Plans
- Site Overview & Analytics
- TypeScript Config
- CI Workflow Hardening
- Site Overview & Analytics
- Brand & Design System
- Favicon & App Icons
- OG Image Renderer (render-og.mjs)
- Acquisition Model & Lead Contract
- First-Touch Attribution Script
- i18n Parity Spec
- E2E Static Server (serve-dist.mjs)
- Brand Marks & Taglines
- NPM Dependencies
- NPM Dependencies
- Funnel Controls & Conversion Spec
- Product Purpose & Audience
- Monogram Assets
- Product Identity & OG Card
- SEO & Brand Facts Wiring
- Vercel Redirect Patcher
- Header Responsive Spec
- Localized Slugs Spec
- Playwright Config
- Elevation & Glow Rules
- Vitest Harness Setup
- OG Images (SL/HR)
- OG Images (SL/HR)
- Analytics / consent (GTM + Consent Mode)
- Microsoft Bookings calendar reveal (BookingEmbed
- CI workflow (.github/workflows/ci.yml)
- Design context (impeccable: PRODUCT.md/DESIGN.md
- Design source of truth (Claude Design project / 
- _parts/lp.en.json (EN-only landing copy)
- Playwright e2e harness (tests/e2e/)
- Vitest unit test harness (src/lib/)
- Conversion Hierarchy
- Gradvera Confirmed Acquisition Model
- Paid-Acquisition Economic Ceiling (15–20%)
- English-First Sales Language
- Phased Go/No-Go Gates
- gradvera.app Booking Domain Deferred
- Guided Demo on Sample Tenant
- Netherlands as First Market
- No Self-Service Free Trial
- Phase 0 — Foundation and Measurement
- Phase 1 — Search-Quality Smoke Test
- Phase 2 — Conversion Validation
- Phase 3 — Message and Language Optimization
- Phase 4 — Controlled Scale and Second Market
- RefID Booking Attribution
- gradvera.com SURBL Listing Risk
- Value Requiring Pricing Review
- BookingEmbed Component
- Decision B1: Required Form Fields
- Decision B6: Contract v2 Additive Keys
- Decision C1: Bookings RefID Sanitization
- Decision D2': Score -> GTM dataLayer
- parseLeadBody() Function
- scoreLead() Function
- Principle 5: Speed is part of the promise
- Register: brand

## God Nodes (most connected - your core abstractions)
1. `construction-estimating-software (LP route)` - 25 edges
2. `useTranslations()` - 23 edges
3. `Lead integration (website → gtm-toolkit → D365)` - 20 edges
4. `Lead events & conversion tracking (GA4 / Google Ads via GTM)` - 20 edges
5. `Playwright E2E Browser Harness` - 20 edges
6. `localizePath()` - 19 edges
7. `Locale` - 17 edges
8. `Confirmed Acquisition Model (doc, v1.1)` - 17 edges
9. `absoluteUrl()` - 16 edges
10. `Inbound-acquisition website design spec (doc)` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Operational lead score (§8.2)` --semantically_similar_to--> `company_website honeypot`  [INFERRED] [semantically similar]
  docs/confirmed-acquisition-model.md → README.md
- `The Lit Blueprint (Creative North Star)` --semantically_similar_to--> `Brand personality: calm / precise / anti-hype`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md
- `The Sentence-Case Rule` --semantically_similar_to--> `Brand personality: calm / precise / anti-hype`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `stripLocale()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts
- `Task 2: Landing copy, components, route, JSON-LD` --references--> `construction-estimating-software (LP route)`  [EXTRACTED]
  docs/superpowers/plans/2026-08-19-ws-e-landing-page.md → src/pages/construction-estimating-software/index.astro

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Four open tracks (B/C/D/E) forming the Phase-1 launch gate** — docs_next_steps_to_launch_track_b, docs_next_steps_to_launch_track_c, docs_next_steps_to_launch_track_d, docs_next_steps_to_launch_track_e, docs_next_steps_to_launch_launch_gate [EXTRACTED 1.00]
- **Track B flow: GTM setup → consent matrix (row 11) → Ads conversion (row 12)** — docs_next_steps_to_launch_consent_matrix, docs_acquisition_readiness_row_11, docs_acquisition_readiness_row_12 [EXTRACTED 1.00]
- **Track D sales-ops artifacts: demo (13), NDA/preview (14), annual (15), register (16)** — docs_acquisition_readiness_row_13, docs_acquisition_readiness_row_14, docs_acquisition_readiness_row_15, docs_acquisition_readiness_row_16, docs_next_steps_to_launch_track_d [EXTRACTED 1.00]
- **Acquisition model documentation chain** — docs_confirmed_acquisition_model_doc, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_doc, claude_doc [INFERRED 0.85]
- **Landing page verification (implementation task, e2e spec, unit test)** — docs_superpowers_plans_2026_08_19_ws_e_landing_page_task2_landing_copy_components, tests_e2e_readme_landing_spec, tests_unit_readme_i18n_test [INFERRED 0.75]
- **Bookings reveal + dataLayer events mechanism** — claude_lead_capture, docs_lead_tracking_ga4_doc, docs_superpowers_plans_2026_08_19_ws_cd_bookings_events_task_2 [INFERRED 0.85]
- **Lead contract v2 pipeline (validate → forward → D365)** — docs_lead_integration_contract_v2, src_pages_api_lead, src_lib_leadpayload [EXTRACTED 1.00]
- **CI's two jobs (check, e2e) enforce the documented verification gates** — _github_workflows_ci_check_job, _github_workflows_ci_e2e_job [INFERRED 0.85]
- **Workstream B Tasks Implementing Spec** — docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_1, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_2, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_3, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_4 [EXTRACTED 1.00]
- **Claims Policy Enforcement Chain (task → regression spec → README catalog → policy doc)** — docs_superpowers_plans_2026_08_18_ws_a_claims_sweep_task_1_remove_results_section, tests_e2e_claims_spec_mjs, tests_e2e_readme_doc, docs_confirmed_acquisition_model_claims_policy [INFERRED 0.75]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]
- **Lead capture pipeline (form → endpoint → toolkit → D365)** — docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_demoform, docs_lead_integration_api_lead, docs_lead_integration_contract_v2, docs_lead_integration_hmac, docs_lead_integration_d365_lead [EXTRACTED 1.00]
- **Conversion analytics & consent flow** — docs_lead_tracking_ga4_datalayer_events, docs_lead_tracking_ga4_booking_embed, docs_lead_tracking_ga4_gtm_setup, docs_lead_tracking_ga4_ads_conversion, docs_lead_tracking_ga4_consent_matrix [EXTRACTED 1.00]
- **E2E harness infrastructure (config, static server, shared helpers)** — tests_e2e_readme_playwright_config_mjs, tests_e2e_readme_serve_dist_mjs, tests_e2e_readme_helpers_mjs, tests_e2e_readme_webserver_dist_client [EXTRACTED 1.00]
- **Lead-capture flow browser coverage (events, wire payload, layout, landing page)** — tests_e2e_readme_lead_events_spec, tests_e2e_readme_lead_form_spec, tests_e2e_readme_demo_form_layout_spec, tests_e2e_readme_landing_spec, tests_e2e_readme_bookings_embed_refid [EXTRACTED 1.00]
- **Trilingual EN/SL/HR coverage specs** — tests_e2e_readme_i18n_parity_spec, tests_e2e_readme_number_format_spec, tests_e2e_readme_localized_slugs_spec, tests_e2e_readme_lang_picker_spec, tests_e2e_readme_content_pages_spec, tests_e2e_readme_trilingual_parity [INFERRED 0.85]

## Communities (87 total, 43 thin omitted)

### Community 0 - "Lead Capture & Scoring"
Cohesion: 0.06
Nodes (53): RFC-3986, Lead payload validation (parseLeadBody), Wire Enum Values (country/role/companySize/...), Global Constraints (i18n parity, enums, scoring, response shape), Scoring Table (+2/-2 signals, threshold 7), Task 1: leadScore.ts - Enums + scoreLead(), Task 2: leadPayload.ts + lead.ts Refactor, Task 3: DemoForm Qualification Fields (+45 more)

### Community 1 - "Playwright E2E Specs"
Cohesion: 0.08
Nodes (36): LEGACY_SLUG_PATHS, redirects, serialize(), EN_ONLY_ROUTES (src/i18n/slugs.ts), 308 redirects for legacy canonical-slug SL/HR URLs, localizePath/stripLocale slug-aware rework (src/i18n/utils.ts), scripts/patch-vercel-redirects.mjs (planned), PR2: feat/localized-slugs (+28 more)

### Community 2 - "E2E Test Harness & Gates"
Cohesion: 0.08
Nodes (42): Task 6 — Full Gates, Docs, PR, Adding a check (spec authoring convention), armLeadCapture, astro check type-safety gate, BOOKING_URL, Bookings embed + RefID contract, boxOf, checkChip (+34 more)

### Community 3 - "Core Utils & Page Composition"
Cohesion: 0.10
Nodes (23): DEMO_PAGES, GUARANTEE_PHRASES, GUIDE_PAGES, HOME, PRIVACY, PRODUCT_LINE, PAGES, DISCLOSURE_PAGES (+15 more)

### Community 4 - "SEO & i18n Routing"
Cohesion: 0.06
Nodes (34): astro, @astrojs/check, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, dependencies, astro, @astrojs/sitemap (+26 more)

### Community 5 - "Acquisition Model & Launch Phases"
Cohesion: 0.09
Nodes (34): Twenty-file customer-specific preview (§10.2), Confirmed acquisition journey (§5), Google Search Ads launch model (§12), Positioning & prohibited-claims policy (§6.2), Confirmed Acquisition Model (doc, v1.1), Microsoft Bookings booking spec (§9), Phase-0 foundation & gate (§13), Illustrative product-UI reproductions approach (v1.2) (+26 more)

### Community 6 - "Design Spec & Readiness Docs"
Cohesion: 0.13
Nodes (25): §19 Readiness Checklist (17 rows), gtm-toolkit v2 receiver (image v9), Row 10 — Test booking matched to originating lead, Row 11 — Consent + analytics verified (accept & reject), Row 12 — Google Ads records one valid conversion exactly once, Row 13 — Sample-tenant demo stable and rehearsed, Row 14 — NDA handling + 20-file preview process ready, Row 15 — Annual-agreement requirement in sales materials (+17 more)

### Community 7 - "SEO Content Guide Pages"
Cohesion: 0.12
Nodes (24): Qualification form & required fields (§8.1), POST /api/lead endpoint, Forwarded lead contract v2, D365 Account + Lead (idempotent write), Lead integration (website → gtm-toolkit → D365), English role label mapping (role → jobtitle), GTM_LEAD_ENDPOINT / GTM_LEAD_SECRET env vars, Forwarded lead payload (website → gtm-toolkit, contract v2) (+16 more)

### Community 8 - "Hero Animation Script"
Cohesion: 0.10
Nodes (23): Principle 4: Trilingual parity (EN/SL/HR), Analytics.astro component, Astro 5 framework, Claude Design project (design origin), Google Consent Mode v2, CookieConsent banner, Design-asset provenance, Design fidelity rules (+15 more)

### Community 9 - "OG Images (SL/HR)"
Cohesion: 0.13
Nodes (9): t, DEFAULT_LOCALE, DICTS, getLocaleFromPath(), isLocale(), LOCALES, stripLocale(), jsonLd (+1 more)

### Community 10 - "Cluster Pages & Guide Schema"
Cohesion: 0.19
Nodes (19): applyScroll(), buildHero(), cross(), delayFor(), drawCap2(), drawConnectors(), init(), line() (+11 more)

### Community 11 - "NPM Dependencies"
Cohesion: 0.15
Nodes (14): absoluteUrl(), guideArticleLd(), breadcrumbLd, faqLd, t, breadcrumbLd, faqLd, t (+6 more)

### Community 12 - "Lead Events & GTM Setup"
Cohesion: 0.12
Nodes (8): ../components/marketing/Analytics.astro, ../components/marketing/CookieConsent.astro, t, ../styles/cap1-screens.css, ../styles/cap-screens.css, ../styles/gradvera-tokens.css, ../styles/site.css, ../styles/site-polish.css

### Community 13 - "Project Guidance & Readiness"
Cohesion: 0.16
Nodes (16): Acquisition model section (source-of-truth rule), CLAUDE.md (project guidance doc), EN-only acquisition landing route (/construction-estimating-software/), Acquisition Readiness — Evidence Log (§19), Lead attribution capture (§8.3), EU hosting confirmed (§7.2.8), Netherlands landing-page structure (§7.2), Next Steps to Phase-1 Launch (runbook) (+8 more)

### Community 14 - "Locale Home Pages"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 15 - "Acquisition Model & Lead Contract"
Cohesion: 0.13
Nodes (8): t, t, construction-estimating-software (LP route), breadcrumbLd, faqLd, softwareLd, t, url

### Community 16 - "Claims Policy & Workstream Plans"
Cohesion: 0.29
Nodes (14): Consent & verification requirement (§11.3), Google Ads primary conversion rule (qualification_form_submit only), booking_widget_open event, Bookings embed measurement limit (§9.4, manual reconciliation), Microsoft Bookings page configuration checklist (§9.2), Consent & verification matrix (Consent Mode v2), Consent & verification matrix (§11.3), Lead events & conversion tracking (GA4 / Google Ads via GTM) (+6 more)

### Community 17 - "Landing Page Workstream & Deploy Policy"
Cohesion: 0.21
Nodes (11): Branch flow & deploy model (main/staging, Vercel), Knowledge graph / graphify update policy, landing/ components (LpHero…LpBook, ProductEvidence), Claims policy constraints (§6.2), Workstream E — Acquisition Landing Page Implementation Plan, Internal links (footer, guides, homepage HelpsIntro), SoftwareApplication + FAQPage + BreadcrumbList JSON-LD, ProductEvidence empty-shots gating (no placeholder art) (+3 more)

### Community 18 - "Social Listening & SEO Strategy"
Cohesion: 0.22
Nodes (13): Lead capture (/api/lead), src/lib/ pure unit-tested helpers (leadScore.ts, leadPayload.ts), Required analytics events & conversion hierarchy (§11.1/§11.2), Attribution fields captured with every lead (§8.3), Operational lead score (§8.2), v1.1 changelog (as-built amendments), Google Ads conversion = qualification_form_submit, Client dataLayer conversion events (+5 more)

### Community 19 - "Privacy Policy Pages"
Cohesion: 0.35
Nodes (12): ICP hypothesis (§4), Negative-keyword themes (§12.3), Marked-for-Brainstorm Session (superpowers:brainstorming), Buying Triggers & Audience (Small Subs vs ENR Heavy-Civil), Competitor Mentions, Social Listening — SEO & Sales-Strategy Brainstorm Input, ENR Top-50 Heavy-Civil Contractors Software Usage, Exact Phrases → Keyword Candidates (+4 more)

### Community 20 - "Site Overview & Analytics"
Cohesion: 0.18
Nodes (9): isEmpty(), useTranslations(), l10n, strings(), t, jsonLd, t, jsonLd (+1 more)

### Community 21 - "Brand Identity & OG Assets (Locales)"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 22 - "Claims Policy & Workstream Plans"
Cohesion: 0.22
Nodes (10): Microsoft Bookings embed spec (§9), BookingEmbed.astro component (plan spec), Workstreams C+D plan — Bookings Embed & dataLayer Events, RefID sanitizer spec (lowercase, [a-z0-9_-], ≤40), DemoForm reveal logic (iframe src once, scrollIntoView), Task 0: Worktree, baseline, Task 1: Booking URL const, i18n, BookingEmbed markup, Task 2: Reveal + dataLayer events script (+2 more)

### Community 23 - "Site Overview & Analytics"
Cohesion: 0.20
Nodes (6): breadcrumbLd, t, breadcrumbLd, t, breadcrumbLd, t

### Community 24 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 25 - "CI Workflow Hardening"
Cohesion: 0.28
Nodes (9): System deps install is best-effort (continue-on-error), bounded to 3 minutes, check job: astro check + npm run test:unit on ubuntu-latest, Chromium install bounded/retried, not via apt --with-deps, concurrency group ci-${{ github.ref }} cancels superseded runs, .github/workflows/ci.yml — CI workflow, e2e job: Playwright browser checks, 20-minute timeout, e2e job capped at timeout-minutes: 20, astro check verification gate (+1 more)

### Community 26 - "Site Overview & Analytics"
Cohesion: 0.28
Nodes (5): Task 5: Privacy Policy - Form Data + Attribution Disclosure, Locale, t, t, t

### Community 27 - "Brand & Design System"
Cohesion: 0.29
Nodes (6): COMPANY, GA4_ID, GTM_ID, GUIDE_DATES, NAV_ITEMS, SITE

### Community 28 - "Favicon & App Icons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 29 - "OG Image Renderer (render-og.mjs)"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 31 - "First-Touch Attribution Script"
Cohesion: 0.53
Nodes (4): capture(), hasClickId(), read(), write()

### Community 32 - "i18n Parity Spec"
Cohesion: 0.33
Nodes (4): LOCAL_PROOF, LOCALIZED_COMPONENTS, ROOT, SENTINELS

### Community 33 - "E2E Static Server (serve-dist.mjs)"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 34 - "Brand Marks & Taglines"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 35 - "NPM Dependencies"
Cohesion: 0.50
Nodes (3): breadcrumbLd, faqLd, t

### Community 36 - "NPM Dependencies"
Cohesion: 0.50
Nodes (3): breadcrumbLd, faqLd, t

### Community 37 - "Funnel Controls & Conversion Spec"
Cohesion: 0.67
Nodes (3): 20-file NDA customer-specific preview cap (§10.2), Provisional funnel controls (§14), Qualified demo → booking as primary conversion (§2.5, §11.2)

### Community 38 - "Product Purpose & Audience"
Cohesion: 0.67
Nodes (3): Principle 3: Credibility is the conversion, Product purpose: convert qualified interest into a booked demo (to D365), Users: construction estimators / quantity surveyors / bid teams

### Community 39 - "Monogram Assets"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 40 - "Product Identity & OG Card"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

### Community 41 - "SEO & Brand Facts Wiring"
Cohesion: 0.67
Nodes (3): consts.ts (brand facts, integration ids), Open Graph images / render-og.mjs, SEO.astro component

## Knowledge Gaps
- **218 isolated node(s):** `t`, `t`, `t`, `jsonLd`, `t` (+213 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 277 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Lead integration (website → gtm-toolkit → D365)` connect `SEO Content Guide Pages` to `Lead Capture & Scoring`, `Project Guidance & Readiness`, `Claims Policy & Workstream Plans`, `Social Listening & SEO Strategy`, `Claims Policy & Workstream Plans`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `Lead events & conversion tracking (GA4 / Google Ads via GTM)` connect `Claims Policy & Workstream Plans` to `E2E Test Harness & Gates`, `Acquisition Model & Launch Phases`, `SEO Content Guide Pages`, `Project Guidance & Readiness`, `Social Listening & SEO Strategy`, `Claims Policy & Workstream Plans`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `/api/lead lead-capture endpoint` connect `SEO Content Guide Pages` to `Hero Animation Script`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Lead events & conversion tracking (GA4 / Google Ads via GTM)` (e.g. with `landing.spec.mjs` and `lead-events.spec.mjs`) actually correct?**
  _`Lead events & conversion tracking (GA4 / Google Ads via GTM)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Lead Capture & Scoring` be split into smaller, more focused modules?**
  _Cohesion score 0.06120218579234973 - nodes in this community are weakly interconnected._
- **Should `Playwright E2E Specs` be split into smaller, more focused modules?**
  _Cohesion score 0.07505285412262157 - nodes in this community are weakly interconnected._