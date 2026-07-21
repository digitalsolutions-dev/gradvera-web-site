// Language picker — the behaviour astro check and static greps can't prove:
// state-layer hover feedback, touch sizing of the menu cells, cross-locale href
// wiring on subpages, and the semantic layer (aria-current="page", per-anchor
// lang) screen readers depend on.
import { test, expect } from '@playwright/test';
import { gotoClean, VIEWPORTS } from './helpers.mjs';

const ENDONYMS = { en: 'English', sl: 'Slovenščina', hr: 'Hrvatski' };

test.describe('Language picker — desktop header', () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test('three anchors, each with hreflang + matching lang attribute', async ({ page }) => {
    await gotoClean(page, '/');
    const links = page.locator('.hdr .lang-switch a');
    await expect(links).toHaveCount(3);
    for (const code of ['en', 'sl', 'hr']) {
      const a = page.locator(`.hdr .lang-switch a[hreflang="${code}"]`);
      await expect(a).toHaveAttribute('lang', code);
      await expect(a).toHaveAttribute('aria-label', ENDONYMS[code]);
    }
  });

  test('current locale carries aria-current="page" and the amber fill', async ({ page }) => {
    await gotoClean(page, '/sl/');
    const current = page.locator('.hdr .lang-switch a[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute('hreflang', 'sl');
    expect(await current.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(232, 144, 28)');
  });

  test('subpage switch preserves the path across locales', async ({ page }) => {
    await gotoClean(page, '/book-a-demo/');
    await expect(page.locator('.hdr .lang-switch a[hreflang="sl"]')).toHaveAttribute('href', '/sl/book-a-demo/');
    await expect(page.locator('.hdr .lang-switch a[hreflang="hr"]')).toHaveAttribute('href', '/hr/book-a-demo/');
    await expect(page.locator('.hdr .lang-switch a[hreflang="en"]')).toHaveAttribute('href', '/book-a-demo/');
  });

  test('hover feedback is a state layer, not a colour-only change', async ({ page }) => {
    await gotoClean(page, '/');
    const idle = page.locator('.hdr .lang-switch a[hreflang="sl"]');
    const before = await idle.evaluate((el) => getComputedStyle(el).backgroundColor);
    await idle.hover();
    // Poll past the 150ms background transition rather than sampling at t=0.
    await expect
      .poll(() => idle.evaluate((el) => getComputedStyle(el).backgroundColor), { timeout: 2000 })
      .not.toBe(before);
  });
});

test.describe('Language picker — mobile menu', () => {
  test.use({ viewport: VIEWPORTS.mobile, hasTouch: true });

  test.beforeEach(async ({ page }) => { await gotoClean(page, '/'); });

  test('header copy is hidden; menu copy shows code + endonym per locale', async ({ page }) => {
    await expect(page.locator('.hdr > .wrap .lang-switch')).toBeHidden();
    await page.locator('.menu-btn').click();
    const menuPicker = page.locator('.mobile-nav .lang-switch');
    await expect(menuPicker).toBeVisible();
    for (const code of ['en', 'sl', 'hr']) {
      const cell = menuPicker.locator(`a[hreflang="${code}"]`);
      await expect(cell.locator('.lang-switch__code')).toHaveText(code.toUpperCase());
      await expect(cell.locator('.lang-switch__name')).toHaveText(ENDONYMS[code]);
      await expect(cell).toHaveAttribute('lang', code);
    }
    // The menu copy carries the same semantic layer as the header copy.
    await expect(menuPicker.locator('a[aria-current="page"]')).toHaveCount(1);
    await expect(menuPicker.locator('a[aria-current="page"]')).toHaveAttribute('hreflang', 'en');
  });

  test('menu cells meet the 44px touch target and do not overflow the viewport', async ({ page }) => {
    await page.locator('.menu-btn').click();
    const cells = page.locator('.mobile-nav .lang-switch a');
    for (let i = 0; i < 3; i++) {
      const box = await cells.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
});
