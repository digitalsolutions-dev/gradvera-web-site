// Lead events + Bookings embed (acquisition model §9, §11): the success block
// holds the Microsoft Bookings calendar (lazy iframe, src set only after a 2xx)
// and a direct link; dataLayer pushes follow the §11.1 names. API intercepted —
// the static server has no /api/lead.
import { test, expect } from '@playwright/test';
import { gotoClean, fillRequired, armLeadCapture, BOOKING_URL } from './helpers.mjs';

const PAGES = [
  { path: '/book-a-demo/', locale: 'en', ref: 'website-demo-en' },
  { path: '/sl/rezervirajte-demo/', locale: 'sl', ref: 'website-demo-sl' },
  { path: '/hr/rezervirajte-demo/', locale: 'hr', ref: 'website-demo-hr' },
];

for (const { path, locale, ref } of PAGES) {
  test(`${path} ships the booking block hidden, with a direct link and no iframe src before success`, async ({ page }) => {
    await gotoClean(page, path);
    const block = page.locator('.form-ok .booking');
    await expect(block).toHaveCount(1);
    await expect(page.locator('.form-ok')).toBeHidden();
    await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('href', `${BOOKING_URL}&RefID=${ref}`);
    await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('target', '_blank');
    await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('rel', /noopener/);
    expect(await page.locator('.form-ok iframe.booking-frame').getAttribute('src')).toBeNull();
    // no third-party request before conversion
    const requests = [];
    page.on('request', (r) => { if (r.url().includes('outlook.office.com')) requests.push(r.url()); });
    await page.waitForTimeout(300);
    expect(requests).toEqual([]);
  });
}
