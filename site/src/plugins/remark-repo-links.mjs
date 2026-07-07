import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_PATH } from '../../site.config.mjs';

function visit(node, type, fn) {
  if (node.type === type) fn(node);
  if (node.children) for (const c of node.children) visit(c, type, fn);
}

/**
 * Rewrites relative links in the repo's markdown so they work on the built site:
 *  - links to .md files map to their site route (see ROUTES),
 *  - links to data/reference/script assets map to the copies served from public/,
 *  - external links, anchors, and absolute paths pass through untouched.
 * Resolution is done against the *linking file's* directory, so the markdown
 * stays correct on github.com too.
 */

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

const ROUTES = new Map([
  ['index.md', '/'],
  ['readme.md', '/about/'],
  ['quickstart.md', '/quickstart/'],
  ['evaluation-metrics.md', '/evaluation/'],
  ['baselines.md', '/baselines/'],
  ['changelog.md', '/changelog/'],
  ['license', '/LICENSE'],
  ['tasks/tasks.md', '/tasks/'],
  ['tasks/global/alignment_task_index.md', '/tasks/global/'],
  ['tasks/global/submission-format.md', '/tasks/global/submission-format/'],
  ['tasks/ranking/ranking_task_index.md', '/tasks/ranking/'],
  ['tasks/ranking/submission-format.md', '/tasks/ranking/submission-format/'],
  ['ontologies/ontologies.md', '/ontologies/'],
]);

export default function remarkRepoLinks() {
  return (tree, file) => {
    const fileDir = file?.path ? path.dirname(file.path) : REPO_ROOT;
    const rewrite = (node) => {
      const url = node.url;
      if (!url) return;
      if (/^(https?:|mailto:|#|\/)/i.test(url)) return;
      const [target, fragment] = url.split('#');
      if (!target) return;
      const abs = path.resolve(fileDir, decodeURI(target));
      const rel = path.relative(REPO_ROOT, abs).split(path.sep).join('/');
      if (rel.startsWith('..')) return; // outside the repo — leave alone
      const route = ROUTES.get(rel.toLowerCase());
      const dest = BASE_PATH + (route ?? `/${rel}`);
      node.url = fragment ? `${dest}#${fragment}` : dest;
    };
    visit(tree, 'link', rewrite);
    visit(tree, 'definition', rewrite);
    return tree;
  };
}
