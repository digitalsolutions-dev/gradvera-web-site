# Graph Report - .  (2026-08-13)

## Corpus Check
- 21 files · ~69,032 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 478 nodes · 607 edges · 70 communities (48 shown, 22 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Homepage Sections & Layout
- Project Architecture & Integrations
- Build, CI & Deploy Pipeline
- Package Dependencies
- SEO Slugs, Redirects & Guide Content
- Lead Capture & Graphify Outputs
- site.js Interactions & Animation
- Design System (Lit Blueprint)
- Guide Pages & Article Schema
- GA4/GTM Lead Conversion Tracking
- E2E Test Suite
- Lead API Endpoint & HMAC Forwarding
- Demo/Booking Pages & Form
- SEO Head & Structured Data
- OG Images & Localized Taglines
- TypeScript Config
- Homepage Routes & i18n Routing
- Privacy Policy Pages
- i18n Helpers & Entry Pages
- Design Docs & Principles
- Favicons & Brand Icons
- OG Image Renderer
- i18n Parity Tests
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 51
- Community 52
- Community 53
- Community 58
- Community 59
- Community 60
- Community 61
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68

## God Nodes (most connected - your core abstractions)
1. `useTranslations()` - 21 edges
2. `localizePath()` - 17 edges
3. `Locale` - 15 edges
4. `absoluteUrl()` - 15 edges
5. `../../layouts/BaseLayout.astro` - 12 edges
6. `guideArticleLd()` - 10 edges
7. `mk()` - 9 edges
8. `Gradvera marketing website` - 9 edges
9. `scripts` - 9 edges
10. `Astro 5 (static output framework)` - 9 edges

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
- **CI verification pipeline: astro check + Playwright e2e gates** — claude_ci_yml, claude_astro_check_job, claude_e2e_job, claude_npm_run_check, claude_npm_run_test_e2e, claude_playwright_harness [EXTRACTED 1.00]
- **Lead capture pipeline: form -> HMAC-signed forward -> gtm-toolkit -> Dynamics 365** — claude_pages_api_lead_ts, claude_demoform_astro, claude_gtm_lead_endpoint, claude_hmac_sha256, claude_gtm_toolkit, claude_dynamics_365 [EXTRACTED 1.00]
- **Design context docs consumed by /impeccable** — claude_product_md, claude_design_md, claude_impeccable_design_json, claude_impeccable_skill, claude_five_design_principles [EXTRACTED 1.00]
- **Lead Submission -> GA4 Event Pipeline** — docs_lead_tracking_ga4_datalayerpush, docs_lead_tracking_ga4_generateleadevent, docs_lead_tracking_ga4_customeventtrigger, docs_lead_tracking_ga4_ga4eventtag, docs_lead_tracking_ga4_ga4 [INFERRED 0.85]
- **End-to-end lead capture pipeline (browser -> website -> gtm-toolkit -> D365)** — src_components_forms_demoform, src_pages_api_lead_post, docs_lead_integration_hmac_signature, docs_lead_integration_gtm_toolkit_receiver, docs_lead_integration_d365_write_path [EXTRACTED 1.00]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]

## Communities (70 total, 22 thin omitted)

### Community 0 - "Homepage Sections & Layout"
Cohesion: 0.07
Nodes (19): string, t, t, m1sFrom, m1sTo, { pct }, t, COMPANY (+11 more)

### Community 1 - "Project Architecture & Integrations"
Cohesion: 0.06
Nodes (35): Principle 4: Trilingual parity (EN/SL/HR), Analytics.astro component, /api/lead lead-capture endpoint, Astro 5 framework, Claude Design project (design origin), Google Consent Mode v2, CookieConsent banner, DemoForm.astro demo/contact form (+27 more)

### Community 2 - "Build, CI & Deploy Pipeline"
Cohesion: 0.08
Nodes (32): Astro 5 (static output framework), `astro check` verification gate, CI "astro check" job (type-safety gate), astro.config.mjs (hreflang x-default + per-page priority), @astrojs/sitemap integration, @astrojs/vercel integration, Branch flow (feat/fix/docs/ci/chore -> PR -> CI green -> merge), .github/workflows/ci.yml (+24 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.06
Nodes (30): astro, @astrojs/check, @astrojs/sitemap, @astrojs/vercel, dependencies, astro, @astrojs/sitemap, @astrojs/vercel (+22 more)

### Community 4 - "SEO Slugs, Redirects & Guide Content"
Cohesion: 0.09
Nodes (26): LEGACY_SLUG_PATHS, redirects, Lead Integration (doc), SEO Growth Implementation Plan (doc), Footer guide links (footer.explore.estGuide/bidGuide), guide.bid.* content brief (construction bid estimate), guide.est.* content brief (construction cost estimation), GuideArticle.astro component (planned) (+18 more)

### Community 5 - "Lead Capture & Graphify Outputs"
Cohesion: 0.08
Nodes (25): BaseLayout.astro (wraps every route), company_website honeypot field (silently drops bots), Decoupled queue (cross-repo lead concept, lives in gtm-toolkit), DemoForm.astro (src/components/forms/DemoForm), Dynamics 365 (lead destination), .env.example (lead-capture env vars), graph.html (standalone interactive viewer), graph.json (nodes/edges of the repo graph) (+17 more)

### Community 6 - "site.js Interactions & Animation"
Cohesion: 0.18
Nodes (16): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+8 more)

