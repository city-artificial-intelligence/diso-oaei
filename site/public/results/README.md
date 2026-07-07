# Archived results by edition

- `results/<year>/leaderboard.json` — the machine-readable baselines-and-results snapshot for each edition, in the same schema as the repo-root `leaderboard.json` (which the website's baselines page renders at build time).
  - `2026/leaderboard.json` — the 2026 baselines. Currently identical to the root `leaderboard.json`; it becomes the frozen final record when the 2026 evaluation closes.
- `results/live/codabench.json` — written by CI from the CodaBench leaderboard during the evaluation window; not hand-edited. The website's results page and homepage top-5 render from this file when it exists.
