# Graph Report - .  (2026-07-02)

## Corpus Check
- 8 files · ~35,311 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 209 nodes · 284 edges · 22 communities (18 shown, 4 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Routes, Layout & Forms|Routes, Layout & Forms]]
- [[_COMMUNITY_SEO & Structured Data|SEO & Structured Data]]
- [[_COMMUNITY_Package Manifest & Scripts|Package Manifest & Scripts]]
- [[_COMMUNITY_Hero Animation Script|Hero Animation Script]]
- [[_COMMUNITY_Marketing Sections|Marketing Sections]]
- [[_COMMUNITY_Lead Integration Docs|Lead Integration Docs]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_CI & Deploy Pipeline|CI & Deploy Pipeline]]
- [[_COMMUNITY_Favicon Assets|Favicon Assets]]
- [[_COMMUNITY_E2E Test Specs|E2E Test Specs]]
- [[_COMMUNITY_Lead Capture API|Lead Capture API]]
- [[_COMMUNITY_E2E Static Server|E2E Static Server]]
- [[_COMMUNITY_Open Graph Cards|Open Graph Cards]]
- [[_COMMUNITY_Project README|Project README]]
- [[_COMMUNITY_Brand & Site Consts|Brand & Site Consts]]
- [[_COMMUNITY_Brand Marks|Brand Marks]]
- [[_COMMUNITY_Playwright Config|Playwright Config]]
- [[_COMMUNITY_Analytics & Consent Docs|Analytics & Consent Docs]]
- [[_COMMUNITY_Design Sync Doc|Design Sync Doc]]
- [[_COMMUNITY_Consts Module|Consts Module]]

## God Nodes (most connected - your core abstractions)
1. `../../../layouts/BaseLayout.astro` - 23 edges
2. `../../components/pages/HomeSections.astro` - 15 edges
3. `../components/seo/SEO.astro` - 13 edges
4. `useTranslations()` - 12 edges
5. `scripts` - 9 edges
6. `Locale` - 9 edges
7. `localizePath()` - 9 edges
8. `mk()` - 8 edges
9. `buildHero()` - 8 edges
10. `absoluteUrl()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Lead capture (/api/lead)` --semantically_similar_to--> `Lead capture (README)`  [INFERRED] [semantically similar]
  CLAUDE.md → README.md
- `astro check job` --implements--> `astro check verification gate`  [INFERRED]
  .github/workflows/ci.yml → CLAUDE.md
- `Branch, CI & deploy flow` --references--> `CI Workflow (GitHub Actions)`  [EXTRACTED]
  CLAUDE.md → .github/workflows/ci.yml
- `Playwright e2e harness` --references--> `e2e (Playwright) job`  [EXTRACTED]
  tests/e2e/README.md → .github/workflows/ci.yml
- `Playwright e2e harness` --conceptually_related_to--> `astro check verification gate`  [EXTRACTED]
  tests/e2e/README.md → CLAUDE.md

## Import Cycles
- None detected.

## Communities (22 total, 4 thin omitted)

### Community 0 - "Routes, Layout & Forms"
Cohesion: 0.09
Nodes (24): @fontsource/ibm-plex-sans/400.css, @fontsource/ibm-plex-sans/500.css, @fontsource/ibm-plex-sans/600.css, @fontsource/ibm-plex-sans/700.css, ../components/layout/Footer.astro, ../components/layout/Header.astro, ../components/layout/MobileNav.astro, ../components/marketing/Analytics.astro (+16 more)

### Community 1 - "SEO & Structured Data"
Cohesion: 0.10
Nodes (23): ../components/seo/SEO.astro, alts, canonical, ogAltLocales, ogImage, organizationLd, structuredData, webSiteLd (+15 more)

### Community 2 - "Package Manifest & Scripts"
Cohesion: 0.08
Nodes (24): dependencies, astro, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, @fontsource/ibm-plex-sans, description, devDependencies (+16 more)

### Community 3 - "Hero Animation Script"
Cohesion: 0.20
Nodes (15): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+7 more)

### Community 4 - "Marketing Sections"
Cohesion: 0.12
Nodes (7): ../../components/pages/HomeSections.astro, t, t, [], m1sFrom, m1sTo, t

### Community 5 - "Lead Integration Docs"
Cohesion: 0.22
Nodes (14): Knowledge graph (graphify-out), Lead capture (/api/lead), D365 Account + Lead write path, Decoupled queue + consumer, 5s forward timeout (AbortSignal.timeout), forwarded soft flag, gtm-toolkit inbound-lead receiver (POST /website/lead), HMAC-SHA256 signature (x-gradvera-signature) (+6 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 7 - "CI & Deploy Pipeline"
Cohesion: 0.29
Nodes (8): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions), Branch, CI & deploy flow, astro check verification gate, Playwright e2e harness, homepage.spec.mjs, mobile-nav.spec.mjs

### Community 8 - "Favicon Assets"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 9 - "E2E Test Specs"
Cohesion: 0.57
Nodes (4): boxOf(), gotoClean(), rectsOverlap(), VIEWPORTS

### Community 10 - "Lead Capture API"
Cohesion: 0.47
Nodes (4): GET(), json(), Lead, POST()

### Community 11 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 12 - "Open Graph Cards"
Cohesion: 0.83
Nodes (4): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (PNG), Gradvera OG social-share card (SVG source)

### Community 13 - "Project README"
Cohesion: 0.50
Nodes (4): Design-asset provenance & fidelity rules, i18n flat-keyed JSON model, Gradvera README overview, Self-hosted IBM Plex fonts

### Community 14 - "Brand & Site Consts"
Cohesion: 0.50
Nodes (3): COMPANY, NAV_ITEMS, SITE

### Community 15 - "Brand Marks"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

## Knowledge Gaps
- **83 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `../../../layouts/BaseLayout.astro` connect `Routes, Layout & Forms` to `SEO & Structured Data`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `../../components/pages/HomeSections.astro` connect `Marketing Sections` to `SEO & Structured Data`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `../components/seo/SEO.astro` connect `SEO & Structured Data` to `Routes, Layout & Forms`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routes, Layout & Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._
- **Should `SEO & Structured Data` be split into smaller, more focused modules?**
  _Cohesion score 0.09971509971509972 - nodes in this community are weakly interconnected._
- **Should `Package Manifest & Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._