// Homepage layout + a11y regressions — the kind of thing a static grep can't
// prove and that would otherwise silently regress. Also parametrises the
// Capability-2 desktop-overlap check across locales + widths (the finding that
// browser measurement showed was a false positive).
import { test, expect } from '@playwright/test';
import { gotoClean, VIEWPORTS, boxOf, rectsOverlap } from './helpers.mjs';

test.describe('Homepage a11y + layout regressions', () => {
  test('has exactly one <h1>', async ({ page }) => {
    await gotoClean(page, '/');
    expect(await page.locator('h1').count()).toBe(1);
  });

  test('decorative product mockups are aria-hidden', async ({ page }) => {
    await gotoClean(page, '/');
    const panels = page.locator('.gv-panelwrap');
    const n = await panels.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) await expect(panels.nth(i)).toHaveAttribute('aria-hidden', 'true');
  });

  test('no horizontal scroll at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await gotoClean(page, '/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('homepage JSON-LD declares no price (paid product not free)', async ({ page }) => {
    await gotoClean(page, '/');
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(' ');
    expect(ld).not.toContain('"price"');
  });

  test('hero pulse circle uses a valid SVG translate() (no translateY console error)', async ({ page }) => {
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await gotoClean(page, '/');
    await page.waitForTimeout(600); // let the hero animation frames run
    expect(errors.join('\n')).not.toMatch(/translateY|attribute transform/i);
  });
});

test.describe('Capability 2 foot never overlaps the annotation cards (desktop)', () => {
  for (const locale of ['/', '/sl/', '/hr/']) {
    for (const vp of [VIEWPORTS.desktopNarrow, VIEWPORTS.desktop, VIEWPORTS.wide]) {
      test(`${locale} @ ${vp.width}px`, async ({ page }) => {
        await page.setViewportSize(vp);
        await gotoClean(page, locale);
        await page.waitForTimeout(500); // site.js draws + scales cap2
        const foot = await boxOf(page, '.cap2-annot .capx-foot');
        const last = await boxOf(page, '.cap2-col.left .c2card:last-child');
        expect(foot, 'capx-foot present').toBeTruthy();
        expect(last, 'annotation cards present at desktop width').toBeTruthy();
        const gap = Math.round(last.top < foot.top ? foot.top - last.bottom : last.top - foot.bottom);
        expect(rectsOverlap(foot, last), `foot/last-card gap = ${gap}px`).toBe(false);
      });
    }
  }
});
