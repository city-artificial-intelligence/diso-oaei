# DISO-OAEI Track

DISO-OAEI is an [OAEI](https://oaei.ontologymatching.org/) ontology-matching track based on the [Defence, Intelligence and Security Ontologies (DISO) collection](https://github.com/city-artificial-intelligence/diso) ([Zenodo record](https://doi.org/10.5281/zenodo.20059506)): a network of publicly available ontologies spanning defence, intelligence, national security, and closely related subdomains (cyber-security, situation awareness, information exchange, and smart environments). The track distributes ten DISO-curated ontologies, providing eight ontology-task pairs that span **two tasks** — a _traditional_ [global alignment task](./tasks/global/alignment_task_index.md) and a [local equivalence ranking task](./tasks/ranking/ranking_task_index.md). This website provides the relevant documentation for preparing for and participating in DISO-OAEI in a form that is easy to browse, cite and reuse. Supporting material on motivation, methods, repair, and coherence measures will be published in the accompanying resource paper and supplementary materials (available at track launch).

## Track Scope

The proposed track targets ontology matching in the intersecting domains of defence, intelligence, and security, while also drawing on neighbouring areas that are operationally relevant to those domains, such as cyber-security, situation awareness, information exchange, and smart environments. The immediate objective is to identify a coherent set of ontology alignment (and related ranking) tasks that are:

* large enough to be meaningful,
* difficult enough to be interesting to the ontology matching community,
* diverse enough to exercise different matching capabilities, and
* well documented enough to support transparent evaluation and future reuse.

## Planned Editions

* OAEI 2026: full description and task release by 00:00, 6 July 2026, Anywhere on Earth (AoE).
* Future editions will be listed here as the track matures.

## Datasets and Reference Alignments

This webpage resource publishes (and points to):

* [the selected ontology pairs](./ontologies/ontologies.md),
* [task descriptions](./tasks/tasks.md) and [dataset packaging details](./quickstart.md),
* [reference alignment creation methodology](https://github.com/city-artificial-intelligence/diso-mappings),
* [evaluation metrics](./evaluation-metrics.md), 
* [baselines page](./BASELINES.md) and the [dataset & results changelog](./changelog.md), and
* extended supplementary material for each released edition (available at track launch).

Download the [ontologies](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/ontologies.zip), [repaired reference alignments](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/repaired_silver_refs.zip), [unrepaired reference alignments](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/unrepaired_silver_refs.zip), and [candidate pools](https://huggingface.co/datasets/OAEI-ML/diso-oaei/tree/main/pools) from the [Hugging Face dataset release](https://huggingface.co/datasets/OAEI-ML/diso-oaei).

### Track Ontologies

| Ontology | Full Title | DISO Subdomain | Summary | Provenance / Source |
| --- | --- | --- | --- | --- |
| UCO | Unified Cyber Ontology | Cyber-security | Community-developed ontology covering cyber investigations, threat intelligence, malware analysis, vulnerability research, and defensive or offensive operations. | Open community effort with support from the Linux Foundation. |
| STIX | Structured Threat Information eXpression | Cyber-security | Ontology for exchanging cyber threat intelligence in a structured and interoperable way. | OWL representation of the STIX ecosystem maintained around the OASIS CTI work. |
| D3FEND | D3FEND | Cyber-security | Knowledge graph and ontology for cybersecurity countermeasures, defensive techniques, and operational planning. | Developed by MITRE with support from U.S. defence and security bodies. |
| JC3IEDM | Joint Consultation, Command and Control Information Exchange Data Model | Information exchange / Situation awareness | Ontology for exchanging consultation, command, and control information in military situational awareness settings. | OWL version derived from the NATO and MIP JC3IEDM specifications. |
| mIO! | A Context Ontology for Mobile Environments | Context awareness | Context ontology network for modelling user and environmental context in mobile and pervasive computing scenarios. | Developed by the Ontology Engineering Group at the Technical University of Madrid. |
| Brick | Brick: A Uniform Metadata Schema for Buildings | Smart buildings | Building ontology covering physical assets, spaces, systems, sensors, and operational relationships. | Open-source ontology maintained by the Brick community and research collaborators. |
| FacilityOntology | FacilityOntology | Mid-level | Mid-level ontology module for representing facilities such as buildings and campuses across domains. | Part of the Common Core Ontologies ecosystem. |
| ThinkHome | ThinkHome: Energy Efficiency in Future Smart Homes | Smart homes | Smart home ontology with emphasis on home control, sensed activity, and energy-aware environments. | Developed at TU Wien as part of the ThinkHome project. |
| SmartEnv | Smart Home Environments | Smart homes | Ontology network for smart home environments, observations, events, agents, and spatial or temporal context. | Developed in the E-care@home / SmartEnv line of research. |
| CityOWL | CityOWL | Smart cities | OWL rendering of the CityGML conceptual model for semantically rich digital representations of cities. | Derived from CityGML and distributed through academic research infrastructure associated with LIRIS / OGC-related work. |

Per-ontology descriptions, downloads, and preferred citations: [`ontologies/`](ontologies/ontologies.md).

### Downloads

The 2026 datasets are published on the Hugging Face Hub: [`OAEI-ML/diso-oaei`](https://huggingface.co/datasets/OAEI-ML/diso-oaei) (the [`v2026` tag](https://huggingface.co/datasets/OAEI-ML/diso-oaei/tree/v2026) pins this edition). The SHA-256 checksums below were computed from the bytes served by Hugging Face and re-verified against the repository's canonical files.

| File | Contents | SHA-256 |
|---|---|---|
| [`archives/ontologies.zip`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/ontologies.zip) | the 10 task ontologies (OWL) | `8ff0a5fa64ff3ee5c05601b7618d471ea12f36018e2f0cf8c511c9d47af2777d` |
| [`archives/repaired_silver_refs.zip`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/repaired_silver_refs.zip) | Task 1 headline references $R_{\approx}^{+}$ (6 pairs) | `e885b1a9f2a5e39c6529406860db12a4f8ae6e4961f790d2ed919070a9f0a4c8` |
| [`archives/unrepaired_silver_refs.zip`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/unrepaired_silver_refs.zip) | Task 1 secondary references $R_{\approx}$ (6 pairs) | `bd50b4b6472ae790b4c4e949172de8325bead20951a337eb010bb53f948b7c40` |
| [`pools/uco-stix/pools.jsonl`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/pools/uco-stix/pools.jsonl) | Task 2 candidate pools — uco-stix (217 queries) | `dc375cff4d92e30caf7f54f2cb58036541c7d0b8eb82e00a8cb3c1cb9570d096` |
| [`pools/stix-d3fend/pools.jsonl`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/pools/stix-d3fend/pools.jsonl) | Task 2 candidate pools — stix-d3fend (73 queries) | `5c50fae542a4df49c5cf12e66a24c40b489bfb279909a8f30d08ec170896df6b` |

## Timeline, Competition Status & Participation

> **Status:** 2026 edition — the datasets are final and the competition is live; evaluation and the leaderboard open on 12 July 2026 via the CodaBench portals linked below.

| Milestone | Date | Delivered |
|---|---|---|
| Provisional Materials Released | 30 June 2026 | ✓ |
| Finalised Datasets Published | 6 July 2026 | ✓ |
| Competition Starts, Evaluation + Leaderboard Opens | 12 July 2026 | - |
| Evaluation Closes | 1 September 2026 | - |
| Competition Ends, Evaluation Results Reported _(grace period until 12 September)_ | 6 September 2026 | - |

_Note that all dates are considered 00:00 Anywhere on Earth (AoE)._

### Get Started & Participate

- Get acquainted with the **[quickstart](quickstart.md)** guide. Also, see the exact submission specification for [task one](tasks/global/submission-format.md) and [task two](tasks/ranking/submission-format.md).
- Task 1 references [are now public](./tasks/global/alignment_task_index.md), hosted on [Hugging Face](https://huggingface.co/datasets/OAEI-ML/diso-oaei/tree/main/references) and mirrored in the repository.
- Task 2 is scored organiser-side against the private answers. However, you may [validate your JSONL and prepare to submit](./tasks/ranking/submission-format.md).
- Submission is via CodaBench, currently available at the [CodaBench Global Alignment (Task 1)](https://www.codabench.org/competitions/17405/) and [Ranking (Task 2)](https://www.codabench.org/competitions/17406/) portals.

## Related Material

* [Ontology Alignment Evaluation Initiative](https://oaei.ontologymatching.org/)
* [DISO: Defence, Intelligence and Security Ontologies](https://github.com/city-artificial-intelligence/diso)
* The accompanying resource paper and related publications will be linked here when public.

## Citation

A Zenodo DOI for the DISO-OAEI track dataset is **pending** and will be published here once minted. Until then, cite the underlying collection:

> Dilworth, J., Cotovio, P., Herron, D., Pesquita, C., Jimenez-Ruiz, E., Cripps, P., & Dewdney, N. (2026). DISO: Defence, Intelligence and Security Ontologies (1.1.0) [Data set]. Zenodo. <https://doi.org/10.5281/zenodo.20059506>

## Organisers

[Jon Dilworth](https://dilworth.io/), [Pedro Cotovio](https://pedrocotovio.github.io/), [Ernesto Jimenez-Ruiz](https://ernestojimenezruiz.github.io/), and [Catia Pesquita](https://www.di.fc.ul.pt/~catiapesquita/).

## Contributors

[Dave Herron](https://djherron.github.io/), Paul Cripps, and Nigel Dewdney.

## Acknowledgements

This research was supported by Turing Innovations Limited and [The Alan Turing Institute's Defence and Security Programme](https://www.turing.ac.uk/science-innovation/defence-and-national-security) via the project [GUARD](https://ernestojimenezruiz.github.io/projects/guard/).
