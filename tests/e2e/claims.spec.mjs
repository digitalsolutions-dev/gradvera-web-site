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

const PRODUCT_LINE = {
  '/': 'Gradvera is a product of DIGITAL SOLUTIONS d.o.o.',
  '/sl/': 'Gradvera je produkt podjetja DIGITAL SOLUTIONS d.o.o.',
  '/hr/': 'Gradvera je proizvod tvrtke DIGITAL SOLUTIONS d.o.o.',
};

for (const [path, line] of Object.entries(PRODUCT_LINE)) {
  test(`${path} footer discloses the DIGITAL SOLUTIONS relationship`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 }); // narrowest layout: the new line must not overflow
    await gotoClean(page, path);
    await expect(page.locator('footer .foot-bottom')).toContainText(line);
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows, `horizontal overflow on ${path} at 390px`).toBe(false);
  });
}

const GUARANTEE_PHRASES = {
  '/': ['protects your profits', 'protect profits'],
  '/sl/': ['varuje vaš dobiček', 'varujte dobiček'],
  '/hr/': ['štiti vašu dobit', 'štitite dobit'],
};

for (const [path, phrases] of Object.entries(GUARANTEE_PHRASES)) {
  test(`${path} makes no profit-guarantee claim`, async ({ page }) => {
    await gotoClean(page, path);
    const text = (await bodyText(page)).toLowerCase();
    for (const p of phrases) expect(text, `found "${p}" on ${path}`).not.toContain(p.toLowerCase());
  });
}

const GUIDE_PAGES = [
  { path: '/construction-bid-estimate/', excel: 'Excel bill of quantities', own: ['from your own documents', 'on the bill of quantities on your desk'] },
  { path: '/sl/gradbeni-izracun/', excel: 'popisa del v Excelu', own: ['iz vaših dokumentov', 'ki ga imate pred seboj'] },
  { path: '/hr/gradevinski-troskovnik/', excel: 'troškovnika u Excelu', own: ['iz vaše dokumentacije', 'koji vam je na stolu'] },
  { path: '/construction-cost-estimation/', excel: 'Excel BoQs', own: ['one of your own offers', 'on your last estimate'] },
  { path: '/sl/gradbene-kalkulacije/', excel: 'popise del v Excelu', own: ['eno od vaših ponudb', 'svoje zadnje kalkulacije'] },
  { path: '/hr/gradevinske-kalkulacije/', excel: 'troškovnike u Excelu', own: ['jednu vašu ponudu', 'vašom posljednjom kalkulacijom'] },
];

for (const { path, excel, own } of GUIDE_PAGES) {
  test(`${path} states Excel BoQ input and no own-documents demo promise`, async ({ page }) => {
    await gotoClean(page, path);
    const text = await bodyText(page);
    expect(text, `missing "${excel}" on ${path}`).toContain(excel);
    for (const o of own) expect(text, `found "${o}" on ${path}`).not.toContain(o);
  });
}

const DEMO_PAGES = [
  { path: '/book-a-demo/', must: ['Excel', 'sample data', 'annual', '14-day'], mustNot: ['on your own offers', 'On your own offers', 'free trial', 'Free trial'] },
  { path: '/sl/rezervirajte-demo/', must: ['Excel', 'vzorčnih podatkih', 'letna uvedba', '14-dnevn'], mustNot: ['na primeru svojih ponudb', 'Na primeru vaših ponudb', 'brezplačn', 'Brezplačn'] },
  { path: '/hr/rezervirajte-demo/', must: ['Excel', 'oglednim podacima', 'godišnje uvođenje', '14-dnevn'], mustNot: ['s vašim ponudama', 'Uz vaše ponude', 'besplatn', 'Besplatn'] },
];

for (const { path, must, mustNot } of DEMO_PAGES) {
  test(`${path} sets guided-demo / Excel / annual-onboarding expectations`, async ({ page }) => {
    await gotoClean(page, path);
    const text = await bodyText(page);
    for (const m of must) expect(text, `missing "${m}" on ${path}`).toContain(m);
    for (const n of mustNot) expect(text, `found "${n}" on ${path}`).not.toContain(n);
    // The numbered "what happens next" list must keep exactly three steps.
    expect(await page.locator('.demo-steps ol li').count()).toBe(3);
  });
}

const PRIVACY = [
  { path: '/privacy-policy/', must: 'session storage' },
  { path: '/sl/politika-zasebnosti/', must: 'sejni shrambi' },
  { path: '/hr/pravila-privatnosti/', must: 'pohrani sesije' },
];

for (const { path, must } of PRIVACY) {
  test(`${path} discloses form qualification data and session attribution storage`, async ({ page }) => {
    await gotoClean(page, path);
    expect(await bodyText(page)).toContain(must);
  });
}
