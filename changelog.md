# Changelog

All notable changes to the DISO-OAEI datasets, baselines, and published results are recorded here, per edition. Dataset archives are identified by their SHA-256 checksums (see the [downloads table](./index.md#downloads)); each edition's machine-readable results snapshot is archived under `results/<year>/`.

## 2026 edition (first edition)

### 2026-07-06 — Finalised datasets published

The 2026 datasets are frozen and published on the Hugging Face Hub at [`OAEI-ML/diso-oaei`](https://huggingface.co/datasets/OAEI-ML/diso-oaei), pinned by the [`v2026` tag](https://huggingface.co/datasets/OAEI-ML/diso-oaei/tree/v2026): the ten ontologies, the Task 1 dual references (repaired and unrepaired), and the Task 2 candidate pools. SHA-256 checksums for every download are in the [downloads table](./index.md#downloads); the archive zips were repacked for release (new checksums), with contents verified identical to the repository's canonical files. Submission portals opened on CodaBench: [Task 1](https://www.codabench.org/competitions/17405/) and [Task 2](https://www.codabench.org/competitions/17406/); the evaluation window runs 12 July – 1 September 2026.

### 2026-06-30 — Provisional materials released

- Provisional website, task documentation, datasets, and download archives made public for review.
- Organiser-run baselines published on the [baselines page](./BASELINES.md): 13 matching systems for Task 1 (8 covering all six pairs; 5 on the two openly redistributable JC3IEDM pairs) and 2 reference baselines for Task 2.
- Machine-readable snapshot archived at `results/2026/leaderboard.json`.

## Entry format for future editions

From the 2027 edition onward, entries will record, relative to the previous edition:

- **Dataset changes** — ontology version bumps, reference-alignment additions/removals/repairs (with cell counts), candidate-pool regeneration, and the new archive checksums.
- **Protocol changes** — metric, validation, or submission-format changes.
- **Results** — a pointer to the closed edition's final archived results under `results/<year>/`.
