# DISO: Task Overview

## Task 1 — Global alignment

The standard OAEI alignment task of DISO-OAEI: for each of the six ontology pairs below, you submit one full OAEI alignment.

| | |
|---|---|
| **Pairs (6)** | thinkhome-brick, brick-smartenv, city-brick, jc3iedm-mio, jc3iedm-brick, jc3iedm-facility |
| **Participants submit** | one full OAEI Alignment RDF per pair ([see: the global alignment submission format](./global/submission-format.md)) |
| **Reference alignments** | the partial, unrepaired $R_{\approx}$ and the repaired $R_{\approx}^{+}$ reference alignments are made **public** under [`tasks/global/references/<pair>/`](./global/alignment_task_index.md) |
| **Metric** | partiality-corrected P/R/F1, micro and macro-averaged, measured over $R_{\approx}^{+}$ |

The DISO-OAEI alignment ontologies are made available in [the ontologies directory](../ontologies/ontologies.md), or they can be downloaded conveniently as a [zipped archive](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/ontologies.zip). The six alignment ontology task pairs are broken down in further detail below.

| Pair | $\vert R_{\approx}\vert$ | $\vert R_{\approx}^{+}\vert$ | repaired | reference |
|---|--:|--:|:--:|---|
| `thinkhome-brick`  | 116 | 66  | yes  | [thinkhome-brick.silver.rdf](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/references/repaired_silver/thinkhome-brick.silver.rdf) |
| `brick-smartenv`   | 47  | 18  | yes  | [brick-smartenv.silver.rdf](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/references/repaired_silver/brick-smartenv.silver.rdf) |
| `city-brick`       | 61  | 19  | yes  | [city-brick.silver.rdf](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/references/repaired_silver/city-brick.silver.rdf) |
| `jc3iedm-mio`      | 267 | 267 | -    | [jc3iedm-mio.silver.rdf](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/references/repaired_silver/jc3iedm-mio.silver.rdf) |
| `jc3iedm-brick`    | 75  | 75  | -    | [jc3iedm-brick.silver.rdf](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/references/repaired_silver/jc3iedm-brick.silver.rdf) |
| `jc3iedm-facility` | 43  | 43  | -    | [jc3iedm-facility.silver.rdf](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/references/repaired_silver/jc3iedm-facility.silver.rdf) |

Submissions are scored using precision, recall and f-measure (under partiality-corrected semantics) using their [corresponding repaired silver standard reference alignment](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/repaired_silver_refs.zip). Both $R_{\approx}$ and $R_{\approx}^{+}$ [are given](./global/alignment_task_index.md); submissions are headlined against $R_{\approx}^{+}$ (scores against $R_{\approx}$ are also reported). Results are both micro (and macro) averaged across all six task pairs when published to the [baselines page](../BASELINES.md) (and, for participant submissions, the live leaderboard).

Download [the ontologies](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/ontologies.zip) and the [reference alignments](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/repaired_silver_refs.zip) for Task 1; and see Task 1's [extended documentation](./global/alignment_task_index.md), its [submission format](./global/submission-format.md), and the [quickstart](../quickstart.md) for submission logistics.


## Task 2 — Local equivalence ranking (mixed-signature, with NIL mappings)

Task 2 is an equivalence ranking task, for which a brief overview is provided in the table below.

| | |
|---|---|
| **Pairs (2)** | uco-stix, stix-d3fend |
| **You submit** | one JSONL ranking per pair: each query's 50-candidate pool ordered best-first, NIL first to abstain ([format](./ranking/submission-format.md)) |
| **Pools** | **public** — `tasks/ranking/candidates/<pair>/pools.jsonl` (mixed-signature: classes + object properties + data properties; every pool includes a NIL candidate) |
| **References** | **private** — unsupervised; participants validate the format, organisers score |
| **Metric** | Hits@{1,3,5,10} + MRR, macro-averaged over the 2 pairs (fixed $\tau=0.5$) |
| **Details** | See: [Local Ranking Task Specification](./ranking/ranking_task_index.md) |


**Task Definition:** Given a pair of ontologies, $\mathcal{O}_{src}$ and $\mathcal{O}_{tgt}$, a source entity from $\mathcal{O}_{src}$, denoted $e_{src}$, a set of 50 potential target entities (consisting of 49 entities from $\mathcal{O}_{tgt}$ and a NIL entity), denoted $\mathcal{K}$, produce a ranking for $\mathcal{K}$, ordered by confidence that $e_{src} \equiv e_{tgt}$ for each $e_{tgt}$ in $\mathcal{K}$. In the case where an equivalence correspondence between $\mathcal{O}_{src}$ and $\mathcal{O}_{tgt}$ through $e_{src}$ does not exist, instead map $e_{src}$ to NIL.

**Simply put:** for each source entity ($e_{src}$) you are given a fixed candidate pool of 50 possible target entities (represented by their IRI; $e_{tgt}^{1}, e_{tgt}^{2}, \ldots, e_{tgt}^{50}$) drawn from the target ontology's signature. A participating system aims to rank order the pool such that the true equivalence correspondence $\langle e_{src}, e_{tgt}^{i}, \equiv, [0,1] \rangle$ appears as early as possible; or, when the source has no equivalent target from $\mathcal{O}_{tgt}$ within the pool, your ranking should place the NIL IRI as early as possible.

**Candidates:** are pooled into one unified set per source entity, each pool has a cardinality (or _size_) of 50; that is, 49 + a NIL candidate. The NIL candidate (represented by the IRI `https://oaei.ontologymatching.org/2026/diso/NIL`) indicates that a mapping does not exist from the source entity to any other possible candidate entity. Read the [justification for how these are computed here](./ranking/ranking_task_index.md). Given that the query set is relatively small (290 queries: 217 uco-stix + 73 stix-d3fend), it remains infeasible to provide a public training set. As such, this task is considered unsupervised; however, there are no formal constraints on the methodology used to implement a participating system, so long as the system is documented and the results are reproducible.

Download [the candidates](https://huggingface.co/datasets/OAEI-ML/diso-oaei/tree/main/pools) for Task 2; and see Task 2's [extended documentation](./ranking/ranking_task_index.md), its [submission format](./ranking/submission-format.md), and the [quickstart](../quickstart.md) for submission logistics.