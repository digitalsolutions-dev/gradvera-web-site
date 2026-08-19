# Graph Report - .  (2026-08-19)

## Corpus Check
- 14 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 567 nodes · 883 edges · 59 communities (38 shown, 21 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.82)
- Token cost: 103,294 input · 18,229 output

## Community Hubs (Navigation)
- Homepage Sections
- Demo Form & Book-a-Demo Pages
- Guide Pages & i18n Helpers
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
- ../styles/gradvera-tokens.css
- ../styles/site.css
- ../styles/cap1-screens.css
- ../styles/cap-screens.css
- ../styles/site-polish.css
- ../components/marketing/CookieConsent.astro
- ../components/marketing/Analytics.astro
- E2E Static Server
- Brand Marks & Tagline
- Brand & OG Assets
- i18n Parity E2E Spec
- Brand Facts & OG Pipeline
- Header & Language Switch
- Header Responsive E2E
- Astro Config & Redirects
- Vercel Redirect Patch
- Localized Slugs E2E
- SEO Component & Structured Data
- i18n Utils & 404
- SL Homepage
- Confirmed Acquisition Model
- Social Listening Research
- Package Dependencies
- Lead Scoring, Payload & Demo Form
- Site Interactions (site.js)
- Site Interactions (site.js)
- Project Guidance & Test Harnesses
- Vitest Harness Task
- Lead Capture, Contract v2 & Event Tracking
- Bookings Embed (planned)
- ProductEvidence Component
- Decision B1: Required Form Fields

