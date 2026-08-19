// Acquisition landing page (acquisition model §7.2): EN-only indexed route,
// hreflang en+x-default only, JSON-LD, anchors, form wired with page/refId,
// no product-evidence placeholder, no horizontal overflow, claims-safe copy.
import { test, expect } from '@playwright/test';
import { gotoClean, VIEWPORTS, fillRequired, armLeadCapture, BOOKING_URL } from './helpers.mjs';

const LP = '/construction-estimating-software/';

test('LP: 200, H1, title/description limits, canonical + hreflang en/x-default only', async ({ page }) => {
  const res = await page.goto(LP, { waitUntil: 'load' });
  expect(res.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText(/construction estimating software/i);
  const title = await page.title();
  expect(title.length).toBeLessThanOrEqual(60);
  expect(title).toMatch(/Netherlands/);
  const desc = await page.getAttribute('meta[name="description"]', 'content');
  expect(desc.length).toBeLessThanOrEqual(160);
  expect(await page.getAttribute('link[rel="canonical"]', 'href')).toBe(`https://gradvera.com${LP}`);
  const alts = await page.$$eval('link[rel="alternate"][hreflang]', (els) => els.map((e) => [e.getAttribute('hreflang'), e.getAttribute('href')]));
  expect(alts).toEqual([['en', `https://gradvera.com${LP}`], ['x-default', `https://gradvera.com${LP}`]]);
  expect(await page.locator('meta[name="robots"][content*="noindex"]').count()).toBe(0);
});

test('LP: JSON-LD carries SoftwareApplication (no offers/ratings), FAQPage, BreadcrumbList', async ({ page }) => {
  await page.goto(LP, { waitUntil: 'load' });
  const blocks = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent || '{}')));
  const types = blocks.map((b) => b['@type']);
  expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList']));
  const app = blocks.find((b) => b['@type'] === 'SoftwareApplication');
  expect(app.name).toBe('Gradvera');
  expect(app.applicationCategory).toBe('BusinessApplication');
  expect(app.offers).toBeUndefined();
  expect(app.aggregateRating).toBeUndefined();
  const faq = blocks.find((b) => b['@type'] === 'FAQPage');
  expect(faq.mainEntity.length).toBeGreaterThanOrEqual(6);
});

test('LP: sections + anchors present, header CTA targets #book-a-demo, no ProductEvidence placeholder', async ({ page }) => {
  await gotoClean(page, LP);
  for (const id of ['pricing-review', 'subcontractor-quotes', 'how-it-works', 'faq', 'book-a-demo']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator('header .nav-cta a.btn-primary')).toHaveAttribute('href', '#book-a-demo');
  // The mobile menu carries its own CTA — it must follow the same override.
  await expect(page.locator('#mobile-nav a.btn-primary, #mobile-nav a[href="#book-a-demo"]').first()).toHaveAttribute('href', '#book-a-demo');
  await expect(page.locator('.product-evidence')).toHaveCount(0);
  await expect(page.locator('#gv-demo-form input[name="page"]')).toHaveValue('construction-estimating-software');
  await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('href', `${BOOKING_URL}&RefID=website-lp`);
});

test('LP: language switcher links to the locale homepages (no SL/HR LP)', async ({ page }) => {
  await gotoClean(page, LP);
  const hrefs = await page.$$eval('header .nav-cta a[hreflang]', (els) => els.map((e) => [e.getAttribute('hreflang'), e.getAttribute('href')]));
  expect(hrefs).toEqual(expect.arrayContaining([['sl', '/sl/'], ['hr', '/hr/']]));
});

for (const [name, vp] of Object.entries({ mobile: { width: 360, height: 780 }, tablet: { width: 768, height: 1024 }, desktop: VIEWPORTS.desktop })) {
  test(`LP: no horizontal overflow at ${name}`, async ({ page }) => {
    await page.setViewportSize(vp);
    await gotoClean(page, LP);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });
}

// The ban list covers AFFIRMATIVE claims only. "free trial" and "expected loss"
// are required page copy in their negated form (acquisition model §7.2.9 "not a
// free trial"; §4.2 caveat "not an estimate of expected loss") — the FAQ answers
// the "free trial" search intent with a clear No. The positive assertions below
// are the discriminating guard: the phrases must appear, and only negated.
test('LP: claims-safe copy (no measured/guaranteed claims; the free-trial + expected-loss caveats appear only negated)', async ({ page }) => {
  await gotoClean(page, LP);
  const text = await page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style,noscript').forEach((n) => n.remove()); return (c.textContent || '').replace(/\s+/g, ' '); });
  for (const banned of ['%', '×', 'guaranteed', 'Guaranteed', 'Measured in Practice', 'real results']) expect(text, `found "${banned}"`).not.toContain(banned);
  expect(text).toContain('not a free trial');
  expect(text).toContain('not an estimate of expected loss');
  for (const must of ['Excel', 'sample data', 'pricing review', 'Netherlands', 'DIGITAL SOLUTIONS']) expect(text, `missing "${must}"`).toContain(must);
});

test('LP: form submits with page=construction-estimating-software and reveals Bookings with RefID=website-lp', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await gotoClean(page, LP);
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  expect((await cap.body).page).toBe('construction-estimating-software');
  await expect(page.locator('.form-ok iframe.booking-frame')).toHaveAttribute('src', `${BOOKING_URL}&RefID=website-lp`);
});
