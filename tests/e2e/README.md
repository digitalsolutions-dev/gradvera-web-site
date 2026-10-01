# End-to-end / browser checks (Playwright)

A browser harness for the things `astro check` and static HTML greps can't
verify: interaction, focus management, computed layout, responsive overflow, and
runtime console errors. It runs **in CI** (the `e2e` job in `ci.yml`) and
locally. `astro check` stays the type-safety gate — this suite is additive, not
a replacement. Server-side logic (lead scoring/parsing) is covered by Vitest in
`tests/unit/`, not here.

## One-time setup

```bash
npm install                       # installs @playwright/test (devDependency)
npx playwright install chromium   # downloads the browser (not committed)
```

## Run

```bash
npm run test:e2e            # builds the site, serves dist/client, runs all specs
npm run test:e2e -- --headed        # watch it drive a real browser
npm run test:e2e -- mobile-nav      # a single spec by name
npm run test:e2e:report             # open the last HTML report (generated with CI=1)
```

`test:e2e` builds the production site itself (via the `webServer` in
`playwright.config.mjs`) and serves the real `dist/client` output — so the
checks run against the exact artifact Vercel ships, not `astro dev`.

## Layout

| file | purpose |
|------|---------|
| `playwright.config.mjs` | config + `webServer` that builds & serves `dist/client` |
| `serve-dist.mjs` | zero-dep static server (serves `/`, `/sl/`, `/hr/`, assets; unknown paths get `404.html` with status 404, mirroring Vercel) |
| `helpers.mjs` | reusable bits: `VIEWPORTS`, `gotoClean` (drops the consent banner), `boxOf`, `rectsOverlap`, `checkChip`, `fillRequired`, `openOptional` (reveals the collapsed optional-qualifier disclosure), `armLeadCapture`, `stubBookings` |
| `mobile-nav.spec.mjs` | MobileNav a11y: open state, focus trap, Escape, scrim, scroll-lock, breakpoint auto-close |
| `homepage.spec.mjs` | one-`h1`, mockups `aria-hidden`, no h-scroll @375, no JSON-LD price, no hero SVG console error, Cap2 no-overlap across locales × widths |
| `seo.spec.mjs` | 404 page (status 404, noindex, client-side SL/HR localization), per-locale OG image + localized `og:image:alt`, hero font preloads (latin / latin-ext), canonical host stays apex |
| `header-responsive.spec.mjs` | header band overflow / responsive behavior across widths; on the 3 book-a-demo pages the header + mobile-menu CTA scrolls to the form column `#demo-form-col` (no reload, column top clears the fixed header — also after a successful submit has hidden the form), home pages keep the book-a-demo target |
| `lang-picker.spec.mjs` | globe dropdown: options, hreflang hrefs (incl. localized SL/HR slugs), keyboard behavior |
| `i18n-parity.spec.mjs` | SL/HR pages leak no hardcoded English mock-screen copy; every `t()` key exists in all three dictionaries; HR proofreading (lektura 2026-10-01): no "demonstracija" / "Rezervirajte" anywhere in the raw HTML of the 5 HR pages (title, meta, JSON-LD, iframe title included — the `rezervirajte-demo` URL slug is unchanged), the header / hero / CTA-band / footer / guide / form-submit CTAs, the demo page `<title>` and the Bookings iframe title read "Zakažite prezentaciju", proofread Helps + CTA-band headings (amber on "pouzdana", as SL) |
| `number-format.spec.mjs` | SL/HR locale number rendering in the mock screens (decimal comma, NBSP before %) |
| `lead-events.spec.mjs` | §11.1 dataLayer events (`qualification_form_start` once, `qualification_form_submit` w/ qualified+score, `qualified_lead` conditional, `booking_widget_open` once, no `generate_lead`) + Bookings embed (hidden block, direct link with `RefID`, iframe `src` only after 2xx, sanitized `utm_campaign` → RefID, failure path) on EN/SL/HR; honeypot reply (`{"ok":true}`, no `qualified`) → the trap value still POSTs, success + calendar, no `qualification_form_submit`/`qualified_lead`; a non-JSON 2xx still counts (`qualified:false, score:0`); helpers `BOOKING_URL`, `stubBookings` (no real outlook.office.com load) |
| `lead-form.spec.mjs` | qualification form: required set + enum wire values + optional blanks on the intercepted `/api/lead` POST per locale (`helpers.armLeadCapture`), locale default country, chip validation; first-touch attribution (gclid/utm survive navigation, first touch wins, consent from `gv-consent`); spam trap `hp_field` unrendered, unfocusable, no autofill-bait name/label (no `company_website`), and a filled trap never kills the submit (required-field errors still show); Chrome's real autofill engine (CDP `Autofill.trigger` from `#fn` / `#co` / `#em` on EN/SL/HR + the LP) never fills or classifies the trap or any other non-contact field (the test profile also carries a street/city/zip, so an address-typed decoy would be filled and caught; every other form control stays empty in the DOM) and, per Chrome's own `addressFormFilled` report, fills and types fullName, company, email, phone and country as one section — this group launches the full Chromium (`channel: 'chromium'`; the default headless shell has no `Autofill` domain), which `npx playwright install chromium` provides, and fails (never skips) if the domain or the fill event is missing |
| `demo-form-layout.spec.mjs` | Book-a-demo redesign: stacked layout (form card 760–900px at desktop on all 3 demo pages + the LP book section), the optional qualifiers behind a closed `details.form-more` disclosure that still posts its values (EN + HR), `#country` keeps native `<select>` semantics (13 options) under custom chrome (`appearance: none`/`base-select`), no h-scroll at 390 (EN + HR), card geometry — `.form-sec` divider spans the card and the submit button reaches the card edge (neither inherits `.demo p`'s 380px prose measure) plus the button stays inside the card padding at 320, "what happens next" as a 3-across strip |
| `localized-slugs.spec.mjs` | localized SL/HR routes serve 200 with correct canonical/hreflang; legacy-URL 308s match both slash forms in the Vercel config; sitemap uses localized slugs |
| `content-pages.spec.mjs` | guide pages ×6: status 200, FAQPage JSON-LD, hreflang set, CTA; footer links in every locale |
| `landing.spec.mjs` | acquisition landing page `/construction-estimating-software/`: 200 + one H1, title/description limits, self canonical, hreflang en + x-default only, JSON-LD (SoftwareApplication/FAQPage/BreadcrumbList), section anchors, header + mobile CTA → `#book-a-demo`, ProductEvidence renders four coded reproductions (illustrations), LangSwitch → locale homes, no overflow 360/768/1280, claims-safe copy (negations present), form posts `page=construction-estimating-software` and reveals Bookings with `RefID=website-lp`, internal links (footer ×3, guides, HelpsIntro) |
| `claims.spec.mjs` | Claims policy (acquisition model §6.2/§7.1): no measured-results / profit-guarantee / own-data-demo copy; Excel input, DS-relationship footer line, sample-data guided demo + annual route present (EN/SL/HR) |

## Adding a check

New spec: `something.spec.mjs`, `import { test, expect } from '@playwright/test'`
and the helpers. Set a viewport with `test.use({ viewport: VIEWPORTS.desktop })`.
Use `gotoClean(page, '/sl/')` to land on a page with the consent banner removed.

## CI

Wired into `.github/workflows/ci.yml` as the **`e2e`** job (runs beside `astro
check` on every PR and on pushes to `main` / `staging`): `npx playwright install
chromium` (bounded, retried once) → a best-effort `npx playwright install-deps
chromium` (bounded, `continue-on-error` — no `--with-deps`, whose apt step stalls
on runner images) → `npm run test:e2e` with `CI=1` (enables a retry + the HTML
report). On failure the `playwright-report/` folder is uploaded as a
build artifact. `astro check` remains the type-safety gate; this job is additive.
