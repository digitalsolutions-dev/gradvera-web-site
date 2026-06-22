// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import vercel from '@astrojs/vercel';

// Production canonical origin. Override per-environment with PUBLIC_SITE_URL.
// NOTE: confirm the real production domain (gradvera.com? gradvera.si?) before launch —
// it bakes into canonical URLs, hreflang, OG tags, sitemap and robots.
const SITE = process.env.PUBLIC_SITE_URL || 'https://www.gradvera.com';

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
    }),
    // Run GTM / GA4 off the main thread to keep Core Web Vitals green.
    partytown({ config: { forward: ['dataLayer.push', 'gtag'] } }),
  ],
  build: { inlineStylesheets: 'auto' },
});
