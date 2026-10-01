// Trilingual parity of the mock platform screens — the localized pages must not
// leak hardcoded English strings from the fake product UI (Capability sections,
// HowItWorks visualisation, hero scroll cue). Sentinels are exact strings that
// exist on the EN page; each localized page must render none of them.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { gotoClean, VIEWPORTS } from './helpers.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

// The components whose mock-screen copy this suite guards.
const LOCALIZED_COMPONENTS = [
  'src/components/sections/Hero.astro',
  'src/components/sections/Capability1.astro',
  'src/components/sections/Capability2.astro',
  'src/components/sections/Capability3.astro',
  'src/components/sections/Capability4.astro',
  'src/components/sections/HowItWorks.astro',
  'src/pages/sl/index.astro',
  'src/pages/hr/index.astro',
];

// Distinctive mock-screen copy — one representative string per screen area.
const SENTINELS = [
  'Estimate structure', // Cap1 screen 1 heading
  'Preparatory works', // Cap1 section list item
  'Adding items', // Cap1 screen 2 window title / stepper
  'Suggested unit price', // Cap2 price card
  'Compared to previous prices', // Cap2 history block
  'Risk review', // Cap3 window title
  'Subcontractor comparison', // Cap4 window title
  'Not assigned to you', // Cap4 portal
  'Estimate in progress', // HowItWorks visualisation
  'Scroll', // hero scroll cue
];

test.use({ viewport: VIEWPORTS.desktop });

// textContent of body minus script/style, NOT innerText: several mock screens
// start hidden (scroll-reveal), and innerText would skip their copy entirely.
async function visibleText(page) {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('script, style, noscript').forEach((el) => el.remove());
    return clone.textContent;
  });
}

test('EN homepage still renders every sentinel (guards sentinel typos)', async ({ page }) => {
  await gotoClean(page, '/');
  const text = await visibleText(page);
  for (const s of SENTINELS) expect(text, `EN page should contain "${s}"`).toContain(s);
});

// One localized sentinel per page proves the page actually rendered (and is not
// a 404 fallback that would pass the negative checks vacuously).
const LOCAL_PROOF = { sl: 'Struktura ponudbe', hr: 'Struktura troškovnika' };

for (const locale of ['sl', 'hr']) {
  test(`/${locale}/ mock screens carry no hardcoded English`, async ({ page }) => {
    const res = await page.goto(`/${locale}/`, { waitUntil: 'load' });
    expect(res.status(), `/${locale}/ should serve 200`).toBe(200);
    const text = await visibleText(page);
    expect(text, `/${locale}/ should contain "${LOCAL_PROOF[locale]}"`).toContain(LOCAL_PROOF[locale]);
    for (const s of SENTINELS) {
      expect(text, `/${locale}/ should not contain "${s}"`).not.toContain(s);
    }
  });
}

// Exhaustive guard for the silent-fallback bug class: every literal t('…') key
// used by the localized components must exist in all three dictionaries —
// a key missing from sl/hr silently renders English.
test('every t() key in the localized components exists in en, sl and hr', () => {
  const keys = new Set();
  for (const file of LOCALIZED_COMPONENTS) {
    const src = readFileSync(ROOT + file, 'utf8');
    for (const m of src.matchAll(/\bt\('([^']+)'\)/g)) keys.add(m[1]);
  }
  expect(keys.size).toBeGreaterThan(100);
  const missing = [];
  for (const locale of ['en', 'sl', 'hr']) {
    const dict = JSON.parse(readFileSync(`${ROOT}src/i18n/${locale}.json`, 'utf8'));
    for (const key of keys) if (!(key in dict)) missing.push(`${locale}: ${key}`);
  }
  expect(missing).toEqual([]);
});

// HR proofreading (lektura, 2026-10-01): the demo is a "prezentacija" booked
// with "Zakažite", never a "demonstracija" you "rezervirate". The raw HTML is
// checked, so attributes (iframe title), <title>, meta and JSON-LD count too —
// the lowercase URL slug `rezervirajte-demo` is deliberately unchanged.
const HR_PAGES = ['/hr/', '/hr/rezervirajte-demo/', '/hr/gradevinski-troskovnik/', '/hr/gradevinske-kalkulacije/', '/hr/pravila-privatnosti/'];
const HR_CTA = 'Zakažite prezentaciju';

for (const path of HR_PAGES) {
  test(`${path} uses the proofread HR demo wording`, async ({ page }) => {
    await gotoClean(page, path);
    const html = await page.content();
    expect(html, `${path} still says "demonstracija"`).not.toMatch(/demonstrac/i);
    expect(html, `${path} still says "Rezervirajte"`).not.toContain('Rezervirajte');
    await expect(page.locator('header.hdr .nav-cta a.btn-primary')).toHaveText(HR_CTA);
    await expect(page.locator('footer')).toContainText(HR_CTA);
  });
}

test('/hr/ home CTAs and headings carry the proofread copy', async ({ page }) => {
  await gotoClean(page, '/hr/');
  for (const sel of ['.hero-actions a.btn-primary', '.cta1 a.btn-primary', '.cta2 a.btn-primary']) {
    await expect(page.locator(sel)).toHaveText(`${HR_CTA} →`);
  }
  await expect(page.locator('#helps h2')).toHaveText('Odredite cijene za više ponuda u manje vremena, uz troškove na koje se možete osloniti.');
  await expect(page.locator('#helps h2 .amber')).toHaveText('troškove na koje se možete osloniti.');
  await expect(page.locator('.cta1 .c1t')).toHaveText('Pogledajte koliko se brže sastavlja pouzdana ponuda.');
  await expect(page.locator('.cta1 .c1t .amber')).toHaveText('pouzdana');
});

test('/hr/rezervirajte-demo/ title, submit button and Bookings frame carry the proofread copy', async ({ page }) => {
  await gotoClean(page, '/hr/rezervirajte-demo/');
  await expect(page).toHaveTitle(`${HR_CTA} — Gradvera`);
  await expect(page.locator('#gv-demo-form button[type="submit"] .btn-label')).toHaveText(HR_CTA);
  await expect(page.locator('iframe.booking-frame')).toHaveAttribute('title', `${HR_CTA} Gradvere — Microsoft Bookings`);
});

for (const path of ['/hr/gradevinski-troskovnik/', '/hr/gradevinske-kalkulacije/']) {
  test(`${path} guide CTA carries the proofread copy`, async ({ page }) => {
    await gotoClean(page, path);
    await expect(page.locator('.guide-cta a.btn-primary')).toHaveText(`${HR_CTA} →`);
  });
}
