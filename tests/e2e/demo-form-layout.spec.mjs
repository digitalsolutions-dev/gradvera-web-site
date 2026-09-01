// Book-a-demo redesign (2026-09): the conversion page is a stacked layout —
// compact intro header on top, one wide form card below — with the three
// optional qualifier groups + the message box folded into a native <details>
// disclosure, and a CSS-customizable country <select>.
//
// This spec pins geometry + disclosure behaviour only. The wire payload
// (field names / enum values / required set) stays guarded by
// lead-form.spec.mjs; the single POST assertion here exists to prove the
// disclosure does not amputate an optional field from the submission.
import { test, expect } from '@playwright/test';
import { gotoClean, VIEWPORTS, boxOf, fillRequired, armLeadCapture, checkChip, openOptional } from './helpers.mjs';

// Every route that embeds DemoForm: the three localized demo pages plus the
// EN-only acquisition landing page's book section (LpBook).
const FORM_PAGES = [
  '/book-a-demo/',
  '/sl/rezervirajte-demo/',
  '/hr/rezervirajte-demo/',
  '/construction-estimating-software/',
];

for (const path of FORM_PAGES) {
  test(`${path} renders the form card full width (stacked layout, not the 0.9/1.1 split)`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoClean(page, path);
    const card = await boxOf(page, '.form-card');
    expect(card, `.form-card missing on ${path}`).not.toBeNull();
    // Stacked layout caps the column at 880px; the old two-column grid gave the
    // card ~560px inside the 1.1fr track.
    expect(card.width, `.form-card width on ${path}`).toBeGreaterThan(760);
    expect(card.width, `.form-card width on ${path}`).toBeLessThan(900);
  });
}

test('/book-a-demo/ folds the optional qualifiers into a closed disclosure that still posts their values', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await page.setViewportSize(VIEWPORTS.desktop);
  await gotoClean(page, '/book-a-demo/');

  const more = page.locator('details.form-more');
  await expect(more).toHaveCount(1);
  expect(await more.evaluate((el) => el.open), 'disclosure must start closed').toBe(false);

  const methodChip = page.locator('label.chip:has(input[name="estimatingMethod"][value="mixed"])');
  await expect(methodChip, 'optional chips are hidden while the disclosure is closed').toBeHidden();

  await openOptional(page);
  expect(await more.evaluate((el) => el.open), 'summary click must open the disclosure').toBe(true);
  await expect(methodChip).toBeVisible();

  // A field behind the disclosure must still reach the POST body.
  await fillRequired(page);
  await checkChip(page, 'estimatingMethod', 'mixed');
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  expect(await cap.body).toMatchObject({ estimatingMethod: 'mixed' });
});

test('/book-a-demo/ country control keeps native <select> semantics under custom chrome', async ({ page }) => {
  await gotoClean(page, '/book-a-demo/');
  const info = await page.evaluate(() => {
    const el = document.getElementById('country');
    return { tag: el.tagName, options: el.options.length, appearance: getComputedStyle(el).appearance };
  });
  expect(info.tag).toBe('SELECT');
  // placeholder + the 12 COUNTRIES enum values
  expect(info.options).toBe(13);
  // `none` = styled trigger everywhere; `base-select` = the customizable-select
  // upgrade where the engine supports it. `auto` / `menulist` is the system widget.
  expect(['none', 'base-select']).toContain(info.appearance);
});

test('/book-a-demo/ has no horizontal overflow at 390px', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.mobile);
  await gotoClean(page, '/book-a-demo/');
  const m = await page.evaluate(() => ({
    scrollWidth: document.scrollingElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(m.scrollWidth, `page scrollWidth ${m.scrollWidth} > viewport ${m.innerWidth}`).toBeLessThanOrEqual(m.innerWidth + 1);
});

test('/book-a-demo/ shows the three "what happens next" steps as one 3-across strip at desktop', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.desktop);
  await gotoClean(page, '/book-a-demo/');
  const rects = await page.evaluate(() =>
    [...document.querySelectorAll('.demo-steps li')].map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left };
    }));
  expect(rects).toHaveLength(3);
  const tops = rects.map((r) => r.top);
  expect(Math.max(...tops) - Math.min(...tops), 'steps must share one baseline row').toBeLessThanOrEqual(1);
  // ...and actually sit beside each other, not stacked at the same top by accident.
  expect(new Set(rects.map((r) => Math.round(r.left))).size, 'steps must occupy three columns').toBe(3);
});
