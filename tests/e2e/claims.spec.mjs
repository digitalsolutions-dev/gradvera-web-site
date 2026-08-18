// Claims policy (docs/confirmed-acquisition-model.md §6.2, §7.1): the built
// site must not carry unsupported "measured results", free-trial wording, or
// copy implying the default demo runs on the prospect's own data. Positive
// checks pin the required disclosures (Excel-only input, DS relationship,
// guided-demo route). Runs against dist/ like every other spec here.
import { test, expect } from '@playwright/test';
import { gotoClean } from './helpers.mjs';

const HOME = ['/', '/sl/', '/hr/'];

// Visible text of the page minus script/style, collapsed whitespace.
async function bodyText(page) {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('script,style,noscript').forEach((n) => n.remove());
    return (clone.textContent || '').replace(/\s+/g, ' ');
  });
}

for (const path of HOME) {
  test(`${path} carries no "measured results" section`, async ({ page }) => {
    await gotoClean(page, path);
    expect(await page.locator('section.results').count()).toBe(0);
    const text = await bodyText(page);
    for (const banned of ['Measured in Practice', 'Izmerjeno v praksi', 'Izmjereno u praksi', '82%', '82 %', '5×', '95%', '95 %']) {
      expect(text, `found banned claim "${banned}" on ${path}`).not.toContain(banned);
    }
  });
}
