# Evaluation Metrics

This document provides a brief overview of the evaluation metrics used for both tasks. A full description will appear in the supplementary material (available at track launch).

## Task 1 - Global Alignment

To score Task 1, we use an implementation equivalent to the scorers in [MELT](https://dwslab.github.io/melt/) for incomplete, partial reference alignments (i.e., our repaired silver standard). Specifically, we use partiality-corrected precision, recall and f-measure, as defined below.

$$
\hat{A} = \text{predictions touching a covered entity},
$$

$$
\mathrm{Precision}_{partial} = \frac{\vert A \cap R \vert}{\vert \hat{A} \vert},
$$

$$
\mathrm{Recall} = \frac{\vert A \cap R \vert}{\vert R \vert}.
$$

$$
\mathrm{F1} = \frac{2 \cdot \mathrm{Precision}_{partial} \cdot \mathrm{Recall}}{\mathrm{Precision}_{partial} + \mathrm{Recall}}.
$$

**Averaging:** results are reported both **micro-averaged** (pool the cell counts $\vert A \cap R \vert$, $\vert \hat{A} \vert$, $\vert R \vert$ across all six pairs, then compute P/R/F1 once) and **macro-averaged** (compute P/R/F1 per pair, then take the unweighted mean over the six pairs).

**Dual reference:** headline scores are computed against the repaired silver standard $R_{\approx}^{+}$; the same metrics against the unrepaired $R_{\approx}$ are reported as secondary, for comparison only.

## Task 2 - Local Ranking

For our local ranking task, we measure Mean Reciprocal Rank (MRR) and Hits@k ($k=\{1,3,5,10\}$).

Given a pair of ontologies, $\mathcal{O}_{src}$ and $\mathcal{O}_{tgt}$, a source entity from $\mathcal{O}_{src}$, denoted $e_{src} \in \mathcal{E}_{src}$, a set of 50 potential target entities (consisting of 49 entities from $\mathcal{O}_{tgt}$ and a NIL entity), denoted $\mathcal{K}$, produce a ranking for $\mathcal{K}$, ordered by confidence that $e_{src} \equiv e_{tgt}$ for each $e_{tgt}$ in $\mathcal{K}$. In the case where an equivalence correspondence between $\mathcal{O}_{src}$ and $\mathcal{O}_{tgt}$ through $e_{src}$ does not exist, instead map $e_{src}$ to NIL. Then, writing $\mathrm{rank}(e_{src})$ for the 1-based position of the correct answer (the validated equivalent, or NIL) in the system's ranking of $\mathcal{K}$,

$$
\mathrm{Hits@}k = \frac{1}{\vert \mathcal{E}_{src} \vert} \sum_{e_{src} \in \mathcal{E}_{src}} \mathbb{1}[\mathrm{rank}(e_{src}) \leq k],
$$

$$
\mathrm{MRR} = \frac{1}{\vert \mathcal{E}_{src} \vert} \sum_{e_{src} \in \mathcal{E}_{src}} \frac{1}{\mathrm{rank}(e_{src})}.
$$

**Abstention ($\tau=0.5$):** a system abstains by ranking the NIL IRI early. The task is unsupervised, so the reference baselines use a fixed threshold. NIL is assigned the confidence $\tau=0.5$ and the pool is sorted by score, so a candidate scoring below $\tau$ ranks below NIL. Participant systems are free to place NIL however they judge best.

**Macro-average:** each metric is reported per pair (overall, plus matched-only, NIL-only and per-type breakdowns), and the headline score is the **unweighted mean** of the two pairs' overall values,

$$
\mathrm{MACRO}(m) = \tfrac{1}{2} \left( m_{\text{uco-stix}} + m_{\text{stix-d3fend}} \right).
$$

The pairs are weighted equally (not by query count) because a system must do well on **both**: `uco-stix` is data-property-dominated and `stix-d3fend` is class-dominated, so neither pair can be carried by the other.

**Simply put:** these metrics look at where your ranking places the (private) right answer — the validated equivalent, or NIL when there is none. Hits@$k$ is the fraction of queries whose right answer appears in your top $k$; MRR rewards placing it as early as possible (rank 1 scores $1$, rank 2 scores $1/2$, and so on). The final score averages the two ontology pairs equally.

_Note: pool construction and the NIL semantics will be described in the supplementary materials (available at track launch)._