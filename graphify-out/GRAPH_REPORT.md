# Graph Report - .  (2026-08-19)

## Corpus Check
- 21 files · ~81,389 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 545 nodes · 764 edges · 66 communities (45 shown, 21 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 60 edges (avg confidence: 0.83)
- Token cost: 202,541 input · 35,744 output

## Community Hubs (Navigation)
- Confirmed Acquisition Model
- Astro Config & Redirects
- Stack & CI Gates
- Package Dependencies
- Project Docs & Principles
- Layout & Lead Capture Concepts
- Guide Pages & i18n Helpers
- Homepage Sections
- Claims Policy E2E Spec
- Site Interactions (site.js)
- Workstream A Plan
- SEO Component & Structured Data
- Design System Rules
- GA4 / GTM Lead Tracking
- gtm-toolkit Lead Integration
- Demo Form & Book-a-Demo Pages
- Privacy Policy Pages
- Brand & OG Assets
- Social Listening Research
- TypeScript Config
- i18n Utils & 404
- Design Context Files
- Favicons & App Icons
- Header & Language Switch
- OG Image Renderer
- i18n Parity E2E Spec
- E2E Static Server
- Design Sync Tooling
- Brand Marks & Tagline
- HR Bid Guide Page
- CI Workflow Jobs
- Consts & i18n Layout
- Product Purpose & Users
- Monograms & Favicon
- Product Identity & Tagline
- Brand Facts & OG Pipeline
- Vercel Redirect Patch
- SL Homepage
- Header Responsive E2E
- Localized Slugs E2E
- Playwright Config
- Sections & Page Composers
- OG Images
- Elevation & Glow Rules
- Layout Components Dir
- IDE State
- Static Assets Dir
- Principle: Speed
- Register: Brand
- Analytics Component Import
- Cookie Consent Import
- Cap1 Screens CSS
- Cap Screens CSS
- Design Tokens CSS
- Site CSS
- Site Polish CSS

## God Nodes (most connected - your core abstractions)
1. `Gradvera Confirmed Acquisition Model` - 27 edges
2. `useTranslations()` - 21 edges
3. `localizePath()` - 17 edges
4. `Locale` - 15 edges
5. `absoluteUrl()` - 15 edges
6. `../../layouts/BaseLayout.astro` - 12 edges
7. `Workstream A Claims Sweep Implementation Plan` - 11 edges
8. `guideArticleLd()` - 10 edges
9. `mk()` - 9 edges
10. `Gradvera marketing website` - 9 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --implements--> ``forwarded` soft flag`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `POST()` --implements--> `Honeypot field (company_website)`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `POST()` --implements--> `Lead payload validation`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Sentence-Case Rule`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Netherlands Inbound Conversion Journey** — docs_confirmed_acquisition_model_qualified_demo_conversion, docs_confirmed_acquisition_model_guided_demo_sample_tenant, docs_confirmed_acquisition_model_microsoft_bookings_embed [EXTRACTED 1.00]
- **Claims Policy Implemented on NL Landing Page** — docs_confirmed_acquisition_model_claims_policy, docs_confirmed_acquisition_model_value_requiring_pricing_review, docs_confirmed_acquisition_model_netherlands_landing_page_structure [EXTRACTED 1.00]
- **Lead Qualification & Attribution Funnel** — docs_confirmed_acquisition_model_lead_scoring_model, docs_confirmed_acquisition_model_attribution_fields, docs_confirmed_acquisition_model_analytics_events [INFERRED 0.75]
- **Workstream Execution Pipeline (A→B→C+D→E→F)** — docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_workstream_a, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_workstream_b, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_workstream_c, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_workstream_d, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_workstream_e, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_workstream_f [EXTRACTED 1.00]
- **Claims Policy Enforcement Chain (task → regression spec → README catalog → policy doc)** — docs_superpowers_plans_2026_08_18_ws_a_claims_sweep_task_1_remove_results_section, tests_e2e_claims_spec_mjs, tests_e2e_readme_doc, docs_confirmed_acquisition_model_claims_policy [INFERRED 0.75]
- **CI verification pipeline: astro check + Playwright e2e gates** — claude_ci_yml, claude_astro_check_job, claude_e2e_job, claude_npm_run_check, claude_npm_run_test_e2e, claude_playwright_harness [EXTRACTED 1.00]
- **Lead capture pipeline: form -> HMAC-signed forward -> gtm-toolkit -> Dynamics 365** — claude_pages_api_lead_ts, claude_demoform_astro, claude_gtm_lead_endpoint, claude_hmac_sha256, claude_gtm_toolkit, claude_dynamics_365 [EXTRACTED 1.00]
- **Design context docs consumed by /impeccable** — claude_product_md, claude_design_md, claude_impeccable_design_json, claude_impeccable_skill, claude_five_design_principles [EXTRACTED 1.00]
- **Lead Submission -> GA4 Event Pipeline** — docs_lead_tracking_ga4_datalayerpush, docs_lead_tracking_ga4_generateleadevent, docs_lead_tracking_ga4_customeventtrigger, docs_lead_tracking_ga4_ga4eventtag, docs_lead_tracking_ga4_ga4 [INFERRED 0.85]
- **End-to-end lead capture pipeline (browser -> website -> gtm-toolkit -> D365)** — src_components_forms_demoform, src_pages_api_lead_post, docs_lead_integration_hmac_signature, docs_lead_integration_gtm_toolkit_receiver, docs_lead_integration_d365_write_path [EXTRACTED 1.00]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]

## Communities (66 total, 21 thin omitted)

### Community 0 - "Confirmed Acquisition Model"
Cohesion: 0.09
Nodes (43): 20-File NDA Preview Cap, Required Analytics Events, Lead Attribution Fields, Proof Claims Policy, Conversion Hierarchy, Gradvera Confirmed Acquisition Model, Paid-Acquisition Economic Ceiling (15–20%), English-First Sales Language (+35 more)

### Community 1 - "Astro Config & Redirects"
Cohesion: 0.09
Nodes (28): LEGACY_SLUG_PATHS, redirects, Lead Integration (doc), SEO Growth Implementation Plan (doc), Footer guide links (footer.explore.estGuide/bidGuide), guide.bid.* content brief (construction bid estimate), guide.est.* content brief (construction cost estimation), GuideArticle.astro component (planned) (+20 more)

### Community 2 - "Stack & CI Gates"
Cohesion: 0.08
Nodes (32): Astro 5 (static output framework), `astro check` verification gate, CI "astro check" job (type-safety gate), astro.config.mjs (hreflang x-default + per-page priority), @astrojs/sitemap integration, @astrojs/vercel integration, Branch flow (feat/fix/docs/ci/chore -> PR -> CI green -> merge), .github/workflows/ci.yml (+24 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.06
Nodes (30): astro, @astrojs/check, @astrojs/sitemap, @astrojs/vercel, dependencies, astro, @astrojs/sitemap, @astrojs/vercel (+22 more)

### Community 4 - "Project Docs & Principles"
Cohesion: 0.07
Nodes (31): Principle 4: Trilingual parity (EN/SL/HR), Analytics.astro component, /api/lead lead-capture endpoint, Astro 5 framework, Claude Design project (design origin), Google Consent Mode v2, CookieConsent banner, DemoForm.astro demo/contact form (+23 more)

### Community 5 - "Layout & Lead Capture Concepts"
Cohesion: 0.08
Nodes (25): BaseLayout.astro (wraps every route), company_website honeypot field (silently drops bots), Decoupled queue (cross-repo lead concept, lives in gtm-toolkit), DemoForm.astro (src/components/forms/DemoForm), Dynamics 365 (lead destination), .env.example (lead-capture env vars), graph.html (standalone interactive viewer), graph.json (nodes/edges of the repo graph) (+17 more)

### Community 6 - "Guide Pages & i18n Helpers"
Cohesion: 0.13
Nodes (18): absoluteUrl(), alternates(), guideArticleLd(), localizePath(), breadcrumbLd, faqLd, t, breadcrumbLd (+10 more)

### Community 7 - "Homepage Sections"
Cohesion: 0.12
Nodes (9): t, t, t, DEFAULT_LOCALE, DICTS, getLocaleFromPath(), isLocale(), LOCALES (+1 more)

### Community 8 - "Claims Policy E2E Spec"
Cohesion: 0.12
Nodes (12): DEMO_PAGES, GUARANTEE_PHRASES, GUIDE_PAGES, HOME, PRODUCT_LINE, PAGES, gotoClean(), VIEWPORTS (+4 more)

### Community 9 - "Site Interactions (site.js)"
Cohesion: 0.18
Nodes (16): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+8 more)

### Community 10 - "Workstream A Plan"
Cohesion: 0.21
Nodes (18): Workstream A Claims Sweep Implementation Plan, Global Constraints (Workstream A Plan), Parts-Sync Helper, Task 0 — Branch, Baseline, Parts-Sync Helper, Task 1 — Remove 'Measured in Practice' Results Section, Task 2 — Disclose Gradvera ↔ DIGITAL SOLUTIONS Relationship, Task 3 — Soften Guarantee Verbs, Task 4 — Pin Excel BoQ Input in Guides (+10 more)

### Community 11 - "SEO Component & Structured Data"
Cohesion: 0.11
Nodes (16): alts, canonical, ogAltLocales, ogImage, organizationLd, string, structuredData, t (+8 more)

### Community 12 - "Design System Rules"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 13 - "GA4 / GTM Lead Tracking"
Cohesion: 0.19
Nodes (14): Consent Mode v2 Cookieless Pings, CE — generate_lead Trigger, window.dataLayer Push on Lead Success, Data Layer Variables (DLV - locale/form_id/page), GA4 (Google Analytics 4), GA4 DebugView, GA4 Event Tag, GA4 Key Event Marking (+6 more)

### Community 14 - "gtm-toolkit Lead Integration"
Cohesion: 0.18
Nodes (11): D365 write path (scheduled consumer, idempotent), `forwarded` soft flag, GTM_LEAD_SECRET env var, gtm-toolkit inbound-lead webhook receiver (POST /website/lead), HMAC-SHA256 lead signature (x-gradvera-signature), Honeypot field (company_website), Lead payload validation, GET() (+3 more)

### Community 15 - "Demo Form & Book-a-Demo Pages"
Cohesion: 0.18
Nodes (6): breadcrumbLd, t, breadcrumbLd, t, breadcrumbLd, t

### Community 16 - "Privacy Policy Pages"
Cohesion: 0.21
Nodes (8): Locale, ../../layouts/BaseLayout.astro, t, t, breadcrumbLd, faqLd, t, t

### Community 17 - "Brand & OG Assets"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 18 - "Social Listening Research"
Cohesion: 0.47
Nodes (10): Marked-for-Brainstorm Session (superpowers:brainstorming), Buying Triggers & Audience (Small Subs vs ENR Heavy-Civil), Competitor Mentions, Social Listening — SEO & Sales-Strategy Brainstorm Input, ENR Top-50 Heavy-Civil Contractors Software Usage, Exact Phrases → Keyword Candidates, Pains & Objections Extraction, r/estimators: What Construction Estimating Software Do You Use? (+2 more)

### Community 19 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 20 - "i18n Utils & 404"
Cohesion: 0.25
Nodes (7): isEmpty(), useTranslations(), l10n, strings(), t, jsonLd, t

### Community 21 - "Design Context Files"
Cohesion: 0.29
Nodes (7): DESIGN.md (visual system, "The Lit Blueprint"), 5 design principles (restraint, show-the-work, credibility=conversion, trilingual parity, speed), .impeccable/design.json sidecar, /impeccable skill, "The Lit Blueprint" north star (blueprint-navy + burnished-amber #E8901C, IBM Plex Sans/Mono), PRODUCT.md (register, users, purpose, brand personality, design principles), WCAG 2.1 AA target

### Community 22 - "Favicons & App Icons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 24 - "OG Image Renderer"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 25 - "i18n Parity E2E Spec"
Cohesion: 0.33
Nodes (4): LOCAL_PROOF, LOCALIZED_COMPONENTS, ROOT, SENTINELS

### Community 26 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 27 - "Design Sync Tooling"
Cohesion: 0.50
Nodes (4): /design-login (auth for design scopes), Claude Design project (remote design source of truth), /design-sync skill, DesignSync MCP tool

### Community 28 - "Brand Marks & Tagline"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 29 - "HR Bid Guide Page"
Cohesion: 0.50
Nodes (3): breadcrumbLd, faqLd, t

### Community 30 - "CI Workflow Jobs"
Cohesion: 0.67
Nodes (3): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions)

### Community 31 - "Consts & i18n Layout"
Cohesion: 0.67
Nodes (3): src/consts.ts (brand/company facts, site metadata, analytics ids, nav), src/i18n/ (en.json/sl.json/hr.json + _parts/), src/i18n/utils.ts (translation helpers)

### Community 32 - "Product Purpose & Users"
Cohesion: 0.67
Nodes (3): Principle 3: Credibility is the conversion, Product purpose: convert qualified interest into a booked demo (to D365), Users: construction estimators / quantity surveyors / bid teams

### Community 33 - "Monograms & Favicon"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 34 - "Product Identity & Tagline"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

### Community 35 - "Brand Facts & OG Pipeline"
Cohesion: 0.67
Nodes (3): consts.ts (brand facts, integration ids), Open Graph images / render-og.mjs, SEO.astro component

## Knowledge Gaps
- **197 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+192 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Workstream A — Claims & Terminology Sweep` connect `Workstream A Plan` to `Confirmed Acquisition Model`, `SEO Component & Structured Data`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `Proof Claims Policy` connect `Confirmed Acquisition Model` to `Workstream A Plan`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `Task 1: generate_lead dataLayer push + e2e + doc` connect `Astro Config & Redirects` to `Claims Policy E2E Spec`, `Demo Form & Book-a-Demo Pages`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _197 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Confirmed Acquisition Model` be split into smaller, more focused modules?**
  _Cohesion score 0.08859357696567 - nodes in this community are weakly interconnected._
- **Should `Astro Config & Redirects` be split into smaller, more focused modules?**
  _Cohesion score 0.08669354838709678 - nodes in this community are weakly interconnected._
- **Should `Stack & CI Gates` be split into smaller, more focused modules?**
  _Cohesion score 0.07661290322580645 - nodes in this community are weakly interconnected._