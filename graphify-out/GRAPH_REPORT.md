# Graph Report - .  (2026-08-05)

## Corpus Check
- 14 files · ~57,333 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 443 nodes · 532 edges · 63 communities (43 shown, 20 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.87)
- Token cost: 104,956 input · 0 output

## Community Hubs (Navigation)
- Gradvera Site Overview & Core Systems
- Lead Capture, Consent & Design Docs
- SEO Growth Plan & Localized-Slug Redirects
- site.js Interaction Script
- package.json Dependencies & Scripts
- Astro Config & Static Routing Setup
- Book-a-Demo Pages & Localized Routing
- Homepage Sections & i18n Utils
- Knowledge Graph & Cross-Repo Lead Pipeline
- Design System: The Lit Blueprint
- CI/CD Pipeline & Branch Workflow
- SEO.astro Meta & Structured Data
- Playwright E2E Test Helpers & Specs
- Privacy Policy Pages & Localization Helpers
- Lead API Endpoint & D365 Forwarding
- OG Social Images & Brand Taglines
- tsconfig.json Compiler Options
- Locale Homepage Pages (SL/HR)
- Favicon & Brand Mark Assets
- Header, Language Switch & Mobile Nav
- render-og.mjs OG Rasterizer
- i18n Parity Test Spec
- Claude Design Sync Tooling
- Results.astro Section
- serve-dist.mjs Static Server
- Gradvera OG Image Assets (EN)
- Playwright Config & CI Wiring
- CI Workflow Jobs
- Product Purpose & Target Users
- Monogram & Favicon Variants
- Brand Identity & OG Source
- Brand Facts & SEO Assets Link
- patch-vercel-redirects.mjs Script
- Header Responsive Test Spec
- Playwright Config Constants
- SEO Test Spec (Preload/CSS)
- OG Images Directory Link
- Elevation & Glow Design Rules
- Cta1.astro Section
- Cta2.astro Section
- .idea/ Editor State Note
- public/assets/ Directory
- Principle 5: Speed
- Register: Brand (PRODUCT.md)
- Analytics.astro Import Reference
- CookieConsent.astro Import Reference
- cap1-screens.css Import Reference
- cap-screens.css Import Reference
- gradvera-tokens.css Import Reference
- site.css Import Reference
- site-polish.css Import Reference

