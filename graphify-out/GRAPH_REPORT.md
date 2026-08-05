# Graph Report - /Users/katarov/WebstormProjects/WEB APPs/gradvera-web-site/.claude/worktrees/seo-growth  (2026-08-05)

## Corpus Check
- 8 files · ~56,459 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 354 nodes · 420 edges · 54 communities (37 shown, 17 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.88)
- Token cost: 111,471 input · 0 output

## Community Hubs (Navigation)
- Layout Components & Language Dropdown
- Sections, Forms & i18n Copy
- Brand & Analytics Conventions
- Package Dependencies
- Brand & Analytics Conventions
- site.js Interactions
- Lit Blueprint Design System
- SEO Component & JSON-LD
- OG Branding (HR) & Taglines
- Lead Integration Doc
- TypeScript Config
- Favicons
- OG Render Script
- Lead API Endpoint
- E2E Helpers & MobileNav Spec
- i18n Parity E2E Spec
- E2E Static Server
- OG Card (EN)
- CI Workflow
- Graph Bridges
- Monogram Assets
- OG Card Concepts
- README: SEO & OG
- Header Responsive E2E Spec
- Playwright Config
- SEO E2E Spec
- Astro Config
- Design Elevation Rules
- CTA Section 1
- CTA Section 2
- robots.txt
- Lang Picker E2E Spec
- Font: Sans 400
- Brand Register
- Analytics Component
- CookieConsent Component
- HelpsIntro Section
- Cap Screens CSS
- Design Tokens CSS
- Site CSS
- Site Polish CSS
- Homepage E2E Spec

