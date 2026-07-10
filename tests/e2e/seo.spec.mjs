// SEO regressions that a static grep can't prove against the real build:
// the client-localized 404 page, per-locale OG images (content + the files
// actually existing), hero font preloads (the URLs resolving AND matching the
// bundled CSS so nothing double-downloads), the sitemap excluding the 404,
// and the canonical host staying apex.
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

/** Concatenated text of every bundled stylesheet the current page links. */
async function bundledCss(page) {
  const hrefs = await page
    .locator('link[rel="stylesheet"]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs.length, 'page should link at least one bundled stylesheet').toBeGreaterThan(0);
  let css = '';
  for (const href of hrefs) {
    const res = await page.request.get(href);
    expect(res.status(), `stylesheet ${href} must serve 200`).toBe(200);
    css += await res.text();
  }
  return css;
}

/** Each preload href must serve 200 (a mis-hashed URL fails) and its basename
 *  must appear in the bundled CSS — i.e. the preloaded file is the same asset
 *  the @font-face rules request, so the preload can't double-download. */
async function expectPreloadsResolveAndMatchCss(page, hrefs) {
  const css = await bundledCss(page);
  for (const href of hrefs) {
    const res = await page.request.get(href);
    expect(res.status(), `preload ${href} must serve 200`).toBe(200);
    const basename = href.split('/').pop();
    expect(css.includes(basename), `preloaded ${basename} must be referenced by the bundled CSS`).toBe(true);
  }
}

test.describe('404 page is served with status 404 and localizes client-side', () => {
  test('/this-page-does-not-exist/ -> EN 404 with noindex', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist/', { waitUntil: 'load' });
    expect(res.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toHaveText("This page doesn't exist.");
    expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
    await expect(page.locator('#nf-cta')).toHaveAttribute('href', '/');
  });

  test('/sl/this-page-does-not-exist/ -> Slovenian copy, lang and CTA', async ({ page }) => {
    const res = await page.goto('/sl/this-page-does-not-exist/', { waitUntil: 'load' });
    expect(res.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'sl');
    await expect(page.locator('h1')).toHaveText('Ta stran ne obstaja.');
    await expect(page.locator('#nf-cta')).toHaveAttribute('href', '/sl/');
  });

  test('/hr/this-page-does-not-exist/ -> Croatian copy, lang and CTA', async ({ page }) => {
    const res = await page.goto('/hr/this-page-does-not-exist/', { waitUntil: 'load' });
    expect(res.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'hr');
    await expect(page.locator('h1')).toHaveText('Ova stranica ne postoji.');
    await expect(page.locator('#nf-cta')).toHaveAttribute('href', '/hr/');
  });
});

test.describe('Per-locale OG image', () => {
  for (const [path, suffix] of [
    ['/', '/og/gradvera-og.png'],
    ['/sl/', '/og/gradvera-og-sl.png'],
    ['/hr/', '/og/gradvera-og-hr.png'],
  ]) {
    test(`${path} og:image ends with ${suffix} and the file serves 200`, async ({ page }) => {
      await gotoClean(page, path);
      const content = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(content.endsWith(suffix), `og:image = ${content}`).toBe(true);
      const res = await page.request.get(new URL(content).pathname);
      expect(res.status()).toBe(200);
    });
  }

  test('/sl/ og:image:alt carries the Slovenian tagline', async ({ page }) => {
    await gotoClean(page, '/sl/');
    expect(await page.locator('meta[property="og:image:alt"]').getAttribute('content'))
      .toBe('Gradvera — programska oprema za gradbeno ocenjevanje');
  });
});

test.describe('Hero font preloads (h1 uses sans 500 + 600)', () => {
  test('/ preloads exactly the two latin woff2 weights, with crossorigin', async ({ page }) => {
    await gotoClean(page, '/');
    const links = page.locator('link[rel="preload"][as="font"]');
    expect(await links.count()).toBe(2);
    const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(hrefs.some((h) => h.includes('ibm-plex-sans-latin-500'))).toBe(true);
    expect(hrefs.some((h) => h.includes('ibm-plex-sans-latin-600'))).toBe(true);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('type', 'font/woff2');
      expect(await link.getAttribute('crossorigin'), 'font preload needs crossorigin').not.toBeNull();
    }
    await expectPreloadsResolveAndMatchCss(page, hrefs);
  });

  test('/sl/ adds the two latin-ext weights (č š ž glyphs) -> exactly 4', async ({ page }) => {
    await gotoClean(page, '/sl/');
    const hrefs = await page
      .locator('link[rel="preload"][as="font"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(hrefs.length).toBe(4);
    expect(hrefs.some((h) => h.includes('ibm-plex-sans-latin-ext-500'))).toBe(true);
    expect(hrefs.some((h) => h.includes('ibm-plex-sans-latin-ext-600'))).toBe(true);
    await expectPreloadsResolveAndMatchCss(page, hrefs);
  });
});

test.describe('Sitemap', () => {
  test('/sitemap-0.xml serves 200 and does not list the 404 page', async ({ page }) => {
    const res = await page.request.get('/sitemap-0.xml');
    expect(res.status()).toBe(200);
    expect(await res.text()).not.toContain('/404');
  });
});

test.describe('Canonical host', () => {
  test('/ canonical is the apex domain (no www)', async ({ page }) => {
    await gotoClean(page, '/');
    expect(await page.locator('link[rel="canonical"]').getAttribute('href'))
      .toBe('https://gradvera.com/');
  });
});
