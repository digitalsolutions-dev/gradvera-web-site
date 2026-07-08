---
target: the hero banner
total_score: 36
p0_count: 0
p1_count: 2
timestamp: 2026-07-08T08-47-29Z
slug: src-components-sections-hero-astro
---
Method: dual-agent (A: a89d073d6d8d911ad · B: aaa38469044a46e3c)

# Critique — Gradvera hero banner

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | HUD "Analyzing → Estimate ready" is status-as-content; scroll cue + progress bar |
| 2 | Match System / Real World | 4 | Fluent surveyor dialect — €/m³, C25/30, B500B, SECTION A-A, GL ±0.00 |
| 3 | User Control & Freedom | 3 | Scan loops forever (~8s) with no pause (reduced-motion covers it) |
| 4 | Consistency & Standards | 3 | Two competing amber "primary" affordances — header "Book a demo" pill vs hero button |
| 5 | Error Prevention | 4 | n/a — no inputs in the hero |
| 6 | Recognition Rather Than Recall | 4 | Everything visible |
| 7 | Flexibility & Efficiency | 4 | n/a for a hero |
| 8 | Aesthetic & Minimalist | 2 | Amber in 5 places (One Light Rule broken); hierarchy inverted (lamp on the complaint); dense blueprint competes with HUD |
| 9 | Error Recovery | 4 | n/a |
| 10 | Help & Documentation | 4 | n/a |
| **Total** | | **36/40** | **Read the two P1s, not the number** |

**Band caveat:** 36/40 reads "Excellent" on *usability* — but a hero has almost no usability surface to fail (4 heuristics are n/a-solid), so the number is structurally inflated. The real weaknesses are **brand-strategic** (amber overload, inverted hierarchy, mobile signature loss, unlabeled proof) — outside Nielsen's usability frame, captured below.

## Anti-patterns verdict — NOT AI-generated

- **Design review (A):** Not slop. The bespoke SVG blueprint — two-point-perspective tower, scaffolding, tower crane + counter-jib, mobile crane, correct surveyor annotations — is the opposite of the flooded generic-SaaS look; no generator produces it. The HUD survives the "hero-metric template" ban *conditionally*: it's diegetic (the € counts up as a scan beam rises and price-chips land per element), so it's the product working, not a decorative brag — but that defense depends entirely on the motion being seen.
- **Deterministic scan (B):** `detect.mjs --json` on `Hero.astro` and `index.astro` → **0 findings, exit 0, both files clean.** Verified genuine, not suppressed: re-ran `--no-config`, confirmed no rule-muting `config.json`, and proved the detector fires on `.astro` (synthetic bounce-easing tell → correctly flagged). No false positives to adjudicate.
- **Agreement:** LLM and detector agree it's not slop. The detector catches CSS-pattern tells; the hero's actual issues are semantic/strategic, which a static scanner structurally cannot see — so a clean scan is not a clean bill of design health.
- **Fallback signal:** no interactive `[Human]` overlay tab (headless session); evidence = deterministic detector + rendered desktop/mobile screenshots.

## Overall impression

A genuinely strong, credibility-first hero undermined by one recurring mistake: **the amber work-lamp is pointed at the wrong things.** The blueprint + surveyor vocabulary earn instant "these people know construction" trust — the single best asset on the site. But the biggest, brightest element is a *complaint* ("Why does estimating still take so much time?"), amber is smeared across five elements instead of one, and the whole proof apparatus (the animated estimate) is desktop-and-motion-only. Biggest opportunity: **aim the one lamp at the value/answer, and make the proof survive mobile + reduced-motion.**

## What's working

1. **The bespoke blueprint is the anti-slop trump card** — hand-built perspective tower with real construction detail and correct dimension/section/scale marks. Puts the hero above template-land entirely.
2. **The estimating-scan demonstrates the job** — beam rises, price chips land element-by-element (Earthworks €15/m³ → C25/30 €170/m³ → B500B €1,500/t → façade €280/m²), HUD ticks to the total, "Estimate ready." "Show the work, don't claim it" is executed, not asserted.
3. **Register discipline** — sentence-case, zero exclamation marks, mono-as-annotation, content always visible with a real reduced-motion path. Calm and adult, exactly on brief.

## Priority issues

**[P1] Amber overload breaks the One Light Rule.** Amber is in five competing places on one fold: the eyebrow dot, the giant h1 line 2, its underline bar, the CTA, the entire blueprint, and the HUD. DESIGN.md's own rule: "one clearly dominant amber element per fold; if amber is in three competing places, dim two." Nothing is *the* lit object, so the brand's whole metaphor collapses into "amber everywhere." (The detector can't see this — it's semantic.) *Fix:* demote at least two — h1 line 2 to on-ink white with only a keyword in amber, and/or drop blueprint stroke-opacity so the HUD reads as the one lit thing; keep CTA + one anchor amber. *Command:* `/impeccable quieter` (pull back the amber spread).

