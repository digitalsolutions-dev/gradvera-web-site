# Unit tests (Vitest)

`npm run test:unit` — Vitest over `tests/unit/**/*.test.ts`, using Astro's Vite
config (`vitest.config.ts`) so `@/` imports resolve like in the site.

Scope: the pure modules under `src/lib/` (lead scoring, lead payload parsing), the i18n helpers (`alternates()` / EN-only routes, `tests/unit/i18n.test.ts`) and the `/api/lead` route itself (`tests/unit/lead.test.ts` — honeypot drop reply + log, success response shape; `fetch` is stubbed to throw and the lead endpoint is stubbed empty, so no lead is ever forwarded).
Anything that needs the built site or a browser belongs in `tests/e2e/`.
`tests/` is excluded from `tsconfig.json`, so these files never feed the
`astro check` gate; Vitest transpiles them itself.
