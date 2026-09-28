// Header responsive integrity — the defect this pins: between the old 940px
// mobile breakpoint and the width where the full desktop header actually fits,
// the row overflowed .hdr .wrap and body{overflow-x:hidden} clipped the CTA
// (with the language dropdown: EN fits from ~969px, SL ~1051px, HR ~1100px —
// measured on the built site).
// Contract: ≤940 burger only; 941–1199 burger + visible CTA; ≥1200 full
// desktop header, in ALL three locales. Clip checks compare against
// documentElement.clientWidth (the layout viewport), so reserved-scrollbar
// environments (Linux CI) are held to the same bar as overlay-scrollbar macOS.
import { test, expect } from '@playwright/test';
import { gotoClean, boxOf, fillRequired, armLeadCapture } from './helpers.mjs';

const LOCALES = ['/', '/sl/', '/hr/'];

async function headerState(page) {
  return page.evaluate(() => {
    const vis = (el) => !!el && getComputedStyle(el).display !== 'none';
    const nav = document.querySelector('.hdr .nav');
    const btn = document.querySelector('.menu-btn');
    const cta = document.querySelector('.nav-cta .btn-primary');
    const picker = document.querySelector('.hdr .lang-menu');
    const wrap = document.querySelector('.hdr .wrap');
    const right = Math.max(...[...wrap.querySelectorAll('*')].map((el) => el.getBoundingClientRect().right));
    return {
      nav: vis(nav),
      burger: vis(btn),
      cta: vis(cta),
      picker: vis(picker),
      ctaRight: cta ? cta.getBoundingClientRect().right : null,
      contentRight: right,
      layoutWidth: document.documentElement.clientWidth,
    };
  });
}

for (const locale of LOCALES) {
  test.describe(`header @ ${locale}`, () => {
    test('941–1199px: burger + CTA, nothing clipped', async ({ page }) => {
      await gotoClean(page, locale);
      for (const width of [941, 1000, 1018, 1120, 1199]) {
        await page.setViewportSize({ width, height: 800 });
        const s = await headerState(page);
        expect(s.nav, `${width}px: inline nav hidden`).toBe(false);
        expect(s.burger, `${width}px: burger visible`).toBe(true);
        expect(s.cta, `${width}px: CTA visible`).toBe(true);
        expect(s.ctaRight, `${width}px: CTA inside layout viewport`).toBeLessThanOrEqual(s.layoutWidth);
        expect(s.contentRight, `${width}px: no header content clipped`).toBeLessThanOrEqual(s.layoutWidth);
      }
    });

    test('≥1200px: full desktop header fits', async ({ page }) => {
      await gotoClean(page, locale);
      for (const width of [1200, 1280, 1440]) {
        await page.setViewportSize({ width, height: 800 });
        const s = await headerState(page);
        expect(s.nav, `${width}px: inline nav visible`).toBe(true);
        expect(s.picker, `${width}px: language dropdown visible`).toBe(true);
        expect(s.burger, `${width}px: burger hidden`).toBe(false);
        expect(s.contentRight, `${width}px: no header content clipped`).toBeLessThanOrEqual(s.layoutWidth);
      }
    });

    test('≤940px: unchanged burger-only header', async ({ page }) => {
      await gotoClean(page, locale);
      await page.setViewportSize({ width: 390, height: 780 });
      const s = await headerState(page);
      expect(s.nav).toBe(false);
      expect(s.burger).toBe(true);
      expect(s.cta, 'CTA stays hidden below 941px').toBe(false);
      expect(s.picker).toBe(false);
    });
  });
}

// Header CTA on the book-a-demo pages: the form is already on the page, so
// "Book a demo" (desktop header + mobile menu) scrolls to it instead of
// reloading the page, and scroll-margin keeps the form's top clear of the
// fixed 74px header. The target is the `#demo-form-col` column (it wraps both the
// form and the success card), so the CTA still lands somewhere after a submit
// has hidden the form. Every other page keeps its own CTA target.
const DEMO_PAGES = ['/book-a-demo/', '/sl/rezervirajte-demo/', '/hr/rezervirajte-demo/'];
const HEADER_H = 74;