**[P1] The headline leads with the problem, not the value or the ask.** The largest element on the page is "Why does estimating still take so much time?" A first-timer reading only the h1 learns the *pain*, never that Gradvera prices bids faster and with confidence. The lamp is on the grievance. *Fix:* make line 2 a value statement (or the answer), landing the amber emphasis on the benefit. *Command:* `/impeccable clarify` (rework the hero headline to lead with value).

**[P2] No path to the one conversion in the hero.** PRODUCT.md: the site's job is "book a demo… one unambiguous path." The hero's only button is the soft "See how Gradvera simplifies estimating" → `#helps`; "Book a demo" exists only in the header pill, and the two amber affordances compete for "primary." A search-landing buyer has no above-the-fold demo action. *Fix:* add a co-present "Book a demo" (secondary style) or pin the header CTA on scroll; don't let two amber buttons both read primary. *Command:* `/impeccable clarify` + `/impeccable layout`.

**[P2] Mobile guts the signature.** The HUD is `display:none` below 700px (`site.css:632`), the blueprint sits below the fold, and on first load the cookie banner occludes its top (confirmed in the mobile screenshot). A large share of trilingual SME traffic gets a **text-only hero** — the entire "show don't claim" proof is desktop-only garnish. *Fix:* ship a compact mobile HUD or a static estimate chip, raise/trim the visual, keep the consent banner off it. *Command:* `/impeccable adapt`.

**[P3] Reduced-motion degrades the HUD into the banned static metric card.** Under `prefers-reduced-motion` the scan returns early and the price chips are never created (`site.js:266`); the HUD shows a static "€1.24M / Estimate ready / 87% confidence" — precisely the "big number + label + confidence" anti-reference, minus the story, with no sample label. And the HUD is `aria-hidden="true"` (`Hero.astro:23`), so screen-reader users get *none* of the proof. The "demo not brag" defense is one media query (and one assistive tech) from collapsing. *Fix:* render a couple of price chips in the static/reduced path, add a small "sample estimate" caption, and expose the numeric story to AT. *Command:* `/impeccable harden`.

## Persona red flags (read → book a demo)

- **Jordan (first-timer):** Eyebrow gives "construction estimating"; the giant amber gives a *question about time*, not what the tool does. Sees a cool building + a €-number but may not connect "this software made that." The CTA is a clear next step — but it's "learn more," not "book." Risk: leaves thinking "nice drawing, but what is it?" if they don't scroll.
- **Riley (stress-tester):** **HR is the worst case across every string** — HR eyebrow wraps 2–3 lines with the dot floating; h1 line 1 has `white-space:nowrap` (desktop) so long HR strains the 50% column; h1 line 2 HR wraps to ~3 giant amber lines; the HR CTA is a 3-line button on mobile. Reduced-motion loses the scan + all chips. At 200% zoom, nowrap line-1 + the absolutely-positioned HUD risk overlap against the scaled visual.
- **Casey (distracted mobile):** Signature visual buried/cookie-occluded; the amber button is the one clear thing (fine for a tap) — but the whole credibility apparatus is invisible, so the decision rests on copy alone.
- **Skeptical estimator (project persona):** Loves the surveyor vocabulary and per-element unit rates — insider-correct, trust-earning. But the headline agitates the pain instead of leading with proof, and **€1.24M / 87% confidence are unlabeled and unsourced** — to a buyer who distrusts marketing numbers, unexplained precision reads as invented, not proof. Add the sample tag; lead with proof.

## Minor observations

- Pulsing amber dot signals "live data" on a *static* label — small liveness-theater tell.
- HUD combines glassmorphism *and* a heavy black drop-shadow (`0 18px 44px`) on dark chrome — both mildly against DESIGN.md's own "dark chrome stays flat / glow-signals-life" rules.
- The `.l2::after` amber underline doubles the amber emphasis on the *problem* line specifically.
- The scan loops indefinitely — a persistently moving corner element never lets the fold "settle."
- Body lede is the lowest-contrast running text on the fold (readable — passes AA on `--on-ink-2` — but visually the mutest).
- `.hero-visual { transform: translateY(40px) scale(1.18) }` + `overflow:hidden` risks clipping the left-edge crane/scaffolding at some widths.

## Questions to consider

1. Your brightest element is a question about why estimating is *slow* — should the lamp fall on the grievance, or on the answer?
2. If a viewer never sees the scan (reduced-motion, screenshot, slow paint, mobile), the HUD *is* the "big number + label + confidence" card in your anti-references — is the whole "demo not brag" defense one media query from collapsing?
3. The One Light Rule allows one dominant amber per fold; you have five. Which single element should the estimator's eye hit first?
4. The hero's one button says "see how it works," but the site's only conversion is "book a demo." Deliberate deferral, or has the money CTA been quietly demoted to a header pill?
5. On mobile the entire "show don't claim" apparatus vanishes — is the thesis load-bearing, or a desktop garnish?
