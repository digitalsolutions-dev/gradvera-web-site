# Graph Report - .  (2026-07-10)

## Corpus Check
- 22 files · ~46,535 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 292 nodes · 380 edges · 29 communities (23 shown, 6 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.87)
- Token cost: 0 input · 207,969 output

## Community Hubs (Navigation)
- [[_COMMUNITY_IBM Plex Font Pipeline|IBM Plex Font Pipeline]]
- [[_COMMUNITY_Project Architecture Docs|Project Architecture Docs]]
- [[_COMMUNITY_SEO Head Component|SEO Head Component]]
- [[_COMMUNITY_Package Manifest|Package Manifest]]
- [[_COMMUNITY_Site Interactions (site.js)|Site Interactions (site.js)]]
- [[_COMMUNITY_Homepage Sections|Homepage Sections]]
- [[_COMMUNITY_Lit Blueprint Design System|Lit Blueprint Design System]]
- [[_COMMUNITY_Localized OG Cards|Localized OG Cards]]
- [[_COMMUNITY_Lead Pipeline Concepts|Lead Pipeline Concepts]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Brand Icon Set|Brand Icon Set]]
- [[_COMMUNITY_OG Render Script|OG Render Script]]
- [[_COMMUNITY_Lead API Endpoint|Lead API Endpoint]]
- [[_COMMUNITY_E2E Helpers & MobileNav Spec|E2E Helpers & MobileNav Spec]]
- [[_COMMUNITY_E2E Static Server|E2E Static Server]]
- [[_COMMUNITY_Graph Bridges & Tooling|Graph Bridges & Tooling]]
- [[_COMMUNITY_EN OG Card Elements|EN OG Card Elements]]
- [[_COMMUNITY_Site Constants|Site Constants]]
- [[_COMMUNITY_CI Jobs|CI Jobs]]
- [[_COMMUNITY_Monogram Assets|Monogram Assets]]
- [[_COMMUNITY_Brand Tagline Concepts|Brand Tagline Concepts]]
- [[_COMMUNITY_Playwright Config|Playwright Config]]
- [[_COMMUNITY_SEO E2E Spec|SEO E2E Spec]]
- [[_COMMUNITY_Elevation & Glow Rules|Elevation & Glow Rules]]
- [[_COMMUNITY_Speed Principle|Speed Principle]]
- [[_COMMUNITY_Brand Register|Brand Register]]

## God Nodes (most connected - your core abstractions)
1. `../../components/pages/HomeSections.astro` - 15 edges
2. `useTranslations()` - 15 edges
3. `Locale` - 10 edges
4. `scripts` - 9 edges
5. `mk()` - 9 edges
6. `localizePath()` - 9 edges
7. `buildHero()` - 8 edges
8. `absoluteUrl()` - 8 edges
9. `The Lit Blueprint (Creative North Star)` - 7 edges
10. `[]` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Brand personality: calm / precise / anti-hype` --semantically_similar_to--> `The Sentence-Case Rule`  [INFERRED] [semantically similar]
  PRODUCT.md → DESIGN.md
- `Principle 2: Show the work, don't claim it` --conceptually_related_to--> `The Lit Blueprint (Creative North Star)`  [INFERRED]
  PRODUCT.md → DESIGN.md
- `Principle 4: Trilingual parity (EN/SL/HR)` --conceptually_related_to--> `i18n Model (flat-keyed JSON dictionaries)`  [INFERRED]
  PRODUCT.md → README.md
- `Trilingual i18n Routing` --conceptually_related_to--> `i18n Model (flat-keyed JSON dictionaries)`  [INFERRED]
  CLAUDE.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lead Capture Pipeline** — claude_lead_capture, readme_lead_capture_flow, readme_honeypot, readme_hmac_signing, readme_env_vars [EXTRACTED 0.90]
