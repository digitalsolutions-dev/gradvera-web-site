/**
 * Per-locale URL slugs for canonical (EN) route segments. Single source of
 * truth consumed by i18n/utils.ts (links, hreflang) AND astro.config.mjs
 * (sitemap alternates, priorities, 308 redirects). ASCII only — no diacritics
 * in URLs. A segment absent here keeps its canonical form in every locale.
 */
export const SLUGS: Record<string, { sl: string; hr: string }> = {
  'book-a-demo': { sl: 'rezervirajte-demo', hr: 'rezervirajte-demo' },
  'privacy-policy': { sl: 'politika-zasebnosti', hr: 'pravila-privatnosti' },
  'construction-cost-estimation': { sl: 'gradbene-kalkulacije', hr: 'gradevinske-kalkulacije' },
  'construction-bid-estimate': { sl: 'gradbeni-predracun', hr: 'gradevinski-troskovnik' },
};

/** localized segment → canonical segment, per locale. */
export const REVERSE: Record<'sl' | 'hr', Record<string, string>> = { sl: {}, hr: {} };
for (const [canonical, bySlug] of Object.entries(SLUGS)) {
  // A localized slug reused across two canonical segments would silently
  // last-write-wins here and cross-wire stripLocale (wrong canonical → wrong
  // hreflang/sitemap alternates). Fail the build instead.
  for (const lang of ['sl', 'hr'] as const) {
    const localized = bySlug[lang];
    if (REVERSE[lang][localized] !== undefined) {
      throw new Error(
        `Duplicate ${lang} slug "${localized}": already maps to "${REVERSE[lang][localized]}", cannot also map to "${canonical}".`,
      );
    }
    REVERSE[lang][localized] = canonical;
  }
}
