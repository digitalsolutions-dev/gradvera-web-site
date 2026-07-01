# Graph Report - /Users/katarov/WebstormProjects/WEB APPs/gradvera-web-site  (2026-07-01)

## Corpus Check
- 23 files · ~32,960 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 204 nodes · 264 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.91)
- Token cost: 0 input · 40,208 output

## Community Hubs (Navigation)
- [[_COMMUNITY_i18n & SEO Layer|i18n & SEO Layer]]
- [[_COMMUNITY_Routes & Components|Routes & Components]]
- [[_COMMUNITY_Client-side site.js|Client-side site.js]]
- [[_COMMUNITY_Project Overview & CI|Project Overview & CI]]
- [[_COMMUNITY_Lead API & Forwarding|Lead API & Forwarding]]
- [[_COMMUNITY_Dependencies (package.json)|Dependencies (package.json)]]
- [[_COMMUNITY_Fonts & Astro Config|Fonts & Astro Config]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Cross-repo Lead Bridges|Cross-repo Lead Bridges]]
- [[_COMMUNITY_Brand Icon Assets|Brand Icon Assets]]
- [[_COMMUNITY_Site Constants|Site Constants]]
- [[_COMMUNITY_Analytics & Consent|Analytics & Consent]]
- [[_COMMUNITY_Brand & OG Cards|Brand & OG Cards]]
- [[_COMMUNITY_CI Type-safety Gate|CI Type-safety Gate]]
- [[_COMMUNITY_Monogram Assets|Monogram Assets]]
- [[_COMMUNITY_IBM Plex Sans 400|IBM Plex Sans 400]]
- [[_COMMUNITY_IBM Plex Sans 500|IBM Plex Sans 500]]
- [[_COMMUNITY_IBM Plex Sans 600|IBM Plex Sans 600]]
- [[_COMMUNITY_IBM Plex Sans 700|IBM Plex Sans 700]]

## God Nodes (most connected - your core abstractions)
1. `../components/seo/SEO.astro` - 14 edges
2. `mk()` - 8 edges
3. `buildHero()` - 8 edges
4. `scripts` - 7 edges
5. `useTranslations()` - 7 edges
6. `Lead Capture Endpoint (/api/lead)` - 7 edges
7. `init()` - 6 edges
8. `Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent` - 6 edges
9. `Gradvera Marketing Website` - 6 edges
10. `line()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `@fontsource/ibm-plex-mono` --implements--> `Self-hosted IBM Plex fonts`  [INFERRED]
  package.json → README.md
- `@fontsource/ibm-plex-sans` --implements--> `Self-hosted IBM Plex fonts`  [INFERRED]
  package.json → README.md
- `Lead Capture Endpoint (/api/lead)` --semantically_similar_to--> `Lead capture (README)`  [INFERRED] [semantically similar]
  CLAUDE.md → README.md
- `Analytics / Consent (GTM + Consent Mode)` --conceptually_related_to--> `Partytown off-thread GTM analytics`  [INFERRED]
  CLAUDE.md → README.md
- `Analytics / Consent (GTM + Consent Mode)` --conceptually_related_to--> `Consent Mode v2 default denied`  [INFERRED]
  CLAUDE.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lead capture and HMAC-signed forwarding flow** — claude_demo_form, claude_lead_capture, claude_honeypot, claude_gtm_lead_endpoint, claude_hmac_signing, claude_gtm_toolkit, claude_dynamics_365 [EXTRACTED 1.00]
- **astro check type-safety verification gate** — claude_astro_check_gate, claude_ci_workflow, claude_vercel_deploy [EXTRACTED 1.00]
- **Branch to CI to Vercel deploy pipeline** — claude_branch_flow, claude_ci_workflow, claude_vercel_deploy [EXTRACTED 1.00]

## Communities (20 total, 4 thin omitted)

### Community 0 - "i18n & SEO Layer"
Cohesion: 0.08
Nodes (30): ../components/marketing/CookieConsent.astro, t, ../../../components/sections/PrivacyBody.astro, ../components/seo/SEO.astro, alts, canonical, ogAltLocales, ogImage (+22 more)

### Community 1 - "Routes & Components"
Cohesion: 0.08
Nodes (14): localizePath(), t, breadcrumbLd, t, breadcrumbLd, t, jsonLd, t (+6 more)

### Community 2 - "Client-side site.js"
Cohesion: 0.20
Nodes (15): buildHero(), cross(), delayFor(), drawConnectors(), init(), line(), mk(), node() (+7 more)

### Community 3 - "Project Overview & CI"
Cohesion: 0.14
Nodes (17): astro check Verification Gate, Astro 5 Static Stack, Branch Flow (feat/fix/docs/ci/chore), CI Workflow (ci.yml astro check job), DemoForm (form component), Design Source of Truth (Claude Design project), design-sync skill / DesignSync MCP, DIGITAL SOLUTIONS d.o.o. (+9 more)

### Community 4 - "Lead API & Forwarding"
Cohesion: 0.15
Nodes (15): POST /api/lead endpoint contract, D365 Account + Lead write path, Decoupled queue + consumer pattern, forwarded soft flag, gtm-toolkit inbound-lead receiver, HMAC-SHA256 signature over raw body, company_website honeypot, Idempotent processed-key ledger (+7 more)

### Community 5 - "Dependencies (package.json)"
Cohesion: 0.12
Nodes (15): description, devDependencies, @astrojs/check, typescript, name, private, scripts, astro (+7 more)

### Community 6 - "Fonts & Astro Config"
Cohesion: 0.18
Nodes (10): dependencies, astro, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, @fontsource/ibm-plex-sans, Design-asset provenance & fidelity rules, i18n flat-keyed JSON model (+2 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 8 - "Cross-repo Lead Bridges"
Cohesion: 0.33
Nodes (7): BaseLayout.astro Bridge, Dynamics 365, GTM_LEAD_ENDPOINT Forwarding, gtm-toolkit inbound-lead service, HMAC-SHA256 Signing, Knowledge Graph (graphify-out), SEO.astro Structured-Data Bridge

### Community 9 - "Brand Icon Assets"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 10 - "Site Constants"
Cohesion: 0.40
Nodes (4): ../components/marketing/Analytics.astro, COMPANY, NAV_ITEMS, SITE

### Community 11 - "Analytics & Consent"
Cohesion: 0.67
Nodes (4): Analytics / Consent (GTM + Consent Mode), CookieConsent (GDPR gate), Consent Mode v2 default denied, Partytown off-thread GTM analytics

### Community 12 - "Brand & OG Cards"
Cohesion: 0.83
Nodes (4): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (PNG), Gradvera OG social-share card (SVG source)

### Community 13 - "CI Type-safety Gate"
Cohesion: 0.67
Nodes (3): CI astro check job, CI concurrency cancel-in-progress, Type-safety gate

### Community 14 - "Monogram Assets"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

## Knowledge Gaps
- **69 isolated node(s):** `name`, `type`, `version`, `private`, `description` (+64 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `i18n flat-keyed JSON model` connect `Fonts & Astro Config` to `i18n & SEO Layer`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `i18n & SEO Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.08367071524966262 - nodes in this community are weakly interconnected._
- **Should `Routes & Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07954545454545454 - nodes in this community are weakly interconnected._
- **Should `Project Overview & CI` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._
- **Should `Lead API & Forwarding` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
- **Should `Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._