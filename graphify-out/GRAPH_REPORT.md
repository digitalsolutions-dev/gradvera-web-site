# Graph Report - /Users/katarov/WebstormProjects/WEB APPs/gradvera-web-site  (2026-07-02)

## Corpus Check
- Corpus is ~35,340 words - fits in a single context window. You may not need a graph.

## Summary
- 209 nodes · 282 edges · 23 communities (17 shown, 6 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Layout & Form Components|Layout & Form Components]]
- [[_COMMUNITY_SEO & i18n Helpers|SEO & i18n Helpers]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Hero Animation (site.js)|Hero Animation (site.js)]]
- [[_COMMUNITY_Homepage Sections|Homepage Sections]]
- [[_COMMUNITY_Lead Integration Pipeline|Lead Integration Pipeline]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_CI & Verification Gates|CI & Verification Gates]]
- [[_COMMUNITY_Brand Icons & Favicons|Brand Icons & Favicons]]
- [[_COMMUNITY_E2E Test Helpers|E2E Test Helpers]]
- [[_COMMUNITY_Lead API Endpoint|Lead API Endpoint]]
- [[_COMMUNITY_E2E Static Server|E2E Static Server]]
- [[_COMMUNITY_Brand & OG Identity|Brand & OG Identity]]
- [[_COMMUNITY_Docs & Design Rules|Docs & Design Rules]]
- [[_COMMUNITY_Gradvera Monogram Assets|Gradvera Monogram Assets]]
- [[_COMMUNITY_Site Constants|Site Constants]]
- [[_COMMUNITY_Playwright Config|Playwright Config]]
- [[_COMMUNITY_Analytics Consent|Analytics Consent]]
- [[_COMMUNITY_Design-Sync Workflow|Design-Sync Workflow]]
- [[_COMMUNITY_Consts Import Ref|Consts Import Ref]]
- [[_COMMUNITY_i18n Utils Import Ref|i18n Utils Import Ref]]

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

## Hyperedges (group relationships)
- **CI verification (astro check gate + additive e2e harness)** — _github_workflows_ci_check_job, _github_workflows_ci_e2e_job, claude_verification_gate, tests_e2e_readme_harness [INFERRED 0.85]
- **Lead capture pipeline (browser -> /api/lead -> gtm-toolkit -> D365)** — docs_lead_integration_lead_flow, docs_lead_integration_honeypot, docs_lead_integration_validation, docs_lead_integration_hmac_signature, docs_lead_integration_forwarded_flag, docs_lead_integration_gtm_receiver, docs_lead_integration_d365_write [EXTRACTED 1.00]
- **Resilient always-200 success UX pattern** — docs_lead_integration_honeypot, docs_lead_integration_forwarded_flag, docs_lead_integration_forward_timeout [INFERRED 0.85]
- **Gradvera G monogram brand mark variants** — public_assets_monogram_plain_gradvera_monogram_plain, public_assets_monogram_gradvera_monogram, public_favicons_favicon_gradvera_favicon [INFERRED 0.85]
- **Gradvera favicon / app-icon set — same 'G' brand mark across Android Chrome, Apple touch, and browser favicon sizes** — public_favicons_android_chrome_192x192_gradvera_g_icon_192px, public_favicons_android_chrome_512x512_gradvera_g_icon_512px, public_favicons_apple_touch_icon_gradvera_g_apple_touch_icon, public_favicons_favicon_16x16_gradvera_g_favicon_16px, public_favicons_favicon_32x32_gradvera_g_favicon_32px, public_favicons_favicon_48x48_gradvera_g_favicon_48px, public_favicons_gradvera_g_brand_mark_concept [INFERRED 0.85]

## Communities (23 total, 6 thin omitted)

### Community 0 - "Layout & Form Components"
Cohesion: 0.09
Nodes (27): @fontsource/ibm-plex-sans/400.css, @fontsource/ibm-plex-sans/500.css, @fontsource/ibm-plex-sans/600.css, @fontsource/ibm-plex-sans/700.css, ../../../components/forms/DemoForm.astro, ../components/layout/Footer.astro, ../components/layout/Header.astro, ../components/layout/MobileNav.astro (+19 more)

### Community 1 - "SEO & i18n Helpers"
Cohesion: 0.10
Nodes (23): ../components/seo/SEO.astro, alts, canonical, ogAltLocales, ogImage, organizationLd, structuredData, webSiteLd (+15 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, astro, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, @fontsource/ibm-plex-sans, description, devDependencies (+16 more)

### Community 3 - "Hero Animation (site.js)"
Cohesion: 0.20
Nodes (15): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+7 more)

### Community 4 - "Homepage Sections"
Cohesion: 0.12
Nodes (7): ../../components/pages/HomeSections.astro, t, t, [], m1sFrom, m1sTo, t

### Community 5 - "Lead Integration Pipeline"
Cohesion: 0.22
Nodes (14): Knowledge graph (graphify-out), Lead capture (/api/lead), D365 Account + Lead write path, Decoupled queue + consumer, 5s forward timeout (AbortSignal.timeout), forwarded soft flag, gtm-toolkit inbound-lead receiver (POST /website/lead), HMAC-SHA256 signature (x-gradvera-signature) (+6 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 7 - "CI & Verification Gates"
Cohesion: 0.29
Nodes (8): astro check job, e2e (Playwright) job, CI Workflow (GitHub Actions), Branch, CI & deploy flow, astro check verification gate, Playwright e2e harness, homepage.spec.mjs, mobile-nav.spec.mjs

### Community 8 - "Brand Icons & Favicons"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 9 - "E2E Test Helpers"
Cohesion: 0.57
Nodes (4): boxOf(), gotoClean(), rectsOverlap(), VIEWPORTS

### Community 10 - "Lead API Endpoint"
Cohesion: 0.47
Nodes (4): GET(), json(), Lead, POST()

### Community 11 - "E2E Static Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 12 - "Brand & OG Identity"
Cohesion: 0.83
Nodes (4): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (PNG), Gradvera OG social-share card (SVG source)

### Community 13 - "Docs & Design Rules"
Cohesion: 0.50
Nodes (4): Design-asset provenance & fidelity rules, i18n flat-keyed JSON model, Gradvera README overview, Self-hosted IBM Plex fonts

### Community 14 - "Gradvera Monogram Assets"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

## Knowledge Gaps
- **82 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+77 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `../../../layouts/BaseLayout.astro` connect `Layout & Form Components` to `SEO & i18n Helpers`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `../../components/pages/HomeSections.astro` connect `Homepage Sections` to `SEO & i18n Helpers`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `../components/seo/SEO.astro` connect `SEO & i18n Helpers` to `Layout & Form Components`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Layout & Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08739495798319327 - nodes in this community are weakly interconnected._
- **Should `SEO & i18n Helpers` be split into smaller, more focused modules?**
  _Cohesion score 0.09971509971509972 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._