for (const path of DEMO_PAGES) {
  test(`${path}: header + mobile-menu CTA scroll to the on-page form, no reload`, async ({ page }) => {
    // Instant scroll: html{scroll-behavior:smooth} yields to reduced motion.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoClean(page, path);
    await expect(page.locator('#demo-form-col')).toHaveCount(1);
    await expect(page.locator('#demo-form-col #gv-demo-form')).toHaveCount(1);
    await expect(page.locator('header .nav-cta a.btn-primary')).toHaveAttribute('href', '#demo-form-col');
    await expect(page.locator('#mobile-nav a.btn-primary')).toHaveAttribute('href', '#demo-form-col');
    // Start past the form's top so the click must scroll back up to it; any
    // document request after this point would be a reload.
    const docLoads = [];
    page.on('request', (r) => { if (r.resourceType() === 'document') docLoads.push(r.url()); });
    await page.evaluate(() => { window.scrollTo(0, document.documentElement.scrollHeight); window.__noReload = true; });
    expect((await boxOf(page, '#demo-form-col')).top, 'precondition: form top scrolled above the viewport').toBeLessThan(0);
    await page.click('header .nav-cta a.btn-primary');
    await expect.poll(async () => (await boxOf(page, '#demo-form-col')).top, { message: 'form top clears the fixed header' })
      .toBeGreaterThanOrEqual(HEADER_H);
    expect((await boxOf(page, '#demo-form-col')).top, 'form top inside the viewport').toBeLessThan(800);
    expect(docLoads, 'CTA must not reload the page').toEqual([]);
    expect(await page.evaluate(() => window.__noReload)).toBe(true);
    expect(new URL(page.url()).pathname).toBe(path);
  });
}

test('/book-a-demo/: after a successful submit the header CTA still lands on the form column', async ({ page }) => {
  // The submit hides the <form> (display:none); the CTA must not go dead.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 800 });
  const lead = await armLeadCapture(page);
  await gotoClean(page, '/book-a-demo/');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await lead.body;
  await expect(page.locator('.form-ok')).toBeVisible();
  await expect(page.locator('#gv-demo-form')).toBeHidden();
  const docLoads = [];
  page.on('request', (r) => { if (r.resourceType() === 'document' && r.frame() === page.mainFrame()) docLoads.push(r.url()); });
  await page.evaluate(() => { window.scrollTo(0, document.documentElement.scrollHeight); window.__noReload = true; });
  expect((await boxOf(page, '#demo-form-col'))?.top ?? Infinity, 'precondition: column top hidden under the header').toBeLessThan(HEADER_H);
  await page.click('header .nav-cta a.btn-primary');
  await expect.poll(async () => (await boxOf(page, '#demo-form-col'))?.top ?? -1, { message: 'form column top clears the fixed header' })
    .toBeGreaterThanOrEqual(HEADER_H);
  const box = await boxOf(page, '#demo-form-col');
  expect(box.height, '#demo-form-col still has a box').toBeGreaterThan(0);
  expect(box.width, '#demo-form-col still has a box').toBeGreaterThan(0);
  expect(box.top, 'form column top inside the viewport').toBeLessThan(800);
  expect(docLoads, 'CTA must not reload the page').toEqual([]);
  expect(await page.evaluate(() => window.__noReload)).toBe(true);
  expect(new URL(page.url()).pathname).toBe('/book-a-demo/');
});

test('home pages keep the header + mobile-menu CTA on the book-a-demo page', async ({ page }) => {
  for (const [home, demo] of [['/', '/book-a-demo/'], ['/sl/', '/sl/rezervirajte-demo/'], ['/hr/', '/hr/rezervirajte-demo/']]) {
    await gotoClean(page, home);
    await expect(page.locator('header .nav-cta a.btn-primary')).toHaveAttribute('href', demo);
    await expect(page.locator('#mobile-nav a.btn-primary')).toHaveAttribute('href', demo);
  }
});
