// Central place for values that flip when the CodaBench competition goes live.
//
// CODABENCH_URL: set to the competition's public URL once it is published
// (see guides/CODABENCH_SETUP.md). Every "submission portal" link and
// call-to-action on the site renders from this one constant; while it is null
// the site says the channel is "to be announced".
export const CODABENCH_URL: string | null = 'https://www.codabench.org/competitions/17405/';
export const CODABENCH_T2_URL: string | null = 'https://www.codabench.org/competitions/17406/';

// Path (repo-root-relative) of the CI-written live-leaderboard snapshot.
// The results page and the homepage top-5 render from it when it exists.
export const LIVE_RESULTS_REL = 'results/live/codabench.json';

// Prefix an internal absolute path with the deployment's base path
// (site/site.config.mjs → astro.config `base`). Every hand-written internal
// href/src in .astro files must go through this so the site works both at a
// domain root and under a GitHub Pages project subpath.
export const withBase = (path: string): string =>
  import.meta.env.BASE_URL.replace(/\/$/, '') + path;

// The Hugging Face dataset release (OAEI-ML org) — the canonical download
// location for the task data from the 2026 edition onward.
export const HF_DATASET = 'https://huggingface.co/datasets/OAEI-ML/diso-oaei';