## God Nodes (most connected - your core abstractions)
1. `Gradvera Confirmed Acquisition Model` - 27 edges
2. `useTranslations()` - 21 edges
3. `localizePath()` - 17 edges
4. `Lead events & conversion tracking (GA4/Ads)` - 16 edges
5. `Locale` - 15 edges
6. `absoluteUrl()` - 15 edges
7. `Lead integration (website → gtm-toolkit → D365)` - 14 edges
8. `../../layouts/BaseLayout.astro` - 12 edges
9. `CLAUDE.md — Gradvera repo guidance` - 12 edges
10. `guideArticleLd()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `CI e2e job wiring (ci.yml)` --semantically_similar_to--> `CI jobs (astro check + e2e, ci.yml)`  [INFERRED] [semantically similar]
  tests/e2e/README.md → CLAUDE.md
- `astro check remains the type-safety gate (readme note)` --semantically_similar_to--> `astro check verification gate`  [INFERRED] [semantically similar]
  tests/e2e/README.md → CLAUDE.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Sentence-Case Rule`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `localizePath()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bookings reveal + dataLayer events mechanism** — claude_lead_capture, docs_lead_tracking_ga4_doc, docs_superpowers_plans_2026_08_19_ws_cd_bookings_events_task_2 [INFERRED 0.85]
- **Lead contract v2 pipeline (validate → forward → D365)** — docs_lead_integration_contract_v2, src_pages_api_lead, src_lib_leadpayload [EXTRACTED 1.00]
- **CI verification gates (type-check + unit + e2e)** — claude_astro_check_gate, claude_vitest_unit_harness, claude_e2e_playwright_harness [EXTRACTED 1.00]
- **CI's two jobs (check, e2e) enforce the documented verification gates** — _github_workflows_ci_check_job, _github_workflows_ci_e2e_job [INFERRED 0.85]
- **Workstream B Tasks Implementing Spec** — docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_1, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_2, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_3, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_4 [EXTRACTED 1.00]
- **Netherlands Inbound Conversion Journey** — docs_confirmed_acquisition_model_qualified_demo_conversion, docs_confirmed_acquisition_model_guided_demo_sample_tenant, docs_confirmed_acquisition_model_microsoft_bookings_embed [EXTRACTED 1.00]
- **Claims Policy Implemented on NL Landing Page** — docs_confirmed_acquisition_model_claims_policy, docs_confirmed_acquisition_model_value_requiring_pricing_review, docs_confirmed_acquisition_model_netherlands_landing_page_structure [EXTRACTED 1.00]
- **Lead Qualification & Attribution Funnel** — docs_confirmed_acquisition_model_lead_scoring_model, docs_confirmed_acquisition_model_attribution_fields, docs_confirmed_acquisition_model_analytics_events [INFERRED 0.75]
- **Claims Policy Enforcement Chain (task → regression spec → README catalog → policy doc)** — docs_superpowers_plans_2026_08_18_ws_a_claims_sweep_task_1_remove_results_section, tests_e2e_claims_spec_mjs, tests_e2e_readme_doc, docs_confirmed_acquisition_model_claims_policy [INFERRED 0.75]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]

## Communities (59 total, 21 thin omitted)

### Community 9 - "Homepage Sections"
Cohesion: 0.11
Nodes (11): t, t, t, SLUGS, REVERSE, LOCALES, DEFAULT_LOCALE, DICTS (+3 more)

### Community 12 - "Demo Form & Book-a-Demo Pages"
Cohesion: 0.15
Nodes (11): t, breadcrumbLd, t, strings(), l10n, t, breadcrumbLd, t (+3 more)

### Community 8 - "Guide Pages & i18n Helpers"
Cohesion: 0.12
Nodes (20): t, jsonLd, localizePath(), absoluteUrl(), guideArticleLd(), t, faqLd, breadcrumbLd (+12 more)

### Community 13 - "Privacy Policy Pages"
Cohesion: 0.19
Nodes (9): t, ../../layouts/BaseLayout.astro, t, t, Locale, t, faqLd, breadcrumbLd (+1 more)

### Community 4 - "Claims Policy E2E Spec"
Cohesion: 0.10
Nodes (19): ENDONYMS, PAGES, bundledCss(), expectPreloadsResolveAndMatchCss(), HOME, PRODUCT_LINE, GUARANTEE_PHRASES, GUIDE_PAGES (+11 more)

### Community 17 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): extends, include, exclude, compilerOptions, resolveJsonModule, allowJs, baseUrl, paths (+1 more)

### Community 26 - "Monograms & Favicon"
Cohesion: 1.00
Nodes (3): Gradvera monogram (plain, transparent), Gradvera monogram (on dark tile), Gradvera favicon

### Community 19 - "Favicons & App Icons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48

### Community 27 - "Product Identity & Tagline"
Cohesion: 1.00
Nodes (3): Gradvera OG social-share card (SVG source), Construction estimating software (Gradvera product tagline), Gradvera brand / product identity

### Community 11 - "Design System Rules"
Cohesion: 0.17
Nodes (16): The Lit Blueprint (Creative North Star), Burnished Amber accent (#E8901C), Blueprint Navy (#1E3A8A) link/info accent, The One Light Rule, The Amber-Never-As-Body-Text Rule, The Sentence-Case Rule, The Mono-Is-Annotation Rule, IBM Plex Sans/Mono typography system (+8 more)

### Community 25 - "Product Purpose & Users"
Cohesion: 0.67
Nodes (3): Users: construction estimators / quantity surveyors / bid teams, Product purpose: convert qualified interest into a booked demo (to D365), Principle 3: Credibility is the conversion

### Community 6 - "Project Docs & Principles"
Cohesion: 0.07
Nodes (31): Principle 4: Trilingual parity (EN/SL/HR), Gradvera marketing website, Astro 5 framework, TypeScript (astro/tsconfigs/strict), Astro i18n routing (EN/SL/HR), Vercel hosting (@astrojs/vercel), Self-hosted IBM Plex fonts, Google Tag Manager (GA4 inside GTM) (+23 more)

### Community 21 - "OG Image Renderer"
Cohesion: 0.33
Nodes (4): ROOT, OG_DIR, FONT_PKG, svgs

### Community 23 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): ROOT, PORT, TYPES

### Community 24 - "Brand Marks & Tagline"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Gradvera Wordmark, Construction Estimating Software Tagline

### Community 15 - "Brand & OG Assets"
Cohesion: 0.22
Nodes (10): Gradvera OG Image (Slovenian), Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Croatian Tagline — Softver za izradu građevinskih troškovnika, Open Graph Social-Share Preview (HR locale), Gradvera OG Image (SL) — SVG Source (+2 more)

### Community 22 - "i18n Parity E2E Spec"
Cohesion: 0.33
Nodes (4): ROOT, LOCALIZED_COMPONENTS, SENTINELS, LOCAL_PROOF

### Community 28 - "Brand Facts & OG Pipeline"
Cohesion: 0.67
Nodes (3): Open Graph images / render-og.mjs, consts.ts (brand facts, integration ids), SEO.astro component

### Community 2 - "Astro Config & Redirects"
Cohesion: 0.09
Nodes (33): SEO Growth Implementation Plan (doc), PR1: feat/lead-event-ga4, PR2: feat/localized-slugs, PR3: feat/content-pages, Task 1: generate_lead dataLayer push + e2e + doc, Task 2: Slug map + localized routing helpers, Task 3: Sitemap + redirects + trailing-slash patch script, Task 4: Rename page dirs + update e2e specs (+25 more)

### Community 14 - "SEO Component & Structured Data"
Cohesion: 0.17
Nodes (11): LOCALE_META, alternates(), t, string, canonical, ogImage, alts, ogAltLocales (+3 more)

### Community 5 - "Confirmed Acquisition Model"
Cohesion: 0.12
Nodes (32): Gradvera Confirmed Acquisition Model, Phase 0 — Foundation and Measurement, Phase 1 — Search-Quality Smoke Test, Phase 2 — Conversion Validation, Phase 3 — Message and Language Optimization, Phase 4 — Controlled Scale and Second Market, Phased Go/No-Go Gates, Netherlands as First Market (+24 more)

### Community 16 - "Social Listening Research"
Cohesion: 0.47
Nodes (10): Social Listening — SEO & Sales-Strategy Brainstorm Input, r/estimators: What Construction Estimating Software Do You Use?, r/smallbusiness: Estimating Software for a Small Sub, ENR Top-50 Heavy-Civil Contractors Software Usage, Marked-for-Brainstorm Session (superpowers:brainstorming), Pains & Objections Extraction, Exact Phrases → Keyword Candidates, Competitor Mentions (+2 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.06
Nodes (34): name, type, version, private, description, scripts, dev, start (+26 more)

### Community 0 - "Lead Scoring, Payload & Demo Form"
Cohesion: 0.06
Nodes (54): Qualification, Attribution, Lead, ParseResult, ROLE_LABELS_EN, CHALLENGE_LABELS_EN, METHOD_LABELS_EN, FREQUENCY_LABELS_EN (+46 more)

### Community 18 - "Site Interactions (site.js)"
Cohesion: 0.43
Nodes (5): read(), write(), hasClickId(), capture(), Attribution Capture Script (attribution.js)

### Community 10 - "Site Interactions (site.js)"
Cohesion: 0.19
Nodes (19): delayFor(), mk(), stroke(), line(), path(), node(), text(), cross() (+11 more)

### Community 7 - "Project Guidance & Test Harnesses"
Cohesion: 0.09
Nodes (28): .github/workflows/ci.yml — CI workflow, check job: astro check + npm run test:unit on ubuntu-latest, e2e job: Playwright browser checks, 20-minute timeout, Chromium install bounded/retried, not via apt --with-deps, System deps install is best-effort (continue-on-error), bounded to 3 minutes, e2e job capped at timeout-minutes: 20, concurrency group ci-${{ github.ref }} cancels superseded runs, tests/unit/README.md — Vitest unit test guide (+20 more)

### Community 1 - "Lead Capture, Contract v2 & Event Tracking"
Cohesion: 0.06
Nodes (42): Task 6: Contract v2 Docs, Gates, Graphify, PR, Decision B6: Contract v2 Additive Keys, Decision D2': Score -> GTM dataLayer, COMPANY, SITE, GUIDE_DATES, GTM_ID, GA4_ID (+34 more)

## Knowledge Gaps
- **191 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+186 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Lead integration (website → gtm-toolkit → D365)` connect `Lead Capture, Contract v2 & Event Tracking` to `Lead Scoring, Payload & Demo Form`, `Confirmed Acquisition Model`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `Lead events & conversion tracking (GA4/Ads)` connect `Lead Capture, Contract v2 & Event Tracking` to `Lead Scoring, Payload & Demo Form`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `Lead contract v2 body (browser → /api/lead)` connect `Lead Scoring, Payload & Demo Form` to `Lead Capture, Contract v2 & Event Tracking`, `Site Interactions (site.js)`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _191 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Homepage Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.10541310541310542 - nodes in this community are weakly interconnected._
- **Should `Guide Pages & i18n Helpers` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `Claims Policy E2E Spec` be split into smaller, more focused modules?**
  _Cohesion score 0.09848484848484848 - nodes in this community are weakly interconnected._