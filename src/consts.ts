/**
 * Site-wide constants. Brand / company facts and integration ids live here so
 * components never hardcode them. Marketing copy lives in src/i18n/*.json.
 */

export const COMPANY = {
  brand: 'Gradvera',
  legalName: 'DIGITAL SOLUTIONS d.o.o.',
  tagline: 'Construction estimating software',
  email: 'info@digitalsolutions.si',
  phoneDisplay: '+386 40 328 355',
  phoneHref: 'tel:+38640328355',
  linkedin: 'https://www.linkedin.com/company/digital-solutions-eu/',
  address: {
    locality: 'Ljubljana',
    country: 'Slovenia',
    countryCode: 'SI',
  },
} as const;

export const SITE = {
  /** Canonical origin. astro.config sets Astro.site from PUBLIC_SITE_URL; we mirror the fallback here. */
  url: import.meta.env.PUBLIC_SITE_URL || 'https://gradvera.com',
  defaultTitle: 'Gradvera — Construction estimating software',
  defaultDescription:
    'Gradvera is construction estimating software that helps teams prepare bids faster, price with confidence from their own historical data, and catch costly risks before offers reach the client.',
  ogImage: '/og/gradvera-og.png',
  // Dark blueprint-navy site chrome (hero/header). Accent is amber #E8901C.
  themeColor: '#0A1020',
} as const;

/** Analytics — blank disables the tag entirely. GA4 is configured inside GTM. */
export const GTM_ID = import.meta.env.PUBLIC_GTM_ID || '';
export const GA4_ID = import.meta.env.PUBLIC_GA4_ID || '';

/** Logical navigation. Hrefs are canonical (locale-stripped); components localize them. */
export const NAV_ITEMS = [
  { key: 'nav.helps', href: '/#helps' },
  { key: 'nav.works', href: '/#works' },
  { key: 'nav.outcomes', href: '/#outcomes' },
] as const;
