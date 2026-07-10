// Renders every public/og/gradvera-og*.svg to a sibling 1200x630 PNG using
// Playwright Chromium with the real self-hosted IBM Plex Sans (fontsource
// woff2). Rerunnable after any SVG edit:
//   node scripts/render-og.mjs
import { chromium } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OG_DIR = join(ROOT, 'public/og');
const FONT_PKG = join(ROOT, 'node_modules/@fontsource/ibm-plex-sans');

// Reuse fontsource's own @font-face blocks — they carry the unicode-range
// declarations that let latin and latin-ext (š ž č đ) coexist under one
// family — inlining each woff2 as a data: URI so the generated page needs no
// file:// fetches.
async function fontFaces(weight) {
  const css = await readFile(join(FONT_PKG, `${weight}.css`), 'utf8');
  const blocks = css.match(/@font-face \{[^}]*\}/g) ?? [];
  const out = [];
  for (const block of blocks) {
    const m = block.match(/url\(\.\/files\/(ibm-plex-sans-latin(?:-ext)?-\d+-normal\.woff2)\)/);
    if (!m) continue;
    const data = await readFile(join(FONT_PKG, 'files', m[1]));
    out.push(
      block.replace(
        /src: [^;]+;/,
        `src: url(data:font/woff2;base64,${data.toString('base64')}) format('woff2');`,
      ),
    );
  }
  if (out.length !== 2) throw new Error(`expected latin + latin-ext faces for weight ${weight}, got ${out.length}`);
  return out.join('\n');
}

const css = `${await fontFaces(400)}\n${await fontFaces(600)}\nbody { margin: 0; } svg { display: block; }`;
const svgs = (await readdir(OG_DIR)).filter((f) => /^gradvera-og.*\.svg$/.test(f)).sort();
if (svgs.length === 0) throw new Error(`no gradvera-og*.svg found in ${OG_DIR}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 700 }, deviceScaleFactor: 1 });
for (const name of svgs) {
  const svg = await readFile(join(OG_DIR, name), 'utf8');
  await page.setContent(`<!doctype html><style>${css}</style>${svg}`);
  await page.evaluate(() => document.fonts.ready);
  // Gate: the tagline (last <text>) must end inside the canvas with at least
  // 60px of right margin, or a longer tagline would silently ship clipped.
  const MIN_RIGHT_MARGIN = 60;
  const right = await page.evaluate(() => {
    const texts = document.querySelectorAll('svg text');
    const b = texts[texts.length - 1].getBBox();
    return Math.round(b.x + b.width);
  });
  const margin = 1200 - right;
  if (right > 1200 - MIN_RIGHT_MARGIN) {
    throw new Error(
      `${name}: tagline right edge ${right}px leaves only ${margin}px right margin ` +
        `(minimum ${MIN_RIGHT_MARGIN}px) — shorten the tagline or shrink its font size`,
    );
  }
  const out = name.replace(/\.svg$/, '.png');
  await page.locator('svg').screenshot({ path: join(OG_DIR, out) });
  console.log(`${out}  tagline right edge ${right}px (right margin ${margin}px)`);
}
await browser.close();
