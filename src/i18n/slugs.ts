/**
 * Per-locale URL slugs for canonical (EN) route segments. Single source of
 * truth consumed by i18n/utils.ts (links, hreflang) AND astro.config.mjs
 * (sitemap alternates, priorities, 308 redirects). ASCII only — no diacritics
 * in URLs. A segment absent here keeps its canonical form in every locale.
 */
export const SLUGS: Record<string, { sl: string; hr: string }> = {
  'book-a-demo': { sl: 'rezervirajte-demo', hr: 'rezervirajte-demo' },
  'privacy-policy': { sl: 'politika-zasebnosti', hr: 'pravila-privatnosti' },
};

/** localized segment → canonical segment, per locale. */
export const REVERSE: Record<'sl' | 'hr', Record<string, string>> = { sl: {}, hr: {} };
for (const [canonical, bySlug] of Object.entries(SLUGS)) {
  REVERSE.sl[bySlug.sl] = canonical;
  REVERSE.hr[bySlug.hr] = canonical;
}