- **CI Verification Pipeline** — claude_astro_check_gate, claude_playwright_e2e_harness, claude_ci_deploy_flow, tests_e2e_readme_e2e_ci_job [EXTRACTED 0.90]
- **Trilingual i18n System** — claude_i18n_routing, readme_i18n_model, readme_usetranslations, readme_localizepath [EXTRACTED 0.90]

## Communities (29 total, 6 thin omitted)

### Community 0 - "IBM Plex Font Pipeline"
Cohesion: 0.06
Nodes (35): @fontsource/ibm-plex-sans/400.css, @fontsource/ibm-plex-sans/500.css, @fontsource/ibm-plex-sans/600.css, @fontsource/ibm-plex-sans/700.css, @fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2?url, @fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2?url, @fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-ext-500-normal.woff2?url, @fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-ext-600-normal.woff2?url (+27 more)

### Community 1 - "Project Architecture Docs"
Cohesion: 0.07
Nodes (33): Analytics & Consent (GTM + Consent Mode), astro check Verification Gate, Astro 5 Static Stack, CI & Deploy Flow (Vercel + ci.yml), Design Source of Truth (Claude Design + design-sync), Gradvera Marketing Website, Trilingual i18n Routing, Lead Capture (/api/lead) (+25 more)

### Community 2 - "SEO Head Component"
Cohesion: 0.09
Nodes (26): alts, canonical, ogAltLocales, ogImage, organizationLd, string, structuredData, t (+18 more)

### Community 3 - "Package Manifest"
Cohesion: 0.08
Nodes (24): dependencies, astro, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, @fontsource/ibm-plex-sans, description, devDependencies (+16 more)

### Community 4 - "Site Interactions (site.js)"
Cohesion: 0.18
Nodes (16): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+8 more)

### Community 5 - "Homepage Sections"
Cohesion: 0.11
Nodes (8): ../../components/pages/HomeSections.astro, t, t, t, [], m1sFrom, m1sTo, t

### Community 6 - "Lit Blueprint Design System"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 7 - "Localized OG Cards"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 8 - "Lead Pipeline Concepts"
Cohesion: 0.27
Nodes (10): D365 Account + Lead write path, Decoupled queue + consumer, 5s forward timeout (AbortSignal.timeout), forwarded soft flag, gtm-toolkit inbound-lead receiver (POST /website/lead), HMAC-SHA256 signature (x-gradvera-signature), Honeypot (company_website), Idempotent processed-key ledger (+2 more)

### Community 9 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 10 - "Brand Icon Set"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 11 - "OG Render Script"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 12 - "Lead API Endpoint"
Cohesion: 0.47
Nodes (4): GET(), json(), Lead, POST()

### Community 14 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 15 - "Graph Bridges & Tooling"
Cohesion: 0.67
Nodes (4): BaseLayout.astro (graph bridge), Knowledge Graph (graphify-out), SEO.astro (JSON-LD bridge), OG Image Generation (render-og.mjs)

### Community 16 - "EN OG Card Elements"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 17 - "Site Constants"
Cohesion: 0.50
Nodes (3): COMPANY, NAV_ITEMS, SITE

### Community 18 - "CI Jobs"
Cohesion: 0.67
Nodes (3): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions)

### Community 19 - "Monogram Assets"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 20 - "Brand Tagline Concepts"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

## Knowledge Gaps
- **110 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+105 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `../../components/pages/HomeSections.astro` connect `Homepage Sections` to `SEO Head Component`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `useTranslations()` connect `IBM Plex Font Pipeline` to `SEO Head Component`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _119 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `IBM Plex Font Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.06382978723404255 - nodes in this community are weakly interconnected._
- **Should `Project Architecture Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.07386363636363637 - nodes in this community are weakly interconnected._
- **Should `SEO Head Component` be split into smaller, more focused modules?**
  _Cohesion score 0.08602150537634409 - nodes in this community are weakly interconnected._
- **Should `Package Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._