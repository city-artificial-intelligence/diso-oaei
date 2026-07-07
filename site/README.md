# DISO-OAEI website

The modernised track website. Built with [Astro](https://astro.build). It deploys to GitHub Pages 
using the following workflow: `.github/workflows/deploy.yml`.

## How it fits together

- Markdown files remain the single source of truth.
- The typeScript files `src/content.config.ts` load `*.md` files.
- [Astro] performs the rendering.
- Math is rendered at build-time with KaTeX and does not require client-side JS.

## Building with node

```bash
npm install
npm run dev
npm run build
npm run a11y
```

The accessibility thresholds (WCAG, A11Y standards) must be met for the build to deploy. The website design was constructed using AI-assistance.
