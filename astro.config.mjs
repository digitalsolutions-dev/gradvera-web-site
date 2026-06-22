// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Production canonical origin. Override per-environment with PUBLIC_SITE_URL.
// Confirmed launch domain: gradvera.com (apex). Configure Vercel to redirect
// www.gradvera.com → gradvera.com so there is a single canonical host.
const SITE = process.env.PUBLIC_SITE_URL || 'https://gradvera.com';

export default defineConfig({
  site: SITE,
  // Static-first for SEO / Core Web Vitals. The Vercel adapter lets individual
  // routes opt into on-demand rendering via `export const prerender = false`
  // (used only by /api/lead — every page stays pre-rendered HTML).
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'ignore',
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
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', sl: 'sl', hr: 'hr' },
      },
      // Stamp every entry with the deploy time — the static site is fully
      // regenerated on each deploy, so this is an honest freshness signal.
      lastmod: new Date(),
      changefreq: 'monthly',
      serialize(item) {
        // Per-page priority. (Google ignores priority/changefreq, but they are
        // conventional and read by Bing / SEO-audit tools.)
        const path = new URL(item.url).pathname.replace(/^\/(?:sl|hr)\//, '/');
        item.priority = path === '/' ? 1.0 : path.startsWith('/privacy') ? 0.3 : 0.8;
        // Complete the hreflang set with x-default → the English/default URL.
        // The i18n integration has already populated item.links with en/sl/hr.
        const en = item.links?.find((l) => l.lang === 'en');
        if (en && !item.links?.some((l) => l.lang === 'x-default')) {
          item.links?.push({ lang: 'x-default', url: en.url });
        }
        return item;
      },
    }),
  ],
  build: { inlineStylesheets: 'auto' },
});