### Community 7 - "Design System (Lit Blueprint)"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 8 - "Guide Pages & Article Schema"
Cohesion: 0.18
Nodes (11): absoluteUrl(), guideArticleLd(), breadcrumbLd, faqLd, t, breadcrumbLd, faqLd, t (+3 more)

### Community 9 - "GA4/GTM Lead Conversion Tracking"
Cohesion: 0.19
Nodes (14): Consent Mode v2 Cookieless Pings, CE — generate_lead Trigger, window.dataLayer Push on Lead Success, Data Layer Variables (DLV - locale/form_id/page), GA4 (Google Analytics 4), GA4 DebugView, GA4 Event Tag, GA4 Key Event Marking (+6 more)

### Community 10 - "E2E Test Suite"
Cohesion: 0.23
Nodes (5): PAGES, gotoClean(), VIEWPORTS, ENDONYMS, PAGES

### Community 11 - "Lead API Endpoint & HMAC Forwarding"
Cohesion: 0.18
Nodes (11): D365 write path (scheduled consumer, idempotent), `forwarded` soft flag, GTM_LEAD_SECRET env var, gtm-toolkit inbound-lead webhook receiver (POST /website/lead), HMAC-SHA256 lead signature (x-gradvera-signature), Honeypot field (company_website), Lead payload validation, GET() (+3 more)

### Community 12 - "Demo/Booking Pages & Form"
Cohesion: 0.18
Nodes (6): breadcrumbLd, t, breadcrumbLd, t, breadcrumbLd, t

### Community 13 - "SEO Head & Structured Data"
Cohesion: 0.18
Nodes (10): alts, canonical, ogAltLocales, ogImage, organizationLd, string, structuredData, t (+2 more)

### Community 14 - "OG Images & Localized Taglines"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 16 - "Homepage Routes & i18n Routing"
Cohesion: 0.25
Nodes (7): ../../components/pages/HomeSections.astro, alternates(), localizePath(), jsonLd, t, jsonLd, t

### Community 17 - "Privacy Policy Pages"
Cohesion: 0.31
Nodes (5): Locale, ../../layouts/BaseLayout.astro, t, t, t

### Community 18 - "i18n Helpers & Entry Pages"
Cohesion: 0.25
Nodes (7): isEmpty(), useTranslations(), l10n, strings(), t, jsonLd, t

### Community 19 - "Design Docs & Principles"
Cohesion: 0.29
Nodes (7): DESIGN.md (visual system, "The Lit Blueprint"), 5 design principles (restraint, show-the-work, credibility=conversion, trilingual parity, speed), .impeccable/design.json sidecar, /impeccable skill, "The Lit Blueprint" north star (blueprint-navy + burnished-amber #E8901C, IBM Plex Sans/Mono), PRODUCT.md (register, users, purpose, brand personality, design principles), WCAG 2.1 AA target

### Community 20 - "Favicons & Brand Icons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 21 - "OG Image Renderer"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 22 - "i18n Parity Tests"
Cohesion: 0.33
Nodes (4): LOCAL_PROOF, LOCALIZED_COMPONENTS, ROOT, SENTINELS

### Community 23 - "Community 23"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (4): /design-login (auth for design scopes), Claude Design project (remote design source of truth), /design-sync skill, DesignSync MCP tool

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 26 - "Community 26"
Cohesion: 0.50
Nodes (3): breadcrumbLd, faqLd, t

### Community 27 - "Community 27"
Cohesion: 0.50
Nodes (3): breadcrumbLd, faqLd, t

### Community 28 - "Community 28"
Cohesion: 0.50
Nodes (3): breadcrumbLd, faqLd, t

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (4): e2e CI Job, playwright.config.mjs, Playwright Browser Harness, serve-dist.mjs

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (3): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions)

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (3): src/consts.ts (brand/company facts, site metadata, analytics ids, nav), src/i18n/ (en.json/sl.json/hr.json + _parts/), src/i18n/utils.ts (translation helpers)

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (3): Principle 3: Credibility is the conversion, Product purpose: convert qualified interest into a booked demo (to D365), Users: construction estimators / quantity surveyors / bid teams

### Community 33 - "Community 33"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 34 - "Community 34"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

### Community 35 - "Community 35"
Cohesion: 0.67
Nodes (3): consts.ts (brand facts, integration ids), Open Graph images / render-og.mjs, SEO.astro component

## Knowledge Gaps
- **196 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Task 1: generate_lead dataLayer push + e2e + doc` connect `SEO Slugs, Redirects & Guide Content` to `E2E Test Suite`, `Demo/Booking Pages & Form`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `POST()` connect `Lead API Endpoint & HMAC Forwarding` to `Demo/Booking Pages & Form`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `localizePath()` connect `Homepage Routes & i18n Routing` to `Homepage Sections & Layout`, `SEO Slugs, Redirects & Guide Content`, `Guide Pages & Article Schema`, `Demo/Booking Pages & Form`, `SEO Head & Structured Data`, `i18n Helpers & Entry Pages`, `Community 26`, `Community 27`, `Community 28`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Homepage Sections & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Project Architecture & Integrations` be split into smaller, more focused modules?**
  _Cohesion score 0.06386554621848739 - nodes in this community are weakly interconnected._
- **Should `Build, CI & Deploy Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.07661290322580645 - nodes in this community are weakly interconnected._