## God Nodes (most connected - your core abstractions)
1. `useTranslations()` - 12 edges
2. `Gradvera marketing website` - 11 edges
3. `mk()` - 9 edges
4. `scripts` - 9 edges
5. `Locale` - 9 edges
6. `POST()` - 8 edges
7. `buildHero()` - 8 edges
8. `/api/lead lead-capture endpoint` - 8 edges
9. `localizePath()` - 8 edges
10. `The Lit Blueprint (Creative North Star)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --references--> `GTM_LEAD_ENDPOINT Env Var`  [EXTRACTED]
  src/pages/api/lead.ts → CLAUDE.md
- `POST()` --implements--> ``forwarded` soft flag`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `POST()` --implements--> `Honeypot field (company_website)`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `POST()` --implements--> `Lead payload validation`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lead Submission -> GA4 Event Pipeline** — claude_apileadendpoint, claude_demoformastro, docs_lead_tracking_ga4_datalayerpush, docs_lead_tracking_ga4_generateleadevent, docs_lead_tracking_ga4_customeventtrigger, docs_lead_tracking_ga4_ga4eventtag, docs_lead_tracking_ga4_ga4 [INFERRED 0.85]
- **CI Verification Gates (astro check + e2e)** — claude_astrocheckgate, claude_playwrighte2eharness, claude_ciyml, claude_astrocheckcijob, claude_e2ecijob [EXTRACTED 1.00]
- **Design System Documentation Set** — claude_productmd, claude_designmd, claude_impeccabledesignjsonsidecar, claude_designcontextimpeccable [EXTRACTED 1.00]
- **End-to-end lead capture pipeline (browser -> website -> gtm-toolkit -> D365)** — src_components_forms_demoform, src_pages_api_lead_post, docs_lead_integration_hmac_signature, docs_lead_integration_gtm_toolkit_receiver, docs_lead_integration_d365_write_path [EXTRACTED 1.00]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]

## Communities (63 total, 20 thin omitted)

### Community 0 - "Gradvera Site Overview & Core Systems"
Cohesion: 0.06
Nodes (36): DIGITAL SOLUTIONS d.o.o., Principle 4: Trilingual parity (EN/SL/HR), Analytics.astro component, /api/lead lead-capture endpoint, Astro 5 framework, Claude Design project (design origin), Google Consent Mode v2, CookieConsent banner (+28 more)

### Community 1 - "Lead Capture, Consent & Design Docs"
Cohesion: 0.07
Nodes (35): Analytics / Consent, company_website Honeypot, CookieConsent.astro, DemoForm.astro, Design Context (impeccable), DESIGN.md, docs/lead-integration.md, .env.example (+27 more)

### Community 2 - "SEO Growth Plan & Localized-Slug Redirects"
Cohesion: 0.09
Nodes (26): LEGACY_SLUG_PATHS, redirects, Lead Integration (doc), SEO Growth Implementation Plan (doc), Footer guide links (footer.explore.estGuide/bidGuide), guide.bid.* content brief (construction bid estimate), guide.est.* content brief (construction cost estimation), GuideArticle.astro component (planned) (+18 more)

### Community 3 - "site.js Interaction Script"
Cohesion: 0.18
Nodes (16): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+8 more)

### Community 4 - "package.json Dependencies & Scripts"
Cohesion: 0.09
Nodes (21): @astrojs/check, description, devDependencies, @astrojs/check, @playwright/test, typescript, name, private (+13 more)

### Community 5 - "Astro Config & Static Routing Setup"
Cohesion: 0.10
Nodes (21): astro, @astrojs/sitemap, @astrojs/vercel, POST /api/lead (on-demand route), src/pages/api/lead.ts, Astro 5 (output: 'static'), astro.config.mjs, @astrojs/sitemap Integration (+13 more)

### Community 6 - "Book-a-Demo Pages & Localized Routing"
Cohesion: 0.15
Nodes (11): absoluteUrl(), alternates(), localizePath(), breadcrumbLd, t, breadcrumbLd, t, jsonLd (+3 more)

### Community 7 - "Homepage Sections & i18n Utils"
Cohesion: 0.13
Nodes (7): t, DEFAULT_LOCALE, DICTS, getLocaleFromPath(), isLocale(), LOCALES, stripLocale()

### Community 8 - "Knowledge Graph & Cross-Repo Lead Pipeline"
Cohesion: 0.13
Nodes (16): BaseLayout.astro, Decoupled Queue, Dynamics 365, graph.html Viewer, graphify-out/ Directory, /graphify Skill, graph.json, GRAPH_REPORT.md (+8 more)

### Community 9 - "Design System: The Lit Blueprint"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 10 - "CI/CD Pipeline & Branch Workflow"
Cohesion: 0.17
Nodes (15): astro check CI Job, astro check Verification Gate, Branches, CI & Deploy, Branch Flow (feat/fix/docs/ci/chore -> PR -> main), .github/workflows/ci.yml, e2e CI Job, main Branch -> Production, npm Scripts (dev/build/preview/check/test:e2e) (+7 more)

### Community 11 - "SEO.astro Meta & Structured Data"
Cohesion: 0.13
Nodes (14): alts, canonical, ogAltLocales, ogImage, organizationLd, string, structuredData, t (+6 more)

### Community 12 - "Playwright E2E Test Helpers & Specs"
Cohesion: 0.21
Nodes (6): gotoClean(), VIEWPORTS, ENDONYMS, PAGES, PAGES, ROOT

### Community 13 - "Privacy Policy Pages & Localization Helpers"
Cohesion: 0.21
Nodes (9): isEmpty(), Locale, useTranslations(), l10n, strings(), t, t, t (+1 more)

### Community 14 - "Lead API Endpoint & D365 Forwarding"
Cohesion: 0.18
Nodes (11): D365 write path (scheduled consumer, idempotent), `forwarded` soft flag, GTM_LEAD_SECRET env var, gtm-toolkit inbound-lead webhook receiver (POST /website/lead), HMAC-SHA256 lead signature (x-gradvera-signature), Honeypot field (company_website), Lead payload validation, GET() (+3 more)

### Community 15 - "OG Social Images & Brand Taglines"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 16 - "tsconfig.json Compiler Options"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 17 - "Locale Homepage Pages (SL/HR)"
Cohesion: 0.29
Nodes (6): ../../components/pages/HomeSections.astro, ../../layouts/BaseLayout.astro, jsonLd, t, jsonLd, t

### Community 18 - "Favicon & Brand Mark Assets"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 20 - "render-og.mjs OG Rasterizer"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 21 - "i18n Parity Test Spec"
Cohesion: 0.33
Nodes (4): LOCAL_PROOF, LOCALIZED_COMPONENTS, ROOT, SENTINELS

### Community 22 - "Claude Design Sync Tooling"
Cohesion: 0.40
Nodes (5): Claude Design Project URL, /design-login Skill, Design Source of Truth, DesignSync MCP Tool, /design-sync Skill

### Community 23 - "Results.astro Section"
Cohesion: 0.40
Nodes (4): m1sFrom, m1sTo, { pct }, t

### Community 24 - "serve-dist.mjs Static Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 25 - "Gradvera OG Image Assets (EN)"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 26 - "Playwright Config & CI Wiring"
Cohesion: 0.50
Nodes (4): e2e CI Job, playwright.config.mjs, Playwright Browser Harness, serve-dist.mjs

### Community 27 - "CI Workflow Jobs"
Cohesion: 0.67
Nodes (3): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions)

### Community 28 - "Product Purpose & Target Users"
Cohesion: 0.67
Nodes (3): Principle 3: Credibility is the conversion, Product purpose: convert qualified interest into a booked demo (to D365), Users: construction estimators / quantity surveyors / bid teams

### Community 29 - "Monogram & Favicon Variants"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 30 - "Brand Identity & OG Source"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

### Community 31 - "Brand Facts & SEO Assets Link"
Cohesion: 0.67
Nodes (3): consts.ts (brand facts, integration ids), Open Graph images / render-og.mjs, SEO.astro component

## Knowledge Gaps
- **168 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+163 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POST()` connect `Lead API Endpoint & D365 Forwarding` to `Lead Capture, Consent & Design Docs`, `Book-a-Demo Pages & Localized Routing`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Why does `GTM_LEAD_ENDPOINT Env Var` connect `Lead Capture, Consent & Design Docs` to `Lead API Endpoint & D365 Forwarding`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Why does `Lead Capture Flow` connect `Lead Capture, Consent & Design Docs` to `Knowledge Graph & Cross-Repo Lead Pipeline`, `Astro Config & Static Routing Setup`?**
  _High betweenness centrality (0.191) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Gradvera marketing website` (e.g. with `Static-first / prerender rationale` and `www -> apex permanent redirect (307->308)`) actually correct?**
  _`Gradvera marketing website` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _168 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Gradvera Site Overview & Core Systems` be split into smaller, more focused modules?**
  _Cohesion score 0.06190476190476191 - nodes in this community are weakly interconnected._
- **Should `Lead Capture, Consent & Design Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.07226890756302522 - nodes in this community are weakly interconnected._