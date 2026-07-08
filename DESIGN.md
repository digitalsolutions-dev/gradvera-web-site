---
name: Gradvera
description: Construction estimating software — calm, precise, anti-hype marketing site
colors:
  amber: "#E8901C"
  amber-hover: "#C77713"
  amber-pressed: "#9C5C0E"
  amber-soft: "#FBF1DA"
  amber-text: "#7A4708"
  blueprint-navy: "#1E3A8A"
  ink: "#0A1020"
  ink-1: "#0E1525"
  ink-2: "#141E33"
  ink-3: "#1B2740"
  on-ink: "#EEF2FA"
  on-ink-2: "#97A6C0"
  on-ink-3: "#5E6E8C"
  placeholder-ink: "#8290AA"
  slate-ink: "#0F172A"
  slate-2: "#475569"
  slate-3: "#94A3B8"
  slate-label: "#64748B"
  surface: "#FFFFFF"
  page: "#F7F8FA"
  sunken: "#F3F4F6"
  border-default: "#E5E7EB"
  border-strong: "#D1D5DB"
typography:
  display:
    fontFamily: "IBM Plex Sans, Inter, Helvetica Neue, system-ui, sans-serif"
    fontSize: "clamp(38px, 6.2vw, 82px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "IBM Plex Sans, Inter, Helvetica Neue, system-ui, sans-serif"
    fontSize: "clamp(29px, 3.9vw, 50px)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  title:
    fontFamily: "IBM Plex Sans, Inter, Helvetica Neue, system-ui, sans-serif"
    fontSize: "clamp(22px, 2.6vw, 32px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  body:
    fontFamily: "IBM Plex Sans, Inter, Helvetica Neue, system-ui, sans-serif"
    fontSize: "clamp(16px, 1.35vw, 19px)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  gutter: "clamp(20px, 5vw, 64px)"
  section: "clamp(80px, 11vh, 150px)"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "17px 28px"
  button-primary-hover:
    backgroundColor: "{colors.amber-hover}"
    textColor: "#FFFFFF"
  button-ghost-ink:
    backgroundColor: "transparent"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.md}"
    padding: "14px 22px"
  input-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.md}"
    padding: "13px 14px"
  card-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.lg}"
    padding: "clamp(22px, 3vw, 38px)"
  form-card:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.xl}"
    padding: "clamp(24px, 3vw, 36px)"
---

# Design System: Gradvera

## 1. Overview

**Creative North Star: "The Lit Blueprint"**

Gradvera is a dark drafting table seen under a single work lamp. The ground is
deep blueprint navy; one burnished-amber light picks out exactly what matters —
a number, a confidence score, a call to book a demo — and nothing competes with
it. Around that light, the interface annotates itself in IBM Plex Mono, the way a
quantity surveyor marks up a drawing: small, precise, uppercase callouts that
report rather than sell. The voice is calm, precise, and anti-hype: sentence-case
headings, no exclamation marks, no superlatives. Credibility is shown, not
claimed — the hero renders a live estimate (€1.24M · 87% confidence) instead of
asserting accuracy in adjectives.

This system explicitly rejects two things. It is **not a generic SaaS template**
— no cream or gradient-mesh backgrounds, no hero-metric card templates, no endless
identical icon-card grids, no purple gradient buttons, no gradient text. And it is
**not sterile corporate blue** — no stock-photo handshakes, no faceless navy-and-gray
walls of body copy. Warmth and trust are carried by the amber accent, the technical
type voice, and real product visuals, never by decoration.

The site is trilingual (EN / SL / HR) and static-first; performance and legibility
are part of the brand promise, not an afterthought.

**Key Characteristics:**
- Dark blueprint-navy chrome (hero, header, footer, forms); light slate-on-white for the reading body between.
- A single accent — burnished amber `#E8901C` — used as a work-light, sparingly.
- Two IBM Plex faces: Sans for everything readable, Mono for technical annotation only.
- Precision motifs (blueprint wireframe, estimate HUD) that demonstrate the product.
- Content is always visible; motion animates only already-visible elements (reduced-motion safe).

## 2. Colors

A dark technical ground lit by one warm accent, with a calm slate-on-white reading surface for long-form sections.

### Primary
- **Burnished Amber** (`#E8901C`): The single brand accent — the work-light. Fills the primary CTA, marks live-data dots and progress bars, underlines the one thing per fold that must be seen. Hover deepens to **Amber Ember** (`#C77713`), pressed to **Amber Kiln** (`#9C5C0E`).
- **Amber Ink** (`#7A4708`): The amber-as-*text* tone. Raw `#E8901C` scores ~2.2–2.5:1 as text on light surfaces — below AA — so any amber-colored word on the light body uses this darker tone (7.7:1 on white). `#FBF1DA` (**Amber Wash**) is the soft tint for chips and success halos.

