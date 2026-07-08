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

  test('hero CTA text clears WCAG AA on its amber fill (no white-on-amber regression)', async ({ page }) => {
    await gotoClean(page, '/');
    const ratio = await page.evaluate(() => {
      const btn = document.querySelector('.hero-actions .btn-primary');
      if (!btn) return null;
      const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); return m ? m[1].split(',').map(Number) : null; };
      const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
      const L = (v) => 0.2126 * lin(v[0]) + 0.7152 * lin(v[1]) + 0.0722 * lin(v[2]);
      const fg = parse(getComputedStyle(btn).color);
      let el = btn, bg = null;
      while (el) { const c = parse(getComputedStyle(el).backgroundColor); if (c && (c[3] === undefined || c[3] > 0)) { bg = c; break; } el = el.parentElement; }
      if (!fg || !bg) return null;
      const l1 = L(fg), l2 = L(bg), [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
      return (hi + 0.05) / (lo + 0.05);
    });
    expect(ratio, 'hero CTA computed contrast ratio').not.toBeNull();
    expect(ratio).toBeGreaterThanOrEqual(4.5);
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

// The hero's setup line was pinned to `white-space: nowrap` above 1000px, so a
// long translation could not fold — it overran the copy column and painted over
// the blueprint (HR: 630px of text in a 536px column, 62px over the drawing at
// 1440). `document.scrollWidth` stayed 0 the whole time because `.hero` is
// `overflow: hidden`, which is why every earlier sweep called it clean. Assert on
// the ELEMENT's own scrollWidth, and on the painted edge vs the visual column.
test.describe('Hero setup line never overruns its column (desktop)', () => {
  for (const locale of ['/', '/sl/', '/hr/']) {
    for (const vp of [VIEWPORTS.desktopNarrow, VIEWPORTS.desktop, VIEWPORTS.wide]) {
      test(`${locale} @ ${vp.width}px`, async ({ page }) => {
        await page.setViewportSize(vp);
        await gotoClean(page, locale);
        const m = await page.evaluate(() => {
          const l1 = document.querySelector('.hero h1 .l1');
          if (!l1) return null;
          const vis = document.querySelector('.hero-visual').getBoundingClientRect();
          const copy = document.querySelector('.hero-copy').getBoundingClientRect();
          return {
            spill: l1.scrollWidth - l1.clientWidth,
            gutter: Math.round(vis.left - copy.right),
            text: l1.textContent.trim(),
          };
        });
        expect(m, '.hero h1 .l1 present').toBeTruthy();
        expect(m.spill, `"${m.text}" overruns its column by ${m.spill}px`).toBeLessThanOrEqual(0);
        // Even a spill the gutter happens to absorb is a latent overpaint bug.
        expect(m.spill, `spill would cross the ${m.gutter}px gutter into the blueprint`)
          .toBeLessThan(m.gutter);
      });
    }
  }
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
