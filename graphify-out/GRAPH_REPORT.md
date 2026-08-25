# Graph Report - /Users/katarov/WebstormProjects/WEB APPs/gradvera-web-site  (2026-08-25)

## Corpus Check
- 137 files · ~117,660 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 674 nodes · 1085 edges · 82 communities (42 shown, 40 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 77 edges (avg confidence: 0.83)
- Token cost: 0 input · 79,442 output

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
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
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
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79

## God Nodes (most connected - your core abstractions)
1. `construction-estimating-software (LP route)` - 25 edges
2. `useTranslations()` - 23 edges
3. `localizePath()` - 19 edges
4. `Locale` - 17 edges
5. `absoluteUrl()` - 16 edges
6. `Confirmed Acquisition Model (v1.2)` - 16 edges
7. `Lead events & conversion tracking (GA4 / Google Ads via GTM)` - 14 edges
8. `Lead integration (website → gtm-toolkit → D365)` - 12 edges
9. `Operational lead score (§8.2)` - 12 edges
10. `§19 Readiness Checklist (17 rows)` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Operational lead score (§8.2)` --semantically_similar_to--> `company_website honeypot`  [INFERRED] [semantically similar]
  docs/confirmed-acquisition-model.md → README.md
- `The Lit Blueprint (Creative North Star)` --semantically_similar_to--> `Brand personality: calm / precise / anti-hype`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md
- `The Sentence-Case Rule` --semantically_similar_to--> `Brand personality: calm / precise / anti-hype`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `localizePath()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts
- `localizePath/stripLocale slug-aware rework (src/i18n/utils.ts)` --references--> `stripLocale()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-seo-growth.md → src/i18n/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Four open tracks (B/C/D/E) forming the Phase-1 launch gate** — docs_next_steps_to_launch_track_b, docs_next_steps_to_launch_track_c, docs_next_steps_to_launch_track_d, docs_next_steps_to_launch_track_e, docs_next_steps_to_launch_launch_gate [EXTRACTED 1.00]
- **Track B flow: GTM setup → consent matrix (row 11) → Ads conversion (row 12)** — docs_next_steps_to_launch_consent_matrix, docs_acquisition_readiness_row_11, docs_acquisition_readiness_row_12 [EXTRACTED 1.00]
- **Track D sales-ops artifacts: demo (13), NDA/preview (14), annual (15), register (16)** — docs_acquisition_readiness_row_13, docs_acquisition_readiness_row_14, docs_acquisition_readiness_row_15, docs_acquisition_readiness_row_16, docs_next_steps_to_launch_track_d [EXTRACTED 1.00]
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

## Communities (82 total, 40 thin omitted)

### Community 0 - "Lead Capture & Scoring"
Cohesion: 0.06
Nodes (51): RFC-3986, Wire Enum Values (country/role/companySize/...), Global Constraints (i18n parity, enums, scoring, response shape), Scoring Table (+2/-2 signals, threshold 7), Task 1: leadScore.ts - Enums + scoreLead(), Task 2: leadPayload.ts + lead.ts Refactor, attr(), Attribution (+43 more)

### Community 1 - "Core Utils & Page Composition"
Cohesion: 0.10
Nodes (21): Task 3: DemoForm Qualification Fields, Task 5: Privacy Policy - Form Data + Attribution Disclosure, DEMO_PAGES, GUARANTEE_PHRASES, GUIDE_PAGES, HOME, PRIVACY, PRODUCT_LINE (+13 more)

### Community 2 - "SEO & i18n Routing"
Cohesion: 0.06
Nodes (34): astro, @astrojs/check, @astrojs/sitemap, @astrojs/vercel, @fontsource/ibm-plex-mono, dependencies, astro, @astrojs/sitemap (+26 more)

### Community 3 - "Acquisition Model & Lead Contract"
Cohesion: 0.09
Nodes (18): landing/ components (LpHero…LpBook, ProductEvidence), Task 2: Landing copy, components, route, JSON-LD, t, t, t, t, DEFAULT_LOCALE, DICTS (+10 more)

### Community 4 - "Claims Policy & Workstream Plans"
Cohesion: 0.12
Nodes (28): Lead integration (website → gtm-toolkit → D365), GTM_LEAD_ENDPOINT / GTM_LEAD_SECRET env vars, gtm-toolkit follow-up (extend WebsiteLead + D365 mapping), gtm-toolkit WebsiteLead receiver (extra=ignore), HMAC-SHA256 signature (x-gradvera-signature), POST /api/lead response matrix (qualified + score), Lead payload validation (parseLeadBody), Google Ads primary conversion rule (qualification_form_submit only) (+20 more)

### Community 5 - "NPM Dependencies"
Cohesion: 0.11
Nodes (20): absoluteUrl(), guideArticleLd(), breadcrumbLd, faqLd, t, breadcrumbLd, faqLd, t (+12 more)

### Community 6 - "Playwright E2E Specs"
Cohesion: 0.13
Nodes (18): LEGACY_SLUG_PATHS, redirects, serialize(), EN_ONLY_ROUTES (src/i18n/slugs.ts), Task 1: EN-only route plumbing, localizePath(), string, t (+10 more)

### Community 7 - "Design Spec & Readiness Docs"
Cohesion: 0.13
Nodes (25): §19 Readiness Checklist (17 rows), gtm-toolkit v2 receiver (image v9), Row 10 — Test booking matched to originating lead, Row 11 — Consent + analytics verified (accept & reject), Row 12 — Google Ads records one valid conversion exactly once, Row 13 — Sample-tenant demo stable and rehearsed, Row 14 — NDA handling + 20-file preview process ready, Row 15 — Annual-agreement requirement in sales materials (+17 more)

### Community 8 - "Site Overview & Analytics"
Cohesion: 0.12
Nodes (15): isEmpty(), Locale, useTranslations(), l10n, strings(), t, breadcrumbLd, t (+7 more)

### Community 9 - "Lead Events & GTM Setup"
Cohesion: 0.09
Nodes (12): ../components/marketing/Analytics.astro, ../components/marketing/CookieConsent.astro, t, jsonLd, t, jsonLd, t, ../styles/cap1-screens.css (+4 more)

### Community 10 - "Hero Animation Script"
Cohesion: 0.10
Nodes (23): Principle 4: Trilingual parity (EN/SL/HR), Analytics.astro component, Astro 5 framework, Claude Design project (design origin), Google Consent Mode v2, CookieConsent banner, Design-asset provenance, Design fidelity rules (+15 more)

### Community 11 - "Cluster Pages & Guide Schema"
Cohesion: 0.19
Nodes (19): applyScroll(), buildHero(), cross(), delayFor(), drawCap2(), drawConnectors(), init(), line() (+11 more)

### Community 12 - "BaseLayout & Fonts"
Cohesion: 0.13
Nodes (21): SEO Growth Implementation Plan (doc), Footer guide links (footer.explore.estGuide/bidGuide), guide.bid.* content brief (construction bid estimate), guide.est.* content brief (construction cost estimation), GuideArticle.astro component (planned), HR 'stavke/stavaka' native-speaker open item, 308 redirects for legacy canonical-slug SL/HR URLs, localizePath/stripLocale slug-aware rework (src/i18n/utils.ts) (+13 more)

### Community 13 - "Brand & Design System"
Cohesion: 0.11
Nodes (17): altLocales, alts, canonical, ogAltLocales, ogImage, organizationLd, string, structuredData (+9 more)

### Community 14 - "SEO Content Guide Pages"
Cohesion: 0.17
Nodes (18): Qualification form & required fields (§8.1), Lead integration (contract v2), POST /api/lead endpoint, Forwarded lead contract v2, D365 Account + Lead (idempotent write), English role label mapping (role → jobtitle), Forwarded lead payload (website → gtm-toolkit, contract v2), HMAC-SHA256 request signature (+10 more)

### Community 15 - "Locale Home Pages"
Cohesion: 0.17
Nodes (16): The Amber-Never-As-Body-Text Rule, Blueprint Navy (#1E3A8A) link/info accent, Burnished Amber accent (#E8901C), Hero Blueprint + Estimate HUD (signature object), IBM Plex Sans/Mono typography system, The Lit Blueprint (Creative North Star), The Mono-Is-Annotation Rule, The One Light Rule (+8 more)

### Community 16 - "OG Images (SL/HR)"
Cohesion: 0.12
Nodes (3): t, t, t

### Community 17 - "Social Listening & SEO Strategy"
Cohesion: 0.24
Nodes (15): Acquisition model section (source-of-truth rule), CLAUDE.md (project guidance doc), Lead capture (/api/lead), src/lib/ pure unit-tested helpers (leadScore.ts, leadPayload.ts), Required analytics events & conversion hierarchy (§11.1/§11.2), Attribution fields captured with every lead (§8.3), Confirmed Acquisition Model (doc, v1.1), Operational lead score (§8.2) (+7 more)

### Community 18 - "Book-a-Demo Pages"
Cohesion: 0.18
Nodes (15): Confirmed Acquisition Model (v1.2), Twenty-file customer-specific preview (§10.2), Confirmed acquisition journey (§5), Google Search Ads launch model (§12), Positioning & prohibited-claims policy (§6.2), Consent & verification requirement (§11.3), Microsoft Bookings booking spec (§9), Phase-0 foundation & gate (§13) (+7 more)

### Community 19 - "TypeScript Config"
Cohesion: 0.20
Nodes (14): CLAUDE.md — project guidance, Acquisition Readiness — Evidence Log (§19), Lead events & conversion tracking (GA4/GTM), Google Ads conversion = qualification_form_submit, BookingEmbed (lazy iframe + RefID), Client dataLayer conversion events, GTM container setup (user action), Next Steps to Phase-1 Launch (runbook) (+6 more)

### Community 20 - "Privacy Policy Pages"
Cohesion: 0.35
Nodes (12): ICP hypothesis (§4), Negative-keyword themes (§12.3), Marked-for-Brainstorm Session (superpowers:brainstorming), Buying Triggers & Audience (Small Subs vs ENR Heavy-Civil), Competitor Mentions, Social Listening — SEO & Sales-Strategy Brainstorm Input, ENR Top-50 Heavy-Civil Contractors Software Usage, Exact Phrases → Keyword Candidates (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.30
Nodes (11): Workstream A Claims Sweep Implementation Plan, Global Constraints (Workstream A Plan), Parts-Sync Helper, Task 0 — Branch, Baseline, Parts-Sync Helper, Task 1 — Remove 'Measured in Practice' Results Section, Task 2 — Disclose Gradvera ↔ DIGITAL SOLUTIONS Relationship, Task 3 — Soften Guarantee Verbs, Task 4 — Pin Excel BoQ Input in Guides (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (10): Slovenian Tagline: Programska oprema za gradbeno ocenjevanje, Lit Blueprint Brand Identity (navy chrome + amber G monogram), Gradvera OG Image (Croatian), Gradvera Brand Wordmark & Amber G Monogram, Open Graph Social-Share Preview (HR locale), Gradvera OG Image Source (HR), Croatian Tagline — Softver za izradu građevinskih troškovnika, Gradvera OG Image (Slovenian) (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.20
Nodes (9): compilerOptions, allowJs, baseUrl, paths, resolveJsonModule, exclude, extends, include (+1 more)

### Community 24 - "Community 24"
Cohesion: 0.28
Nodes (9): System deps install is best-effort (continue-on-error), bounded to 3 minutes, check job: astro check + npm run test:unit on ubuntu-latest, Chromium install bounded/retried, not via apt --with-deps, concurrency group ci-${{ github.ref }} cancels superseded runs, .github/workflows/ci.yml — CI workflow, e2e job: Playwright browser checks, 20-minute timeout, e2e job capped at timeout-minutes: 20, astro check verification gate (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.28
Nodes (9): Branch flow & deploy model (main/staging, Vercel), Knowledge graph / graphify update policy, Claims policy constraints (§6.2), Workstream E — Acquisition Landing Page Implementation Plan, Internal links (footer, guides, homepage HelpsIntro), SoftwareApplication + FAQPage + BreadcrumbList JSON-LD, ProductEvidence empty-shots gating (no placeholder art), Task 3: Internal links + claims spec + sitemap assertion (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.43
Nodes (5): Task 4: Attribution Capture (attribution.js), capture(), hasClickId(), read(), write()

### Community 27 - "Community 27"
Cohesion: 0.52
Nodes (7): Gradvera 'G' brand mark, Android Chrome icon 192x192, Gradvera 'G' brand mark, Android Chrome icon 512x512, Gradvera 'G' brand mark, Apple touch icon, Gradvera 'G' brand mark, browser favicon 16x16, Gradvera 'G' brand mark, browser favicon 32x32, Gradvera 'G' brand mark, browser favicon 48x48, Gradvera 'G' brand mark: angular amber square-spiral G on dark charcoal with orange corner accent

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (6): Lead attribution capture (§8.3), Inbound-acquisition website design spec, attribution.js first-touch capture, ProductEvidence component, Workstreams A–F implementation order, lead-form.spec.mjs

### Community 29 - "Community 29"
Cohesion: 0.33
Nodes (4): FONT_PKG, OG_DIR, ROOT, svgs

### Community 30 - "Community 30"
Cohesion: 0.33
Nodes (4): LOCAL_PROOF, LOCALIZED_COMPONENTS, ROOT, SENTINELS

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (5): EN-only acquisition landing route (/construction-estimating-software/), EU hosting confirmed (§7.2.8), Netherlands landing-page structure (§7.2), 12 landing-page sections (acquisition model §7.2), Workstream E — landing page

### Community 32 - "Community 32"
Cohesion: 0.40
Nodes (3): PORT, ROOT, TYPES

### Community 33 - "Community 33"
Cohesion: 0.67
Nodes (4): Gradvera Open Graph Image, Gradvera G Monogram (amber blueprint mark), Construction Estimating Software Tagline, Gradvera Wordmark

### Community 34 - "Community 34"
Cohesion: 0.67
Nodes (3): 20-file NDA customer-specific preview cap (§10.2), Provisional funnel controls (§14), Qualified demo → booking as primary conversion (§2.5, §11.2)

### Community 35 - "Community 35"
Cohesion: 0.67
Nodes (3): Principle 3: Credibility is the conversion, Product purpose: convert qualified interest into a booked demo (to D365), Users: construction estimators / quantity surveyors / bid teams

### Community 36 - "Community 36"
Cohesion: 1.00
Nodes (3): Gradvera monogram (on dark tile), Gradvera monogram (plain, transparent), Gradvera favicon

### Community 37 - "Community 37"
Cohesion: 1.00
Nodes (3): Construction estimating software (Gradvera product tagline), Gradvera brand / product identity, Gradvera OG social-share card (SVG source)

### Community 38 - "Community 38"
Cohesion: 0.67
Nodes (3): consts.ts (brand facts, integration ids), Open Graph images / render-og.mjs, SEO.astro component

## Knowledge Gaps
- **213 isolated node(s):** `t`, `t`, `t`, `breadcrumbLd`, `t` (+208 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Lead integration (website → gtm-toolkit → D365)` connect `Claims Policy & Workstream Plans` to `Lead Capture & Scoring`, `SEO Content Guide Pages`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `Lead events & conversion tracking (GA4 / Google Ads via GTM)` connect `Claims Policy & Workstream Plans` to `TypeScript Config`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `Operational lead score (§8.2)` connect `Social Listening & SEO Strategy` to `Lead Capture & Scoring`, `Claims Policy & Workstream Plans`, `SEO Content Guide Pages`, `Book-a-Demo Pages`, `TypeScript Config`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `t`, `t`, `t` to the rest of the system?**
  _213 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Lead Capture & Scoring` be split into smaller, more focused modules?**
  _Cohesion score 0.06370543541788427 - nodes in this community are weakly interconnected._
- **Should `Core Utils & Page Composition` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `SEO & i18n Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._