## God Nodes (most connected - your core abstractions)
1. `Gradvera marketing website` - 12 edges
2. `useTranslations()` - 12 edges
3. `scripts` - 9 edges
4. `mk()` - 9 edges
5. `Locale` - 9 edges
6. `POST()` - 8 edges
7. `buildHero()` - 8 edges
8. `/api/lead lead-capture endpoint` - 8 edges
9. `localizePath()` - 8 edges
10. `The Lit Blueprint (Creative North Star)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --implements--> ``forwarded` soft flag`  [EXTRACTED]
  src/pages/api/lead.ts → docs/lead-integration.md
- `POST()` --references--> `GTM_LEAD_ENDPOINT env var`  [EXTRACTED]
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
- **End-to-end lead capture pipeline (browser -> website -> gtm-toolkit -> D365)** — src_components_forms_demoform, src_pages_api_lead_post, docs_lead_integration_hmac_signature, docs_lead_integration_gtm_toolkit_receiver, docs_lead_integration_d365_write_path [EXTRACTED 1.00]
- **generate_lead dataLayer push -> GTM -> GA4, gated by Consent Mode v2** — src_components_forms_demoform, docs_lead_tracking_ga4_generate_lead_event, docs_lead_tracking_ga4_gtm_container_setup, docs_lead_tracking_ga4_consent_mode_v2 [EXTRACTED 1.00]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]

## Communities (54 total, 17 thin omitted)

### Community 0 - "Layout Components & Language Dropdown"
Cohesion: 0.06
Nodes (37): t, alts, canonical, ogAltLocales, ogImage, organizationLd, string, structuredData (+29 more)

### Community 1 - "Sections, Forms & i18n Copy"
Cohesion: 0.08
Nodes (30): Design Source of Truth (Claude Design + design-sync), Trilingual i18n Routing, The Lit Blueprint Design System, Principle 4: Trilingual parity (EN/SL/HR), Analytics.astro component, Astro 5 framework, Claude Design project (design origin), Google Consent Mode v2 (+22 more)

### Community 2 - "Brand & Analytics Conventions"
Cohesion: 0.08
Nodes (24): dependencies, astro, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, @fontsource/ibm-plex-sans, description, devDependencies (+16 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.13
Nodes (20): SEO Growth Implementation Plan (doc), Footer guide links (footer.explore.estGuide/bidGuide), guide.bid.* content brief (construction bid estimate), guide.est.* content brief (construction cost estimation), GuideArticle.astro component (planned), HR 'stavke/stavaka' native-speaker open item, 308 redirects for legacy canonical-slug SL/HR URLs, localizePath/stripLocale slug-aware rework (src/i18n/utils.ts) (+12 more)

### Community 4 - "Brand & Analytics Conventions"
Cohesion: 0.18
Nodes (16): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+8 more)

### Community 5 - "site.js Interactions"
Cohesion: 0.15
Nodes (9): Lead Integration (doc), Lead conversion tracking (GA4 via GTM) (doc), Consent Mode v2 gating, generate_lead dataLayer event, GTM container setup (trigger/tag/key event), Task 1: generate_lead dataLayer push + e2e + doc, gotoClean(), VIEWPORTS (+1 more)

### Community 6 - "Lit Blueprint Design System"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 7 - "SEO Component & JSON-LD"
Cohesion: 0.16
Nodes (12): D365 write path (scheduled consumer, idempotent), `forwarded` soft flag, GTM_LEAD_ENDPOINT env var, GTM_LEAD_SECRET env var, gtm-toolkit inbound-lead webhook receiver (POST /website/lead), HMAC-SHA256 lead signature (x-gradvera-signature), Honeypot field (company_website), Lead payload validation (+4 more)

### Community 8 - "OG Branding (HR) & Taglines"
Cohesion: 0.18
Nodes (13): Analytics & Consent (GTM + Consent Mode), astro check Verification Gate, Astro 5 Static Stack, CI & Deploy Flow (Vercel + ci.yml), Lead Capture (/api/lead), Playwright E2E Harness, Principle 3: Credibility is the conversion, Product purpose: convert qualified interest into a booked demo (to D365) (+5 more)

### Community 9 - "Lead Integration Doc"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 11 - "Favicons"
Cohesion: 0.29
Nodes (8): /api/lead lead-capture endpoint, DemoForm.astro demo/contact form, Environment variables, gtm-toolkit inbound-lead receiver, HMAC-SHA256 lead signing, company_website honeypot, docs/lead-integration.md, robots.txt (generated)

### Community 12 - "OG Render Script"
Cohesion: 0.29
Nodes (6): ../../components/pages/HomeSections.astro, ../../layouts/BaseLayout.astro, jsonLd, t, jsonLd, t

### Community 13 - "Lead API Endpoint"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 15 - "i18n Parity E2E Spec"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 16 - "E2E Static Server"
Cohesion: 0.33
Nodes (4): LOCAL_PROOF, LOCALIZED_COMPONENTS, ROOT, SENTINELS

### Community 17 - "OG Card (EN)"
Cohesion: 0.40
Nodes (4): m1sFrom, m1sTo, { pct }, t

### Community 18 - "CI Workflow"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 19 - "Graph Bridges"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 20 - "Monogram Assets"
Cohesion: 0.50
Nodes (4): ../../consts, COMPANY, NAV_ITEMS, SITE

### Community 21 - "OG Card Concepts"
Cohesion: 0.67
Nodes (3): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions)

### Community 22 - "README: SEO & OG"
Cohesion: 1.00
Nodes (3): BaseLayout.astro (graph bridge), Knowledge Graph (graphify-out), SEO.astro (JSON-LD bridge)

### Community 23 - "Header Responsive E2E Spec"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 24 - "Playwright Config"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

### Community 25 - "SEO E2E Spec"
Cohesion: 0.67
Nodes (3): consts.ts (brand facts, integration ids), Open Graph images / render-og.mjs, SEO.astro component

## Knowledge Gaps
- **131 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+126 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Task 1: generate_lead dataLayer push + e2e + doc` connect `site.js Interactions` to `Package Dependencies`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `POST()` connect `SEO Component & JSON-LD` to `site.js Interactions`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` connect `Package Dependencies` to `Layout Components & Language Dropdown`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Gradvera marketing website` (e.g. with `Static-first / prerender rationale` and `www -> apex permanent redirect (307->308)`) actually correct?**
  _`Gradvera marketing website` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _131 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Layout Components & Language Dropdown` be split into smaller, more focused modules?**
  _Cohesion score 0.05576441102756892 - nodes in this community are weakly interconnected._
- **Should `Sections, Forms & i18n Copy` be split into smaller, more focused modules?**
  _Cohesion score 0.07816091954022988 - nodes in this community are weakly interconnected._