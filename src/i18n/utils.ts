/**
 * i18n routing + translation helpers.
 *
 * Content lives in flat-keyed JSON dictionaries (en/sl/hr.json). Keys are dot
 * paths (e.g. "hero.h1.l1"). Values may be strings OR arrays/objects (lists,
 * structured blocks). `t()` falls back to English, then to the raw key, so a
 * missing SL/HR translation degrades gracefully to the English string.
 *
 * Routing: English is the default locale served at "/"; SL at "/sl/", HR at
 * "/hr/" (astro.config i18n with prefixDefaultLocale:false).
 */
import en from './en.json';
import sl from './sl.json';
import hr from './hr.json';
import { SLUGS, REVERSE } from './slugs';
import { COMPANY, GUIDE_DATES } from '../consts';

export const LOCALES = ['en', 'sl', 'hr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * `decimal` / `group` are locale config, not copy, so they live here rather than in the
 * dictionaries. SI and HR write 1.500 and 1,24 — rendering "1.24" there reads as a
 * thousands separator, i.e. one hundred twenty-four.
 */
export const LOCALE_META: Record<
  Locale,
  { label: string; htmlLang: string; ogLocale: string; decimal: string; group: string }
> = {
  en: { label: 'English', htmlLang: 'en', ogLocale: 'en_US', decimal: '.', group: ',' },
  sl: { label: 'Slovenščina', htmlLang: 'sl', ogLocale: 'sl_SI', decimal: ',', group: '.' },
  hr: { label: 'Hrvatski', htmlLang: 'hr', ogLocale: 'hr_HR', decimal: ',', group: '.' },
};

const DICTS: Record<Locale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  sl: sl as Record<string, unknown>,
  hr: hr as Record<string, unknown>,
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function isEmpty(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
}

/**
 * Returns a translator bound to a locale. `t(key)` resolves the value in the
 * locale, falling back to English, then the raw key. Generic so callers can
 * type array/object content: `t('problem.daily')`.
 */
// Returns `any` (not a generic): values are strings OR arrays of strings, and
// callers use them directly in templates (`t('x')` renders, `t('list').map(...)`).
// A generic call site like `t<string[]>(...)` cannot be used inside an .astro
// template because `<...>` is parsed as JSX, so we type-erase here instead.
export function useTranslations(lang: Locale) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function t(key: string): any {
    const own = DICTS[lang]?.[key];
    if (!isEmpty(own)) return own;
    const fallback = DICTS.en?.[key];
    return fallback !== undefined ? fallback : key;
  };
}

/**
 * Locale-aware number rendering for the mock screens. Separators come from
 * LOCALE_META (SI and HR write 1.500 and 1,24); percent follows SL/HR
 * orthography (non-breaking space before %). The currency symbol stays BEFORE
 * the number in every locale — site-wide convention set by the hero chips.
 */
export function useNumberFormat(lang: Locale) {
  const { decimal, group } = LOCALE_META[lang];
  const num = (value: number, decimals = 0): string => {
    const [int, frac] = value.toFixed(decimals).split('.');
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, group);
    return frac !== undefined ? grouped + decimal + frac : grouped;
  };
  const pct = (value: number | string): string =>
    lang === 'en' ? `${value}%` : `${value}\u00A0%`;
  return { num, pct };
}

/** Detect the active locale from a URL pathname. */
export function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.replace(/^\/+/, '').split('/')[0];
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/** Strip the locale prefix → canonical path, reverse-translating slug segments. */
export function stripLocale(pathname: string): string {
  let p = pathname.startsWith('/') ? pathname : '/' + pathname;
  const first = p.replace(/^\/+/, '').split('/')[0];
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    const lang = first as 'sl' | 'hr';
    const rest = p.replace(/^\/+/, '').split('/').slice(1);
    const segs = rest.filter(Boolean).map((s) => REVERSE[lang][s] ?? s);
    p = '/' + segs.join('/');
  }
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) {
    if (!/[.#?]/.test(p.split('/').pop() || '')) p += '/';
  }
  return p === '//' ? '/' : p;
}

/** Build a localized URL path from a canonical path, translating slug segments. */
export function localizePath(canonicalPath: string, lang: Locale): string {
  let p = canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath;
  if (lang === DEFAULT_LOCALE) return p;
  const l = lang as 'sl' | 'hr';
  // Split off #hash / ?query so segment mapping never touches them (hardening —
  // today all callers append hashes AFTER localizePath).
  const cut = p.search(/[#?]/);
  const suffix = cut === -1 ? '' : p.slice(cut);
  let path = cut === -1 ? p : p.slice(0, cut);
  const hadTrailing = path.endsWith('/');
  const segs = path.split('/').filter(Boolean).map((s) => SLUGS[s]?.[l] ?? s);
  path = `/${l}` + (segs.length ? '/' + segs.join('/') : '') + (hadTrailing || segs.length === 0 ? '/' : '');
  return path + suffix;
}

/** hreflang alternates (relative paths) for a canonical path, incl. x-default (en). */
export function alternates(
  canonicalPath: string,
): { hreflang: string; path: string }[] {
  const list = LOCALES.map((lang) => ({
    hreflang: LOCALE_META[lang].htmlLang,
    path: localizePath(canonicalPath, lang),
  }));
  list.push({ hreflang: 'x-default', path: localizePath(canonicalPath, DEFAULT_LOCALE) });
  return list;
}

/** Absolute URL from a path against the configured site origin. */
export function absoluteUrl(path: string, siteOrigin: string | URL | undefined): string {
  const origin = (siteOrigin ? String(siteOrigin) : 'https://gradvera.com').replace(/\/$/, '');
  return origin + (path.startsWith('/') ? path : '/' + path);
}

/**
 * Article JSON-LD for a guide-cluster page. Headline is the page's own H1
 * (native copy); dates come from GUIDE_DATES (hand-maintained). Shared by all
 * six guide pages; the returned node is passed through the page's `jsonLd` prop
 * to SEO.astro, which stays the sole emitter of the JSON-LD subtree.
 */
export function guideArticleLd(
  lang: Locale,
  ns: string,
  canonicalPath: string,
  siteOrigin: string | URL | undefined,
) {
  const t = useTranslations(lang);
  const url = absoluteUrl(localizePath(canonicalPath, lang), siteOrigin);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t(`guide.${ns}.h1`),
    inLanguage: LOCALE_META[lang].htmlLang,
    datePublished: GUIDE_DATES.published,
    dateModified: GUIDE_DATES.modified,
    author: { '@type': 'Organization', name: COMPANY.legalName },
    publisher: { '@type': 'Organization', name: COMPANY.legalName },
    mainEntityOfPage: url,
  };
}
