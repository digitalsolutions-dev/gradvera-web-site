// Qualification form (acquisition model §8.1): required fields + enum wire
// values + optional fields, per locale, asserted on the intercepted POST body.
import { test, expect } from '@playwright/test';
import { gotoClean, fillRequired, armLeadCapture, checkChip, openOptional } from './helpers.mjs';

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
    // The three optional qualifier groups sit inside the collapsed
    // `<details class="form-more">` disclosure — reveal it before clicking them.
    await openOptional(page);
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

// ---- Spam trap (honeypot) ----
// Browser autofill and password managers ignore autocomplete="off", treat an
// off-screen input as fillable, and match "company"/"website"-style names and
// labels — so the old off-screen `company_website` trap got a real visitor's
// saved company and the submit went dead. The trap must be unrendered
// (`hidden` → display:none, unfocusable) and carry no autofill-bait wording.
const TRAP_BANNED = ['company', 'website', 'url', 'email', 'name', 'phone', 'tel', 'address'];

for (const { path } of DEMO) {
  test(`${path} spam trap is unrendered, unfocusable, and has no autofill-bait name or label`, async ({ page }) => {
    await gotoClean(page, path);
    const trap = page.locator('#gv-demo-form input[name="hp_field"]');
    await expect(trap).toHaveCount(1);
    await expect(page.locator('input[name="company_website"]')).toHaveCount(0);
    await expect(trap).toBeHidden();
    const t = await trap.evaluate((el) => {
      el.focus();
      const label = el.closest('label') || (el.id ? document.querySelector(`label[for="${el.id}"]`) : null);
      return {
        rendered: el.getClientRects().length > 0,
        focused: document.activeElement === el,
        name: el.getAttribute('name') || '',
        id: el.id || '',
        label: label ? (label.textContent || '').trim() : '',
        tabindex: el.getAttribute('tabindex'),
        autocomplete: el.getAttribute('autocomplete'),
        inAriaHidden: !!el.closest('[aria-hidden="true"]'),
      };
    });
    expect(t.rendered, 'trap has no layout box (display:none)').toBe(false);
    expect(t.focused, 'trap cannot take focus').toBe(false);
    expect(t.label).toBe('Leave this field empty');
    for (const [k, v] of [['name', t.name], ['id', t.id], ['label', t.label]]) {
      for (const w of TRAP_BANNED) expect(v.toLowerCase(), `trap ${k} "${v}" contains "${w}"`).not.toContain(w);
    }
    expect(t).toMatchObject({ tabindex: '-1', autocomplete: 'off', inAriaHidden: true });
  });
}

test('/book-a-demo/ a filled trap never kills the button: empty required fields still show errors, no POST', async ({ page }) => {
  let posted = false;
  await page.route('**/api/lead', (route) => { posted = true; route.fulfill({ status: 200, body: '{"ok":true}' }); });
  await gotoClean(page, '/book-a-demo/');
  await page.locator('#gv-demo-form input[name="hp_field"]').evaluate((el) => { el.value = 'Test Co BV'; });
  await page.click('#gv-demo-form button[type="submit"]');
  for (const id of ['#err-fn', '#err-co', '#err-em', '#err-country', '#err-role', '#err-size', '#err-challenge']) {
    await expect(page.locator(id), `${id} shown`).toBeVisible();
  }
  expect(posted).toBe(false);
});

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

// ---- First-touch attribution (src/scripts/attribution.js, acquisition model §8.3) ----
// sessionStorage only (no cookie): the first touch of the tab wins and rides the POST.

test('attribution: click id + utm on the landing page survive navigation to the form and ride the POST', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await gotoClean(page, '/?gclid=Cj0TEST&utm_source=google&utm_medium=cpc&utm_campaign=nl-est&utm_term=construction%20estimating%20software');
  // `.nav-cta` also holds the LangSwitch anchors, so target the CTA button itself.
  await page.click('header .nav-cta a.btn-primary');
  await expect(page).toHaveURL(/\/book-a-demo\/$/);
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  const b = await cap.body;
  expect(b).toMatchObject({
    gclid: 'Cj0TEST', utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'nl-est',
    utm_term: 'construction estimating software', landingPage: '/', submissionPage: '/book-a-demo/', consent: 'unset',
  });
  expect(typeof b.submittedAt).toBe('string');
  expect(b.submittedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
});

test('attribution: first touch wins; a later visit without a click id does not overwrite', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await gotoClean(page, '/book-a-demo/?gclid=FIRST&utm_campaign=one');
  await gotoClean(page, '/book-a-demo/?utm_campaign=two');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  expect(await cap.body).toMatchObject({ gclid: 'FIRST', utm_campaign: 'one' });
});

test('attribution: consent state is read from the gv-consent cookie', async ({ page }) => {
  const cap = await armLeadCapture(page);
  await page.goto('/book-a-demo/', { waitUntil: 'load' });
  await page.click('[data-consent="accept"]');
  await fillRequired(page);
  await page.click('#gv-demo-form button[type="submit"]');
  await expect(page.locator('.form-ok')).toBeVisible();
  expect((await cap.body).consent).toBe('accept');
});
