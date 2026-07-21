# Graph Report - .  (2026-07-21)

## Corpus Check
- 5 files · ~47,305 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 318 nodes · 408 edges · 37 communities (30 shown, 7 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.88)
- Token cost: 0 input · 52,030 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Project Conventions & Principles|Project Conventions & Principles]]
- [[_COMMUNITY_Layout Components & Language Picker|Layout Components & Language Picker]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_site.js Interactions|site.js Interactions]]
- [[_COMMUNITY_Font Assets & Preloads|Font Assets & Preloads]]
- [[_COMMUNITY_Lit Blueprint Design System|Lit Blueprint Design System]]
- [[_COMMUNITY_Localized Pages & Fallback|Localized Pages & Fallback]]
- [[_COMMUNITY_Demo Form & Booking Flow|Demo Form & Booking Flow]]
- [[_COMMUNITY_CI & Delivery Conventions|CI & Delivery Conventions]]
- [[_COMMUNITY_Locale Routing & Alternates|Locale Routing & Alternates]]
- [[_COMMUNITY_SEO Component & JSON-LD|SEO Component & JSON-LD]]
- [[_COMMUNITY_OG Branding & Taglines|OG Branding & Taglines]]
- [[_COMMUNITY_Lead Integration Doc|Lead Integration Doc]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_README Lead Capture|README: Lead Capture]]
- [[_COMMUNITY_Favicons|Favicons]]
- [[_COMMUNITY_i18n Core Utils|i18n Core Utils]]
- [[_COMMUNITY_OG Render Script|OG Render Script]]
- [[_COMMUNITY_Lead API Endpoint|Lead API Endpoint]]
- [[_COMMUNITY_E2E Harness & MobileNav Spec|E2E Harness & MobileNav Spec]]
- [[_COMMUNITY_E2E Static Server|E2E Static Server]]
- [[_COMMUNITY_OG Card (EN)|OG Card (EN)]]
- [[_COMMUNITY_Site Constants|Site Constants]]
- [[_COMMUNITY_CI Workflow|CI Workflow]]
- [[_COMMUNITY_Graph Bridges|Graph Bridges]]
- [[_COMMUNITY_Monogram Assets|Monogram Assets]]
- [[_COMMUNITY_OG Card Concepts|OG Card Concepts]]
- [[_COMMUNITY_README SEO & OG|README: SEO & OG]]
- [[_COMMUNITY_Playwright Config|Playwright Config]]
- [[_COMMUNITY_SEO E2E Spec|SEO E2E Spec]]
- [[_COMMUNITY_Design Elevation Rules|Design Elevation Rules]]
- [[_COMMUNITY_Lang Picker E2E Spec|Lang Picker E2E Spec]]
- [[_COMMUNITY_Speed Principle|Speed Principle]]
- [[_COMMUNITY_Brand Register|Brand Register]]

## God Nodes (most connected - your core abstractions)
1. `../../components/pages/HomeSections.astro` - 15 edges
2. `useTranslations()` - 15 edges
3. `Locale` - 10 edges
4. `scripts` - 9 edges
5. `mk()` - 9 edges
6. `localizePath()` - 9 edges
7. `Gradvera marketing website` - 9 edges
8. `buildHero()` - 8 edges
9. `absoluteUrl()` - 8 edges
10. `/api/lead lead-capture endpoint` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Sentence-Case Rule`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Principle 2: Show the work, don't claim it` --conceptually_related_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED]
  PRODUCT.md → DESIGN.md
- `The Lit Blueprint (Creative North Star)` --references--> `Anti-reference: Sterile corporate blue`  [EXTRACTED]
  DESIGN.md → PRODUCT.md
- `The Lit Blueprint (Creative North Star)` --references--> `Anti-reference: Generic SaaS template`  [EXTRACTED]
  DESIGN.md → PRODUCT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lead capture flow (form to gtm-toolkit)** — readme_demo_form, readme_api_lead, readme_honeypot, readme_hmac_signing, readme_gtm_toolkit [EXTRACTED 1.00]
- **Analytics and consent stack** — readme_analytics_component, readme_gtm, readme_partytown, readme_consent_mode, readme_cookie_consent [INFERRED 0.85]
- **Design-origin asset provenance** — readme_claude_design_project, readme_design_provenance, readme_site_polish, readme_fidelity_rules, readme_ibm_plex_fonts [INFERRED 0.85]

## Communities (37 total, 7 thin omitted)

### Community 0 - "Project Conventions & Principles"
Cohesion: 0.07
Nodes (32): Analytics & Consent (GTM + Consent Mode), Design Source of Truth (Claude Design + design-sync), Gradvera Marketing Website, Trilingual i18n Routing, The Lit Blueprint Design System, Principle 4: Trilingual parity (EN/SL/HR), Analytics.astro component, Astro 5 framework (+24 more)

