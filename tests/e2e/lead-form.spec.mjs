// Qualification form (acquisition model §8.1): required fields + enum wire
// values + optional fields, per locale, asserted on the intercepted POST body.
import { test, expect } from '@playwright/test';
import { gotoClean, fillRequired, armLeadCapture, checkChip } from './helpers.mjs';

const DEMO = [
  { path: '/book-a-demo/', locale: 'en' },
  { path: '/sl/rezervirajte-demo/', locale: 'sl' },
  { path: '/hr/rezervirajte-demo/', locale: 'hr' },
];

for (const { path, locale } of DEMO) {
  test(`${path} posts the qualification fields with wire enum values`, async ({ page }) => {
    const cap = await armLeadCapture(page);
    await gotoClean(page, path);
    await fillRequired(page);
    await checkChip(page, 'estimatingMethod', 'mixed');
    await checkChip(page, 'bidFrequency', 'monthly');
    await checkChip(page, 'ndaWilling', 'yes');
    await page.click('#gv-demo-form button[type="submit"]');
    await expect(page.locator('.form-ok')).toBeVisible();
    expect(await cap.body).toMatchObject({
      locale, page: 'book-a-demo', fullName: 'Test Person', company: 'Test Co', email: 'test@example.com',
      country: 'NL', role: 'head-of-estimating', companySize: '30-99', mainChallenge: 'pricing-confidence',
      estimatingMethod: 'mixed', bidFrequency: 'monthly', ndaWilling: 'yes',
    });
  });

  test(`${path} blocks submit until country, role, size and challenge are chosen`, async ({ page }) => {
    let posted = false;
    await page.route('**/api/lead', (route) => { posted = true; route.fulfill({ status: 200, body: '{"ok":true}' }); });
    await gotoClean(page, path);
    await page.fill('#fn', 'Test Person');
    await page.fill('#co', 'Test Co');
    await page.fill('#em', 'test@example.com');
    await page.click('#gv-demo-form button[type="submit"]');
    // Country carries a locale default (spec §2 B3: SL→SI, HR→HR, EN→none), so
    // only the EN form can flag it as missing; SL/HR are pre-answered instead.
    if (locale === 'en') {
      await expect(page.locator('#err-country')).toBeVisible();
    } else {
      await expect(page.locator('#country')).toHaveValue(locale === 'sl' ? 'SI' : 'HR');
      await expect(page.locator('#err-country')).toBeHidden();
    }
    await expect(page.locator('#err-role')).toBeVisible();
    await expect(page.locator('#err-size')).toBeVisible();
    await expect(page.locator('#err-challenge')).toBeVisible();
    expect(posted).toBe(false);
    // message is optional now: no error for it
    await expect(page.locator('#err-ms')).toHaveCount(0);
  });
}

test('/book-a-demo/ optional fields may be left blank and message is optional', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await gotoClean(page, '/book-a-demo/');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  const b = await cap.body;
  expect(b.message ?? '').toBe('');
  expect(b.estimatingMethod).toBeUndefined();
  expect(b.phone ?? '').toBe('');
});
