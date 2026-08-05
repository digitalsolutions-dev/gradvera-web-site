// Guide pages: serve 200 in all locales, carry FAQPage JSON-LD, correct
// hreflang triplet, and are reachable from the footer.
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

const PAGES = [
  { url: '/construction-cost-estimation/', lang: 'en', proof: 'Gradvera' },
  { url: '/sl/gradbene-kalkulacije/', lang: 'sl', proof: 'kalkulacij' },
  { url: '/hr/gradevinske-kalkulacije/', lang: 'hr', proof: 'kalkulacij' },
  { url: '/construction-bid-estimate/', lang: 'en', proof: 'Gradvera' },
  { url: '/sl/gradbeni-predracun/', lang: 'sl', proof: 'predračun' },
  { url: '/hr/gradevinski-troskovnik/', lang: 'hr', proof: 'troškovnik' },
];

for (const { url, proof } of PAGES) {
  test(`${url} serves with FAQPage schema and full hreflang`, async ({ page }) => {
    await gotoClean(page, url);
    await expect(page.locator('article.guide h1')).toBeVisible();
    const body = await page.textContent('body');
    expect(body.toLowerCase()).toContain(proof.toLowerCase());
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((s) => s.includes('"FAQPage"'))).toBe(true);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);
    await expect(page.locator('.guide-cta a.btn')).toBeVisible();
  });
}

test('footer links to both guides in every locale', async ({ page }) => {
  for (const home of ['/', '/sl/', '/hr/']) {
    await gotoClean(page, home);
    const hrefs = await page.locator('.foot-links a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs.join(' ')).toMatch(/construction-cost-estimation|gradbene-kalkulacije|gradevinske-kalkulacije/);
    expect(hrefs.join(' ')).toMatch(/construction-bid-estimate|gradbeni-predracun|gradevinski-troskovnik/);
  }
});
