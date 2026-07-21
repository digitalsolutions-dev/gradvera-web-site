# Graph Report - .  (2026-07-21)

## Corpus Check
- 11 files · ~49,404 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 320 nodes · 366 edges · 52 communities (28 shown, 24 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Sections, Forms & i18n Copy|Sections, Forms & i18n Copy]]
- [[_COMMUNITY_Layout Components & Language Picker|Layout Components & Language Picker]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_site.js Interactions|site.js Interactions]]
- [[_COMMUNITY_Project Conventions & Delivery|Project Conventions & Delivery]]
- [[_COMMUNITY_README Stack & Principles|README: Stack & Principles]]
- [[_COMMUNITY_Lit Blueprint Design System|Lit Blueprint Design System]]
- [[_COMMUNITY_OG Branding (HR) & Taglines|OG Branding (HR) & Taglines]]
- [[_COMMUNITY_Lead Integration Doc|Lead Integration Doc]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_README Lead Capture|README: Lead Capture]]
- [[_COMMUNITY_Favicons|Favicons]]
- [[_COMMUNITY_OG Render Script|OG Render Script]]
- [[_COMMUNITY_Lead API Endpoint|Lead API Endpoint]]
- [[_COMMUNITY_E2E Helpers & MobileNav Spec|E2E Helpers & MobileNav Spec]]
- [[_COMMUNITY_i18n Parity E2E Spec|i18n Parity E2E Spec]]
- [[_COMMUNITY_E2E Static Server|E2E Static Server]]
- [[_COMMUNITY_OG Card (EN)|OG Card (EN)]]
- [[_COMMUNITY_Results Section|Results Section]]
- [[_COMMUNITY_CI Workflow|CI Workflow]]
- [[_COMMUNITY_Graph Bridges|Graph Bridges]]
- [[_COMMUNITY_Monogram Assets|Monogram Assets]]
- [[_COMMUNITY_OG Card Concepts|OG Card Concepts]]
- [[_COMMUNITY_README SEO & OG|README: SEO & OG]]
- [[_COMMUNITY_Playwright Config|Playwright Config]]
- [[_COMMUNITY_SEO E2E Spec|SEO E2E Spec]]
- [[_COMMUNITY_Design Elevation Rules|Design Elevation Rules]]
- [[_COMMUNITY_CTA Section 1|CTA Section 1]]
- [[_COMMUNITY_CTA Section 2|CTA Section 2]]
- [[_COMMUNITY_Lang Picker E2E Spec|Lang Picker E2E Spec]]
- [[_COMMUNITY_Font Sans 400|Font: Sans 400]]
- [[_COMMUNITY_Font Sans 500|Font: Sans 500]]
- [[_COMMUNITY_Font Sans 600|Font: Sans 600]]
- [[_COMMUNITY_Font Sans 700|Font: Sans 700]]
- [[_COMMUNITY_Font Preload Latin 500|Font Preload: Latin 500]]
- [[_COMMUNITY_Font Preload Latin 600|Font Preload: Latin 600]]
- [[_COMMUNITY_Font Preload Latin-ext 500|Font Preload: Latin-ext 500]]
- [[_COMMUNITY_Font Preload Latin-ext 600|Font Preload: Latin-ext 600]]
- [[_COMMUNITY_Speed Principle|Speed Principle]]
- [[_COMMUNITY_Brand Register|Brand Register]]
- [[_COMMUNITY_Analytics Component|Analytics Component]]
- [[_COMMUNITY_CookieConsent Component|CookieConsent Component]]
- [[_COMMUNITY_Cap1 Screens CSS|Cap1 Screens CSS]]
- [[_COMMUNITY_Cap Screens CSS|Cap Screens CSS]]
- [[_COMMUNITY_Design Tokens CSS|Design Tokens CSS]]
- [[_COMMUNITY_Site CSS|Site CSS]]
- [[_COMMUNITY_Site Polish CSS|Site Polish CSS]]

## God Nodes (most connected - your core abstractions)
1. `useTranslations()` - 12 edges
2. `scripts` - 9 edges
3. `mk()` - 9 edges
4. `Locale` - 9 edges
5. `Gradvera marketing website` - 9 edges
6. `buildHero()` - 8 edges
7. `/api/lead lead-capture endpoint` - 8 edges
8. `The Lit Blueprint (Creative North Star)` - 7 edges
9. `localizePath()` - 7 edges
10. `Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Sentence-Case Rule`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Principle 2: Show the work, don't claim it` --conceptually_related_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED]
  PRODUCT.md → DESIGN.md
