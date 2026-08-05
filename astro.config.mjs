// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { SLUGS, REVERSE } from './src/i18n/slugs';

// Production canonical origin. Override per-environment with PUBLIC_SITE_URL.
// Confirmed launch domain: gradvera.com (apex). Configure Vercel to redirect
// www.gradvera.com → gradvera.com so there is a single canonical host.
const SITE = process.env.PUBLIC_SITE_URL || 'https://gradvera.com';

// 308s from the old (canonical-slug) SL/HR URLs — they are indexed; a permanent
// redirect transfers the signal. ONLY launch-era paths: pages created after the
// slug map existed never served a canonical-slug URL. NOTE: Astro+adapter emit
// these as slash-less matchers; scripts/patch-vercel-redirects.mjs (run by the
// build script) widens them to match the trailing-slash URLs Google indexed.
const LEGACY_SLUG_PATHS = ['book-a-demo', 'privacy-policy'];
/** @type {Record<string, {status: 308, destination: string}>} */
const redirects = {};
for (const canonical of LEGACY_SLUG_PATHS) {
  for (const lang of /** @type {('sl'|'hr')[]} */ (['sl', 'hr'])) {
    const localized = SLUGS[canonical]?.[lang];
    if (localized && localized !== canonical) {
      redirects[`/${lang}/${canonical}/`] = { status: 308, destination: `/${lang}/${localized}/` };
    }
  }
}

export default defineConfig({
  site: SITE,
  // Static-first for SEO / Core Web Vitals. The Vercel adapter lets individual
  // routes opt into on-demand rendering via `export const prerender = false`
  // (used only by /api/lead — every page stays pre-rendered HTML).
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'ignore',
  redirects,
  i18n: {
    locales: ['en', 'sl', 'hr'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false, // en at /, sl at /sl/, hr at /hr/
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      // The 404 page is noindex; keep it out of the sitemap. @astrojs/sitemap
      // already excludes status-code pages by itself — this exact-path filter
      // is belt-and-braces (and won't swallow a future /404-guide/ page).
      filter: (page) => new URL(page).pathname !== '/404/',
      // Stamp every entry with the deploy time — the static site is fully
      // regenerated on each deploy, so this is an honest freshness signal.
      lastmod: new Date(),
      changefreq: 'monthly',
      serialize(item) {
        const url = new URL(item.url);
        const parts = url.pathname.split('/').filter(Boolean);
        const locale = parts[0] === 'sl' || parts[0] === 'hr' ? parts[0] : 'en';
        const rest = locale === 'en' ? parts : parts.slice(1);
        const canonSegs = rest.map((s) => (locale === 'en' ? s : (REVERSE[locale][s] ?? s)));
        const canonical = '/' + canonSegs.join('/') + (canonSegs.length ? '/' : '');
        item.priority = canonical === '/' ? 1.0 : canonical.startsWith('/privacy') ? 0.3 : 0.8;
        /** @param {'en'|'sl'|'hr'} lang */
        const localized = (lang) =>
          lang === 'en'
            ? canonical
            : `/${lang}` + (canonSegs.length ? '/' + canonSegs.map((s) => SLUGS[s]?.[lang] ?? s).join('/') : '') + '/';
        item.links = [
          { lang: 'en', url: url.origin + localized('en') },
          { lang: 'sl', url: url.origin + localized('sl') },
          { lang: 'hr', url: url.origin + localized('hr') },
          { lang: 'x-default', url: url.origin + localized('en') },
        ];
        return item;
      },
    }),
  ],
  build: { inlineStylesheets: 'auto' },
});
