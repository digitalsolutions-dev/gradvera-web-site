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

test('LP: hero H1 is light-on-ink (tokens.css paints bare h1 dark; .lp-hero h1 must override)', async ({ page }) => {
  await gotoClean(page, LP);
  // gradvera-tokens.css:101 `h1 { color: var(--fg1) }` (#0F172A) beats the
  // section's inherited --on-ink; without an explicit color the title renders
  // near-invisible on the ink hero.
  const c = await page.evaluate(() => getComputedStyle(document.querySelector('.lp-hero h1')).color);
  expect(c, '.lp-hero h1 color').toBe('rgb(238, 242, 250)');
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

test('LP: sections + anchors present, header CTA targets #book-a-demo, ProductEvidence renders 4 coded reproductions framed as illustrations', async ({ page }) => {
  await gotoClean(page, LP);
  for (const id of ['pricing-review', 'subcontractor-quotes', 'how-it-works', 'faq', 'book-a-demo']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator('header .nav-cta a.btn-primary')).toHaveAttribute('href', '#book-a-demo');
  // The mobile menu carries its own CTA — it must follow the same override.
  await expect(page.locator('#mobile-nav a.btn-primary, #mobile-nav a[href="#book-a-demo"]').first()).toHaveAttribute('href', '#book-a-demo');

  // ProductEvidence no longer renders <img> screenshots (or nothing): it renders
  // four coded app-window reproductions — the homepage winbar/gv-screen mock
  // pattern — one per workflow step, each captioned as an illustration.
  const pe = page.locator('.product-evidence');
  await expect(pe).toHaveCount(1);
  await expect(pe.locator('.winbar')).toHaveCount(4);
  const caps = await pe.locator('figcaption').allTextContents();
  expect(caps).toHaveLength(4);
  for (const c of caps) expect(c.trim()).toMatch(/^Illustration ·/);
  // Honest reframing: the new illustration note is present; the earlier
  // "real screens from the sample tenant" overclaim is gone from the whole page.
  await expect(pe).toContainText('Illustrative UI reproductions using sample data');
  const bodyText = await page.evaluate(() => document.body.textContent || '');
  expect(bodyText).not.toContain('Real screens from the sample tenant');

  await expect(page.locator('#gv-demo-form input[name="page"]')).toHaveValue('construction-estimating-software');
  await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('href', `${BOOKING_URL}&RefID=website-lp`);
});

test('LP: ProductEvidence reproductions cause no horizontal overflow at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await gotoClean(page, LP);
  await expect(page.locator('.product-evidence .winbar')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
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
// are required page copy (acquisition model §7.2.9 "not a free trial"; §4.2
// caveat "not an estimate of expected loss") — the FAQ answers the "free trial"
// search intent with a clear No. The positive assertions below are the
// discriminating guard: the claims must appear in their negated / FAQ form.
test('LP: claims-safe copy (no measured/guaranteed claims; the free-trial + expected-loss caveats appear in their negated/FAQ form)', async ({ page }) => {
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

// Internal links into the EN-only LP: the literal EN path is linked from every
// locale (no localizePath) — footer "Explore" column on all three homepages,
// the guides' related block, and the homepage HelpsIntro.
test('internal links: footer (3 locales), guides related block, homepage HelpsIntro point at the LP', async ({ page }) => {
  for (const home of ['/', '/sl/', '/hr/']) {
    await gotoClean(page, home);
    await expect(page.locator(`footer a[href="${LP}"]`)).toHaveCount(1);
  }
  await gotoClean(page, '/');
  await expect(page.locator(`#helps a[href="${LP}"]`)).toHaveCount(1);
  for (const guide of ['/construction-bid-estimate/', '/sl/gradbeni-izracun/', '/hr/gradevinski-troskovnik/']) {
    await gotoClean(page, guide);
    await expect(page.locator(`.guide-related a[href="${LP}"]`)).toHaveCount(1);
  }
});
