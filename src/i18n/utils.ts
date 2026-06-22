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

export const LOCALES = ['en', 'sl', 'hr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_META: Record<
  Locale,
  { label: string; htmlLang: string; ogLocale: string }
> = {
  en: { label: 'English', htmlLang: 'en', ogLocale: 'en_US' },
  sl: { label: 'Slovenščina', htmlLang: 'sl', ogLocale: 'sl_SI' },
  hr: { label: 'Hrvatski', htmlLang: 'hr', ogLocale: 'hr_HR' },
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

/** Detect the active locale from a URL pathname. */
export function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.replace(/^\/+/, '').split('/')[0];
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/** Strip the locale prefix → canonical, locale-independent path (leading + trailing slash). */
export function stripLocale(pathname: string): string {
  let p = pathname;
  const seg = p.replace(/^\/+/, '').split('/')[0];
  if (isLocale(seg) && seg !== DEFAULT_LOCALE) {
    p = '/' + p.replace(/^\/+/, '').split('/').slice(1).join('/');
  }
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) {
    // keep file-like paths (with extension) and hash/query intact
    if (!/[.#?]/.test(p.split('/').pop() || '')) p += '/';
  }
  return p === '//' ? '/' : p;
}

/** Build a localized URL path from a canonical path. */
export function localizePath(canonicalPath: string, lang: Locale): string {
  let p = canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath;
  if (lang === DEFAULT_LOCALE) return p;
  if (p === '/') return `/${lang}/`;
  return `/${lang}${p}`;
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
  const origin = (siteOrigin ? String(siteOrigin) : 'https://www.gradvera.com').replace(/\/$/, '');
  return origin + (path.startsWith('/') ? path : '/' + path);
}
