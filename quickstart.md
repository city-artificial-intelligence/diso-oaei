# DISO-OAEI — Quickstart

Everything a participant runs is Python 3.12+ standard library only. Clone the distribution and run from its root.

## 1. Get the data

The 2026 datasets are published on the Hugging Face Hub under the OAEI-ML organisation — browse at [`huggingface.co/datasets/OAEI-ML/diso-oaei`](https://huggingface.co/datasets/OAEI-ML/diso-oaei) (the [`v2026` tag](https://huggingface.co/datasets/OAEI-ML/diso-oaei/tree/v2026) pins this edition):

| Download | Contents |
|---|---|
| [`archives/ontologies.zip`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/ontologies.zip) | the 10 task ontologies (also unpacked under [`ontologies/`](ontologies/ontologies.md) in the repository) |
| [`archives/repaired_silver_refs.zip`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/repaired_silver_refs.zip) | Task 1 headline references $R_{\approx}^{+}$ (repository: [`tasks/global/references/_for_use/`](tasks/global/alignment_task_index.md); per-pair component files live under `tasks/global/references/<pair>/`) |
| [`archives/unrepaired_silver_refs.zip`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/archives/unrepaired_silver_refs.zip) | Task 1 secondary references $R_{\approx}$ (repository: `tasks/global/references/_unrepaired/`) |
| [`pools/uco-stix/pools.jsonl`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/pools/uco-stix/pools.jsonl) · [`pools/stix-d3fend/pools.jsonl`](https://huggingface.co/datasets/OAEI-ML/diso-oaei/resolve/main/pools/stix-d3fend/pools.jsonl) | Task 2 candidate pools (repository: `tasks/ranking/candidates/<pair>/pools.jsonl`) |

Verify your downloads against the SHA-256 checksums in the [downloads table](index.md). The repository ships the same files unpacked, so cloning it also works.

### Command-line download

```bash
pip install -U huggingface_hub
hf download OAEI-ML/diso-oaei --repo-type dataset --local-dir ./diso-oaei     # everything
hf download OAEI-ML/diso-oaei ontologies/stix.owl --repo-type dataset        # a single file
hf download OAEI-ML/diso-oaei --repo-type dataset --revision v2026 --local-dir ./diso-oaei-2026   # pin the 2026 edition
```

## 2. Task 1 — Global alignment

For each of the 6 pairs, emit one **OAEI Alignment RDF** (default `xmlns` = the alignment namespace *without* a trailing `#`; one `<Cell>` per `=` correspondence). The full spec and template are provided under [tasks/global/submission-format.md](tasks/global/submission-format.md).

Validate, then self-score — the references are **public**, with headline metrics computed using $R_{\approx}^{+}$ (with $R_{\approx}$ as secondary):

```bash
# structural check (zero-dependency); optional RelaxNG check needs libxml2-utils
python3 scripts/validate_global.py my-thinkhome-brick.rdf
xmllint --relaxng scripts/alignment.rng my-thinkhome-brick.rdf

# score one submission under the dual reference
python3 scripts/score_global.py my-submission.rdf \
    --rplus tasks/global/references/_for_use/thinkhome-brick.silver.rdf \
    --rapprox tasks/global/references/_unrepaired/thinkhome-brick.silver.unrepaired.rdf
```

_Sanity check: a reference scored against itself gives `P=R=F1=1`. A MELT local-track driver is under construction (see the [README](README.md))._

## 3. Task 2 — Local equivalence ranking

For each pair, read `tasks/ranking/candidates/<pair>/pools.jsonl` (one JSON object per query, each with 50 candidates including the NIL IRI). Emit a JSONL submission, one line per `qid`, ranking that query's candidates best-first (a permutation of the 50; rank NIL first to abstain):

```json
{"qid": 0, "ranking": ["<best-IRI>", "...", "https://oaei.ontologymatching.org/2026/diso/NIL", "..."]}
```

The task is considered unsupervised; the answers (ground truths) are private, so there is no local scorer. Validate the format, then submit. We score Hits@$\{1,3,5,10\}$, MRR, and macro-average over both pairs.

```bash
python3 scripts/validate_ranking.py tasks/ranking/candidates/uco-stix/pools.jsonl    my_uco-stix.jsonl
python3 scripts/validate_ranking.py tasks/ranking/candidates/stix-d3fend/pools.jsonl my_stix-d3fend.jsonl
```

Full spec + worked example: [`tasks/ranking/submission-format.md`](tasks/ranking/submission-format.md).

## 4. Submit

The evaluation window runs from 12 July to 1 September 2026, 00:00 Anywhere on Earth (AoE). 

Submit via CodaBench: [Task 1 — Global Alignment](https://www.codabench.org/competitions/17405/) · [Task 2 — Local Equivalence Ranking](https://www.codabench.org/competitions/17406/). 

Register, then upload one zip per task as described on each competition's Overview page.

Results are automatically published as _provisional_ to the leaderboard.

Organisers verify, reproduce where possible, mark participant results as _accepted_, and publish them alongside the organiser-run [baselines](BASELINES.md).
