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

// ---- Spam trap vs Chrome's real autofill engine ----
// The confirmed root cause of the dead submit (PR #90), pinned with the browser
// itself: Chrome classified the old off-screen `company_website` trap as *Company
// name* (autocomplete="off" ignored), split the form into two autofill sections at
// the repeated company type, and autofill from Full name then filled only the trap
// + fullName. This drives Chrome's address-autofill engine over CDP
// (`Autofill.trigger`) from each contact field and asserts the trap — and every
// other non-contact field — stays empty and unclassified while ONE section fills
// every contact field. The `Autofill` domain
// exists only in the full Chromium build (`channel: 'chromium'`), not the default
// headless shell — and `test.use({ channel })` can't be scoped to a describe (it
// forces a new worker), so the group launches its own full Chromium. A missing
// domain or a missing fill event fails the test; it never skips.
const AUTOFILL_PAGES = [...DEMO.map((d) => d.path), '/construction-estimating-software/'];
// Obviously fake profile; nothing is submitted and /api/lead is intercepted anyway.
// It carries a street/city/zip the form never asks for, so a future decoy typed as
// an address field (not just the known trap) would be filled — and caught below.
const AUTOFILL_ADDRESS = {
  fields: [
    { name: 'NAME_FULL', value: 'Ada Lovelace' },
    { name: 'NAME_FIRST', value: 'Ada' },
    { name: 'NAME_LAST', value: 'Lovelace' },
    { name: 'COMPANY_NAME', value: 'Analytical Engines BV' },
    { name: 'EMAIL_ADDRESS', value: 'ada@example.com' },
    { name: 'PHONE_HOME_WHOLE_NUMBER', value: '+31612345678' },
    { name: 'ADDRESS_HOME_LINE1', value: '1 Example Street' },
    { name: 'ADDRESS_HOME_CITY', value: 'Exampleton' },
    { name: 'ADDRESS_HOME_ZIP', value: '1234 AB' },
    { name: 'ADDRESS_HOME_COUNTRY', value: 'NL' },
  ],
};
// Found by structure, not name, so a renamed or reintroduced bait trap (the pre-fix
// `company_website` included) is still the one under test.
const TRAP_SEL = '#gv-demo-form [aria-hidden="true"] input[tabindex="-1"]';
const CONTACT = ['fullName', 'company', 'email', 'phone', 'country'];
const fmtFilled = (f) => `${f.name || f.id}=${JSON.stringify(f.value)} [${f.autofillType}/${f.fillingStrategy}]`;

test.describe('spam trap vs Chrome autofill (full Chromium)', () => {
  let browser;
  test.beforeAll(async ({ playwright, headless }) => {
    browser = await playwright.chromium.launch({ channel: 'chromium', headless });
  });
  test.afterAll(async () => {
    await browser?.close();
  });

  for (const path of AUTOFILL_PAGES) {
    for (const trigger of ['#fn', '#co', '#em']) {
      test(`${path} autofill from ${trigger} fills every contact field, never the trap`, async ({ baseURL }) => {
        const ctx = await browser.newContext({ baseURL });
        let timer; // the event-wait timer; cleared in `finally` on every path
        try {
          let posted = 0;
          await ctx.route('**/api/lead', (route) => { posted++; route.fulfill({ status: 200, body: '{"ok":true}' }); });
          const page = await ctx.newPage();
          await gotoClean(page, path);
          const trap = page.locator(TRAP_SEL);
          await expect(trap).toHaveCount(1);
          const trapName = await trap.getAttribute('name');

          const cdp = await ctx.newCDPSession(page);
          await cdp.send('DOM.enable');
          await cdp.send('Autofill.enable').catch(() => {}); // absent on some builds; Autofill.trigger below is not optional
          // Bounded wait on Chrome's own report of the fill (resolves null on timeout → loud failure below).
          const filledEvent = new Promise((resolve) => {
            timer = setTimeout(() => resolve(null), 10_000);
            cdp.once('Autofill.addressFormFilled', (e) => { clearTimeout(timer); resolve(e); });
          });
          await page.focus(trigger);
          const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
          const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: trigger });
          const { node } = await cdp.send('DOM.describeNode', { nodeId });
          await cdp.send('Autofill.trigger', { fieldId: node.backendNodeId, address: AUTOFILL_ADDRESS });
          const ev = await filledEvent;
          expect(ev, `no Autofill.addressFormFilled event within 10s of triggering from ${trigger}`).not.toBeNull();
          const filled = ev.filledFields;
          const report = filled.map(fmtFilled).join(', ');

          // Sync point: the DOM shows every non-trap value Chrome reports as filled.
          const reported = filled.filter((f) => f.value && f.name && f.name !== trapName).map((f) => f.name);
          await page.waitForFunction((names) => {
            const form = document.getElementById('gv-demo-form');
            return names.every((n) => form.elements.namedItem(n)?.value);
          }, reported);
          const values = await page.evaluate(([sel, names]) => {
            const form = document.getElementById('gv-demo-form');
            const out = { trap: document.querySelector(sel).value, contact: {}, dirty: [] };
            for (const n of names) out.contact[n] = form.elements.namedItem(n)?.value ?? '';
            // Every other control a visitor or autofill could set (not locale/page,
            // which are type="hidden") must be untouched: empty, unchecked, or on
            // its default option.
            for (const el of form.querySelectorAll('input, select, textarea')) {
              if (names.includes(el.name) || ['hidden', 'submit', 'button', 'reset', 'image'].includes(el.type)) continue;
              const touched = el.type === 'radio' || el.type === 'checkbox' ? el.checked
                : el.tagName === 'SELECT' ? [...el.options].some((o) => o.selected !== o.defaultSelected)
                : el.value !== '';
              if (touched) out.dirty.push(`${el.name || el.id || el.tagName}=${JSON.stringify(el.value)}`);
            }
            return out;
          }, [TRAP_SEL, CONTACT]);

          // (b) Chrome types and fills ONLY the five contact fields: the trap (no
          // Company-name type) and every other field in the section — `message`
          // today, any future decoy (street, city, zip, a second email…) — get no
          // value and no autofill type.
          const strays = filled.filter((f) => !CONTACT.includes(f.name) && (f.value || f.autofillType));
          expect.soft(strays.map(fmtFilled), `Chrome autofill filled/classified a non-contact field (trap "${trapName}") from ${trigger} — ${report}`).toEqual([]);
          // (a) The trap input itself, and every other non-contact control, is still empty.
          expect.soft(values.trap, `trap "${trapName}" value after autofill from ${trigger}`).toBe('');
          expect.soft(values.dirty, `non-contact form controls set by autofill from ${trigger}`).toEqual([]);
          // (c) One section, per Chrome's own report: every contact field is typed and
          // filled, whichever field triggered it. (The DOM alone can't prove it —
          // SL/HR pre-select their country.)
          for (const n of CONTACT) {
            const f = filled.find((x) => x.name === n);
            expect.soft(f?.value ?? '', `${n} not filled by autofill from ${trigger} (form split?) — ${report}`).not.toBe('');
            expect.soft(f?.autofillType ?? '', `${n} has no autofill type (from ${trigger}) — ${report}`).not.toBe('');
            expect.soft(values.contact[n], `${n} empty in the DOM after autofill from ${trigger}`).not.toBe('');
          }
          expect(posted, 'nothing was submitted').toBe(0);
        } finally {
          clearTimeout(timer);
          await ctx.close();
        }
      });
    }
  }
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
