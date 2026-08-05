// Localized SL/HR slugs: pages serve at the new URLs, on-page hreflang pairs
// them with EN, and the Vercel routing config 308s the old URLs.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

const PAGES = [
  { url: '/sl/rezervirajte-demo/', canonicalEn: '/book-a-demo/' },
  { url: '/hr/rezervirajte-demo/', canonicalEn: '/book-a-demo/' },
  { url: '/sl/politika-zasebnosti/', canonicalEn: '/privacy-policy/' },
  { url: '/hr/pravila-privatnosti/', canonicalEn: '/privacy-policy/' },
];

for (const { url, canonicalEn } of PAGES) {
  test(`${url} serves 200 with hreflang pointing at ${canonicalEn}`, async ({ page }) => {
    const res = await gotoClean(page, url);
    if (res) expect(res.status()).toBe(200);
    const enAlt = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(enAlt).toHaveAttribute('href', `https://gradvera.com${canonicalEn}`);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', `https://gradvera.com${url}`);
  });
}

test('old SL/HR URLs 308-redirect, matching BOTH slash variants', () => {
  const cfgPath = ROOT + '.vercel/output/config.json';
  expect(existsSync(cfgPath), 'vercel build output config missing').toBe(true);
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  const redirects = (cfg.routes || []).filter((r) => r.status === 308 && r.headers?.Location?.startsWith('/'));
  const CASES = [
    { old: '/sl/book-a-demo', dest: '/sl/rezervirajte-demo/' },
    { old: '/hr/book-a-demo', dest: '/hr/rezervirajte-demo/' },
    { old: '/sl/privacy-policy', dest: '/sl/politika-zasebnosti/' },
    { old: '/hr/privacy-policy', dest: '/hr/pravila-privatnosti/' },
  ];
  for (const { old, dest } of CASES) {
    const route = redirects.find((r) => r.headers.Location === dest);
    expect(route, `no 308 route targeting ${dest}`).toBeTruthy();
    // Compile the emitted matcher: it must match the slash-less AND the
    // trailing-slash form — Google indexed the trailing-slash URLs.
    const re = new RegExp(route.src);
    expect(re.test(old), `${route.src} should match ${old}`).toBe(true);
    expect(re.test(old + '/'), `${route.src} should match ${old}/ (indexed form)`).toBe(true);
  }
});

test('sitemap lists localized slugs with full alternate sets', () => {
  const xml = readFileSync(ROOT + 'dist/client/sitemap-0.xml', 'utf8');
  expect(xml).toContain('/sl/rezervirajte-demo/');
  expect(xml).toContain('/hr/pravila-privatnosti/');
  expect(xml).not.toContain('/sl/book-a-demo/');
});
