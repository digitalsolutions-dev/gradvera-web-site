// MobileNav accessibility — the interactive behaviour that astro check and a
// static HTML grep can't verify (focus management, Escape, scroll-lock, scrim,
// breakpoint auto-close). Mirrors the a11y layer added in PR #16.
import { test, expect } from '@playwright/test';
import { gotoClean, VIEWPORTS } from './helpers.mjs';

test.use({ viewport: VIEWPORTS.mobile, hasTouch: true });

test.describe('MobileNav accessibility', () => {
  test.beforeEach(async ({ page }) => { await gotoClean(page, '/'); });

  test('opening sets aria state, scrim, scroll-lock, focus, and label', async ({ page }) => {
    const btn = page.locator('.menu-btn');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.mobile-scrim')).toBeVisible();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
    expect(await page.evaluate(() => document.getElementById('mobile-nav').contains(document.activeElement))).toBe(true);
    await expect(btn).toHaveAttribute('aria-label', /close|zapri|zatvori/i);
  });

  test('focus trap wraps from last to first on Tab', async ({ page }) => {
    await page.locator('.menu-btn').click();
    const wrapped = await page.evaluate(() => {
      const nav = document.getElementById('mobile-nav');
      const f = nav.querySelectorAll('a[href], button:not([disabled])');
      f[f.length - 1].focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
      return document.activeElement === f[0];
    });
    expect(wrapped).toBe(true);
  });

  test('Escape closes the menu and returns focus to the toggle', async ({ page }) => {
    await page.locator('.menu-btn').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/open/);
    expect(await page.evaluate(() => document.activeElement === document.querySelector('.menu-btn'))).toBe(true);
  });

  test('tapping the scrim closes the menu and unlocks scroll', async ({ page }) => {
    await page.locator('.menu-btn').click();
    await page.locator('.mobile-scrim').click({ position: { x: 20, y: 500 } });
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/open/);
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
  });

  test('growing past the mobile breakpoint auto-closes the menu', async ({ page }) => {
    await page.locator('.menu-btn').click();
    await page.setViewportSize(VIEWPORTS.desktop);
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/open/);
  });
});
