// Header responsive integrity — the defect this pins: between the old 940px
// mobile breakpoint and the width where the full desktop header actually fits,
// the row overflowed .hdr .wrap and body{overflow-x:hidden} clipped the CTA
// (EN fits from ~944px, SL ~1174px, HR ~1214px — measured on the built site).
// Contract: ≤940 burger only; 941–1219 burger + visible CTA; ≥1220 full
// desktop header, in ALL three locales.
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

const LOCALES = ['/', '/sl/', '/hr/'];

async function headerState(page) {
  return page.evaluate(() => {
    const vis = (el) => !!el && getComputedStyle(el).display !== 'none';
    const nav = document.querySelector('.hdr .nav');
    const btn = document.querySelector('.menu-btn');
    const cta = document.querySelector('.nav-cta .btn-primary');
    const picker = document.querySelector('.hdr .lang-switch');
    const wrap = document.querySelector('.hdr .wrap');
    const right = Math.max(...[...wrap.querySelectorAll('*')].map((el) => el.getBoundingClientRect().right));
    return {
      nav: vis(nav),
      burger: vis(btn),
      cta: vis(cta),
      picker: vis(picker),
      ctaRight: cta ? cta.getBoundingClientRect().right : null,
      contentRight: right,
      viewport: window.innerWidth,
    };
  });
}

for (const locale of LOCALES) {
  test.describe(`header @ ${locale}`, () => {
    test('941–1219px: burger + CTA, nothing clipped', async ({ page }) => {
      await gotoClean(page, locale);
      for (const width of [941, 1000, 1018, 1120, 1219]) {
        await page.setViewportSize({ width, height: 800 });
        const s = await headerState(page);
        expect(s.nav, `${width}px: inline nav hidden`).toBe(false);
        expect(s.burger, `${width}px: burger visible`).toBe(true);
        expect(s.cta, `${width}px: CTA visible`).toBe(true);
        expect(s.ctaRight, `${width}px: CTA inside viewport`).toBeLessThanOrEqual(width);
        expect(s.contentRight, `${width}px: no header content clipped`).toBeLessThanOrEqual(width);
      }
    });

    test('≥1220px: full desktop header fits', async ({ page }) => {
      await gotoClean(page, locale);
      for (const width of [1220, 1280, 1440]) {
        await page.setViewportSize({ width, height: 800 });
        const s = await headerState(page);
        expect(s.nav, `${width}px: inline nav visible`).toBe(true);
        expect(s.picker, `${width}px: language picker visible`).toBe(true);
        expect(s.burger, `${width}px: burger hidden`).toBe(false);
        expect(s.contentRight, `${width}px: no header content clipped`).toBeLessThanOrEqual(width);
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
