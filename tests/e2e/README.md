# End-to-end / browser checks (Playwright)

An **opt-in** browser harness for the things `astro check` and static HTML greps
can't verify: interaction, focus management, computed layout, responsive
overflow, and runtime console errors. `astro check` remains the CI gate — this
suite is run locally (or wired into CI deliberately, see below).

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
npm run test:e2e:report             # open the last HTML report (CI runs only)
```

`test:e2e` builds the production site itself (via the `webServer` in
`playwright.config.mjs`) and serves the real `dist/client` output — so the
checks run against the exact artifact Vercel ships, not `astro dev`.

## Layout

| file | purpose |
|------|---------|
| `playwright.config.mjs` | config + `webServer` that builds & serves `dist/client` |
| `serve-dist.mjs` | zero-dep static server (serves `/`, `/sl/`, `/hr/`, assets) |
| `helpers.mjs` | reusable bits: `VIEWPORTS`, `gotoClean` (drops the consent banner), `boxOf`, `rectsOverlap` |
| `mobile-nav.spec.mjs` | MobileNav a11y: open state, focus trap, Escape, scrim, scroll-lock, breakpoint auto-close |
| `homepage.spec.mjs` | one-`h1`, mockups `aria-hidden`, no h-scroll @375, no JSON-LD price, no hero SVG console error, Cap2 no-overlap across locales × widths |

## Adding a check

New spec: `something.spec.mjs`, `import { test, expect } from '@playwright/test'`
and the helpers. Set a viewport with `test.use({ viewport: VIEWPORTS.desktop })`.
Use `gotoClean(page, '/sl/')` to land on a page with the consent banner removed.

## CI (optional)

Not wired into `ci.yml` by default (needs a browser download, ~2–3 min). To add
it: `npx playwright install --with-deps chromium` then `npm run test:e2e` in a
job, with `CI=1` set (enables retries + the HTML report artifact).
