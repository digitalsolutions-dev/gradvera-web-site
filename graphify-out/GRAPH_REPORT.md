# Graph Report - .  (2026-08-19)

## Corpus Check
- 28 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 555 nodes · 844 edges · 62 communities (41 shown, 21 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.83)
- Token cost: 201,163 input · 35,501 output

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
- Principle 5: Speed is part o
- OG Image Renderer
- ../styles/gradvera-tokens.cs
- ../styles/site.css
- ../styles/cap1-screens.css
- ../styles/cap-screens.css
- ../styles/site-polish.css
- ../components/marketing/Cook
- ../components/marketing/Anal
- E2E Static Server
- Brand Marks & Tagline
- Brand & OG Assets
- i18n Parity E2E Spec
- Brand Facts & OG Pipeline
- Header & Language Switch
- Header Responsive E2E
- Astro Config & Redirects
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
- Project Guidance & Test Harnesses
- Lead Docs & Workstream B Plan
- Contract v2 Wire Semantics
- Lead API Responses & Honeypot
- GA4 generate_lead Tracking
- Vitest Harness Task
- Bookings Embed (planned)
- ProductEvidence Component
- Decision B1: Required Form F

## God Nodes (most connected - your core abstractions)
1. `Gradvera Confirmed Acquisition Model` - 27 edges
2. `CLAUDE.md — Gradvera site guidance` - 26 edges
3. `useTranslations()` - 21 edges
4. `localizePath()` - 17 edges
5. `Locale` - 15 edges
6. `absoluteUrl()` - 15 edges
7. `tests/e2e/README.md — Playwright e2e harness guide` - 14 edges
8. `../../layouts/BaseLayout.astro` - 13 edges
9. `guideArticleLd()` - 10 edges
10. `Workstream A Claims Sweep Implementation Plan` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Sentence-Case Rule`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `CLAUDE.md — Gradvera site guidance` --references--> `../../layouts/BaseLayout.astro`  [EXTRACTED]
  CLAUDE.md → src/layouts/BaseLayout.astro
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `localizePath()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `stripLocale()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Three-layer verification stack: type-check, unit, e2e** — claude_astro_check_gate, claude_vitest_unit_tests, claude_playwright_e2e_harness [INFERRED 0.85]
- **CI's two jobs (check, e2e) enforce the documented verification gates** — _github_workflows_ci_check_job, _github_workflows_ci_e2e_job, claude_ci_two_jobs [INFERRED 0.85]
- **Lead-related e2e specs share the helpers.mjs interception/fill utilities** — tests_e2e_readme_lead_form_spec, tests_e2e_readme_lead_tracking_spec, tests_e2e_readme_helpers [EXTRACTED 1.00]
- **Contract v2 Lead Pipeline** — docs_lead_integration_contract_v2, docs_lead_integration_forwarded_lead_v2, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_scorelead, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_parseleadbody [INFERRED 0.85]
- **Workstream B Tasks Implementing Spec** — docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_1, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_2, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_3, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_4 [EXTRACTED 1.00]
- **GA4 Conversion Tracking Chain** — docs_lead_tracking_ga4_generate_lead_push, docs_lead_tracking_ga4_gtm_trigger_tag, docs_lead_tracking_ga4_key_event [EXTRACTED 1.00]
- **Netherlands Inbound Conversion Journey** — docs_confirmed_acquisition_model_qualified_demo_conversion, docs_confirmed_acquisition_model_guided_demo_sample_tenant, docs_confirmed_acquisition_model_microsoft_bookings_embed [EXTRACTED 1.00]
- **Claims Policy Implemented on NL Landing Page** — docs_confirmed_acquisition_model_claims_policy, docs_confirmed_acquisition_model_value_requiring_pricing_review, docs_confirmed_acquisition_model_netherlands_landing_page_structure [EXTRACTED 1.00]
- **Lead Qualification & Attribution Funnel** — docs_confirmed_acquisition_model_lead_scoring_model, docs_confirmed_acquisition_model_attribution_fields, docs_confirmed_acquisition_model_analytics_events [INFERRED 0.75]
- **Claims Policy Enforcement Chain (task → regression spec → README catalog → policy doc)** — docs_superpowers_plans_2026_08_18_ws_a_claims_sweep_task_1_remove_results_section, tests_e2e_claims_spec_mjs, tests_e2e_readme_doc, docs_confirmed_acquisition_model_claims_policy [INFERRED 0.75]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]

## Communities (62 total, 21 thin omitted)

### Community 5 - "Homepage Sections"
Cohesion: 0.09
Nodes (15): t, t, t, LOCALES, DEFAULT_LOCALE, DICTS, isLocale(), getLocaleFromPath() (+7 more)

### Community 12 - "Demo Form & Book-a-Demo Pages"
Cohesion: 0.15
Nodes (11): t, breadcrumbLd, t, strings(), l10n, t, breadcrumbLd, t (+3 more)

### Community 8 - "Guide Pages & i18n Helpers"
Cohesion: 0.12
Nodes (20): t, jsonLd, localizePath(), absoluteUrl(), guideArticleLd(), t, faqLd, breadcrumbLd (+12 more)

### Community 13 - "Privacy Policy Pages"
Cohesion: 0.19
Nodes (9): t, ../../layouts/BaseLayout.astro, t, t, Locale, t, faqLd, breadcrumbLd (+1 more)

### Community 7 - "Claims Policy E2E Spec"
Cohesion: 0.11
Nodes (17): ENDONYMS, PAGES, bundledCss(), expectPreloadsResolveAndMatchCss(), HOME, PRODUCT_LINE, GUARANTEE_PHRASES, GUIDE_PAGES (+9 more)

### Community 17 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): extends, include, exclude, compilerOptions, resolveJsonModule, allowJs, baseUrl, paths (+1 more)

### Community 29 - "Monograms & Favicon"
Cohesion: 1.00
Nodes (3): Gradvera monogram (plain, transparent), Gradvera monogram (on dark tile), Gradvera favicon

### Community 18 - "Favicons & App Icons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48

### Community 30 - "Product Identity & Tagline"
Cohesion: 1.00
Nodes (3): Gradvera OG social-share card (SVG source), Construction estimating software (Gradvera product tagline), Gradvera brand / product identity

### Community 11 - "Design System Rules"
Cohesion: 0.17
Nodes (16): The Lit Blueprint (Creative North Star), Burnished Amber accent (#E8901C), Blueprint Navy (#1E3A8A) link/info accent, The One Light Rule, The Amber-Never-As-Body-Text Rule, The Sentence-Case Rule, The Mono-Is-Annotation Rule, IBM Plex Sans/Mono typography system (+8 more)

### Community 28 - "Product Purpose & Users"
Cohesion: 0.67
Nodes (3): Users: construction estimators / quantity surveyors / bid teams, Product purpose: convert qualified interest into a booked demo (to D365), Principle 3: Credibility is the conversion

### Community 4 - "Project Docs & Principles"
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

### Community 31 - "Brand Facts & OG Pipeline"
Cohesion: 0.67
Nodes (3): Open Graph images / render-og.mjs, consts.ts (brand facts, integration ids), SEO.astro component

### Community 10 - "Astro Config & Redirects"
Cohesion: 0.16
Nodes (16): SEO Growth Implementation Plan (doc), PR1: feat/lead-event-ga4, PR2: feat/localized-slugs, Task 1: generate_lead dataLayer push + e2e + doc, Task 2: Slug map + localized routing helpers, Task 3: Sitemap + redirects + trailing-slash patch script, Task 4: Rename page dirs + update e2e specs, SLUGS/REVERSE slug map (src/i18n/slugs.ts, planned) (+8 more)

### Community 9 - "Astro Config & Redirects"
Cohesion: 0.16
Nodes (19): PR3: feat/content-pages, Task 5: GuideArticle component + guide.est content (cluster 1: kalkulacije), Task 6: Cluster 2 content (guide.bid: predračun/troškovnik), Task 7: Footer links + e2e + graphify + docs, GuideArticle.astro component (planned), guide.est.* content brief (construction cost estimation), guide.bid.* content brief (construction bid estimate), Footer guide links (footer.explore.estGuide/bidGuide) (+11 more)

### Community 14 - "SEO Component & Structured Data"
Cohesion: 0.17
Nodes (11): LOCALE_META, alternates(), t, string, canonical, ogImage, alts, ogAltLocales (+3 more)

### Community 1 - "Confirmed Acquisition Model"
Cohesion: 0.09
Nodes (40): Gradvera Confirmed Acquisition Model, Phase 0 — Foundation and Measurement, Phase 1 — Search-Quality Smoke Test, Phase 2 — Conversion Validation, Phase 3 — Message and Language Optimization, Phase 4 — Controlled Scale and Second Market, Phased Go/No-Go Gates, Netherlands as First Market (+32 more)

### Community 16 - "Social Listening Research"
Cohesion: 0.47
Nodes (10): Social Listening — SEO & Sales-Strategy Brainstorm Input, r/estimators: What Construction Estimating Software Do You Use?, r/smallbusiness: Estimating Software for a Small Sub, ENR Top-50 Heavy-Civil Contractors Software Usage, Marked-for-Brainstorm Session (superpowers:brainstorming), Pains & Objections Extraction, Exact Phrases → Keyword Candidates, Competitor Mentions (+2 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.06
Nodes (34): name, type, version, private, description, scripts, dev, start (+26 more)

### Community 0 - "Lead Scoring, Payload & Demo Form"
Cohesion: 0.06
Nodes (54): Qualification, Attribution, Lead, ParseResult, ROLE_LABELS_EN, CHALLENGE_LABELS_EN, METHOD_LABELS_EN, FREQUENCY_LABELS_EN (+46 more)

### Community 6 - "Site Interactions (site.js)"
Cohesion: 0.14
Nodes (24): read(), write(), hasClickId(), capture(), delayFor(), mk(), stroke(), line() (+16 more)

### Community 3 - "Project Guidance & Test Harnesses"
Cohesion: 0.09
Nodes (33): CLAUDE.md — Gradvera site guidance, Astro static output with /api/lead as sole on-demand route, astro check as the type-safety verification gate, Vitest unit tests covering src/lib pure modules, Playwright e2e harness under tests/e2e, i18n dictionaries with EN authored in _parts/ fragments and assembled, build script runs astro build + patch-vercel-redirects.mjs for SL/HR legacy 308s, Short-lived feat/fix/docs/ci/chore branches merged via PR after CI green (+25 more)

### Community 20 - "Lead Docs & Workstream B Plan"
Cohesion: 0.40
Nodes (6): Lead Integration (docs/lead-integration.md), Lead Conversion Tracking GA4 (docs/lead-tracking-ga4.md), Workstream B Implementation Plan (2026-08-19), Task 6: Contract v2 Docs, Gates, Graphify, PR, Decision B6: Contract v2 Additive Keys, Decision D2': Score -> GTM dataLayer

### Community 25 - "Contract v2 Wire Semantics"
Cohesion: 0.67
Nodes (3): Qualification Fields (country, role, companySize, mainChallenge, estimatingMethod, bidFrequency, ndaWilling), Synthesized Message (never-blank message field), English Role Label (role -> D365 jobtitle)

### Community 26 - "Lead API Responses & Honeypot"
Cohesion: 0.67
Nodes (3): Honeypot (company_website), POST /api/lead Response Table, qualified/score Response Fields Not Yet Pushed

### Community 27 - "GA4 generate_lead Tracking"
Cohesion: 0.67
Nodes (3): generate_lead dataLayer Push, GTM Trigger/Tag (CE - generate_lead / GA4 - generate_lead), generate_lead GA4 Key Event

## Knowledge Gaps
- **197 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+192 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CLAUDE.md — Gradvera site guidance` connect `Project Guidance & Test Harnesses` to `Lead Scoring, Payload & Demo Form`, `Privacy Policy Pages`, `Homepage Sections`, `Site Interactions (site.js)`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Why does `tests/e2e/README.md — Playwright e2e harness guide` connect `Project Guidance & Test Harnesses` to `Confirmed Acquisition Model`, `Claims Policy E2E Spec`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _197 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Homepage Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.09032258064516129 - nodes in this community are weakly interconnected._
- **Should `Guide Pages & i18n Helpers` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `Claims Policy E2E Spec` be split into smaller, more focused modules?**
  _Cohesion score 0.10574712643678161 - nodes in this community are weakly interconnected._
- **Should `Project Docs & Principles` be split into smaller, more focused modules?**
  _Cohesion score 0.07311827956989247 - nodes in this community are weakly interconnected._