/**
 * Copies the repository's downloadable assets into site/public/ so the built
 * site serves them at their existing repo-relative URLs (data/_DISO_*.zip,
 * ontologies/*.owl, tasks/global/references/**, ...). Unlike default Jekyll,
 * this pipeline has no underscore exclusions, so every path publishes as-is.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CNAME } from '../site.config.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const PUB = path.resolve(HERE, '../public');

const jobs = [
  { from: 'data', to: 'data' },
  { from: 'tasks/global/references', to: 'tasks/global/references' },
  { from: 'tasks/global/baselines', to: 'tasks/global/baselines' },
  { from: 'tasks/ranking/candidates', to: 'tasks/ranking/candidates' },
  { from: 'leaderboard.json', to: 'leaderboard.json' },
  { from: 'results', to: 'results' },
  { from: 'LICENSE', to: 'LICENSE' },
];

// CNAME comes from site.config.mjs: written for a custom-domain deployment,
// absent for a GitHub Pages project site (where a stray CNAME would break it).
fs.rmSync(path.join(PUB, 'CNAME'), { force: true });
if (CNAME) fs.writeFileSync(path.join(PUB, 'CNAME'), CNAME + '\n');

// scripts/: participants download the validators; skip caches
for (const f of fs.readdirSync(path.join(ROOT, 'scripts'))) {
  if (/\.(py|rng)$/.test(f)) jobs.push({ from: `scripts/${f}`, to: `scripts/${f}` });
}
// ontologies/: the .owl files and the zip mirror (ontologies.md renders as a page)
for (const f of fs.readdirSync(path.join(ROOT, 'ontologies'))) {
  if (/\.(owl|zip)$/.test(f)) jobs.push({ from: `ontologies/${f}`, to: `ontologies/${f}` });
}

let n = 0;
for (const { from, to } of jobs) {
  const src = path.join(ROOT, from);
  const dest = path.join(PUB, to);
  if (!fs.existsSync(src)) {
    console.warn(`copy-assets: missing ${from} — skipped`);
    continue;
  }
  // clean first so files deleted/renamed in the repo stop being served
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  n++;
}
console.log(`copy-assets: ${n} asset roots copied into site/public/`);
