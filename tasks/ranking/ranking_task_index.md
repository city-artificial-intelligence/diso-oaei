# Task 2 — Unsupervised Local Equivalence Ranking (mixed-signature + NIL)

For each source entity ($src$) you are given a fixed candidate pool of 50 possible target entity IRIs ($tgt_{1}, tgt_{2}, \ldots, tgt_{50}$) drawn from the target ontology's signature. Your system aims to rank order that pool such that the true equivalence correspondence $\langle src, tgt, \equiv, [0,1] \rangle$ appears as early as possible; or, when the source has no equivalent target within the pool, your ranking should place the NIL IRI as early as possible. In short, participants do not generate candidates; they order the ones we provide.

## Pairs

| Ontology Pair | $\mathcal{O}_{src} \rightarrow \mathcal{O}_{tgt}$ | $\vert \Sigma(\mathcal{O}_{tgt}) \vert$ | queries (matched + NIL) |
|:---|:---:|:--:|:---:|
| `uco-stix`    | UCO $\rightarrow$ STIX    | 540  (87 CLS / 68 OPROP / 385 DPROP) | 217 |
| `stix-d3fend` | STIX $\rightarrow$ D3FEND | 3742 (3495 CLS / 205 OPROP / 42 DPROP) | 73 |

The score is macro-averaged across the two pairs.

## Mixed-signature & types

The candidate universe is the target ontology's full named signature, i.e., its classes, object properties, and data properties (individuals are dropped). The gold always shares the query's type — a class source's gold is a class, an object-property source's gold is an object property, and so on. The pool mixes types (so the pool alone does not give the type away), but each query's `type` field states the source entity's type; the pool construction method is described in the supplementary materials; the specific encoder used during pool construction is not disclosed.

## Pools

One JSON object per query (a *query* is one source entity; a source with several golds yields several queries):

```json
{
  "qid": 0, 
  "source": "<source-IRI>", 
  "type": "CLS|OPROP|DPROP",
  "candidates": [
    "<IRI-1>", 
    "...", 
    "https://oaei.ontologymatching.org/2026/diso/NIL"
  ]
}
```

The `candidates` field is a list of exactly 50 IRIs per source entity. Candidates always include the NIL IRI (`https://oaei.ontologymatching.org/2026/diso/NIL`). Note that candidates are not provided in any meaningful order (the lists are shuffled, with the NIL IRI appearing as the final element); participant systems impose the order in their submissions.

A matched query's pool holds the gold target + same-type hard negatives + cross-type label-collision negatives + NIL. A NIL query's pool holds the human-rejected hard distractor + same-type hard negatives + NIL (since no gold exists; i.e., the target is NIL).

## The justification for NIL-matching

A query is **NIL** when its source was obtained via a unique system mapping that was subsequently reviewed and validated as **not an equivalent match**. That is, the single proposed match for that entity was human-confirmed as wrong. Therefore, we assume no legitimate matches exist. Clearly, one possible limitation here is that it is possible that a match does exist but is merely undiscovered. As such, this aspect of the ranking task is considered, at present, as experimental.

## An unsupervised task

References are kept private. We do not provide a public train/validation split (since we could not provide a large enough training/validation set to make training a model feasible). We do not release the answer keys. The provided baselines use a fixed abstention threshold set to 0.5 (i.e., an entity scoring below 0.5 ranks below NIL). It allows us to provide a simple baseline, as there is nothing to tune on. We expect systems to be creative in the ways that they tackle this problem. Participants must submit a ranking for every query in `pools.jsonl` (see the [pools.jsonl file for stix-d3fend](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/pools/stix-d3fend/pools.jsonl) and [uco-stix](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/pools/uco-stix/pools.jsonl)).

## Metrics

* Mean Reciprocal Rank (MRR)
* Hits@k

Official local ranking metrics include Hits@k ($k=\{1,3,5,10\}$) and MRR, reported overall + matched-only + NIL-only + per-type. We then macro-average the scores across the two ontology pairs.

## Reference baselines 

_(organiser-published; $\tau=0.5$; macro-averaged over 2 pairs)_

| Baseline | Hits@1 | Hits@3 | Hits@5 | Hits@10 | MRR |
|---|--:|--:|--:|--:|--:|
| naive-lexical (char-3-gram Jaccard) | **0.835** | 0.968 | 0.970 | 0.986 | **0.899** |
| all-MiniLM-L6-v2 | 0.665 | 0.881 | 0.943 | 0.970 | 0.786 |

_The silver is lexically clean (same-label equivalences dominate), so the naive string baseline beats the neural encoder; the contribution is the task design._

## Validating & scoring

* The task is unsupervised. 
* The gold answers are private. 
* Participants do not score their own submissions.
* You validate its format, then submit the JSONL.
* The organisers score it with a Bio-ML-equivalent metric implementation (to be published alongside the results).
* Validation needs only Python 3.12+ (standard library): [`scripts/validate_ranking.py`](../../scripts/validate_ranking.py).

```bash
# perform a structural check: every query present, each ranking a permutation of its pool
python3 scripts/validate_ranking.py  tasks/ranking/candidates/uco-stix/pools.jsonl  my_uco-stix.jsonl
```

Exact submission spec + worked example: [submission format for local ranking tasks](submission-format.md).
