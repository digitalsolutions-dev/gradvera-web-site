// Guide pages: serve 200 in all locales, carry FAQPage JSON-LD, correct
// hreflang triplet, and are reachable from the footer.
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

const PAGES = [
  { url: '/construction-cost-estimation/', lang: 'en', proof: 'Gradvera', related: /construction-bid-estimate/ },
  { url: '/sl/gradbene-kalkulacije/', lang: 'sl', proof: 'kalkulacij', related: /gradbeni-izracun/ },
  { url: '/hr/gradevinske-kalkulacije/', lang: 'hr', proof: 'kalkulacij', related: /gradevinski-troskovnik/ },
  { url: '/construction-bid-estimate/', lang: 'en', proof: 'Gradvera', related: /construction-cost-estimation/ },
  { url: '/sl/gradbeni-izracun/', lang: 'sl', proof: 'izračun', related: /gradbene-kalkulacije/ },
  { url: '/hr/gradevinski-troskovnik/', lang: 'hr', proof: 'troškovnik', related: /gradevinske-kalkulacije/ },
];

for (const { url, proof, related } of PAGES) {
  test(`${url} serves with FAQPage schema and full hreflang`, async ({ page }) => {
    const res = await page.goto(url, { waitUntil: 'load' });
    expect(res.status(), `${url} should serve 200`).toBe(200);
    await expect(page.locator('article.guide h1')).toBeVisible();
    const body = await page.textContent('body');
    expect(body.toLowerCase()).toContain(proof.toLowerCase());
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((s) => s.includes('"FAQPage"'))).toBe(true);
    expect(ld.some((s) => s.includes('"Article"') && s.includes('"datePublished"')), `${url} should carry Article schema with dates`).toBe(true);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);
    await expect(page.locator('.guide-cta a.btn')).toBeVisible();
    // cross-link to the sibling cluster guide (same locale), anchored on its H1.
    // The block also carries the EN-only landing-page link, so exclude it here.
    const relLink = page.locator('.guide-related a:not(.guide-related-lp)');
    await expect(relLink).toBeVisible();
    expect(await relLink.getAttribute('href'), `${url} should link to its sibling guide`).toMatch(related);
  });
}

test('footer links to both guides in every locale', async ({ page }) => {
  for (const home of ['/', '/sl/', '/hr/']) {
    await gotoClean(page, home);
    const hrefs = await page.locator('.foot-links a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs.join(' ')).toMatch(/construction-cost-estimation|gradbene-kalkulacije|gradevinske-kalkulacije/);
    expect(hrefs.join(' ')).toMatch(/construction-bid-estimate|gradbeni-izracun|gradevinski-troskovnik/);
  }
});
