# Graph Report - .  (2026-07-01)

## Corpus Check
- Corpus is ~30,606 words - fits in a single context window. You may not need a graph.

## Summary
- 188 nodes · 298 edges · 15 communities
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.92)
- Token cost: 167,014 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Layout, i18n Runtime & Global Chrome|Layout, i18n Runtime & Global Chrome]]
- [[_COMMUNITY_Home Section Components|Home Section Components]]
- [[_COMMUNITY_Hero Animation Script|Hero Animation Script]]
- [[_COMMUNITY_SEO, Routes & i18n Alternates|SEO, Routes & i18n Alternates]]
- [[_COMMUNITY_Lead Capture Pipeline (Docs)|Lead Capture Pipeline (Docs)]]
- [[_COMMUNITY_NPM Scripts & Dev Deps|NPM Scripts & Dev Deps]]
- [[_COMMUNITY_Astro Config, Lead API & Stack|Astro Config, Lead API & Stack]]
- [[_COMMUNITY_Runtime Deps & Design Provenance|Runtime Deps & Design Provenance]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Favicon Icon Set|Favicon Icon Set]]
- [[_COMMUNITY_CI Type-Check Gate|CI Type-Check Gate]]
- [[_COMMUNITY_Brand Constants & Analytics|Brand Constants & Analytics]]
- [[_COMMUNITY_OG Social Card|OG Social Card]]
- [[_COMMUNITY_Brand Monogram SVGs|Brand Monogram SVGs]]

## God Nodes (most connected - your core abstractions)
1. `../../../layouts/BaseLayout.astro` - 24 edges
2. `../../components/pages/HomeSections.astro` - 16 edges
3. `../components/seo/SEO.astro` - 15 edges
4. `useTranslations()` - 12 edges
5. `Locale` - 9 edges
6. `localizePath()` - 9 edges
7. `mk()` - 8 edges
8. `buildHero()` - 8 edges
9. `absoluteUrl()` - 8 edges
10. `scripts` - 7 edges

## Surprising Connections (you probably didn't know these)
- `@fontsource/ibm-plex-mono` --implements--> `Self-hosted IBM Plex fonts`  [INFERRED]
  package.json → README.md
- `@fontsource/ibm-plex-sans` --implements--> `Self-hosted IBM Plex fonts`  [INFERRED]
  package.json → README.md
- `Lead capture (CLAUDE.md)` --semantically_similar_to--> `Lead capture (README)`  [INFERRED] [semantically similar]
  CLAUDE.md → README.md
- `Lead capture (CLAUDE.md)` --conceptually_related_to--> `GTM_LEAD_ENDPOINT / GTM_LEAD_SECRET env vars`  [INFERRED]
  CLAUDE.md → docs/lead-integration.md
- `GTM + Consent Mode analytics` --conceptually_related_to--> `Consent Mode v2 default denied`  [INFERRED]
  CLAUDE.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lead pipeline: form to D365** — docs_lead_integration_api_lead_endpoint, docs_lead_integration_hmac_signature, docs_lead_integration_gtm_toolkit_receiver, docs_lead_integration_d365_write_path [EXTRACTED 1.00]
- **Type-safety gate closes Vercel build gap** — github_workflows_ci_astro_check_job, github_workflows_ci_type_safety_gate, claude_vercel_no_astro_check, claude_branches_ci_deploy [EXTRACTED 0.85]
- **Gradvera G monogram brand mark variants** — public_assets_monogram_plain_gradvera_monogram_plain, public_assets_monogram_gradvera_monogram, public_favicons_favicon_gradvera_favicon [INFERRED 0.85]
- **Gradvera favicon / app-icon set — same 'G' brand mark across Android Chrome, Apple touch, and browser favicon sizes** — public_favicons_android_chrome_192x192_gradvera_g_icon_192px, public_favicons_android_chrome_512x512_gradvera_g_icon_512px, public_favicons_apple_touch_icon_gradvera_g_apple_touch_icon, public_favicons_favicon_16x16_gradvera_g_favicon_16px, public_favicons_favicon_32x32_gradvera_g_favicon_32px, public_favicons_favicon_48x48_gradvera_g_favicon_48px, public_favicons_gradvera_g_brand_mark_concept [INFERRED 0.85]

