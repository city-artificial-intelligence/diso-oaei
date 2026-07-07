#!/usr/bin/env python3
"""
Pull the DISO-OAEI leaderboards from CodaBench and write the site's
live-results snapshot (results/live/codabench.json).

Runs inside the deploy workflow, before the site build. Uses only the
PUBLIC, unauthenticated CodaBench API:

    GET /api/competitions/<pk>/                    -> phase ids
    GET /api/phases/<pk>/get_leaderboard/?page_size=all

No credentials are needed (and none should be added — the admin results.*
endpoints are unnecessary for this).

Configuration (environment):
    CODABENCH_T1_COMPETITION   competition pk for Task 1 (global alignment)
    CODABENCH_T2_COMPETITION   competition pk for Task 2 (ranking)

With neither set, the script exits 0 without writing anything, so the
workflow is a no-op until the competitions exist (see guides/CODABENCH_SETUP.md).

Output schema (consumed by site/src/pages/results.astro and index.astro):
{
  "fetched_at": "<ISO-8601 UTC>",
  "competition_url": "https://www.codabench.org/competitions/<t1-pk>/",
  "task1_global":  [ {"system", "team", "date", "scores": {<column_key>: float}} ],
  "task2_ranking": [ ... ]
}
Column keys come straight from the CodaBench leaderboard columns, which the
bundles in guides/codabench/ define as micro_F1/micro_P/micro_R/macro_F1 (T1)
and macro_mrr/macro_h1/... (T2) — matching what the site pages expect.
"""
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone

BASE = os.environ.get("CODABENCH_BASE", "https://www.codabench.org")
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "results", "live", "codabench.json")


def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "diso-oaei-site-sync"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def leaderboard_rows(competition_pk):
    comp = get_json(f"{BASE}/api/competitions/{competition_pk}/")
    phases = comp.get("phases") or []
    if not phases:
        print(f"competition {competition_pk}: no phases; skipping", file=sys.stderr)
        return []
    rows = []
    for phase in phases:
        board = get_json(f"{BASE}/api/phases/{phase['id']}/get_leaderboard/?page_size=all")
        for sub in board.get("submissions", []):
            scores = {}
            for s in sub.get("scores", []):
                try:
                    scores[s["column_key"]] = float(s["score"])
                except (KeyError, TypeError, ValueError):
                    continue
            if not scores:
                continue
            facts = sub.get("fact_sheet_answers") or {}
            org = sub.get("organization")
            rows.append({
                "system": facts.get("system_name") or sub.get("owner") or "anonymous",
                "team": (org.get("name") if isinstance(org, dict) else org) or sub.get("owner"),
                "date": sub.get("created_when"),
                "scores": scores,
            })
    return rows


def main():
    t1 = os.environ.get("CODABENCH_T1_COMPETITION", "").strip()
    t2 = os.environ.get("CODABENCH_T2_COMPETITION", "").strip()
    if not t1 and not t2:
        print("CODABENCH_T{1,2}_COMPETITION unset — nothing to fetch (this is fine pre-launch)")
        return 0

    snapshot = {
        "fetched_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "competition_url": f"{BASE}/competitions/{t1 or t2}/",
        "task1_global": leaderboard_rows(t1) if t1 else [],
        "task2_ranking": leaderboard_rows(t2) if t2 else [],
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(snapshot, f, indent=1)
    print(f"wrote {os.path.normpath(OUT)}: "
          f"{len(snapshot['task1_global'])} T1 rows, {len(snapshot['task2_ranking'])} T2 rows")
    return 0


if __name__ == "__main__":
    sys.exit(main())
