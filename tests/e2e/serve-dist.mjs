// Zero-dependency static server for the built site (dist/client).
// Used by the Playwright harness (playwright.config.mjs -> webServer) so the
// e2e checks run against the real production build, not the dev server.
// Serves directory requests as their index.html so /, /sl/, /book-a-demo/ work.
import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../dist/client', import.meta.url));
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain',
};

async function resolveFile(rawUrl) {
  const clean = normalize(decodeURIComponent((rawUrl || '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let full = join(ROOT, clean);
  try {
    if ((await stat(full)).isDirectory()) full = join(full, 'index.html');
  } catch {
    if (!extname(full)) full = join(ROOT, clean, 'index.html'); // extensionless -> directory index
  }
  return full;
}

createServer(async (req, res) => {
  try {
    const file = await resolveFile(req.url);
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404 Not Found');
  }
}).listen(PORT, () => console.log(`[serve-dist] http://localhost:${PORT}  ->  ${ROOT}`));
