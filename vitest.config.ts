/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Reuses Astro's Vite config so `@/` (tsconfig paths) and TS resolve exactly as
// in the site. Unit tests cover the pure modules under src/lib and the
// /api/lead route itself — the e2e harness (tests/e2e) runs against the static
// build and cannot reach the on-demand route, so server-side logic is proven here.
export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
