# Task 1 — Global Alignment

_A traditional/standard OAEI alignment task for DISO-OAEI._

For each pair listed below, you submit a full OAEI alignment between each pair of ontologies. The alignment ontologies are made available within [the ontologies directory](../../ontologies/ontologies.md) or can be [downloaded as a single zip](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/ontologies.zip).

## The six alignment ontology pairs

| Pair | \|R≈\| | \|R≈⁺\| | repaired | reference |
|---|--:|--:|:--:|---|
| `thinkhome-brick`  | 116 | 66  | yes  | [thinkhome-brick.silver.rdf](./references/_for_use/thinkhome-brick.silver.rdf) |
| `brick-smartenv`   | 47  | 18  | yes  | [brick-smartenv.silver.rdf](./references/_for_use/brick-smartenv.silver.rdf) |
| `city-brick`       | 61  | 19  | yes  | [city-brick.silver.rdf](./references/_for_use/city-brick.silver.rdf) |
| `jc3iedm-mio`      | 267 | 267 | -    | [jc3iedm-mio.silver.rdf](./references/_for_use/jc3iedm-mio.silver.rdf) |
| `jc3iedm-brick`    | 75  | 75  | -    | [jc3iedm-brick.silver.rdf](./references/_for_use/jc3iedm-brick.silver.rdf) |
| `jc3iedm-facility` | 43  | 43  | -    | [jc3iedm-facility.silver.rdf](./references/_for_use/jc3iedm-facility.silver.rdf) |

The three `jc3iedm-*` pairs are coherent at the TBox level under the silver, so repair (which operates on the TBox) removes nothing, i.e., $R_{\approx} \equiv R_{\approx}^{+}$.

## Reference directories with multiple (supplemental) RDF files

* Rapprox.rdf   — $R_{\approx}$ the validated positives (the secondary reference).
* Rplus.rdf     —  $R_{\approx}^{+} \subseteq R_{\approx}$ the coherence-clean repaired subset; present only for the 3 incoherent pairs.
* incorrect.rdf — human-confirmed true negatives. 
* unknown.rdf   — mappings whose status remained undetermined after review; the metrics ignore them.

## How the repaired reference was constructed

The repaired reference $R_{\approx}^{+}$ is derived from the validated silver $R_{\approx}$ by mapping repair, following the LargeBio "remove-if-any" convention: three established repair systems — ALCOMO, LogMap-repair, and AML-repair — are each run over every pair, and a correspondence is removed if **any** of the three flags it as participating in a logical conflict:

$$
R_{\approx}^{+} = R_{\approx} \setminus (\mathrm{ALCOMO} \cup \mathrm{LogMap} \cup \mathrm{AML}).
$$

Repair operates at the TBox level. Three pairs required repair (thinkhome-brick $116 \to 66$, brick-smartenv $47 \to 18$, city-brick $61 \to 19$); the three JC3IEDM pairs are TBox-coherent under the silver, so $R_{\approx}^{+} = R_{\approx}$ and no `Rplus.rdf` is shipped for them. Headline scores use $R_{\approx}^{+}$, with $R_{\approx}$ reported alongside.

## Metric details — partiality-corrected P/R/F1

The silver reference `R` is **partial but locally complete**: for every entity it mentions it lists all of that entity's correct correspondences, but it is silent about unmentioned entities. Let `A` be your alignment; restrict it to what `R` can adjudicate:

$$
\hat{A} = \text{predictions touching a covered entity},
$$

$$
\mathrm{Precision}_{partial} = \frac{\vert A \cap R \vert}{\vert \hat{A} \vert},
$$

$$
\mathrm{Recall} = \frac{\vert A \cap R \vert}{\vert R \vert}.
$$

Submissions are scored using precision, recall and f-measure (under partiality-corrected semantics, as defined above) against their corresponding silver standard reference ([download](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/repaired_silver_refs.zip)) $R_{\approx}^{+}$ for the primary headline metrics. We also compute the same metrics using their unrepaired variants ([download](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/unrepaired_silver_refs.zip)) $R_{\approx}$ as secondary (for comparison and reporting purposes only).

Only predictions that are considered _un-adjudicable_, meaning neither entity is covered by $R$, leave the precision denominator; a prediction over a _covered_ entity that disagrees with $R$ stays in $\hat{A}$ as a genuine error. Equivalence (`=`) correspondences over named entities are scored — classes, properties, and individuals alike (subsumption cells are ignored). The silver references themselves contain individual–individual equivalences (JC3IEDM country and code individuals; QUDT and OWL-Time units), and these are scored exactly like class correspondences. Self-submission of a reference against itself gives **P=R=F1=1**. 

The [baselines page](../../BASELINES.md) reports per-matcher micro and macro-averaged precision/recall/f1 across all 6 pairs (participant submissions will be reported the same way).

For additional information on local scoring using included tools and the submission format, see [this page](submission-format.md).