### Secondary
- **Blueprint Navy** (`#1E3A8A`): The link and informational accent (drafting-ink blue). Used for inline links and `info` semantic states; never as a second brand color competing with amber.

### Neutral — Dark Chrome
- **Ink** (`#0A1020`): The dominant surface. Hero, header-on-scroll, footer, and input fields sit on it. `#0E1525` / `#141E33` / `#1B2740` (**Ink 1–3**) are the tonal plates for cards and form panels layered on the base.
- **On-Ink** (`#EEF2FA`): Primary text on dark. **On-Ink 2** (`#97A6C0`) for secondary/nav text; **On-Ink 3** (`#5E6E8C`) for the dimmest hairline text only — never body copy. Placeholders use **Placeholder Ink** (`#8290AA`), bumped from On-Ink 3 to clear AA on the input surface.

### Neutral — Light Reading Surface
- **Slate Ink** (`#0F172A`): Primary text on light sections. **Slate 2** (`#475569`) for descriptions, **Slate 3** (`#94A3B8`) for tertiary, **Slate Label** (`#64748B`) for tracked labels.
- **Surface / Page / Sunken** (`#FFFFFF` / `#F7F8FA` / `#F3F4F6`): The light backgrounds between dark chrome. Borders: **Default** (`#E5E7EB`), **Strong** (`#D1D5DB`).

### Named Rules
**The One Light Rule.** Amber is the only accent, and it behaves like a single work-lamp: one clearly dominant amber element per fold. If a screen has amber in three competing places, dim two of them. Its rarity is what makes it read as important.

**The Amber-Never-As-Body-Text Rule.** `#E8901C` is a *fill* and a *marker*, not a text color on light surfaces. Amber-toned words on white/cream must use Amber Ink `#7A4708`. This is enforced in `site-polish.css`; do not undo it.

## 3. Typography

**Display / Body Font:** IBM Plex Sans (with Inter, Helvetica Neue, system-ui fallbacks)
**Label / Annotation Font:** IBM Plex Mono (with JetBrains Mono, ui-monospace fallbacks)

**Character:** One humanist-industrial sans carries every readable word across four weights (400/500/600/700); the mono appears only for technical annotation — eyebrows, field labels, HUD callouts. The mono is earned here (estimating, drawings, numbers), not costume. Numerals run tabular (`tnum`/`lnum`) wherever currency or quantities appear.

### Hierarchy
- **Display** (600, `clamp(38px, 6.2vw, 82px)`, lh 1.02, ls −0.022em): Hero and top-of-page statements only. Ceiling 82px — below the shout threshold; letter-spacing stays above the −0.04em floor.
- **Headline** (600, `clamp(29px, 3.9vw, 50px)`, lh 1.06, ls −0.02em): Section titles (`.h-section`).
- **Title** (600, `clamp(22px, 2.6vw, 32px)`, lh 1.12, ls −0.015em): Sub-section and card titles (`.h-sub`).
- **Body / Lede** (400, `clamp(16px, 1.35vw, 19px)`, lh 1.6): Reading copy; cap measure at ~65–75ch. Secondary uses Slate 2 on light, On-Ink 2 on dark.
- **Label / Eyebrow** (500, 12px, ls 0.18em, uppercase, IBM Plex Mono): Section eyebrows and field labels. Amber on dark, Slate Label on light.

### Named Rules
**The Sentence-Case Rule.** Headings are sentence case. No Title Case, no ALL-CAPS headlines, no exclamation marks anywhere. Caps are reserved for short mono labels only.

**The Mono-Is-Annotation Rule.** IBM Plex Mono is for callouts that *report* — labels, tags, HUD readouts, code. Never set a sentence of marketing prose in mono.

## 4. Elevation

Hybrid, and the split is meaningful. The **light reading surface** uses soft, diffuse slate shadows for genuine elevation: cards rest flat and lift on hover (`translateY(-3px)` plus a deeper shadow). The **dark chrome** stays flat — depth there is conveyed by tonal Ink plates (`#0E1525`→`#1B2740`), not shadow — and reserves glow for signal: an amber `box-shadow` halo means *live data*, not elevation.

### Shadow Vocabulary
- **Ambient rest** (`box-shadow: 0 2px 10px rgba(15,23,42,0.06)`): Light cards at rest (`--shadow-sm`).
- **Ambient raised** (`box-shadow: 0 8px 30px rgba(15,23,42,0.10)`): Product shots and default lifted panels (`--shadow-md`).
- **Ambient hover** (`box-shadow: 0 14px 34px rgba(15,23,42,0.12)` → `0 24px 60px rgba(15,23,42,0.18)`): Interactive lift on cards and figures.
- **Amber glow** (`box-shadow: 0 0 30px rgba(232,144,28,0.45)`): Signal only — live progress bars, active markers, the CTA edge-light. Not a depth cue.

