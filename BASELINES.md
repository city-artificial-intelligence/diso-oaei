# DISO-OAEI: Baselines

These are the organiser-run baseline systems, published before the competition; participant submissions are not added to these tables. Participant results are published via the live leaderboards on CodaBench — [Task 1](https://www.codabench.org/competitions/17405/) and [Task 2](https://www.codabench.org/competitions/17406/) — once the evaluation window opens (12 July 2026; see the [track page](./index.md)). Changes to the datasets and results between editions are recorded in the [changelog](./changelog.md); DISO-OAEI 2026 is the first edition, so there are no previous years yet.

## Task 1 — Global alignment: Precision, Recall, F1 (partiality-corrected)

The alignment task pairs are: `thinkhome-brick`, `brick-smartenv`, `city-brick`, `jc3iedm-mio`, `jc3iedm-brick`, and `jc3iedm-facility`. Evaluation covers all named-entity equivalences in the references — classes, properties, and individuals (the JC3IEDM-derived references are predominantly individual–individual). [Evaluation metrics](./evaluation-metrics.md) are computed using $R_{\approx}^{+}$ (the repaired reference alignments). We include $R_{\approx}$ for comparison. Additional information on the methodology will be provided in the supplementary material (available at track launch).

### Reference sizes (unique equivalence pairs)

| Ontology Pair | $\vert R_{\approx} \vert$ | $\vert R_{\approx}^{+} \vert$ | repaired |
|---|--:|--:|:--:|
| thinkhome-brick | 116 | 66 | yes |
| brick-smartenv | 47 | 18 | yes |
| city-brick | 61 | 19 | yes |
| jc3iedm-mio | 267 | 267 | -  |
| jc3iedm-brick | 75 | 75 | - |
| jc3iedm-facility | 43 | 43 | - |

Note: the _repaired_ column entries marked as `-` mean that the original alignment was already coherent at the TBox level ($R_{\approx} \equiv R_{\approx}^{+}$); no repair was necessary. See [how the repaired reference was constructed](./tasks/global/alignment_task_index.md#how-the-repaired-reference-was-constructed).

### Per-matcher aggregate

_(headline = micro-F1 computed on $R_{\approx}^{+}$)_

| Matcher | n pairs | micro P/R/F1 ($R_{\approx}^{+}$) | macro F1 ($R_{\approx}^{+}$) | micro F1 ($R_{\approx}$) | macro F1 ($R_{\approx}$) |
|---|--:|---|--:|--:|--:|
| LogMap | 6 | 0.957/0.777/0.858 | 0.813 | 0.793 | 0.729 |
| LogMapLt | 6 | 0.778/0.424/0.549 | 0.665 | 0.645 | 0.740 |
| AML | 6 | 0.894/0.346/0.499 | 0.644 | 0.535 | 0.635 |
| Matcha | 6 | 0.441/0.488/0.463 | 0.566 | 0.464 | 0.536 |
| BertMapLt | 6 | 0.906/0.217/0.350 | 0.475 | 0.372 | 0.479 |
| SecureBertMap | 6 | 0.961/0.203/0.335 | 0.469 | 0.303 | 0.386 |
| BertMap | 6 | 0.941/0.197/0.325 | 0.463 | 0.295 | 0.379 |
| CySecBertMap | 6 | 0.960/0.195/0.324 | 0.459 | 0.294 | 0.377 |
| LogMapLLM | 2 | 0.996/0.877/0.933 | 0.946 | 0.933 | 0.946 |
| ALOD2Vec | 2 | 0.963/0.255/0.403 | 0.592 | 0.403 | 0.592 |
| ATMatcher | 2 | 0.926/0.242/0.384 | 0.537 | 0.384 | 0.537 |
| Fine-TOM | 2 | 0.625/0.161/0.256 | 0.263 | 0.256 | 0.263 |
| KGMatcher | 2 | 1.000/0.084/0.155 | 0.268 | 0.155 | 0.268 |

_8 matchers cover all 6 pairs (comparable set, n=6); 5 were run only on the two openly redistributable JC3IEDM pairs, jc3iedm-mio and jc3iedm-facility (n=2)._

### Per-pair best matcher

_(headline F1 computed on $R_{\approx}^{+}$)_

| Pair | best matcher | mappings $\vert A \vert$ | P | R | F1 ($R_{\approx}^{+}$) | coherent (TBox) |
|---|---|--:|--:|--:|--:|---|
| thinkhome-brick | AML | 112 | 0.828 | 0.727 | 0.774 | no — 1,123 unsat classes |
| brick-smartenv | LogMap | 40 | 0.739 | 0.944 | 0.829 | yes |
| city-brick | LogMap | 27 | 0.778 | 0.737 | 0.757 | yes |
| jc3iedm-mio | LogMapLLM | 238 | 0.996 | 0.869 | 0.928 | yes |
| jc3iedm-brick | LogMapLt | 105 | 0.824 | 0.813 | 0.819 | yes |
| jc3iedm-facility | LogMap | 44 | 0.977 | 0.977 | 0.977 | yes |

_"Coherent (TBox)" is the TBox-level coherence of the merged ontology pair under the system's alignment (complete reasoner, individuals removed; data: [coherence_best_per_pair.json](tasks/global/baselines/coherence_best_per_pair.json)); with-ABox effects are reported separately in the supplementary analysis._

_Full matcher $\times$ pair detail: [tasks/global/baselines/global_detail.tsv](tasks/global/baselines/global_detail.tsv); aggregates: [tasks/global/baselines/global_aggregate.tsv](tasks/global/baselines/global_aggregate.tsv) (JSON: [global_results.json](tasks/global/baselines/global_results.json))._

## Task 2 — Local equivalence ranking

* Pairs (macro-averaged): uco-stix, stix-d3fend.
* Pool size 50 (mixed-type, always incl. a NIL candidate); the gold always shares the query's type; abstention threshold fixed $\tau=0.5$.
* References are private.
* Local ranking metrics: Hits@k $k=\{1,3,5,10\}$, MRR, macro-averaged across the 2 pairs.

### Reference baselines

| Baseline | Hits@1 | Hits@3 | Hits@5 | Hits@10 | MRR |
|---|--:|--:|--:|--:|--:|
| naive-lexical (char-3-gram Jaccard) | 0.835 | 0.968 | 0.970 | 0.986 | 0.899 |
| all-MiniLM-L6-v2 | 0.665 | 0.881 | 0.943 | 0.970 | 0.786 |

**Per-pair:**

| Pair | Baseline | Hits@1 | Hits@3 | Hits@5 | Hits@10 | MRR |
|---|---|--:|--:|--:|--:|--:|
| uco-stix | lexical | 0.917 | 0.977 | 0.982 | 1.000 | 0.950 |
| uco-stix | MiniLM | 0.728 | 0.926 | 0.954 | 0.982 | 0.830 |
| stix-d3fend | lexical | 0.753 | 0.959 | 0.959 | 0.973 | 0.849 |
| stix-d3fend | MiniLM | 0.603 | 0.836 | 0.931 | 0.959 | 0.743 |

_The silver is lexically clean (same-label equivalences dominate), so the naive string baseline beats the neural encoder; the contribution is the task design. See [tasks/ranking/ranking_task_index.md](tasks/ranking/ranking_task_index.md)._
