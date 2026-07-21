// Language switcher — the behaviour astro check and static greps can't prove.
// Desktop header: a <details>-based dropdown (current-locale SVG-flag trigger,
// popover of flag+endonym options) — open/close semantics, keyboard support,
// cross-locale href wiring, aria-current. Mobile menu: full-width segmented
// cells (unchanged variant) — touch sizing and endonym labels.
import { test, expect } from '@playwright/test';
import { gotoClean, VIEWPORTS } from './helpers.mjs';

const ENDONYMS = { en: 'English', sl: 'Slovenščina', hr: 'Hrvatski' };

test.describe('Language dropdown — desktop header', () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test('trigger shows the current flag (SVG, no text); popover lists all three locales', async ({ page }) => {
    await gotoClean(page, '/sl/');
    const menu = page.locator('.hdr .lang-menu');
    await expect(menu.locator('summary .lang-menu__flag--sl')).toBeVisible();
    expect((await menu.locator('summary').innerText()).trim(), 'no visible code text in the trigger').toBe('');
    await expect(menu.locator('.lang-menu__list a')).toHaveCount(3);
    await menu.locator('summary').click();
    for (const code of ['en', 'sl', 'hr']) {
      const opt = menu.locator(`.lang-menu__list a[hreflang="${code}"]`);
      await expect(opt).toBeVisible();
      await expect(opt).toHaveAttribute('lang', code);
      await expect(opt.locator(`.lang-menu__flag--${code}`)).toBeVisible();
      await expect(opt.locator('.lang-menu__opt-name')).toHaveText(ENDONYMS[code]);
    }
  });

  test('trigger and popover text are unselectable', async ({ page }) => {
    await gotoClean(page, '/');
    const menu = page.locator('.hdr .lang-menu');
    expect(await menu.locator('summary').evaluate((el) => getComputedStyle(el).userSelect)).toBe('none');
    expect(await menu.locator('.lang-menu__list').evaluate((el) => getComputedStyle(el).userSelect)).toBe('none');
  });

  test('current locale carries aria-current="page" and a check mark, not colour alone', async ({ page }) => {
    await gotoClean(page, '/sl/');
    await page.locator('.hdr .lang-menu summary').click();
    const current = page.locator('.hdr .lang-menu .lang-menu__list a[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute('hreflang', 'sl');
    await expect(current.locator('.lang-menu__check')).toBeVisible();
  });

  test('subpage switch preserves the path across locales', async ({ page }) => {
    await gotoClean(page, '/book-a-demo/');
    const list = page.locator('.hdr .lang-menu .lang-menu__list');
    await expect(list.locator('a[hreflang="sl"]')).toHaveAttribute('href', '/sl/book-a-demo/');
    await expect(list.locator('a[hreflang="hr"]')).toHaveAttribute('href', '/hr/book-a-demo/');
    await expect(list.locator('a[hreflang="en"]')).toHaveAttribute('href', '/book-a-demo/');
  });

  test('Escape closes and refocuses the trigger; outside click closes', async ({ page }) => {
    await gotoClean(page, '/');
    const menu = page.locator('.hdr .lang-menu');
    await menu.locator('summary').click();
    await expect(menu).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open', '');
    expect(await page.evaluate(() => document.activeElement === document.querySelector('.lang-menu summary'))).toBe(true);
    await menu.locator('summary').click();
    await page.mouse.click(20, 500);
    await expect(menu).not.toHaveAttribute('open', '');
  });

  test('arrow keys cycle the options while open', async ({ page }) => {
    await gotoClean(page, '/');
    const menu = page.locator('.hdr .lang-menu');
    await menu.locator('summary').click();
    await page.keyboard.press('ArrowDown');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('hreflang'))).toBe('en');
    await page.keyboard.press('ArrowDown');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('hreflang'))).toBe('sl');
    await page.keyboard.press('ArrowUp');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('hreflang'))).toBe('en');
  });

  test('narrowing into the burger band closes the dropdown and releases arrow keys', async ({ page }) => {
    await gotoClean(page, '/');
    const menu = page.locator('.hdr .lang-menu');
    await menu.locator('summary').click();
    await expect(menu).toHaveAttribute('open', '');
    await page.setViewportSize({ width: 1000, height: 800 });
    await expect(menu).not.toHaveAttribute('open', '');
    // Arrow keys must scroll the page again (the keydown handler is disarmed).
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 2000 }).toBeGreaterThan(0);
  });

  test('option hover feedback is a state layer, not a colour-only change', async ({ page }) => {
    await gotoClean(page, '/');
    const menu = page.locator('.hdr .lang-menu');
    await menu.locator('summary').click();
    const idle = menu.locator('.lang-menu__list a[hreflang="sl"]');
    const before = await idle.evaluate((el) => getComputedStyle(el).backgroundColor);
    await idle.hover();
    await expect
      .poll(() => idle.evaluate((el) => getComputedStyle(el).backgroundColor), { timeout: 2000 })
      .not.toBe(before);
  });
});

test.describe('Language picker — mobile menu', () => {
  test.use({ viewport: VIEWPORTS.mobile, hasTouch: true });

  test.beforeEach(async ({ page }) => { await gotoClean(page, '/'); });

  test('header dropdown is hidden; menu copy shows code + endonym per locale', async ({ page }) => {
    await expect(page.locator('.hdr .lang-menu')).toBeHidden();
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
