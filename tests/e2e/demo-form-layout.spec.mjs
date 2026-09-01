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
    // The stacked column spans the parent .wrap's content box (no 880px cap);
    // the old two-column grid gave the card ~560px inside the 1.1fr track.
    const wrapContent = await page.evaluate(() => {
      const wrap = document.querySelector('.demo .wrap');
      const cs = getComputedStyle(wrap);
      return wrap.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    });
    expect(Math.abs(card.width - wrapContent), `.form-card width ${card.width} vs .wrap content ${wrapContent} on ${path}`).toBeLessThanOrEqual(2);
  });
}

test('/book-a-demo/ unchecked chips pad the label symmetrically (no phantom tick gap)', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.desktop);
  await gotoClean(page, '/book-a-demo/');
  // The tick span is 0-width while unchecked; a flex `gap` on the chip would
  // still insert itself before the label and skew the left inset by 6px.
  const { left, right } = await page.evaluate(() => {
    const chip = document.querySelector('.chip-field .chip');
    const lbl = chip.querySelector('.chip-lbl');
    const c = chip.getBoundingClientRect();
    const l = lbl.getBoundingClientRect();
    return { left: l.left - c.left, right: c.right - l.right };
  });
  expect(Math.abs(left - right), `label insets left=${left} right=${right}`).toBeLessThanOrEqual(2);
});

// EN plus HR — the Croatian dictionary carries the longest strings, so it is the
// worst case for the disclosure summary's wrap and for narrow-viewport overflow.
const DISCLOSURE_PAGES = ['/book-a-demo/', '/hr/rezervirajte-demo/'];

for (const path of DISCLOSURE_PAGES) {
  test(`${path} folds the optional qualifiers into a closed disclosure that still posts their values`, async ({ page }) => {
    const cap = await armLeadCapture(page);
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoClean(page, path);

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
}

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

for (const path of DISCLOSURE_PAGES) {
  test(`${path} has no horizontal overflow at 390px`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await gotoClean(page, path);
    const m = await page.evaluate(() => ({
      scrollWidth: document.scrollingElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(m.scrollWidth, `page scrollWidth ${m.scrollWidth} > viewport ${m.innerWidth}`).toBeLessThanOrEqual(m.innerWidth + 1);
  });
}

// ---- card geometry: nothing inside the form card may inherit `.demo p`'s
// 380px measure (site.css:469), which is meant for the intro prose column. ----

test('/book-a-demo/ section divider spans the card, not the 380px prose measure', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.desktop);
  await gotoClean(page, '/book-a-demo/');
  const sec = await boxOf(page, '.form-card .form-sec');
  expect(sec, '.form-sec missing on /book-a-demo/').not.toBeNull();
  // The `<p class="form-sec">` rows are label + rule; capped at 380px the rule
  // stops mid-card. The card spans the .wrap content box (~1070px at 1280).
  expect(sec.width, `.form-sec width ${sec.width}`).toBeGreaterThan(600);
});

test('/book-a-demo/ submit button reaches the card edge at desktop', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.desktop);
  await gotoClean(page, '/book-a-demo/');
  const card = await boxOf(page, '.form-card');
  const btn = await boxOf(page, '.form-card .form-foot .btn');
  expect(card, '.form-card missing').not.toBeNull();
  expect(btn, '.form-foot .btn missing').not.toBeNull();
  // A capped `.consent` shrinks the footer row and floats the button mid-card;
  // with the cap lifted only the card padding (<=36px) sits to its right.
  expect(card.right - btn.right, `button right edge is ${card.right - btn.right}px short of the card`).toBeLessThanOrEqual(60);
});

test('/book-a-demo/ keeps the submit button inside the card padding at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await gotoClean(page, '/book-a-demo/');
  const m = await page.evaluate(() => ({
    scrollWidth: document.scrollingElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(m.scrollWidth, `page scrollWidth ${m.scrollWidth} > viewport ${m.innerWidth}`).toBeLessThanOrEqual(m.innerWidth + 1);
  const card = await boxOf(page, '.form-card');
  const btn = await boxOf(page, '.form-card .form-foot .btn');
  expect(card, '.form-card missing').not.toBeNull();
  expect(btn, '.form-foot .btn missing').not.toBeNull();
  // `min-width: 240px` survives into the stacked footer and overhangs the card's
  // 24px padding below ~330px. 20 = under the narrowest card padding.
  expect(btn.right, `button right ${btn.right} vs card right ${card.right}`).toBeLessThanOrEqual(card.right - 20);
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
