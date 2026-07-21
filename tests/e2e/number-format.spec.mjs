// Locale number formatting in the mock platform screens — SL and HR write
// 1.500 for thousands and 1,24 for decimals (see LOCALE_META), and put a
// non-breaking space before % ("4 %"). The EN page must keep EN separators.
// Currency symbol stays before the number in every locale (hero-chip
// convention). Checks run against body textContent like i18n-parity.spec.
import { test, expect } from '@playwright/test';
import { gotoClean, VIEWPORTS } from './helpers.mjs';

test.use({ viewport: VIEWPORTS.desktop });

async function pageText(page) {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('script, style, noscript').forEach((el) => el.remove());
    return clone.textContent;
  });
}

const NBSP = ' ';

test('EN keeps EN separators and tight percent', async ({ page }) => {
  await gotoClean(page, '/');
  const text = await pageText(page);
  for (const s of ['€11,014.11', '427.66', '9.6 t', '€1,180', '€2,180', '98%', '+34%', '87%', '82%', '±10%']) {
    expect(text, `EN page should contain "${s}"`).toContain(s);
  }
});

for (const locale of ['sl', 'hr']) {
  test(`/${locale}/ mock screens use local separators and spaced percent`, async ({ page }) => {
    await gotoClean(page, `/${locale}/`);
    const text = await pageText(page);
    for (const s of ['€11.014,11', '427,66', '9,6 t', '€1.180', '€2.180', `98${NBSP}%`, `+34${NBSP}%`, `87${NBSP}%`, `82${NBSP}%`, `±10${NBSP}%`]) {
      expect(text, `/${locale}/ should contain "${s}"`).toContain(s);
    }
    for (const s of ['€11,014.11', '427.66', '9.6 t', '€1,180', '€2,180', '98%', '+34%', '87%', '82%', '±10 %', '87 %']) {
      expect(text, `/${locale}/ should not contain "${s}"`).not.toContain(s);
    }
  });
}