### Named Rules
**The Glow-Signals-Life Rule.** Slate shadow = elevation. Amber glow = live data or focus. Never use amber glow to fake depth on a static surface, and never use a slate drop-shadow on the dark chrome.

## 5. Components

### Buttons
- **Shape:** Gently rounded (8px, `--radius-md`).
- **Primary:** Amber fill (`#E8901C`) with white text on dark chrome and warm near-black (`#1A1916`) on amber over light; inline-flex with a trailing `→` that slides 4px on hover. Large size `17px 28px`; default `14px 22px`. An inset top highlight (`inset 0 1px 0 rgba(255,255,255,0.18)`) gives the fill a lit edge.
- **Hover / Focus:** Background deepens to `#C77713`; `:focus-visible` shows a 2px amber outline at 2px offset. The arrow translates `+4px`.
- **Ghost (on ink):** Transparent with a hairline border (`--ink-hair-2`), On-Ink text; border brightens and a 3% white wash appears on hover.

### Inputs / Fields
- **Style:** Dark fields — `#0A1020` background, hairline border (`--ink-hair-2`), 8px radius, `13px 14px` padding, IBM Plex Sans 15px On-Ink text. Field labels are 12px mono uppercase (ls 0.08em) in On-Ink 2.
- **Focus:** Border shifts to amber (`#E8901C`); native outline removed in favor of the border shift (the global amber `:focus-visible` outline still covers keyboard nav).
- **Placeholder:** `#8290AA` (AA-safe on the field), visibly dimmer than real input text.

### Cards / Containers
- **Corner Style:** 12px (`--radius-lg`); the dark form panel uses 16px.
- **Background:** White (`#FFFFFF`) on light sections; Ink-2 (`#141E33`) for the demo form-card.
- **Shadow Strategy:** Ambient rest → hover lift (see Elevation). Never amber glow.
- **Border:** 1px `--border-default` (`#E5E7EB`), strengthening to `#D1D5DB` on hover.
- **Internal Padding:** `clamp(22px, 3vw, 38px)`.

### Navigation
- **Style:** Fixed transparent header over the hero; on scroll it solidifies (`.solid` — translucent Ink at 82% with a 14px backdrop blur, shrinks 74→64px). Nav links are 15px On-Ink 2 in a floating pill row; hover lifts to On-Ink with a 6% white wash. The primary CTA persists at the right.
- **Mobile:** Below 940px the pill nav collapses to a menu button opening a full-width translucent Ink drawer.

### Hero Blueprint + Estimate HUD (signature)
The hero pairs an SVG wireframe "blueprint" of a building with a floating HUD panel that reads a live estimate — amber spark, `Gradvera · estimating offer`, a large `€1.24M`, a filling amber progress bar, and `Estimate ready · 87% confidence`. This is the system's thesis object: it *shows* the product working instead of describing it. Motion (parallax, bar fill, number tick) only ever animates these already-visible elements.

## 6. Do's and Don'ts

### Do:
- **Do** keep amber to one dominant element per fold (The One Light Rule).
- **Do** use Amber Ink `#7A4708` for any amber-colored text on light surfaces; verify body text ≥4.5:1, large text ≥3:1 (WCAG 2.1 AA).
- **Do** write headings in sentence case with no exclamation marks.
- **Do** reserve IBM Plex Mono for labels, tags, and HUD readouts — annotation, not prose.
- **Do** convey depth on dark chrome with tonal Ink plates, and reserve amber glow for live-data signal.
- **Do** keep content visible by default and animate only already-visible elements; ship a reduced-motion path.
- **Do** test headings in EN, SL, and HR at every breakpoint — the longest translation is part of the design.

### Don't:
- **Don't** ship the **generic SaaS template**: no cream/gradient-mesh backgrounds, hero-metric card templates, identical icon-card grids, purple gradient buttons, or gradient text.
- **Don't** drift into **sterile corporate blue**: no stock-photo handshakes, no faceless navy-and-gray walls of body copy.
- **Don't** use `#E8901C` as body text on light surfaces (fails AA) — use Amber Ink.
- **Don't** set the display heading above 82px or letter-spacing tighter than −0.04em.
- **Don't** add a second competing accent color; blueprint navy is for links/info only.
- **Don't** gate content visibility on a scroll/reveal class — a suspended timeline would strand it hidden.
- **Don't** use amber glow to fake elevation, or slate drop-shadows on the dark chrome.
