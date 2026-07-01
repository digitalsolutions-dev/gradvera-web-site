// Shared helpers for the e2e checks. Keep reusable primitives here so new
// specs stay short.

/** Common viewport presets. desktopNarrow == just above the 1000px breakpoint
 *  where the Capability-2 annotation column first appears (tightest layout). */
export const VIEWPORTS = {
  mobile: { width: 390, height: 780 },
  desktopNarrow: { width: 1001, height: 1000 },
  desktop: { width: 1280, height: 900 },
  wide: { width: 1680, height: 1000 },
};

/** Navigate, then remove the GDPR consent banner — it is a fixed overlay that
 *  intercepts pointer events and would block interaction tests. */
export async function gotoClean(page, path = '/') {
  await page.goto(path, { waitUntil: 'load' });
  await page.evaluate(() => document.getElementById('gv-consent-banner')?.remove());
  await page.waitForTimeout(150);
}

/** Bounding rect of the first match, or null if absent. */
export async function boxOf(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
  }, selector);
}

/** True if two rects overlap in both axes. */
export function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
