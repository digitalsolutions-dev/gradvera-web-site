# Graph Report - .  (2026-08-20)

## Corpus Check
- 12 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 623 nodes · 986 edges · 77 communities (33 shown, 44 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.83)
- Token cost: 103,478 input · 18,261 output

## Community Hubs (Navigation)
- Landing Page & Lead Forms
- Demo Form & Book-a-Demo Pages
- Privacy Policy Pages
- Claims Policy E2E Spec
- Playwright Config
- TypeScript Config
- Monograms & Favicon
- Favicons & App Icons
- Product Identity & Tagline
- Design System Rules
- Elevation & Glow Rules
- Register: brand
- Product Purpose & Users
- Project Docs & Principles
- Principle 5: Speed is part of the promise
- OG Image Renderer
- Base Layout & Fonts
- E2E Static Server
- Brand Marks & Tagline
- Brand & OG Assets
- i18n Parity E2E Spec
- Brand Facts & OG Pipeline
- Header Responsive E2E
- Astro Config & Redirects
- Vercel Redirect Patch
- Localized Slugs E2E
- Guide Pages & i18n Helpers
- Guide Pages & i18n Helpers
- Guide Pages & i18n Helpers
- Locale Home Pages & URL Helpers
- Locale Home Pages & URL Helpers
- Social Listening Research
- Project Guidance & Acquisition Plans
- Package Dependencies
- Lead Scoring, Payload & Demo Form
- Site Interactions (site.js)
- Project Guidance, CI & Plans
- Vitest Harness Task
- Lead Capture, Contract v2 & Event Tracking
- Astro Config & Redirects
- Gradvera Confirmed Acquisition Model
- Phase 0 — Foundation and Measurement
- Phase 1 — Search-Quality Smoke Test
- Phase 2 — Conversion Validation
- Phase 3 — Message and Language Optimization
- Phase 4 — Controlled Scale and Second Market
- Phased Go/No-Go Gates
- Netherlands as First Market
- English-First Sales Language
- No Self-Service Free Trial
- Guided Demo on Sample Tenant
- RefID Booking Attribution
- Value Requiring Pricing Review
- Conversion Hierarchy
- Paid-Acquisition Economic Ceiling (15–20%)
- gradvera.com SURBL Listing Risk
- gradvera.app Booking Domain Deferred
- scoreLead() Function
- parseLeadBody() Function
- BookingEmbed Component
- ProductEvidence Component
- Attribution Capture Script (attribution.js)
- Decision B1: Required Form Fields
- Decision B6: Contract v2 Additive Keys
- Decision C1: Bookings RefID Sanitization
- Decision D2': Score -> GTM dataLayer
- _parts/lp.en.json (EN-only landing copy)
- Microsoft Bookings calendar reveal (BookingEmbed
- Analytics / consent (GTM + Consent Mode)
- Vitest unit test harness (src/lib/)
- Playwright e2e harness (tests/e2e/)
- CI workflow (.github/workflows/ci.yml)
- Design context (impeccable: PRODUCT.md/DESIGN.md
- Design source of truth (Claude Design project / 

## God Nodes (most connected - your core abstractions)
1. `useTranslations()` - 23 edges
2. `localizePath()` - 19 edges
3. `Locale` - 17 edges
4. `absoluteUrl()` - 16 edges
5. `Lead events & conversion tracking (GA4 / Google Ads via GTM)` - 14 edges
6. `Lead integration (website → gtm-toolkit → D365)` - 12 edges
7. `Workstream E — Acquisition Landing Page Implementation Plan` - 11 edges
8. `Workstream A Claims Sweep Implementation Plan` - 10 edges
9. `scripts` - 10 edges
10. `scoreLead()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Sentence-Case Rule`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `localizePath()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `stripLocale()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts
- `Principle 2: Show the work, don't claim it` --conceptually_related_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED]
  PRODUCT.md → DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase-0 acquisition readiness gate** — docs_confirmed_acquisition_model_acquisition_readiness, docs_acquisition_readiness_doc, docs_acquisition_readiness_19_checklist, docs_confirmed_acquisition_model_staged_investment_phases [INFERRED 0.85]
- **Acquisition model documentation chain** — docs_confirmed_acquisition_model_doc, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_doc, docs_acquisition_readiness_doc, claude_doc [INFERRED 0.85]
- **Landing page verification (implementation task, e2e spec, unit test)** — docs_superpowers_plans_2026_08_19_ws_e_landing_page_task2_landing_copy_components, tests_e2e_readme_landing_spec, tests_unit_readme_i18n_test [INFERRED 0.75]
- **Bookings reveal + dataLayer events mechanism** — claude_lead_capture, docs_lead_tracking_ga4_doc, docs_superpowers_plans_2026_08_19_ws_cd_bookings_events_task_2 [INFERRED 0.85]
- **Lead contract v2 pipeline (validate → forward → D365)** — docs_lead_integration_contract_v2, src_pages_api_lead, src_lib_leadpayload [EXTRACTED 1.00]
- **CI's two jobs (check, e2e) enforce the documented verification gates** — _github_workflows_ci_check_job, _github_workflows_ci_e2e_job [INFERRED 0.85]
- **Workstream B Tasks Implementing Spec** — docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_1, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_2, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_3, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_4 [EXTRACTED 1.00]
- **Claims Policy Enforcement Chain (task → regression spec → README catalog → policy doc)** — docs_superpowers_plans_2026_08_18_ws_a_claims_sweep_task_1_remove_results_section, tests_e2e_claims_spec_mjs, tests_e2e_readme_doc, docs_confirmed_acquisition_model_claims_policy [INFERRED 0.75]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]

## Communities (77 total, 44 thin omitted)

### Community 1 - "Landing Page & Lead Forms"
Cohesion: 0.06
Nodes (26): t, t, t, COMPANY, SITE, GUIDE_DATES, GTM_ID, GA4_ID (+18 more)

### Community 14 - "Demo Form & Book-a-Demo Pages"
Cohesion: 0.16
Nodes (9): t, breadcrumbLd, t, jsonLd, t, breadcrumbLd, t, breadcrumbLd (+1 more)

### Community 13 - "Privacy Policy Pages"
Cohesion: 0.19
Nodes (10): t, t, strings(), l10n, t, t, Task 5: Privacy Policy - Form Data + Attribution Disclosure, Locale (+2 more)

### Community 6 - "Claims Policy E2E Spec"
Cohesion: 0.10
Nodes (19): ENDONYMS, DEMO, VIEWPORTS, gotoClean(), checkChip(), fillRequired(), BOOKING_URL, stubBookings() (+11 more)

### Community 17 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): extends, include, exclude, compilerOptions, resolveJsonModule, allowJs, baseUrl, paths (+1 more)

### Community 27 - "Monograms & Favicon"
Cohesion: 1.00
Nodes (3): Gradvera monogram (plain, transparent), Gradvera monogram (on dark tile), Gradvera favicon

### Community 19 - "Favicons & App Icons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48

### Community 28 - "Product Identity & Tagline"
Cohesion: 1.00
Nodes (3): Gradvera OG social-share card (SVG source), Construction estimating software (Gradvera product tagline), Gradvera brand / product identity

### Community 12 - "Design System Rules"
Cohesion: 0.17
Nodes (16): The Lit Blueprint (Creative North Star), Burnished Amber accent (#E8901C), Blueprint Navy (#1E3A8A) link/info accent, The One Light Rule, The Amber-Never-As-Body-Text Rule, The Sentence-Case Rule, The Mono-Is-Annotation Rule, IBM Plex Sans/Mono typography system (+8 more)

### Community 26 - "Product Purpose & Users"
Cohesion: 0.67
Nodes (3): Users: construction estimators / quantity surveyors / bid teams, Product purpose: convert qualified interest into a booked demo (to D365), Principle 3: Credibility is the conversion

### Community 7 - "Project Docs & Principles"
Cohesion: 0.07
Nodes (31): Principle 4: Trilingual parity (EN/SL/HR), Gradvera marketing website, Astro 5 framework, TypeScript (astro/tsconfigs/strict), Astro i18n routing (EN/SL/HR), Vercel hosting (@astrojs/vercel), Self-hosted IBM Plex fonts, Google Tag Manager (GA4 inside GTM) (+23 more)

### Community 20 - "OG Image Renderer"
Cohesion: 0.33
Nodes (4): ROOT, OG_DIR, FONT_PKG, svgs

### Community 11 - "Base Layout & Fonts"
Cohesion: 0.12
Nodes (8): ../styles/gradvera-tokens.css, ../styles/site.css, ../styles/cap1-screens.css, ../styles/cap-screens.css, ../styles/site-polish.css, ../components/marketing/CookieConsent.astro, ../components/marketing/Analytics.astro, t

### Community 22 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): ROOT, PORT, TYPES

### Community 23 - "Brand Marks & Tagline"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Gradvera Wordmark, Construction Estimating Software Tagline

### Community 15 - "Brand & OG Assets"
Cohesion: 0.22
Nodes (10): Gradvera OG Image (Slovenian), Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Croatian Tagline — Softver za izradu građevinskih troškovnika, Open Graph Social-Share Preview (HR locale), Gradvera OG Image (SL) — SVG Source (+2 more)

### Community 21 - "i18n Parity E2E Spec"
Cohesion: 0.33
Nodes (4): ROOT, LOCALIZED_COMPONENTS, SENTINELS, LOCAL_PROOF

### Community 29 - "Brand Facts & OG Pipeline"
Cohesion: 0.67
Nodes (3): Open Graph images / render-og.mjs, consts.ts (brand facts, integration ids), SEO.astro component

### Community 9 - "Astro Config & Redirects"
Cohesion: 0.13
Nodes (21): SEO Growth Implementation Plan (doc), PR1: feat/lead-event-ga4, PR2: feat/localized-slugs, PR3: feat/content-pages, Task 1: generate_lead dataLayer push + e2e + doc, Task 2: Slug map + localized routing helpers, Task 3: Sitemap + redirects + trailing-slash patch script, Task 4: Rename page dirs + update e2e specs (+13 more)

### Community 10 - "Guide Pages & i18n Helpers"
Cohesion: 0.15
Nodes (14): t, faqLd, breadcrumbLd, t, faqLd, breadcrumbLd, t, faqLd (+6 more)

### Community 24 - "Guide Pages & i18n Helpers"
Cohesion: 0.50
Nodes (3): t, faqLd, breadcrumbLd

### Community 25 - "Guide Pages & i18n Helpers"
Cohesion: 0.50
Nodes (3): t, faqLd, breadcrumbLd

### Community 16 - "Social Listening Research"
Cohesion: 0.47
Nodes (10): Social Listening — SEO & Sales-Strategy Brainstorm Input, r/estimators: What Construction Estimating Software Do You Use?, r/smallbusiness: Estimating Software for a Small Sub, ENR Top-50 Heavy-Civil Contractors Software Usage, Marked-for-Brainstorm Session (superpowers:brainstorming), Pains & Objections Extraction, Exact Phrases → Keyword Candidates, Competitor Mentions (+2 more)

### Community 2 - "Project Guidance & Acquisition Plans"
Cohesion: 0.08
Nodes (46): Workstream A Claims Sweep Implementation Plan, Task 0 — Branch, Baseline, Parts-Sync Helper, Task 1 — Remove 'Measured in Practice' Results Section, Task 2 — Disclose Gradvera ↔ DIGITAL SOLUTIONS Relationship, Task 3 — Soften Guarantee Verbs, Task 4 — Pin Excel BoQ Input in Guides, Task 5 — Book-a-Demo Page Copy, Task 6 — Full Gates, Docs, PR (+38 more)

### Community 4 - "Package Dependencies"
Cohesion: 0.06
Nodes (34): name, type, version, private, description, scripts, dev, start (+26 more)

### Community 0 - "Lead Scoring, Payload & Demo Form"
Cohesion: 0.06
Nodes (52): Qualification, Attribution, Lead, ParseResult, ROLE_LABELS_EN, CHALLENGE_LABELS_EN, METHOD_LABELS_EN, FREQUENCY_LABELS_EN (+44 more)

### Community 8 - "Site Interactions (site.js)"
Cohesion: 0.14
Nodes (24): read(), write(), hasClickId(), capture(), delayFor(), mk(), stroke(), line() (+16 more)

### Community 18 - "Project Guidance, CI & Plans"
Cohesion: 0.28
Nodes (9): .github/workflows/ci.yml — CI workflow, check job: astro check + npm run test:unit on ubuntu-latest, e2e job: Playwright browser checks, 20-minute timeout, Chromium install bounded/retried, not via apt --with-deps, System deps install is best-effort (continue-on-error), bounded to 3 minutes, e2e job capped at timeout-minutes: 20, concurrency group ci-${{ github.ref }} cancels superseded runs, Unit tests (Vitest) README (+1 more)

### Community 3 - "Lead Capture, Contract v2 & Event Tracking"
Cohesion: 0.07
Nodes (44): Task 6: Contract v2 Docs, Gates, Graphify, PR, Lead integration (website → gtm-toolkit → D365), Lead payload validation (parseLeadBody), POST /api/lead response matrix (qualified + score), Forwarded lead payload (website → gtm-toolkit, contract v2), Synthesized qualification digest message, English role label mapping (role → jobtitle), HMAC-SHA256 signature (x-gradvera-signature) (+36 more)

### Community 5 - "Astro Config & Redirects"
Cohesion: 0.09
Nodes (26): LEGACY_SLUG_PATHS, redirects, serialize(), localizePath(), t, targetPath(), string, SLUGS (+18 more)

## Knowledge Gaps
- **206 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Lead integration (website → gtm-toolkit → D365)` connect `Lead Capture, Contract v2 & Event Tracking` to `Site Interactions (site.js)`, `Lead Scoring, Payload & Demo Form`, `Project Guidance & Acquisition Plans`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `Task 1: EN-only route plumbing` connect `Astro Config & Redirects` to `Lead Scoring, Payload & Demo Form`, `Landing Page & Lead Forms`, `Lead Capture, Contract v2 & Event Tracking`, `Base Layout & Fonts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Netherlands landing-page structure (§7.2)` connect `Project Guidance & Acquisition Plans` to `Social Listening Research`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Lead events & conversion tracking (GA4 / Google Ads via GTM)` (e.g. with `landing.spec.mjs (acquisition landing page checks)` and `lead-events.spec.mjs (§11.1 dataLayer + Bookings embed)`) actually correct?**
  _`Lead events & conversion tracking (GA4 / Google Ads via GTM)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Landing Page & Lead Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.05576441102756892 - nodes in this community are weakly interconnected._
- **Should `Claims Policy E2E Spec` be split into smaller, more focused modules?**
  _Cohesion score 0.10338680926916222 - nodes in this community are weakly interconnected._