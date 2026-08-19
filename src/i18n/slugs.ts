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
  'construction-bid-estimate': { sl: 'gradbeni-izracun', hr: 'gradevinski-troskovnik' },
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

/**
 * Canonical first-segments that exist in EN only (no SL/HR page). Consumers:
 * utils.alternates() (hreflang en + x-default only), astro.config sitemap
 * serialize() (same + priority 0.9), LangSwitch (links to the locale home
 * instead of a 404). Add a segment here the moment an EN-only route is created.
 */
export const EN_ONLY_ROUTES: ReadonlySet<string> = new Set(['construction-estimating-software']);

/** True when a canonical (locale-stripped) path's first segment is EN-only. */
export function isEnOnlyPath(canonicalPath: string): boolean {
  const first = canonicalPath.split('/').filter(Boolean)[0];
  return first !== undefined && EN_ONLY_ROUTES.has(first);
}
