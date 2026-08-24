# Graph Report - /Users/katarov/WebstormProjects/WEB APPs/gradvera-web-site  (2026-08-24)

## Corpus Check
- 137 files · ~115,729 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 658 nodes · 1070 edges · 76 communities (35 shown, 41 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 78 edges (avg confidence: 0.83)
- Token cost: 0 input · 128,382 output

## Community Hubs (Navigation)
- Lead Capture & Scoring
- Core Utils & Page Composition
- SEO & i18n Routing
- Acquisition Model & Lead Contract
- Claims Policy & Workstream Plans
- NPM Dependencies
- Playwright E2E Specs
- Design Spec & Readiness Docs
- Site Overview & Analytics
- Lead Events & GTM Setup
- Hero Animation Script
- Cluster Pages & Guide Schema
- BaseLayout & Fonts
- Brand & Design System
- SEO Content Guide Pages
- Locale Home Pages
- OG Images (SL/HR)
- Social Listening & SEO Strategy
- Book-a-Demo Pages
- TypeScript Config
- Privacy Policy Pages
- Brand Mark Assets
- OG Image Renderer
- i18n Parity Test
- Dist Static Server
- Brand Image Assets
- Cost Estimation Page
- HR Troskovnik Page
- Product Purpose & Users
- Monogram & Favicon
- LP Brand Identity
- OG & SEO Wiring
- Vercel Redirect Patch
- HR Homepage
- Header Responsive Test
- Localized Slugs Test
- Playwright Config
- Elevation & Glow Design
- Vitest Harness Setup
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73

## God Nodes (most connected - your core abstractions)
1. `construction-estimating-software (LP route)` - 27 edges
2. `useTranslations()` - 23 edges
3. `localizePath()` - 19 edges
4. `Confirmed Acquisition Model (v1.2)` - 18 edges
5. `Locale` - 17 edges
6. `absoluteUrl()` - 16 edges
7. `Lead events & conversion tracking (GA4 / Google Ads via GTM)` - 14 edges
8. `Lead integration (website → gtm-toolkit → D365)` - 12 edges
9. `Workstream E — Acquisition Landing Page Implementation Plan` - 11 edges
10. `Positioning & prohibited-claims policy (§6.2)` - 11 edges

## Surprising Connections (you probably didn't know these)
- `The Lit Blueprint (Creative North Star)` --semantically_similar_to--> `Brand personality: calm / precise / anti-hype`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md
- `The Sentence-Case Rule` --semantically_similar_to--> `Brand personality: calm / precise / anti-hype`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `stripLocale()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts
- `construction-estimating-software (LP route)` --references--> `Workstream E — landing page`  [EXTRACTED]
  src/pages/construction-estimating-software/index.astro → docs/superpowers/specs/2026-08-18-inbound-acquisition-website-design.md
- `The Lit Blueprint (Creative North Star)` --conceptually_related_to--> `Principle 2: Show the work, don't claim it`  [INFERRED]
  DESIGN.md → PRODUCT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase-0 acquisition readiness gate** — docs_confirmed_acquisition_model_acquisition_readiness, docs_acquisition_readiness_doc, docs_acquisition_readiness_19_checklist, docs_confirmed_acquisition_model_staged_investment_phases [INFERRED 0.85]
- **Acquisition model documentation chain** — docs_confirmed_acquisition_model_doc, docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_doc, docs_acquisition_readiness_doc, claude_doc [INFERRED 0.85]
- **Landing page verification (implementation task, e2e spec, unit test)** — docs_superpowers_plans_2026_08_19_ws_e_landing_page_task2_landing_copy_components, tests_e2e_readme_landing_spec, tests_unit_readme_i18n_test [INFERRED 0.75]
- **Bookings reveal + dataLayer events mechanism** — claude_lead_capture, docs_lead_tracking_ga4_doc, docs_superpowers_plans_2026_08_19_ws_cd_bookings_events_task_2 [INFERRED 0.85]
- **Lead contract v2 pipeline (validate → forward → D365)** — docs_lead_integration_contract_v2, src_pages_api_lead, src_lib_leadpayload [EXTRACTED 1.00]
- **CI's two jobs (check, e2e) enforce the documented verification gates** — _github_workflows_ci_check_job, _github_workflows_ci_e2e_job [INFERRED 0.85]
- **Workstream B Tasks Implementing Spec** — docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_1, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_2, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_3, docs_superpowers_plans_2026_08_19_ws_b_qualification_form_task_4 [EXTRACTED 1.00]
- **Claims Policy Enforcement Chain (task → regression spec → README catalog → policy doc)** — docs_superpowers_plans_2026_08_18_ws_a_claims_sweep_task_1_remove_results_section, tests_e2e_claims_spec_mjs, tests_e2e_readme_doc, docs_confirmed_acquisition_model_claims_policy [INFERRED 0.75]
- **Slug map as single source of truth for localized routing, sitemap alternates, and legacy 308 redirects** — docs_superpowers_plans_2026_08_05_seo_growth_slug_map, docs_superpowers_plans_2026_08_05_seo_growth_localizepath_rework, docs_superpowers_plans_2026_08_05_seo_growth_sitemap_serialize, docs_superpowers_plans_2026_08_05_seo_growth_patch_vercel_redirects, docs_superpowers_plans_2026_08_05_seo_growth_legacy_redirects, astro_config [EXTRACTED 1.00]
- **Lead capture pipeline (form → endpoint → toolkit → D365)** — docs_superpowers_specs_2026_08_18_inbound_acquisition_website_design_demoform, docs_lead_integration_api_lead, docs_lead_integration_contract_v2, docs_lead_integration_hmac, docs_lead_integration_gtm_toolkit_receiver, docs_lead_integration_d365_lead [EXTRACTED 1.00]
- **Conversion analytics & consent flow** — docs_lead_tracking_ga4_datalayer_events, docs_lead_tracking_ga4_booking_embed, docs_lead_tracking_ga4_gtm_setup, docs_lead_tracking_ga4_ads_conversion, docs_lead_tracking_ga4_consent_matrix [EXTRACTED 1.00]
- **Phase-0 readiness gating apparatus** — docs_confirmed_acquisition_model_readiness_definition, docs_confirmed_acquisition_model_phase0_gate, docs_acquisition_readiness, docs_next_steps_to_launch_launch_gate [INFERRED 0.85]

## Communities (76 total, 41 thin omitted)

### Community 0 - "Lead Capture & Scoring"
Cohesion: 0.06
Nodes (52): RFC-3986, Wire Enum Values (country/role/companySize/...), Global Constraints (i18n parity, enums, scoring, response shape), Scoring Table (+2/-2 signals, threshold 7), Task 1: leadScore.ts - Enums + scoreLead(), Task 2: leadPayload.ts + lead.ts Refactor, Task 3: DemoForm Qualification Fields, attr() (+44 more)

### Community 1 - "Core Utils & Page Composition"
Cohesion: 0.05
Nodes (29): landing/ components (LpHero…LpBook, ProductEvidence), BookingEmbed.astro component (plan spec), ProductEvidence empty-shots gating (no placeholder art), Task 2: Landing copy, components, route, JSON-LD, t, t, t, t (+21 more)

### Community 2 - "SEO & i18n Routing"
Cohesion: 0.08
Nodes (36): LEGACY_SLUG_PATHS, redirects, serialize(), EN_ONLY_ROUTES (src/i18n/slugs.ts), 308 redirects for legacy canonical-slug SL/HR URLs, localizePath/stripLocale slug-aware rework (src/i18n/utils.ts), scripts/patch-vercel-redirects.mjs (planned), PR2: feat/localized-slugs (+28 more)

### Community 3 - "Acquisition Model & Lead Contract"
Cohesion: 0.09
Nodes (40): CLAUDE.md — project guidance, Acquisition readiness — evidence log (§19), Confirmed Acquisition Model (v1.2), Twenty-file customer-specific preview (§10.2), Confirmed acquisition journey (§5), Lead attribution capture (§8.3), Consent & verification requirement (§11.3), Operational lead score (§8.2) (+32 more)

### Community 4 - "Claims Policy & Workstream Plans"
Cohesion: 0.08
Nodes (37): System deps install is best-effort (continue-on-error), bounded to 3 minutes, check job: astro check + npm run test:unit on ubuntu-latest, Chromium install bounded/retried, not via apt --with-deps, concurrency group ci-${{ github.ref }} cancels superseded runs, .github/workflows/ci.yml — CI workflow, e2e job: Playwright browser checks, 20-minute timeout, e2e job capped at timeout-minutes: 20, astro check verification gate (+29 more)

### Community 5 - "NPM Dependencies"
Cohesion: 0.06
Nodes (34): astro, @astrojs/check, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, dependencies, astro, @astrojs/sitemap (+26 more)

### Community 6 - "Playwright E2E Specs"
Cohesion: 0.10
Nodes (19): DEMO_PAGES, GUARANTEE_PHRASES, GUIDE_PAGES, HOME, PRIVACY, PRODUCT_LINE, PAGES, armLeadCapture() (+11 more)

### Community 7 - "Design Spec & Readiness Docs"
Cohesion: 0.11
Nodes (32): Acquisition model section (source-of-truth rule), CLAUDE.md (project guidance doc), EN-only acquisition landing route (/construction-estimating-software/), Lead capture (/api/lead), src/lib/ pure unit-tested helpers (leadScore.ts, leadPayload.ts), §19 checklist (17-row evidence table), Dashboard & operational checklists (GTM/GA4/Ads, Bookings page, GSC, Google Ads, gtm-toolkit v2), Acquisition readiness evidence log (doc) (+24 more)

### Community 8 - "Site Overview & Analytics"
Cohesion: 0.07
Nodes (31): Principle 4: Trilingual parity (EN/SL/HR), Analytics.astro component, /api/lead lead-capture endpoint, Astro 5 framework, Claude Design project (design origin), Google Consent Mode v2, CookieConsent banner, DemoForm.astro demo/contact form (+23 more)

### Community 9 - "Lead Events & GTM Setup"
Cohesion: 0.11
Nodes (30): Lead integration (website → gtm-toolkit → D365), English role label mapping (role → jobtitle), GTM_LEAD_ENDPOINT / GTM_LEAD_SECRET env vars, Forwarded lead payload (website → gtm-toolkit, contract v2), gtm-toolkit follow-up (extend WebsiteLead + D365 mapping), gtm-toolkit WebsiteLead receiver (extra=ignore), HMAC-SHA256 signature (x-gradvera-signature), POST /api/lead response matrix (qualified + score) (+22 more)

### Community 10 - "Hero Animation Script"
Cohesion: 0.19
Nodes (19): applyScroll(), buildHero(), cross(), delayFor(), drawCap2(), drawConnectors(), init(), line() (+11 more)

### Community 11 - "Cluster Pages & Guide Schema"
Cohesion: 0.15
Nodes (14): absoluteUrl(), guideArticleLd(), breadcrumbLd, faqLd, t, breadcrumbLd, faqLd, t (+6 more)

### Community 12 - "BaseLayout & Fonts"
Cohesion: 0.12
Nodes (8): ../components/marketing/Analytics.astro, ../components/marketing/CookieConsent.astro, t, ../styles/cap1-screens.css, ../styles/cap-screens.css, ../styles/gradvera-tokens.css, ../styles/site.css, ../styles/site-polish.css

### Community 13 - "Brand & Design System"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 14 - "SEO Content Guide Pages"
Cohesion: 0.20
Nodes (12): SEO Growth Implementation Plan (doc), Footer guide links (footer.explore.estGuide/bidGuide), guide.bid.* content brief (construction bid estimate), guide.est.* content brief (construction cost estimation), GuideArticle.astro component (planned), HR 'stavke/stavaka' native-speaker open item, PR1: feat/lead-event-ga4, PR3: feat/content-pages (+4 more)

### Community 15 - "Locale Home Pages"
Cohesion: 0.18
Nodes (9): isEmpty(), useTranslations(), l10n, strings(), t, jsonLd, t, jsonLd (+1 more)

### Community 16 - "OG Images (SL/HR)"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 17 - "Social Listening & SEO Strategy"
Cohesion: 0.47
Nodes (10): Marked-for-Brainstorm Session (superpowers:brainstorming), Buying Triggers & Audience (Small Subs vs ENR Heavy-Civil), Competitor Mentions, Social Listening — SEO & Sales-Strategy Brainstorm Input, ENR Top-50 Heavy-Civil Contractors Software Usage, Exact Phrases → Keyword Candidates, Pains & Objections Extraction, r/estimators: What Construction Estimating Software Do You Use? (+2 more)

### Community 18 - "Book-a-Demo Pages"
Cohesion: 0.20
Nodes (6): breadcrumbLd, t, breadcrumbLd, t, breadcrumbLd, t

### Community 19 - "TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 20 - "Privacy Policy Pages"
Cohesion: 0.28
Nodes (5): Task 5: Privacy Policy - Form Data + Attribution Disclosure, Locale, t, t, t

### Community 21 - "Brand Mark Assets"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 22 - "OG Image Renderer"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 23 - "i18n Parity Test"
Cohesion: 0.33
Nodes (4): LOCAL_PROOF, LOCALIZED_COMPONENTS, ROOT, SENTINELS

### Community 24 - "Dist Static Server"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 25 - "Brand Image Assets"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 26 - "Cost Estimation Page"
Cohesion: 0.50
Nodes (3): breadcrumbLd, faqLd, t

### Community 27 - "HR Troskovnik Page"
Cohesion: 0.50
Nodes (3): breadcrumbLd, faqLd, t

### Community 28 - "Product Purpose & Users"
Cohesion: 0.67
Nodes (3): Principle 3: Credibility is the conversion, Product purpose: convert qualified interest into a booked demo (to D365), Users: construction estimators / quantity surveyors / bid teams

### Community 29 - "Monogram & Favicon"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 30 - "LP Brand Identity"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

### Community 31 - "OG & SEO Wiring"
Cohesion: 0.67
Nodes (3): consts.ts (brand facts, integration ids), Open Graph images / render-og.mjs, SEO.astro component

## Knowledge Gaps
- **206 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Lead integration (website → gtm-toolkit → D365)` connect `Lead Events & GTM Setup` to `Lead Capture & Scoring`, `Acquisition Model & Lead Contract`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `Forwarded lead contract v2` connect `Acquisition Model & Lead Contract` to `Lead Capture & Scoring`, `Lead Events & GTM Setup`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `construction-estimating-software (LP route)` connect `Core Utils & Page Composition` to `Design Spec & Readiness Docs`, `Cluster Pages & Guide Schema`, `BaseLayout & Fonts`, `Locale Home Pages`, `Privacy Policy Pages`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Lead Capture & Scoring` be split into smaller, more focused modules?**
  _Cohesion score 0.06271186440677966 - nodes in this community are weakly interconnected._
- **Should `Core Utils & Page Composition` be split into smaller, more focused modules?**
  _Cohesion score 0.05376972530683811 - nodes in this community are weakly interconnected._
- **Should `SEO & i18n Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.07505285412262157 - nodes in this community are weakly interconnected._