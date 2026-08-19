// GA4 lead conversion: a successful /api/lead POST must push a generate_lead
// event to window.dataLayer (GTM forwards it to GA4). The API is intercepted —
// the static preview server has no live endpoint.
import { test, expect } from '@playwright/test';
import { gotoClean, fillRequired } from './helpers.mjs';

const PAGES = [
  { path: '/book-a-demo/', locale: 'en' },
  { path: '/sl/rezervirajte-demo/', locale: 'sl' },
  { path: '/hr/rezervirajte-demo/', locale: 'hr' },
];

for (const { path, locale } of PAGES) {
  test(`${path} pushes generate_lead on successful submit`, async ({ page }) => {
    await page.route('**/api/lead', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    );
    await gotoClean(page, path);
    await fillRequired(page);
    await page.click('#gv-demo-form button[type="submit"]');
    await expect(page.locator('.form-ok')).toBeVisible();
    const events = await page.evaluate(() =>
      (window.dataLayer || []).filter((e) => e && e.event === 'generate_lead'),
    );
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      event: 'generate_lead',
      form_id: 'gv-demo-form',
      locale,
      page: 'book-a-demo',
    });
  });
}

test('failed submit pushes no generate_lead', async ({ page }) => {
  await page.route('**/api/lead', (route) => route.fulfill({ status: 500, body: '' }));
  await gotoClean(page, '/book-a-demo/');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-net-err')).toBeVisible();
  const events = await page.evaluate(() =>
    (window.dataLayer || []).filter((e) => e && e.event === 'generate_lead'),
  );
  expect(events).toHaveLength(0);
});
