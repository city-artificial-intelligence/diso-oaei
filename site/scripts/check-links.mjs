/**
 * Post-build link gate. Scans every built HTML page in dist/ and fails when:
 *   1. an internal href/src does not start with BASE_PATH (a link that would
 *      escape the GitHub Pages project subpath and 404), or
 *   2. an internal link's target does not exist in dist/ (a broken link).
 * External (http/https/mailto), fragment-only, and data: URLs are ignored.
 * Runs automatically after `npm run build` (postbuild), locally and in CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_PATH } from '../site.config.mjs';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (!fs.existsSync(DIST)) {
  console.error('check-links: dist/ not found — run `npm run build` first.');
  process.exit(2);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walk(full);
    else if (f.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(DIST);

const targetExists = (urlPath) => {
  const rel = decodeURIComponent(urlPath.slice(BASE_PATH.length)).replace(/^\//, '');
  const p = path.join(DIST, rel);
  return (
    (fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')))) ||
    fs.existsSync(p + '.html') ||
    fs.existsSync(p + '/index.html')
  );
};

let violations = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const page = '/' + path.relative(DIST, file).split(path.sep).join('/');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|data:|#)/i.test(url)) continue;
    if (!url.startsWith('/')) continue; // hash-bare or relative (none are emitted)
    const clean = url.split('#')[0].split('?')[0];
    if (!clean) continue;
    if (BASE_PATH && !clean.startsWith(BASE_PATH + '/') && clean !== BASE_PATH) {
      console.error(`✗ ${page}: missing base prefix — ${url}`);
      violations++;
    } else if (!targetExists(clean)) {
      console.error(`✗ ${page}: broken internal link — ${url}`);
      violations++;
    }
  }
}

if (violations) {
  console.error(`\ncheck-links: ${violations} violation(s) — failing the build.`);
  process.exit(1);
}
console.log(`check-links: ${htmlFiles.length} pages scanned — all internal links base-prefixed and resolvable.`);
