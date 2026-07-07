/**
 * Automated accessibility audit, run on every build (locally and in CI).
 * Serves the built dist/ folder, then runs axe-core (WCAG 2.0/2.1/2.2 A+AA
 * rule tags) over every page in BOTH themes — the light/dark promise in the
 * accessibility statement is enforced here. Exits non-zero on any violation.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { BASE_PATH } from '../site.config.mjs';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (!fs.existsSync(DIST)) {
  console.error('a11y-check: dist/ not found — run `npm run build` first.');
  process.exit(2);
}

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // the site is built for BASE_PATH; serve dist/ under it, like GitHub Pages does
  if (BASE_PATH && p.startsWith(BASE_PATH)) p = p.slice(BASE_PATH.length) || '/';
  let file = path.join(DIST, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) file = path.join(DIST, '404.html');
  res.setHeader('content-type', MIME[path.extname(file)] ?? 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

// Every generated page
const pages = [];
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && !['data', 'references', 'candidates', 'baselines', 'scripts', '_astro'].includes(f.name)) walk(full);
    else if (f.name === 'index.html' || f.name === '404.html') {
      pages.push('/' + path.relative(DIST, f.name === '404.html' ? full : path.dirname(full)).split(path.sep).join('/'));
    }
  }
};
walk(DIST);
const routes = [...new Set(pages.map((p) => (p === '/.' ? '/' : p.replace(/\/$/, '') || '/')))]
  .map((r) => BASE_PATH + (r === '/' ? '' : r) || '/')
  .sort();

const browser = await chromium.launch();
let failures = 0;

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ colorScheme: theme });
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    if (results.violations.length) {
      failures += results.violations.length;
      console.error(`\n✗ ${route} [${theme}]`);
      for (const v of results.violations) {
        console.error(`  ${v.impact ?? 'n/a'} · ${v.id}: ${v.help}`);
        for (const n of v.nodes.slice(0, 3)) console.error(`    ${n.target.join(' ')}`);
      }
    } else {
      console.log(`✓ ${route} [${theme}]`);
    }
  }
  await ctx.close();
}

await browser.close();
server.close();

if (failures) {
  console.error(`\na11y-check: ${failures} violation group(s) — failing the build.`);
  process.exit(1);
}
console.log(`\na11y-check: ${routes.length} pages × 2 themes — no violations.`);
