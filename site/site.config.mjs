/**
 * THE single place to change when the site moves between deployments.
 *
 * Production (GitHub Pages project site):
 *   SITE_ORIGIN = 'https://city-artificial-intelligence.github.io'
 *   BASE_PATH   = '/diso-oaei'   // the repository subpath
 *   CNAME       = null           // project sites must NOT ship a CNAME file
 *
 * Draft (custom domain at the root):
 *   SITE_ORIGIN = 'https://diso-oaei-draft.ontozoo.io'
 *   BASE_PATH   = ''
 *   CNAME       = 'diso-oaei-draft.ontozoo.io'
 *
 * Everything else derives from these three values: Astro's site/base, every
 * internal link (via withBase in src/config.ts), the markdown link rewriter,
 * the asset-copy step (which writes the CNAME file), and the a11y audit
 * server. Do not hard-code the origin or base path anywhere else.
 */
export const SITE_ORIGIN = 'https://diso.oaei-ml.org';
export const BASE_PATH = '';
export const CNAME = 'diso.oaei-ml.org';
