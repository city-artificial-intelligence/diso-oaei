# DISO-OAEI — Defence, Intelligence and Security Ontology Alignment Evaluation Initiative

DISO-OAEI is an [OAEI](https://oaei.ontologymatching.org/) ontology-matching track based on [DISO: defence, intelligence, and security ontologies](https://doi.org/10.5281/zenodo.20059506). Ontologies used in this track include: STIX [1], UCO [2], D3FEND [3], JC3IEDM [4], Brick [5], ThinkHome [6], SmartEnv [7], CityOWL [8], mIO [9], Facility [10].

The track is split into two tasks. The first is a traditional OAEI global alignment task split over six ontology pairs, whereas the second is a Bio-ML-inspired local equivalence ranking task (which includes [NIL mappings](./tasks/ranking/ranking_task_index.md)).

For each ontology pair in the global alignment task, we provide a partial reference alignment (i.e., our silver-standard) constructed from a three-step process. First, a [consensus-based voting scheme](https://github.com/city-artificial-intelligence/DISO-mappings#consensus) was run over [DISO](https://github.com/city-artificial-intelligence/diso) using several ontology matching systems, including AML [11], LogMap [12], and BERTMap [13]. This was followed by manual review from the authors and domain experts. The resulting validated mappings then underwent a repair process, yielding our silver standard reference alignment. The repair process is adapted from LargeBio [14], where the set of mappings to remove (or weaken) is computed as the union over three repair tools: ALCOMO, LogMap, and AML. A concise self-contained description is given in the [Task 1 reference-repair section](./tasks/global/alignment_task_index.md#how-the-repaired-reference-was-constructed); further detail follows in the supplementary materials (available at track launch).

## Repository Contents _(and useful links)_

* [The DISO-OAEI Homepage (index)](./index.md)
* [A Description of DISO-OAEI: (this file)](./README.md)
* [Quickstart: validate and score a submission](./quickstart.md)
* [Baselines](./BASELINES.md)
* [Tasks Overview](./tasks/tasks.md)
    * [Task 1: Global Alignment](./tasks/global/alignment_task_index.md)
    * [Task 2: Equivalence Ranking](./tasks/ranking/ranking_task_index.md)
* [Data Downloads](./index.md#downloads) _(hosted on Hugging Face: [OAEI-ML/diso-oaei](https://huggingface.co/datasets/OAEI-ML/diso-oaei))_
    * [DISO-OAEI Ontologies](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/ontologies.zip)
    * [Task 1 Repaired Reference Alignments](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/repaired_silver_refs.zip)
    * [Task 1 Unrepaired Reference Alignments](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/unrepaired_silver_refs.zip)
    * [Task 2 Candidate Pools](https://huggingface.co/datasets/OAEI-ML/diso-oaei/tree/main/pools)
* [Useful DISO Scripts](./quickstart.md)
* [Repository Licence (Apache-2.0)](./LICENSE)
* [DISO Network of Ontologies](https://github.com/city-artificial-intelligence/diso)
* [DISO Ontology Alignment Implementation](https://github.com/city-artificial-intelligence/diso-mappings)
* [DISO Ontology Alignment Evaluation Initiative](https://github.com/city-artificial-intelligence/diso-oaei)

## Task Breakdown

| Task | #pairs | You submit | Metric |
|---|--:|---|---|
| Task 1 — Global alignment | 6 | A full OAEI Alignment RDF per pair | Partiality-corrected P/R/F1, micro and macro-averaged, vs $R_{\approx}^{+}$ and $R_{\approx}$ |
| Task 2 — Local equivalence ranking | 2 | A best-first ranking of each query's candidate pool (incl. a NIL candidate) | Hits@{1,3,5,10} + MRR, macro over the 2 pairs |

## Task 1: Global alignment

Ontology pairs include:

* thinkhome-brick
* brick-smartenv
* city-brick
* jc3iedm-mio
* jc3iedm-brick
* jc3iedm-facility

Reference alignments are published under [`tasks/global/references/`](./tasks/global/alignment_task_index.md), or [download them as a zipped archive from Hugging Face](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/repaired_silver_refs.zip). See the [full task description](./tasks/global/alignment_task_index.md) and the [submission format](./tasks/global/submission-format.md). Because the references are public, Task 1 _will_ support MELT local-track evaluation via a local driver _(not yet included, still being constructed)_. Otherwise, evaluation will be performed via [CodaBench - task one](https://www.codabench.org/competitions/17405/) and [task two](https://www.codabench.org/competitions/17406/); see the [quickstart guide](./quickstart.md) for details on getting started.

## Task 2: Unsupervised local equivalence ranking _(mixed-signature with NIL mappings)_

The task is _mixed signature_, meaning the candidate universe is the target ontology's full named signature, i.e., classes, object properties, and data properties; note that individuals are dropped. Ontology pairs include:

* UCO-STIX
* STIX-D3FEND

Candidates are pooled into one unified set per query; each candidate set has a cardinality (size) of 50 (49 + a NIL candidate). The NIL candidate (with IRI `https://oaei.ontologymatching.org/2026/diso/NIL`) indicates that no known mapping exists for the given query. Read the [justification for how these are computed here](./tasks/ranking/ranking_task_index.md). The pool files are published at `tasks/ranking/candidates/<pair>/pools.jsonl` ([uco-stix](./tasks/ranking/candidates/uco-stix/pools.jsonl), [stix-d3fend](./tasks/ranking/candidates/stix-d3fend/pools.jsonl)). Given that the query set is relatively small (290 queries: 217 uco-stix + 73 stix-d3fend), it remains infeasible to provide a public/private training/validation/testing split; so this task should be considered open to unsupervised (or semi-supervised, distantly-supervised, etc.) methods. References are private: participants validate their submission's format and the organisers score it.

## Usage

### Validate submission formats

**Global Alignment RDF Submission Format:**

```bash
# zero-dependency structural check
python3 scripts/validate_global.py my-thinkhome-brick.rdf
# optional declarative check (RelaxNG; requires libxml2-utils)
xmllint --relaxng scripts/alignment.rng my-thinkhome-brick.rdf
```

**Local Ranking JSONL Format with Python:**

* _uco-stix:_ `python3 scripts/validate_ranking.py tasks/ranking/candidates/uco-stix/pools.jsonl my-submission.jsonl`
* _stix-d3fend:_ `python3 scripts/validate_ranking.py tasks/ranking/candidates/stix-d3fend/pools.jsonl my-submission.jsonl`

### Scoring a Global Alignment Submission Locally

```bash
python3 scripts/score_global.py my-thinkhome-brick.rdf \
    --rplus   tasks/global/references/_for_use/thinkhome-brick.silver.rdf \
    --rapprox tasks/global/references/_unrepaired/thinkhome-brick.silver.unrepaired.rdf
```

There is no local scorer for Task 2 (the answer keys are private). A full walkthrough is in the [quickstart](./quickstart.md).

## Organisers

[Jon Dilworth](https://dilworth.io/), [Pedro Cotovio](https://pedrocotovio.github.io/), [Ernesto Jimenez-Ruiz](https://ernestojimenezruiz.github.io/), and [Catia Pesquita](https://www.di.fc.ul.pt/~catiapesquita/).


## Contributors

[Dave Herron](https://djherron.github.io/), Paul Cripps, and Nigel Dewdney.


## Acknowledgements

Supported by Turing Innovations Limited and [The Alan Turing Institute's Defence and Security Programme](https://www.turing.ac.uk/science-innovation/defence-and-national-security) via the project [GUARD](https://ernestojimenezruiz.github.io/projects/guard/).


## References

1. OASIS Cyber Threat Intelligence Technical Committee. STIX Version 2.1. Edited by Bret Jordan, Rich Piazza, and Trey Darley. OASIS Standard, 10 June 2021. <https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html>
2. Casey, E., Barnum, S., Griffith, R., Snyder, J., van Beek, H., and Nelson, A. (2018). The Evolution of Expressing and Exchanging Cyber-investigation Information in a Standardized Form. In: Biasiotti et al. (eds), Handling and Exchanging Electronic Evidence Across Europe. Springer.
3. Kaloroumakis, P. E. and Smith, M. J. (2021). Toward a Knowledge Graph of Cybersecurity Countermeasures. Technical Report Case 20-2034. The MITRE Corporation. <https://d3fend.mitre.org/resources/D3FEND.pdf>
4. Matheus, C. J. and Ulicny, B. (2007). On the Automatic Generation of an OWL Ontology based on the Joint C3 Information Exchange Data Model. In: Proceedings of the 12th International Command and Control Research and Technology Symposium (ICCRTS), Newport, RI, USA.
5. Balaji, B., Bhattacharya, A., Fierro, G., Gao, J., Gluck, J., Hong, D., Johansen, A., Koh, J., Ploennigs, J., Agarwal, Y., Bergés, M., Culler, D., Gupta, R. K., Kjærgaard, M. B., Srivastava, M., and Whitehouse, K. (2018). Brick: Metadata schema for portable smart building applications. Applied Energy, 226, 1273–1292. <https://doi.org/10.1016/j.apenergy.2018.02.091>
6. Reinisch, C., Kofler, M. J., Iglesias, F., and Kastner, W. (2011). ThinkHome Energy Efficiency in Future Smart Homes. EURASIP Journal on Embedded Systems, 2011, Article 104617. <https://doi.org/10.1155/2011/104617>
7. Alirezaie, M., Hammar, K., Blomqvist, E., Nyström, M., and Ivanova, V. (2018). SmartEnv Ontology in E-care@home. In: SSN 2018 — 9th International Semantic Sensor Networks Workshop (ISWC 2018), CEUR Vol. 2213, pp. 72–79.
8. Vinasco-Alvarez, D., Samuel, J., Servigne, S., and Gesquiere, G. (2024). Towards an Automated Transformation of an nD Urban Data Model to a Computational Ontology Network: From UML to OWL, From CityGML 3.0 to CityOWL. ISPRS Annals of Photogrammetry, Remote Sensing and Spatial Information Sciences, X-4/W4-2024, pp. 231–238. <https://doi.org/10.5194/isprs-annals-X-4-W4-2024-231-2024>
9. Poveda-Villalón, M., Suárez-Figueroa, M. C., García-Castro, R., and Gómez-Pérez, A. (2010). A Context Ontology for Mobile Environments. In: Proceedings of the Workshop on Context, Information and Ontologies (CIAO 2010), co-located with EKAW 2010, Lisbon, Portugal. CEUR Vol. 626. <https://ceur-ws.org/Vol-626/regular3.pdf>
10. Jensen, M., Cox, A. P., Beverley, J., Smith, B., and Otte, J. N. (2024). The Common Core Ontologies (Version 2.0). <https://doi.org/10.48550/arXiv.2404.17758>
11. Faria, D., Pesquita, C., Santos, E., Palmonari, M., Cruz, I. F., and Couto, F. M. (2013). The AgreementMakerLight ontology matching system. In: OTM Confederated International Conferences "On the Move to Meaningful Internet Systems", pp. 527–541. Springer.
12. Jiménez-Ruiz, E. and Cuenca Grau, B. (2011). LogMap: Logic-based and scalable ontology matching. In: International Semantic Web Conference, pp. 273–288. Springer.
13. He, Y., Chen, J., Antonyrajah, D., and Horrocks, I. (2022). BERTMap: A BERT-based ontology alignment system. In: Proceedings of the AAAI Conference on Artificial Intelligence, 36(5), 5684–5691.
14. Ontology Alignment Evaluation Initiative — Large BioMed (LargeBio) track. <http://www.cs.ox.ac.uk/isg/projects/SEALS/oaei/>

---

*DISO-OAEI v1. Questions or corrections: open an issue, contact the track organisers, or email <contact@oaei-ml.org>.*
