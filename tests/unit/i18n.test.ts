import { describe, it, expect } from 'vitest';
import { alternates, localizePath } from '@/i18n/utils';
import { EN_ONLY_ROUTES, isEnOnlyPath } from '@/i18n/slugs';

describe('EN-only routes', () => {
  it('declares the landing page as EN-only', () => {
    expect(EN_ONLY_ROUTES.has('construction-estimating-software')).toBe(true);
    expect(isEnOnlyPath('/construction-estimating-software/')).toBe(true);
    expect(isEnOnlyPath('/book-a-demo/')).toBe(false);
    expect(isEnOnlyPath('/')).toBe(false);
  });
  it('alternates() emits only en + x-default for an EN-only path, both self', () => {
    expect(alternates('/construction-estimating-software/')).toEqual([
      { hreflang: 'en', path: '/construction-estimating-software/' },
      { hreflang: 'x-default', path: '/construction-estimating-software/' },
    ]);
  });
  it('alternates() is unchanged for trilingual paths', () => {
    const alts = alternates('/book-a-demo/');
    expect(alts.map((a) => a.hreflang)).toEqual(['en', 'sl', 'hr', 'x-default']);
    expect(alts[1].path).toBe('/sl/rezervirajte-demo/');
  });
  it('localizePath still localizes the EN-only slug verbatim (callers must guard with isEnOnlyPath)', () => {
    expect(localizePath('/construction-estimating-software/', 'sl')).toBe('/sl/construction-estimating-software/');
  });
});