- `Trilingual i18n Routing` --conceptually_related_to--> `i18n model (flat-keyed JSON dictionaries)`  [INFERRED]
  CLAUDE.md → README.md
- `Analytics & Consent (GTM + Consent Mode)` --conceptually_related_to--> `Google Consent Mode v2`  [INFERRED]
  CLAUDE.md → README.md

## Import Cycles
- None detected.

## Communities (52 total, 24 thin omitted)

### Community 0 - "Sections, Forms & i18n Copy"
Cohesion: 0.06
Nodes (34): alts, canonical, ogAltLocales, ogImage, organizationLd, string, structuredData, t (+26 more)

### Community 1 - "Layout Components & Language Picker"
Cohesion: 0.08
Nodes (14): ./LangSwitch.astro, t, ../../components/pages/HomeSections.astro, t, DICTS, getLocaleFromPath(), isLocale(), LOCALES (+6 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, astro, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, @fontsource/ibm-plex-sans, description, devDependencies (+16 more)

### Community 3 - "site.js Interactions"
Cohesion: 0.18
Nodes (16): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+8 more)

### Community 4 - "Project Conventions & Delivery"
Cohesion: 0.10
Nodes (22): Analytics & Consent (GTM + Consent Mode), astro check Verification Gate, Astro 5 Static Stack, CI & Deploy Flow (Vercel + ci.yml), Design Source of Truth (Claude Design + design-sync), Gradvera Marketing Website, Trilingual i18n Routing, Lead Capture (/api/lead) (+14 more)

### Community 5 - "README: Stack & Principles"
Cohesion: 0.10
Nodes (22): Principle 4: Trilingual parity (EN/SL/HR), Analytics.astro component, Astro 5 framework, Google Consent Mode v2, CookieConsent banner, Gradvera marketing website, Google Tag Manager (GA4 inside GTM), i18n model (flat-keyed JSON dictionaries) (+14 more)

### Community 6 - "Lit Blueprint Design System"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 7 - "OG Branding (HR) & Taglines"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 8 - "Lead Integration Doc"
Cohesion: 0.27
Nodes (10): D365 Account + Lead write path, Decoupled queue + consumer, 5s forward timeout (AbortSignal.timeout), forwarded soft flag, gtm-toolkit inbound-lead receiver (POST /website/lead), HMAC-SHA256 signature (x-gradvera-signature), Honeypot (company_website), Idempotent processed-key ledger (+2 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 10 - "README: Lead Capture"
Cohesion: 0.29
Nodes (8): /api/lead lead-capture endpoint, DemoForm.astro demo/contact form, Environment variables, gtm-toolkit inbound-lead receiver, HMAC-SHA256 lead signing, company_website honeypot, docs/lead-integration.md, robots.txt (generated)

### Community 11 - "Favicons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 12 - "OG Render Script"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 13 - "Lead API Endpoint"
Cohesion: 0.47
Nodes (4): GET(), json(), Lead, POST()

### Community 15 - "i18n Parity E2E Spec"
Cohesion: 0.33
Nodes (4): LOCAL_PROOF, LOCALIZED_COMPONENTS, ROOT, SENTINELS

### Community 16 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 17 - "OG Card (EN)"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 18 - "Results Section"
Cohesion: 0.50
Nodes (4): [], m1sFrom, m1sTo, t

### Community 19 - "CI Workflow"
Cohesion: 0.67
Nodes (3): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions)

### Community 20 - "Graph Bridges"
Cohesion: 1.00
Nodes (3): BaseLayout.astro (graph bridge), Knowledge Graph (graphify-out), SEO.astro (JSON-LD bridge)

### Community 21 - "Monogram Assets"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 22 - "OG Card Concepts"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

### Community 23 - "README: SEO & OG"
Cohesion: 0.67
Nodes (3): consts.ts (brand facts, integration ids), Open Graph images / render-og.mjs, SEO.astro component

## Knowledge Gaps
- **125 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Gradvera marketing website` connect `README: Stack & Principles` to `Project Conventions & Delivery`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `useTranslations()` connect `Sections, Forms & i18n Copy` to `Layout Components & Language Picker`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Gradvera marketing website` (e.g. with `Static-first / prerender rationale` and `www -> apex permanent redirect (307->308)`) actually correct?**
  _`Gradvera marketing website` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _136 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sections, Forms & i18n Copy` be split into smaller, more focused modules?**
  _Cohesion score 0.06205673758865248 - nodes in this community are weakly interconnected._
- **Should `Layout Components & Language Picker` be split into smaller, more focused modules?**
  _Cohesion score 0.08374384236453201 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._