## Communities (15 total, 0 thin omitted)

### Community 0 - "Layout, i18n Runtime & Global Chrome"
Cohesion: 0.11
Nodes (23): @fontsource/ibm-plex-sans/400.css, @fontsource/ibm-plex-sans/500.css, @fontsource/ibm-plex-sans/600.css, @fontsource/ibm-plex-sans/700.css, ../../../components/forms/DemoForm.astro, ../components/layout/Footer.astro, ../components/layout/MobileNav.astro, ../components/marketing/CookieConsent.astro (+15 more)

### Community 1 - "Home Section Components"
Cohesion: 0.14
Nodes (9): ../components/layout/Header.astro, ../../components/pages/HomeSections.astro, t, t, DICTS, getLocaleFromPath(), isLocale(), LOCALES (+1 more)

### Community 2 - "Hero Animation Script"
Cohesion: 0.20
Nodes (15): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+7 more)

### Community 3 - "SEO, Routes & i18n Alternates"
Cohesion: 0.11
Nodes (18): ../components/seo/SEO.astro, alts, canonical, ogAltLocales, ogImage, organizationLd, structuredData, webSiteLd (+10 more)

### Community 4 - "Lead Capture Pipeline (Docs)"
Cohesion: 0.17
Nodes (16): Lead capture (CLAUDE.md), POST /api/lead endpoint contract, D365 Account + Lead write path, Decoupled queue + consumer pattern, GTM_LEAD_ENDPOINT / GTM_LEAD_SECRET env vars, Lead integration end-to-end flow, forwarded soft flag, gtm-toolkit inbound-lead receiver (+8 more)

### Community 5 - "NPM Scripts & Dev Deps"
Cohesion: 0.12
Nodes (15): description, devDependencies, @astrojs/check, typescript, name, private, scripts, astro (+7 more)

### Community 6 - "Astro Config, Lead API & Stack"
Cohesion: 0.19
Nodes (10): GTM + Consent Mode analytics, Astro i18n trilingual model, Gradvera marketing website, Astro 5 static output stack, Consent Mode v2 default denied, Partytown off-thread GTM analytics, GET(), json() (+2 more)

### Community 7 - "Runtime Deps & Design Provenance"
Cohesion: 0.18
Nodes (12): Claude Design project source of truth, DesignSync enforced ordering, dependencies, astro, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, @fontsource/ibm-plex-sans (+4 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 9 - "Favicon Icon Set"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 10 - "CI Type-Check Gate"
Cohesion: 0.50
Nodes (5): Branches, CI & deploy workflow, Vercel builds without astro check, CI astro check job, CI concurrency cancel-in-progress, Type-safety gate

### Community 11 - "Brand Constants & Analytics"
Cohesion: 0.40
Nodes (4): ../components/marketing/Analytics.astro, COMPANY, NAV_ITEMS, SITE

### Community 12 - "OG Social Card"
Cohesion: 0.83
Nodes (4): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (PNG), Gradvera OG social-share card (SVG source)

### Community 13 - "Brand Monogram SVGs"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

## Knowledge Gaps
- **61 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `i18n flat-keyed JSON model` connect `Runtime Deps & Design Provenance` to `Home Section Components`, `Astro Config, Lead API & Stack`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _63 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Layout, i18n Runtime & Global Chrome` be split into smaller, more focused modules?**
  _Cohesion score 0.10837438423645321 - nodes in this community are weakly interconnected._
- **Should `Home Section Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1422924901185771 - nodes in this community are weakly interconnected._
- **Should `SEO, Routes & i18n Alternates` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Should `NPM Scripts & Dev Deps` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._