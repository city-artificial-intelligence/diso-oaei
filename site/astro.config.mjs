// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkStripH1 from './src/plugins/remark-strip-h1.mjs';
import remarkRepoLinks from './src/plugins/remark-repo-links.mjs';
import rehypeWrapTables from './src/plugins/rehype-wrap-tables.mjs';
import { SITE_ORIGIN, BASE_PATH } from './site.config.mjs';

export default defineConfig({
  // Deployment origin + base path live in site.config.mjs — change them there.
  site: SITE_ORIGIN,
  base: BASE_PATH || '/',
  trailingSlash: 'ignore',
  // The leaderboard page became "Baselines" (participant results live on the
  // CodaBench leaderboard, not in these static tables); keep old URLs working.
  // NB: Astro prefixes redirect SOURCES with `base` but leaves destinations
  // literal, so the destination must carry the base path itself.
  redirects: {
    '/leaderboard': `${BASE_PATH}/baselines`,
  },
  markdown: {
    remarkPlugins: [remarkStripH1, remarkRepoLinks, remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }], rehypeWrapTables],
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-high-contrast' },
      defaultColor: false,
    },
  },
  vite: {
    server: {
      fs: {
        // content collection reads markdown from the repo root, one level up
        allow: ['..'],
      },
    },
  },
});
