#!/usr/bin/env python3
"""
Validate a DISO-OAEI local-ranking (Task 2) submission.
Usage:  python3 validate_ranking.py POOLS.jsonl SUBMISSION.jsonl
"""
import sys, json


def load_pools(path):
    pools = {}
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                d = json.loads(line)
                pools[d["qid"]] = d["candidates"]
    return pools


def validate(pools_path, submission_path):
    pools = load_pools(pools_path)
    seen, problems = set(), []
    with open(submission_path) as f:
        for n, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                d = json.loads(line)
            except json.JSONDecodeError as e:
                problems.append(f"line {n}: not valid JSON ({e})")
                continue
            if "qid" not in d or "ranking" not in d:
                problems.append(f"line {n}: object must have 'qid' and 'ranking'")
                continue
            qid, ranking = d["qid"], d["ranking"]
            if qid not in pools:
                problems.append(f"qid {qid}: not a query in the pool file")
                continue
            if qid in seen:
                problems.append(f"qid {qid}: submitted more than once")
                continue
            seen.add(qid)
            if len(ranking) != len(pools[qid]) or set(ranking) != set(pools[qid]):
                problems.append(f"qid {qid}: 'ranking' must be a permutation of the {len(pools[qid])} pool candidates")
    missing = sorted(set(pools) - seen)
    if missing:
        problems.append(f"missing {len(missing)} queries (e.g. {missing[:5]})")
    return problems


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("usage: python3 validate_ranking.py POOLS.jsonl SUBMISSION.jsonl")
    problems = validate(sys.argv[1], sys.argv[2])
    if problems:
        print("INVALID submission:")
        for p in problems:
            print("  -", p)
        sys.exit(1)
    print("OK - ranking submission format is valid.")
