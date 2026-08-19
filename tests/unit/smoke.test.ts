import { describe, it, expect } from 'vitest';

describe('unit harness', () => {
  it('runs TypeScript tests with the @/ alias available', async () => {
    const mod = await import('@/i18n/slugs');
    expect(Object.keys(mod.SLUGS)).toContain('book-a-demo');
  });
});