### Community 1 - "Layout Components & Language Picker"
Cohesion: 0.09
Nodes (12): localizePath(), ./LangSwitch.astro, t, ../../components/pages/HomeSections.astro, t, t, t, [] (+4 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, astro, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, @fontsource/ibm-plex-sans, description, devDependencies (+16 more)

### Community 3 - "site.js Interactions"
Cohesion: 0.18
Nodes (16): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+8 more)

### Community 4 - "Font Assets & Preloads"
Cohesion: 0.11
Nodes (18): @fontsource/ibm-plex-sans/400.css, @fontsource/ibm-plex-sans/500.css, @fontsource/ibm-plex-sans/600.css, @fontsource/ibm-plex-sans/700.css, @fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2?url, @fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2?url, @fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-ext-500-normal.woff2?url, @fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-ext-600-normal.woff2?url (+10 more)

### Community 5 - "Lit Blueprint Design System"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 6 - "Localized Pages & Fallback"
Cohesion: 0.21
Nodes (9): isEmpty(), Locale, useTranslations(), l10n, strings(), t, t, t (+1 more)

### Community 7 - "Demo Form & Booking Flow"
Cohesion: 0.18
Nodes (6): breadcrumbLd, t, breadcrumbLd, t, breadcrumbLd, t

### Community 8 - "CI & Delivery Conventions"
Cohesion: 0.20
Nodes (12): astro check Verification Gate, Astro 5 Static Stack, CI & Deploy Flow (Vercel + ci.yml), Lead Capture (/api/lead), Playwright E2E Harness, Principle 3: Credibility is the conversion, Product purpose: convert qualified interest into a booked demo (to D365), Users: construction estimators / quantity surveyors / bid teams (+4 more)

### Community 9 - "Locale Routing & Alternates"
Cohesion: 0.20
Nodes (9): absoluteUrl(), alternates(), localizePath(), jsonLd, t, jsonLd, t, jsonLd (+1 more)

### Community 10 - "SEO Component & JSON-LD"
Cohesion: 0.18
Nodes (10): alts, canonical, ogAltLocales, ogImage, organizationLd, string, structuredData, t (+2 more)

### Community 11 - "OG Branding & Taglines"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 12 - "Lead Integration Doc"
Cohesion: 0.27
Nodes (10): D365 Account + Lead write path, Decoupled queue + consumer, 5s forward timeout (AbortSignal.timeout), forwarded soft flag, gtm-toolkit inbound-lead receiver (POST /website/lead), HMAC-SHA256 signature (x-gradvera-signature), Honeypot (company_website), Idempotent processed-key ledger (+2 more)

### Community 13 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 14 - "README: Lead Capture"
Cohesion: 0.29
Nodes (8): /api/lead lead-capture endpoint, DemoForm.astro demo/contact form, Environment variables, gtm-toolkit inbound-lead receiver, HMAC-SHA256 lead signing, company_website honeypot, docs/lead-integration.md, robots.txt (generated)

### Community 15 - "Favicons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 16 - "i18n Core Utils"
Cohesion: 0.38
Nodes (6): DICTS, getLocaleFromPath(), isLocale(), LOCALE_META, LOCALES, stripLocale()

### Community 17 - "OG Render Script"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 18 - "Lead API Endpoint"
Cohesion: 0.47
Nodes (4): GET(), json(), Lead, POST()

### Community 20 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 21 - "OG Card (EN)"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 22 - "Site Constants"
Cohesion: 0.50
Nodes (3): COMPANY, NAV_ITEMS, SITE

### Community 23 - "CI Workflow"
Cohesion: 0.67
Nodes (3): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions)

### Community 24 - "Graph Bridges"
Cohesion: 1.00
Nodes (3): BaseLayout.astro (graph bridge), Knowledge Graph (graphify-out), SEO.astro (JSON-LD bridge)

### Community 25 - "Monogram Assets"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 26 - "OG Card Concepts"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

### Community 27 - "README: SEO & OG"
Cohesion: 0.67
Nodes (3): consts.ts (brand facts, integration ids), Open Graph images / render-og.mjs, SEO.astro component

## Knowledge Gaps
- **123 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `../../components/pages/HomeSections.astro` connect `Layout Components & Language Picker` to `Locale Routing & Alternates`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `useTranslations()` connect `Localized Pages & Fallback` to `Font Assets & Preloads`, `Demo Form & Booking Flow`, `Locale Routing & Alternates`, `SEO Component & JSON-LD`, `i18n Core Utils`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Project Conventions & Principles` be split into smaller, more focused modules?**
  _Cohesion score 0.07056451612903226 - nodes in this community are weakly interconnected._
- **Should `Layout Components & Language Picker` be split into smaller, more focused modules?**
  _Cohesion score 0.09230769230769231 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Font Assets & Preloads` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._