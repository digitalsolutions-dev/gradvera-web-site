/**
 * GET /robots.txt — generated at build time (static).
 *
 * Allows everything except the on-demand API, and points crawlers at the
 * sitemap index emitted by @astrojs/sitemap. `site` comes from astro.config
 * (PUBLIC_SITE_URL), so the Sitemap URL always matches the canonical origin.
 */
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Sitemap: ' + new URL('sitemap-index.xml', site).href,
  ];
  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
