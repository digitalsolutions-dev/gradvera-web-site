# Graph Report - .  (2026-08-19)

## Corpus Check
- 43 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 604 nodes · 1010 edges · 46 communities (35 shown, 11 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.82)
- Token cost: 105,233 input · 18,571 output

## Community Hubs (Navigation)
- Landing Page & Lead Forms
- Demo Form & Book-a-Demo Pages
- Locale Home Pages & URL Helpers
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
- Astro Config & Redirects
- Vercel Redirect Patch
- Localized Slugs E2E
- Guide Pages & i18n Helpers
- Privacy Policy Pages
- Guide Pages & i18n Helpers
- SEO Component & Structured Data
- Confirmed Acquisition Model
- Social Listening Research
- Project Guidance, CI & Plans
- Package Dependencies
- Lead Scoring, Payload & Demo Form
- Lead Capture, Contract v2 & Event Tracking
- Site Interactions (site.js)
- Vitest Harness Task
- Bookings Embed (planned)
- ProductEvidence Component
- Decision B1: Required Form Fields

## God Nodes (most connected - your core abstractions)
1. `Gradvera Confirmed Acquisition Model` - 27 edges
2. `useTranslations()` - 23 edges
3. `localizePath()` - 19 edges
4. `Locale` - 17 edges
5. `Lead events & conversion tracking (GA4 / Google Ads via GTM)` - 17 edges
6. `absoluteUrl()` - 16 edges
7. `Lead integration (website → gtm-toolkit → D365)` - 13 edges
8. `Workstream E — Acquisition Landing Page Implementation Plan` - 11 edges
9. `Workstream A Claims Sweep Implementation Plan` - 10 edges
10. `scripts` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Sentence-Case Rule`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `localizePath()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `stripLocale()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts
- `lead-events.spec.mjs (§11.1 dataLayer + Bookings embed)` --conceptually_related_to--> `Lead events & conversion tracking (GA4 / Google Ads via GTM)`  [INFERRED]
  tests/e2e/README.md → docs/lead-tracking-ga4.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lead conversion event tracking (capture mechanism, event spec, e2e verification)** — claude_lead_capture, docs_lead_tracking_ga4_qualification_form_submit, tests_e2e_readme_lead_events_spec [INFERRED 0.85]
- **Landing page verification (implementation task, e2e spec, unit test)** — docs_superpowers_plans_2026_08_19_ws_e_landing_page_task2_landing_copy_components, tests_e2e_readme_landing_spec, tests_unit_readme_i18n_test [INFERRED 0.75]
- **Bookings reveal + dataLayer events mechanism** — claude_lead_capture, docs_lead_tracking_ga4_doc, docs_superpowers_plans_2026_08_19_ws_cd_bookings_events_task_2 [INFERRED 0.85]
- **Lead contract v2 pipeline (validate → forward → D365)** — docs_lead_integration_contract_v2, src_pages_api_lead, src_lib_leadpayload [EXTRACTED 1.00]
- **CI's two jobs (check, e2e) enforce the documented verification gates** — _github_workflows_ci_check_job, _github_workflows_ci_e2e_job [INFERRED 0.85]
- **Workstream B Tasks Implementing Spec** — docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_1, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_2, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_3, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_4 [EXTRACTED 1.00]
- **Netherlands Inbound Conversion Journey** — docs_confirmed_acquisition_model_qualified_demo_conversion, docs_confirmed_acquisition_model_guided_demo_sample_tenant, docs_confirmed_acquisition_model_microsoft_bookings_embed [EXTRACTED 1.00]
- **Claims Policy Implemented on NL Landing Page** — docs_confirmed_acquisition_model_claims_policy, docs_confirmed_acquisition_model_value_requiring_pricing_review, docs_confirmed_acquisition_model_netherlands_landing_page_structure [EXTRACTED 1.00]
- **Lead Qualification & Attribution Funnel** — docs_confirmed_acquisition_model_lead_scoring_model, docs_confirmed_acquisition_model_attribution_fields, docs_confirmed_acquisition_model_analytics_events [INFERRED 0.75]
- **Claims Policy Enforcement Chain (task → regression spec → README catalog → policy doc)** — docs_superpowers_plans_2026_08_18_ws_a_claims_sweep_task_1_remove_results_section, tests_e2e_claims_spec_mjs, tests_e2e_readme_doc, docs_confirmed_acquisition_model_claims_policy [INFERRED 0.75]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]

## Communities (46 total, 11 thin omitted)

### Community 1 - "Landing Page & Lead Forms"
Cohesion: 0.06
Nodes (26): t, t, t, COMPANY, SITE, GUIDE_DATES, GTM_ID, GA4_ID (+18 more)

### Community 18 - "Demo Form & Book-a-Demo Pages"
Cohesion: 0.20
Nodes (6): t, breadcrumbLd, t, breadcrumbLd, t, breadcrumbLd

### Community 19 - "Locale Home Pages & URL Helpers"
Cohesion: 0.20
Nodes (7): t, jsonLd, t, jsonLd, t, jsonLd, absoluteUrl()

### Community 14 - "Privacy Policy Pages"
Cohesion: 0.23
Nodes (8): t, t, strings(), l10n, t, t, Locale, useTranslations()

### Community 5 - "Claims Policy E2E Spec"
Cohesion: 0.10
Nodes (19): ENDONYMS, DEMO, VIEWPORTS, gotoClean(), checkChip(), fillRequired(), BOOKING_URL, stubBookings() (+11 more)

### Community 20 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): extends, include, exclude, compilerOptions, resolveJsonModule, allowJs, baseUrl, paths (+1 more)

### Community 29 - "Monograms & Favicon"
Cohesion: 1.00
Nodes (3): Gradvera monogram (plain, transparent), Gradvera monogram (on dark tile), Gradvera favicon

### Community 21 - "Favicons & App Icons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48

### Community 30 - "Product Identity & Tagline"
Cohesion: 1.00
Nodes (3): Gradvera OG social-share card (SVG source), Construction estimating software (Gradvera product tagline), Gradvera brand / product identity

### Community 13 - "Design System Rules"
Cohesion: 0.17
Nodes (16): The Lit Blueprint (Creative North Star), Burnished Amber accent (#E8901C), Blueprint Navy (#1E3A8A) link/info accent, The One Light Rule, The Amber-Never-As-Body-Text Rule, The Sentence-Case Rule, The Mono-Is-Annotation Rule, IBM Plex Sans/Mono typography system (+8 more)

### Community 28 - "Product Purpose & Users"
Cohesion: 0.67
Nodes (3): Users: construction estimators / quantity surveyors / bid teams, Product purpose: convert qualified interest into a booked demo (to D365), Principle 3: Credibility is the conversion

### Community 8 - "Project Docs & Principles"
Cohesion: 0.07
Nodes (31): Principle 4: Trilingual parity (EN/SL/HR), Gradvera marketing website, Astro 5 framework, TypeScript (astro/tsconfigs/strict), Astro i18n routing (EN/SL/HR), Vercel hosting (@astrojs/vercel), Self-hosted IBM Plex fonts, Google Tag Manager (GA4 inside GTM) (+23 more)

### Community 22 - "OG Image Renderer"
Cohesion: 0.33
Nodes (4): ROOT, OG_DIR, FONT_PKG, svgs

### Community 12 - "Base Layout & Fonts"
Cohesion: 0.12
Nodes (8): ../styles/gradvera-tokens.css, ../styles/site.css, ../styles/cap1-screens.css, ../styles/cap-screens.css, ../styles/site-polish.css, ../components/marketing/CookieConsent.astro, ../components/marketing/Analytics.astro, t

### Community 24 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): ROOT, PORT, TYPES

### Community 25 - "Brand Marks & Tagline"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Gradvera Wordmark, Construction Estimating Software Tagline

### Community 16 - "Brand & OG Assets"
Cohesion: 0.22
Nodes (10): Gradvera OG Image (Slovenian), Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Croatian Tagline — Softver za izradu građevinskih troškovnika, Open Graph Social-Share Preview (HR locale), Gradvera OG Image (SL) — SVG Source (+2 more)

### Community 23 - "i18n Parity E2E Spec"
Cohesion: 0.33
Nodes (4): ROOT, LOCALIZED_COMPONENTS, SENTINELS, LOCAL_PROOF

### Community 31 - "Brand Facts & OG Pipeline"
Cohesion: 0.67
Nodes (3): Open Graph images / render-og.mjs, consts.ts (brand facts, integration ids), SEO.astro component

### Community 7 - "Astro Config & Redirects"
Cohesion: 0.10
Nodes (25): SEO Growth Implementation Plan (doc), PR1: feat/lead-event-ga4, PR2: feat/localized-slugs, Task 1: generate_lead dataLayer push + e2e + doc, Task 2: Slug map + localized routing helpers, Task 3: Sitemap + redirects + trailing-slash patch script, Task 4: Rename page dirs + update e2e specs, SLUGS/REVERSE slug map (src/i18n/slugs.ts, planned) (+17 more)

### Community 10 - "Astro Config & Redirects"
Cohesion: 0.16
Nodes (19): PR3: feat/content-pages, Task 5: GuideArticle component + guide.est content (cluster 1: kalkulacije), Task 6: Cluster 2 content (guide.bid: predračun/troškovnik), Task 7: Footer links + e2e + graphify + docs, GuideArticle.astro component (planned), guide.est.* content brief (construction cost estimation), guide.bid.* content brief (construction bid estimate), Footer guide links (footer.explore.estGuide/bidGuide) (+11 more)

### Community 11 - "Guide Pages & i18n Helpers"
Cohesion: 0.15
Nodes (14): t, faqLd, breadcrumbLd, t, faqLd, breadcrumbLd, t, faqLd (+6 more)

### Community 26 - "Privacy Policy Pages"
Cohesion: 0.50
Nodes (3): t, faqLd, breadcrumbLd

### Community 27 - "Guide Pages & i18n Helpers"
Cohesion: 0.50
Nodes (3): t, faqLd, breadcrumbLd

### Community 15 - "SEO Component & Structured Data"
Cohesion: 0.18
Nodes (10): t, string, canonical, ogImage, alts, ogAltLocales, organizationLd, webSiteLd (+2 more)

### Community 6 - "Confirmed Acquisition Model"
Cohesion: 0.12
Nodes (33): Gradvera Confirmed Acquisition Model, Phase 0 — Foundation and Measurement, Phase 1 — Search-Quality Smoke Test, Phase 2 — Conversion Validation, Phase 3 — Message and Language Optimization, Phase 4 — Controlled Scale and Second Market, Phased Go/No-Go Gates, Netherlands as First Market (+25 more)

### Community 17 - "Social Listening Research"
Cohesion: 0.47
Nodes (10): Social Listening — SEO & Sales-Strategy Brainstorm Input, r/estimators: What Construction Estimating Software Do You Use?, r/smallbusiness: Estimating Software for a Small Sub, ENR Top-50 Heavy-Civil Contractors Software Usage, Marked-for-Brainstorm Session (superpowers:brainstorming), Pains & Objections Extraction, Exact Phrases → Keyword Candidates, Competitor Mentions (+2 more)

### Community 3 - "Project Guidance, CI & Plans"
Cohesion: 0.07
Nodes (37): Task 6 — Full Gates, Docs, PR, .github/workflows/ci.yml — CI workflow, check job: astro check + npm run test:unit on ubuntu-latest, e2e job: Playwright browser checks, 20-minute timeout, Chromium install bounded/retried, not via apt --with-deps, System deps install is best-effort (continue-on-error), bounded to 3 minutes, e2e job capped at timeout-minutes: 20, concurrency group ci-${{ github.ref }} cancels superseded runs (+29 more)

### Community 4 - "Package Dependencies"
Cohesion: 0.06
Nodes (34): name, type, version, private, description, scripts, dev, start (+26 more)

### Community 0 - "Lead Scoring, Payload & Demo Form"
Cohesion: 0.06
Nodes (53): Qualification, Attribution, Lead, ParseResult, ROLE_LABELS_EN, CHALLENGE_LABELS_EN, METHOD_LABELS_EN, FREQUENCY_LABELS_EN (+45 more)

### Community 2 - "Lead Capture, Contract v2 & Event Tracking"
Cohesion: 0.08
Nodes (38): read(), write(), hasClickId(), capture(), Task 6: Contract v2 Docs, Gates, Graphify, PR, Attribution Capture Script (attribution.js), Decision B6: Contract v2 Additive Keys, Decision D2': Score -> GTM dataLayer (+30 more)

### Community 9 - "Site Interactions (site.js)"
Cohesion: 0.19
Nodes (19): delayFor(), mk(), stroke(), line(), path(), node(), text(), cross() (+11 more)

## Knowledge Gaps
- **189 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+184 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Lead integration (website → gtm-toolkit → D365)` connect `Lead Capture, Contract v2 & Event Tracking` to `Lead Scoring, Payload & Demo Form`, `Confirmed Acquisition Model`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `Task 1: EN-only route plumbing` connect `Astro Config & Redirects` to `Lead Scoring, Payload & Demo Form`, `Landing Page & Lead Forms`, `Project Guidance, CI & Plans`, `Base Layout & Fonts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Lead events & conversion tracking (GA4 / Google Ads via GTM)` (e.g. with `Decision D2': Score -> GTM dataLayer` and `landing.spec.mjs (acquisition landing page checks)`) actually correct?**
  _`Lead events & conversion tracking (GA4 / Google Ads via GTM)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _189 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Landing Page & Lead Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.05576441102756892 - nodes in this community are weakly interconnected._
- **Should `Claims Policy E2E Spec` be split into smaller, more focused modules?**
  _Cohesion score 0.10338680926916222 - nodes in this community are weakly interconnected._
- **Should `Project Docs & Principles` be split into smaller, more focused modules?**
  _Cohesion score 0.07311827956989247 - nodes in this community are weakly interconnected._