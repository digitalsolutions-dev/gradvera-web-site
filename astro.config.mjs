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
    }),
  ],
  build: { inlineStylesheets: 'auto' },
});
