// Widens the Vercel redirect matchers emitted for astro.config `redirects`:
// Astro strips trailing slashes from redirect keys and @astrojs/vercel compiles
// `^/sl/book-a-demo$`, which misses the indexed trailing-slash URL. Rewrites
// each such route to `^/sl/book-a-demo/?$`. Fails loudly if nothing matched so
// a silent regression cannot ship.
import { readFileSync, writeFileSync } from 'node:fs';

const cfgPath = new URL('../.vercel/output/config.json', import.meta.url);
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
let patched = 0;
for (const route of cfg.routes ?? []) {
  const loc = route.headers && route.headers.Location;
  if (route.status === 308 && typeof loc === 'string' && loc.startsWith('/') &&
      typeof route.src === 'string' && route.src.endsWith('$') && !route.src.endsWith('/?$')) {
    route.src = route.src.slice(0, -1) + '/?$';
    patched++;
  }
}
if (patched === 0) throw new Error('patch-vercel-redirects: no redirect routes found — did astro.config redirects change?');
writeFileSync(cfgPath, JSON.stringify(cfg));
console.log(`patch-vercel-redirects: widened ${patched} route(s)`);
