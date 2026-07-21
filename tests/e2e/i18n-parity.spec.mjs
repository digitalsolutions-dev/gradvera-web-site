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
