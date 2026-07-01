import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

// Repo root, so webServer runs `npm run build` in the right place regardless of cwd.
const REPO_ROOT = fileURLToPath(new URL('../../', import.meta.url));
const PORT = Number(process.env.PORT || 4321);

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.mjs',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: process.env.CI ? 'on-first-retry' : 'off',
  },
  // Build the production site, then serve dist/client. The e2e checks run
  // against the real build (the same artifact Vercel ships), not `astro dev`.
  webServer: {
    command: `npm run build && PORT=${PORT} node tests/e2e/serve-dist.mjs`,
    cwd: REPO_ROOT,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
