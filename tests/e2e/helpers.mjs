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

/** Pick one qualification chip. The radio itself is visually hidden and
 *  `pointer-events: none` (the label owns the pointer), so `page.check()` on the
 *  input can never pass Playwright's hit-target check — click the chip label,
 *  which is the real user gesture. Centred first so the sticky header can't
 *  intercept the click. */
export async function checkChip(page, name, value) {
  const chip = page.locator(`label.chip:has(input[name="${name}"][value="${value}"])`);
  await chip.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await chip.click();
  await page.locator(`input[name="${name}"][value="${value}"]`).evaluate((el) => {
    if (!el.checked) throw new Error('chip did not become checked');
  });
}

/** Reveal the optional qualifier group (estimatingMethod / bidFrequency /
 *  ndaWilling / message), which lives inside a closed `<details class="form-more">`
 *  disclosure. A no-op when the disclosure is absent or already open, so it is a
 *  pure enabler for the specs that pick optional chips — its existence and closed
 *  default are asserted head-on in demo-form-layout.spec.mjs, not here. */
export async function openOptional(page) {
  const details = page.locator('details.form-more');
  if ((await details.count()) === 0) return;
  if (await details.evaluate((el) => el.open)) return;
  const summary = page.locator('details.form-more summary');
  await summary.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await summary.click();
  await details.evaluate((el) => {
    if (!el.open) throw new Error('optional disclosure did not open');
  });
}

/** Fill every required demo-form field with fixed values (qualification form, WS-B). */
export async function fillRequired(page) {
  await page.fill('#fn', 'Test Person');
  await page.fill('#co', 'Test Co');
  await page.fill('#em', 'test@example.com');
  await page.selectOption('#country', 'NL');
  await checkChip(page, 'role', 'head-of-estimating');
  await checkChip(page, 'companySize', '30-99');
  await checkChip(page, 'mainChallenge', 'pricing-confidence');
}

/** Microsoft Bookings page (acquisition model §9.1) — mirrors SITE.bookingUrl. */
export const BOOKING_URL = 'https://outlook.office.com/book/GradveraBookings@digitalsolutions.si/?ismsaljsauthenabled';

/** Serve a tiny stub for any outlook.office.com request (the success state embeds the calendar). */
export async function stubBookings(page) {
  await page.route('https://outlook.office.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>bookings stub</title>' }),
  );
}

/** Intercept /api/lead (static server has none). Returns { body } — await `body` AFTER submitting. */
export async function armLeadCapture(page, reply = '{"ok":true,"forwarded":false,"qualified":true,"score":8}') {
  await stubBookings(page);
  let resolve;
  const body = new Promise((r) => { resolve = r; });
  await page.route('**/api/lead', (route) => {
    resolve(route.request().postDataJSON());
    route.fulfill({ status: 200, contentType: 'application/json', body: reply });
  });
  return { body };
}
