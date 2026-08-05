# Graph Report - .  (2026-08-05)

## Corpus Check
- 103 files · ~68,174 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 474 nodes · 584 edges · 64 communities (42 shown, 22 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Cta1.astro Component
- Cta2.astro Component
- Marketing Pages, i18n Utils & Guide Routes
- E2E Test Helpers & Specs
- Playwright Config
- tsconfig.json Compiler Options
- CI Workflow Jobs
- Monogram & Favicon Concept Assets
- Favicon & App-Icon Assets
- OG Card SVG Brand Concepts
- Lead API Route & Integration Doc
- Design System & Brand Principles
- Design Glow & Elevation Rules
- PRODUCT.md Brand Register
- PRODUCT.md Purpose & Users
- README.md Project Overview
- PRODUCT.md Speed Principle
- site.js Hero Scroll Animations
- render-og.mjs Script Internals
- SEO Component & Site Constants
- gradvera-tokens.css Stylesheet
- site.css Stylesheet
- cap1-screens.css Stylesheet
- cap-screens.css Stylesheet
- site-polish.css Stylesheet
- CookieConsent.astro Component
- Analytics.astro Component
- SEO E2E Spec
- serve-dist.mjs Test Server
- E2E README Harness Docs
- Default OG Image (EN) Assets
- OG Images (SL/HR) & Brand Identity
- HR/SL Homepage Routes
- i18n-Parity E2E Spec
- README.md Assets & SEO Refs
- Header, Nav & Results Section
- Header-Responsive E2E Spec
- Redirects, Slugs & SEO-Growth Plan
- package.json Scripts & Dependencies
- patch-vercel-redirects.mjs Script
- GA4 Lead-Tracking Doc
- Localized-Slugs E2E Spec
- CLAUDE.md Stack, Commands & CI/Deploy
- CLAUDE.md Lead Capture & Graphify
- CLAUDE.md Components Refs
- CLAUDE.md Layout Components Ref
- CLAUDE.md Layout Section Refs
- CLAUDE.md Public Assets Ref
- CLAUDE.md OG Assets Refs
- CLAUDE.md Design-Context Section
- CLAUDE.md Design-Sync Section
- CLAUDE.md .idea Note

## God Nodes (most connected - your core abstractions)
1. `useTranslations()` - 18 edges
2. `Locale` - 15 edges
3. `localizePath()` - 14 edges
4. `../../layouts/BaseLayout.astro` - 12 edges
5. `absoluteUrl()` - 12 edges
6. `mk()` - 9 edges
7. `Gradvera marketing website` - 9 edges
8. `scripts` - 9 edges
9. `Astro 5 (static output framework)` - 9 edges
10. `buildHero()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --implements--> ``forwarded` soft flag`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `POST()` --implements--> `Honeypot field (company_website)`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `POST()` --implements--> `Lead payload validation`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `The Lit Blueprint (Creative North Star)` --semantically_similar_to--> `Brand personality: calm / precise / anti-hype`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md
- `The Sentence-Case Rule` --semantically_similar_to--> `Brand personality: calm / precise / anti-hype`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI verification pipeline: astro check + Playwright e2e gates** — claude_ci_yml, claude_astro_check_job, claude_e2e_job, claude_npm_run_check, claude_npm_run_test_e2e, claude_playwright_harness [EXTRACTED 1.00]
- **Lead capture pipeline: form -> HMAC-signed forward -> gtm-toolkit -> Dynamics 365** — claude_pages_api_lead_ts, claude_demoform_astro, claude_gtm_lead_endpoint, claude_hmac_sha256, claude_gtm_toolkit, claude_dynamics_365 [EXTRACTED 1.00]
- **Design context docs consumed by /impeccable** — claude_product_md, claude_design_md, claude_impeccable_design_json, claude_impeccable_skill, claude_five_design_principles [EXTRACTED 1.00]
- **Lead Submission -> GA4 Event Pipeline** — docs_lead_tracking_ga4_datalayerpush, docs_lead_tracking_ga4_generateleadevent, docs_lead_tracking_ga4_customeventtrigger, docs_lead_tracking_ga4_ga4eventtag, docs_lead_tracking_ga4_ga4 [INFERRED 0.85]
- **End-to-end lead capture pipeline (browser -> website -> gtm-toolkit -> D365)** — src_components_forms_demoform, src_pages_api_lead_post, docs_lead_integration_hmac_signature, docs_lead_integration_gtm_toolkit_receiver, docs_lead_integration_d365_write_path [EXTRACTED 1.00]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]

## Communities (64 total, 22 thin omitted)

### Community 0 - "Marketing Pages, i18n Utils & Guide Routes"
Cohesion: 0.05
Nodes (46): t, breadcrumbLd, t, jsonLd, t, t, t, strings() (+38 more)

### Community 10 - "E2E Test Helpers & Specs"
Cohesion: 0.23
Nodes (5): VIEWPORTS, gotoClean(), ENDONYMS, PAGES, PAGES

### Community 14 - "tsconfig.json Compiler Options"
Cohesion: 0.20
Nodes (9): extends, include, exclude, compilerOptions, resolveJsonModule, allowJs, baseUrl, paths (+1 more)

### Community 24 - "CI Workflow Jobs"
Cohesion: 0.67
Nodes (3): CI Workflow (GitHub Actions), astro check job, e2e (Playwright) job

### Community 27 - "Monogram & Favicon Concept Assets"
Cohesion: 1.00
Nodes (3): Gradvera monogram (plain, transparent), Gradvera monogram (on dark tile), Gradvera favicon

### Community 16 - "Favicon & App-Icon Assets"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48

### Community 28 - "OG Card SVG Brand Concepts"
Cohesion: 1.00
Nodes (3): Gradvera OG social-share card (SVG source), Construction estimating software (Gradvera product tagline), Gradvera brand / product identity

### Community 11 - "Lead API Route & Integration Doc"
Cohesion: 0.18
Nodes (11): Lead, json(), POST(), GET(), Honeypot field (company_website), Lead payload validation, HMAC-SHA256 lead signature (x-gradvera-signature), GTM_LEAD_SECRET env var (+3 more)

### Community 7 - "Design System & Brand Principles"
Cohesion: 0.17
Nodes (16): The Lit Blueprint (Creative North Star), Burnished Amber accent (#E8901C), Blueprint Navy (#1E3A8A) link/info accent, The One Light Rule, The Amber-Never-As-Body-Text Rule, The Sentence-Case Rule, The Mono-Is-Annotation Rule, IBM Plex Sans/Mono typography system (+8 more)

### Community 26 - "PRODUCT.md Purpose & Users"
Cohesion: 0.67
Nodes (3): Users: construction estimators / quantity surveyors / bid teams, Product purpose: convert qualified interest into a booked demo (to D365), Principle 3: Credibility is the conversion

### Community 1 - "README.md Project Overview"
Cohesion: 0.06
Nodes (35): Principle 4: Trilingual parity (EN/SL/HR), helpers.mjs, mobile-nav.spec.mjs, homepage.spec.mjs, seo.spec.mjs, Gradvera marketing website, Astro 5 framework, TypeScript (astro/tsconfigs/strict) (+27 more)

### Community 6 - "site.js Hero Scroll Animations"
Cohesion: 0.18
Nodes (16): delayFor(), mk(), stroke(), line(), path(), node(), text(), cross() (+8 more)

### Community 18 - "render-og.mjs Script Internals"
Cohesion: 0.33
Nodes (4): ROOT, OG_DIR, FONT_PKG, svgs

### Community 8 - "SEO Component & Site Constants"
Cohesion: 0.13
Nodes (14): t, string, canonical, ogImage, alts, ogAltLocales, organizationLd, webSiteLd (+6 more)

### Community 20 - "serve-dist.mjs Test Server"
Cohesion: 0.40
Nodes (3): ROOT, PORT, TYPES

### Community 23 - "E2E README Harness Docs"
Cohesion: 0.50
Nodes (4): Playwright Browser Harness, playwright.config.mjs, serve-dist.mjs, e2e CI Job

### Community 22 - "Default OG Image (EN) Assets"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Gradvera Wordmark, Construction Estimating Software Tagline

### Community 13 - "OG Images (SL/HR) & Brand Identity"
Cohesion: 0.22
Nodes (10): Gradvera OG Image (Slovenian), Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Croatian Tagline — Softver za izradu građevinskih troškovnika, Open Graph Social-Share Preview (HR locale), Gradvera OG Image (SL) — SVG Source (+2 more)

### Community 17 - "HR/SL Homepage Routes"
Cohesion: 0.29
Nodes (5): t, jsonLd, ../../components/pages/HomeSections.astro, t, jsonLd

### Community 19 - "i18n-Parity E2E Spec"
Cohesion: 0.33
Nodes (4): ROOT, LOCALIZED_COMPONENTS, SENTINELS, LOCAL_PROOF

### Community 29 - "README.md Assets & SEO Refs"
Cohesion: 0.67
Nodes (3): Open Graph images / render-og.mjs, consts.ts (brand facts, integration ids), SEO.astro component

### Community 12 - "Header, Nav & Results Section"
Cohesion: 0.15
Nodes (6): t, string, t, { pct }, m1sFrom, m1sTo

### Community 4 - "Redirects, Slugs & SEO-Growth Plan"
Cohesion: 0.09
Nodes (26): Lead Integration (doc), SEO Growth Implementation Plan (doc), PR1: feat/lead-event-ga4, PR2: feat/localized-slugs, PR3: feat/content-pages, Task 1: generate_lead dataLayer push + e2e + doc, Task 2: Slug map + localized routing helpers, Task 3: Sitemap + redirects + trailing-slash patch script (+18 more)

### Community 3 - "package.json Scripts & Dependencies"
Cohesion: 0.06
Nodes (30): name, type, version, private, description, scripts, dev, start (+22 more)

### Community 9 - "GA4 Lead-Tracking Doc"
Cohesion: 0.19
Nodes (14): Lead Conversion Tracking (GA4 via GTM), GA4 (Google Analytics 4), window.dataLayer Push on Lead Success, generate_lead Event, Honeypot/Validation Paths Never Fire Push, PUBLIC_GTM_ID Env Var, GTM Container Setup (one-time), CE — generate_lead Trigger (+6 more)

### Community 2 - "CLAUDE.md Stack, Commands & CI/Deploy"
Cohesion: 0.08
Nodes (32): Gradvera (marketing website / product), DIGITAL SOLUTIONS d.o.o. (company behind Gradvera), gradvera.com (production domain), Astro 5 (static output framework), @astrojs/vercel integration, TypeScript (astro/tsconfigs/strict, no any), @astrojs/sitemap integration, @fontsource/ibm-plex-sans + -mono fonts (+24 more)

### Community 5 - "CLAUDE.md Lead Capture & Graphify"
Cohesion: 0.08
Nodes (25): src/pages/api/lead.ts (POST /api/lead, only on-demand route), src/pages/ (routes, Astro i18n), Astro i18n routing (prefixDefaultLocale: false; EN/SL/HR), src/i18n/slugs.ts (localized SL/HR slugs), DemoForm.astro (src/components/forms/DemoForm), SEO.astro (src/components/seo/SEO; sole owner of JSON-LD/structured-data), src/styles/ cascade (gradvera-tokens -> site -> cap1-screens -> cap-screens -> site-polish), BaseLayout.astro (wraps every route) (+17 more)

### Community 25 - "CLAUDE.md Layout Section Refs"
Cohesion: 0.67
Nodes (3): src/i18n/ (en.json/sl.json/hr.json + _parts/), src/i18n/utils.ts (translation helpers), src/consts.ts (brand/company facts, site metadata, analytics ids, nav)

### Community 15 - "CLAUDE.md Design-Context Section"
Cohesion: 0.29
Nodes (7): PRODUCT.md (register, users, purpose, brand personality, design principles), DESIGN.md (visual system, "The Lit Blueprint"), .impeccable/design.json sidecar, /impeccable skill, 5 design principles (restraint, show-the-work, credibility=conversion, trilingual parity, speed), WCAG 2.1 AA target, "The Lit Blueprint" north star (blueprint-navy + burnished-amber #E8901C, IBM Plex Sans/Mono)

### Community 21 - "CLAUDE.md Design-Sync Section"
Cohesion: 0.50
Nodes (4): Claude Design project (remote design source of truth), /design-sync skill, DesignSync MCP tool, /design-login (auth for design scopes)

## Knowledge Gaps
- **196 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Task 1: generate_lead dataLayer push + e2e + doc` connect `Redirects, Slugs & SEO-Growth Plan` to `Marketing Pages, i18n Utils & Guide Routes`, `E2E Test Helpers & Specs`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `POST()` connect `Lead API Route & Integration Doc` to `Marketing Pages, i18n Utils & Guide Routes`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `localizePath()` connect `Marketing Pages, i18n Utils & Guide Routes` to `SEO Component & Site Constants`, `Redirects, Slugs & SEO-Growth Plan`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Marketing Pages, i18n Utils & Guide Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.051929824561403506 - nodes in this community are weakly interconnected._
- **Should `README.md Project Overview` be split into smaller, more focused modules?**
  _Cohesion score 0.06386554621848739 - nodes in this community are weakly interconnected._
- **Should `SEO Component & Site Constants` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._