# Task 2 - Local Equivalence Ranking: Submission Format

For each query in a pair's `pools.jsonl`, your system submits one ranking of that query's 50 candidates.

See the [description in the ranking task index](./ranking_task_index.md).

## Format: JSONL

You submit one object per query:

```jsonl
{"qid": 0, "ranking": ["<best-IRI>", "<2nd>", "...", "<50th>"]}
```

**Fields:** `qid` is the integer query id from `pools.jsonl` (align by `qid`, not by position). `ranking` should be a permutation of that query's 50 pool candidates, ordered best-first (most confident equivalent matches early). Every candidate must appear exactly once (the scorer rejects a submission whose ranking is not a permutation of the pool).

The NIL IRI (`https://oaei.ontologymatching.org/2026/diso/NIL`) is one of the 50 candidates. To abstain (claim "no equivalent"), rank NIL first. To claim a match, rank a real target above NIL (i.e., order by confidence, with your most confident match first, your second most confident match second, and so forth). Submit a line for every query in `pools.jsonl` (all queries are scored — unsupervised, no held-out split).

## Worked example

Given a query whose _candidates_ include the gold `http://docs.oasis-open.org/ns/cti/stix#Identity` and the NIL IRI, a strong system ranks the gold first (qid illustrative):

```jsonl
{"qid": 12, "ranking": ["http://docs.oasis-open.org/ns/cti/stix#Identity", "http://docs.oasis-open.org/ns/cti/stix#IdentityContact", "https://oaei.ontologymatching.org/2026/diso/NIL", "..."]}
```

In this example, since the gold target is ranked at position 1 _(or at position zero for a zero-based index)_, it contributes Hits@1 = Hits@3 = Hits@5 = Hits@10 = 1 and reciprocal rank 1.0.

For a **NIL** query (no equivalent exists), abstain by ranking the NIL IRI first:

```jsonl
{"qid": 200, "ranking": ["https://oaei.ontologymatching.org/2026/diso/NIL", "<hard-distractor-IRI>", "..."]}
```

NIL ranked at position 1 is a correct abstention if the query's gold answer is the NIL IRI, i.e., there is no equivalent match.

## Template

```jsonl
{"qid": <id-from-pools.jsonl>, "ranking": [<all 50 pool candidates, best first>]}
...one line per query...
```

## Validate (participant) — scoring is organiser-side

The task is _unsupervised_: the answer key is private, so you validate your submission's format and submit it; the organisers score it. Feel free to use whatever creative methods you like to assess your system before submitting.

```bash
# structural check: is every query present? Is each ranking a permutation of its pool?
python3 scripts/validate_ranking.py  tasks/ranking/candidates/uco-stix/pools.jsonl  my_uco-stix.jsonl
```