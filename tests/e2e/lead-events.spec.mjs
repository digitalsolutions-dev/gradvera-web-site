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

const SUBMIT_OK = '{"ok":true,"forwarded":false,"qualified":true,"score":8}';
const SUBMIT_UNQUALIFIED = '{"ok":true,"forwarded":false,"qualified":false,"score":4}';

async function events(page, name) {
  return page.evaluate((n) => (window.dataLayer || []).filter((e) => e && e.event === n), name);
}

for (const { path, locale, ref } of PAGES) {
  test(`${path} pushes qualification_form_start once on first interaction`, async ({ page }) => {
    await gotoClean(page, path);
    expect(await events(page, 'qualification_form_start')).toHaveLength(0);
    await page.fill('#fn', 'A');
    await page.fill('#co', 'B');
    await page.selectOption('#country', 'NL');
    const ev = await events(page, 'qualification_form_start');
    expect(ev).toHaveLength(1);
    expect(ev[0]).toMatchObject({ event: 'qualification_form_start', form_id: 'gv-demo-form', locale, page: 'book-a-demo' });
  });

  test(`${path} qualified submit → form_submit + qualified_lead + booking_widget_open, iframe src set once, no generate_lead`, async ({ page }) => {
    const cap = await armLeadCapture(page, SUBMIT_OK);
    await gotoClean(page, path);
    await fillRequired(page);
    await page.click('#gv-demo-form button[type="submit"]');
    await expect(page.locator('.form-ok')).toBeVisible();
    await cap.body;
    const submit = await events(page, 'qualification_form_submit');
    expect(submit).toHaveLength(1);
    expect(submit[0]).toMatchObject({ form_id: 'gv-demo-form', locale, page: 'book-a-demo', qualified: true, score: 8 });
    const ql = await events(page, 'qualified_lead');
    expect(ql).toHaveLength(1);
    expect(ql[0]).toMatchObject({ form_id: 'gv-demo-form', locale, page: 'book-a-demo', score: 8 });
    const open = await events(page, 'booking_widget_open');
    expect(open).toHaveLength(1);
    expect(open[0]).toMatchObject({ form_id: 'gv-demo-form', locale, page: 'book-a-demo', ref });
    expect(await events(page, 'generate_lead')).toHaveLength(0);
    const frame = page.locator('.form-ok iframe.booking-frame');
    await expect(frame).toHaveAttribute('src', `${BOOKING_URL}&RefID=${ref}`);
    await expect(frame).toBeVisible();
    // order: submit → qualified_lead → booking_widget_open
    const order = await page.evaluate(() => (window.dataLayer || []).map((e) => e && e.event).filter((n) => ['qualification_form_submit', 'qualified_lead', 'booking_widget_open'].includes(n)));
    expect(order).toEqual(['qualification_form_submit', 'qualified_lead', 'booking_widget_open']);
  });
}

test('/book-a-demo/ unqualified submit → form_submit with qualified:false, no qualified_lead, calendar still opens', async ({ page }) => {
  await armLeadCapture(page, SUBMIT_UNQUALIFIED);
  await gotoClean(page, '/book-a-demo/');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  expect((await events(page, 'qualification_form_submit'))[0]).toMatchObject({ qualified: false, score: 4 });
  expect(await events(page, 'qualified_lead')).toHaveLength(0);
  expect(await events(page, 'booking_widget_open')).toHaveLength(1);
});

test('/book-a-demo/ utm_campaign becomes the sanitized RefID; direct link follows', async ({ page }) => {
  await armLeadCapture(page, SUBMIT_OK);
  await gotoClean(page, '/book-a-demo/?utm_source=google&utm_campaign=NL%20Est%20%2F%20Pricing!');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  await expect(page.locator('.form-ok iframe.booking-frame')).toHaveAttribute('src', `${BOOKING_URL}&RefID=nl-est-pricing`);
  await expect(page.locator('.form-ok .booking-link')).toHaveAttribute('href', `${BOOKING_URL}&RefID=nl-est-pricing`);
  expect((await events(page, 'booking_widget_open'))[0]).toMatchObject({ ref: 'nl-est-pricing' });
});

test('/book-a-demo/ failed submit pushes no events and keeps the iframe unloaded', async ({ page }) => {
  await page.route('**/api/lead', (route) => route.fulfill({ status: 500, body: '' }));
  await gotoClean(page, '/book-a-demo/');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-net-err')).toBeVisible();
  expect(await events(page, 'qualification_form_submit')).toHaveLength(0);
  expect(await events(page, 'booking_widget_open')).toHaveLength(0);
  expect(await page.locator('.form-ok iframe.booking-frame').getAttribute('src')).toBeNull();
});
