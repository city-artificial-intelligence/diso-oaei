#!/usr/bin/env python3
"""
Validate a DISO-OAEI global-alignment submission — an OAEI Alignment RDF. Python 3 standard library only.

Checks the structure the scorer needs: a root <rdf:RDF>, an <Alignment>, and one or more <Cell>s, each with an
<entity1> and <entity2> (absolute IRIs via rdf:resource) and a <relation>. Parsing is namespace-tolerant.
Equivalence ('=') cells are the ones that get scored; any other relation is allowed but reported (the scorer
ignores it). See alignment.rng for an optional RelaxNG schema.

Usage:  python3 validate_global.py SUBMISSION.rdf
"""
import sys
import xml.etree.ElementTree as ET

RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
EQUIV = {"=", "==", "≡", "equivalence"}


def _local(tag):
    return tag.split("}")[-1]


def validate(path):
    problems = []
    try:
        root = ET.parse(path).getroot()
    except (ET.ParseError, FileNotFoundError) as e:
        return [f"cannot parse XML: {e}"], 0, 0

    if _local(root.tag) != "RDF":
        problems.append(f"root element should be rdf:RDF (found <{_local(root.tag)}>)")
    if not any(_local(el.tag) == "Alignment" for el in root.iter()):
        problems.append("no <Alignment> element found")

    cells = [el for el in root.iter() if _local(el.tag) == "Cell"]
    if not cells:
        problems.append("no <Cell> correspondences found")

    n_equiv = n_other = 0
    for i, cell in enumerate(cells, 1):
        e1 = e2 = None
        rel = "="
        for ch in cell:
            t = _local(ch.tag)
            if t == "entity1":
                e1 = ch.get(f"{{{RDF}}}resource") or ch.get("resource")
            elif t == "entity2":
                e2 = ch.get(f"{{{RDF}}}resource") or ch.get("resource")
            elif t == "relation":
                rel = (ch.text or "=").strip()
        if not e1 or not e2:
            problems.append(f"cell {i}: missing entity1/entity2 rdf:resource"); continue
        for name, iri in (("entity1", e1), ("entity2", e2)):
            if "://" not in iri:
                problems.append(f"cell {i}: {name} is not an absolute IRI: {iri!r}")
        if rel in EQUIV:
            n_equiv += 1
        else:
            n_other += 1
    return problems, n_equiv, n_other


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python3 validate_global.py SUBMISSION.rdf")
    problems, n_equiv, n_other = validate(sys.argv[1])
    if problems:
        print("INVALID submission:")
        for p in problems:
            print("  -", p)
        sys.exit(1)
    msg = f"OK - {n_equiv} equivalence cell(s) found (duplicates are de-duplicated at scoring time)"
    print(msg + (f"; {n_other} non-'=' cell(s) present (ignored by the scorer)." if n_other else "."))
