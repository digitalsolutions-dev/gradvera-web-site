# Graph Report - /Users/katarov/WebstormProjects/WEB APPs/gradvera-web-site  (2026-07-08)

## Corpus Check
- 6 files · ~42,826 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 236 nodes · 311 edges · 25 communities (19 shown, 6 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Pages, Layout & i18n Routing|Pages, Layout & i18n Routing]]
- [[_COMMUNITY_Brand & Design System (Lit Blueprint)|Brand & Design System (Lit Blueprint)]]
- [[_COMMUNITY_Package Manifest & Scripts|Package Manifest & Scripts]]
- [[_COMMUNITY_Site Interactions (site.js)|Site Interactions (site.js)]]
- [[_COMMUNITY_Homepage Sections|Homepage Sections]]
- [[_COMMUNITY_Lead Integration (D365  HMAC)|Lead Integration (D365 / HMAC)]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Favicons|Favicons]]
- [[_COMMUNITY_i18n Locale Helpers|i18n Locale Helpers]]
- [[_COMMUNITY_CI & E2E Harness Docs|CI & E2E Harness Docs]]
- [[_COMMUNITY_Lead Capture API|Lead Capture API]]
- [[_COMMUNITY_E2E Helpers & Mobile-Nav Test|E2E Helpers & Mobile-Nav Test]]
- [[_COMMUNITY_Product Purpose & Users|Product Purpose & Users]]
- [[_COMMUNITY_E2E Static Server|E2E Static Server]]
- [[_COMMUNITY_Open Graph Images|Open Graph Images]]
- [[_COMMUNITY_Site Constants|Site Constants]]
- [[_COMMUNITY_Brand Monograms|Brand Monograms]]
- [[_COMMUNITY_Playwright Config|Playwright Config]]
- [[_COMMUNITY_Analytics & Consent|Analytics & Consent]]
- [[_COMMUNITY_Elevation & Glow Rule|Elevation & Glow Rule]]
- [[_COMMUNITY_Graphify Workflow|Graphify Workflow]]
- [[_COMMUNITY_Site Constants Module|Site Constants Module]]

## God Nodes (most connected - your core abstractions)
1. `../../components/pages/HomeSections.astro` - 15 edges
2. `useTranslations()` - 11 edges
3. `scripts` - 9 edges
4. `Design context (impeccable): PRODUCT.md + DESIGN.md` - 9 edges
5. `mk()` - 9 edges
6. `localizePath()` - 8 edges
7. `The Lit Blueprint (Creative North Star)` - 8 edges
8. `buildHero()` - 8 edges
9. `Locale` - 7 edges
10. `absoluteUrl()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Sentence-Case Rule`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Astro 5 static-first architecture` --conceptually_related_to--> `Astro 5 static stack (TypeScript / Vercel / Partytown / sitemap)`  [INFERRED]
  CLAUDE.md → README.md
- `Principle 5: Speed is part of the promise` --conceptually_related_to--> `Astro 5 static-first architecture`  [INFERRED]
  PRODUCT.md → CLAUDE.md
- `Lead capture flow (POST /api/lead)` --conceptually_related_to--> `Lead capture -> HMAC-SHA256 -> gtm-toolkit -> D365`  [INFERRED]
  CLAUDE.md → README.md

## Import Cycles
- None detected.

## Communities (25 total, 6 thin omitted)

### Community 0 - "Pages, Layout & i18n Routing"
Cohesion: 0.08
Nodes (25): t, absoluteUrl(), alternates(), DICTS, getLocaleFromPath(), isEmpty(), isLocale(), LOCALE_META (+17 more)

### Community 1 - "Brand & Design System (Lit Blueprint)"
Cohesion: 0.11
Nodes (27): astro check CI verification gate, Astro 5 static-first architecture, /design-sync workflow (DesignSync MCP), Design context (impeccable): PRODUCT.md + DESIGN.md, The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object) (+19 more)

### Community 2 - "Package Manifest & Scripts"
Cohesion: 0.09
Nodes (21): @fontsource/ibm-plex-sans/400.css, @fontsource/ibm-plex-sans/500.css, @fontsource/ibm-plex-sans/600.css, @fontsource/ibm-plex-sans/700.css, Locale, t, t, t (+13 more)

### Community 3 - "Site Interactions (site.js)"
Cohesion: 0.08
Nodes (24): dependencies, astro, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, @fontsource/ibm-plex-sans, description, devDependencies (+16 more)

### Community 4 - "Homepage Sections"
Cohesion: 0.18
Nodes (16): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+8 more)

### Community 5 - "Lead Integration (D365 / HMAC)"
Cohesion: 0.13
Nodes (7): ../../components/pages/HomeSections.astro, t, t, [], m1sFrom, m1sTo, t

### Community 6 - "TypeScript Config"
Cohesion: 0.27
Nodes (10): D365 Account + Lead write path, Decoupled queue + consumer, 5s forward timeout (AbortSignal.timeout), forwarded soft flag, gtm-toolkit inbound-lead receiver (POST /website/lead), HMAC-SHA256 signature (x-gradvera-signature), Honeypot (company_website), Idempotent processed-key ledger (+2 more)

### Community 7 - "Favicons"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 8 - "i18n Locale Helpers"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 9 - "CI & E2E Harness Docs"
Cohesion: 0.33
Nodes (6): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions), Playwright e2e harness, homepage.spec.mjs, mobile-nav.spec.mjs

### Community 10 - "Lead Capture API"
Cohesion: 0.47
Nodes (4): GET(), json(), Lead, POST()

### Community 12 - "Product Purpose & Users"
Cohesion: 0.50
Nodes (5): Lead capture flow (POST /api/lead), Principle 3: Credibility is the conversion, Product purpose: convert qualified interest into a booked demo (to D365), Users: construction estimators / quantity surveyors / bid teams, Lead capture -> HMAC-SHA256 -> gtm-toolkit -> D365

### Community 13 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 14 - "Open Graph Images"
Cohesion: 0.83
Nodes (4): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (PNG), Gradvera OG social-share card (SVG source)

### Community 15 - "Site Constants"
Cohesion: 0.50
Nodes (3): COMPANY, NAV_ITEMS, SITE

### Community 16 - "Brand Monograms"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

## Knowledge Gaps
- **90 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `../../components/pages/HomeSections.astro` connect `Lead Integration (D365 / HMAC)` to `Pages, Layout & i18n Routing`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `useTranslations()` connect `Pages, Layout & i18n Routing` to `Package Manifest & Scripts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Design context (impeccable): PRODUCT.md + DESIGN.md` connect `Brand & Design System (Lit Blueprint)` to `Product Purpose & Users`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Pages, Layout & i18n Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.0796221322537112 - nodes in this community are weakly interconnected._
- **Should `Brand & Design System (Lit Blueprint)` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Package Manifest & Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.08923076923076922 - nodes in this community are weakly interconnected._