#!/usr/bin/env python3
"""
Score a DISO-OAEI global-alignment submission with the partiality-corrected P/R/F1.

Usage:
  python3 score_global.py SUBMISSION.rdf REFERENCE.rdf
  python3 score_global.py SUBMISSION.rdf --rplus Rplus.rdf --rapprox Rapprox.rdf
"""
import sys
import xml.etree.ElementTree as ET

RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
EQUIV = {"=", "==", "≡", "equivalence"}


def pairs(path):
    """
    Set of (entity1, entity2) for equivalence cells in an OAEI Alignment RDF.
    (namespace-tolerant, de-duped)
    """
    out = set()
    for cell in ET.parse(path).getroot().iter():
        if cell.tag.split("}")[-1] != "Cell":
            continue
        e1 = e2 = None
        rel = "="
        for ch in cell:
            tag = ch.tag.split("}")[-1]
            if tag == "entity1":
                e1 = ch.get(f"{{{RDF}}}resource") or ch.get("resource")
            elif tag == "entity2":
                e2 = ch.get(f"{{{RDF}}}resource") or ch.get("resource")
            elif tag == "relation":
                rel = (ch.text or "=").strip()
        if e1 and e2 and rel in EQUIV:
            out.add((e1, e2))
    return out


def score(preds, R):
    entities_src = {e1 for e1, _ in R}
    entities_tgt = {e2 for _, e2 in R}
    judge = {
        (src, tgt) for (src, tgt) in preds 
        if src in entities_src or tgt in entities_tgt
    }
    tp = len(preds & R)
    precision = tp / len(judge) if judge else 0.0
    recall = tp / len(R) if R else 0.0
    f_measure = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0
    return {
        "predicted": len(preds), 
        "judgeable": len(judge), 
        "reference": len(R),
        "TP": tp, 
        "P": round(precision, 4), 
        "R": round(recall, 4), 
        "F1": round(f_measure, 4)
    }


def show(label, s):
    print(f"{label}: P={s['P']}  R={s['R']}  F1={s['F1']}   "
          f"(TP={s['TP']}, judgeable={s['judgeable']}, |A|={s['predicted']}, |R|={s['reference']})")


if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) >= 1 and "--rplus" in a and "--rapprox" in a:
        submission = a[0]
        A = pairs(submission)
        show("vs R+ (headline)", score(A, pairs(a[a.index("--rplus") + 1])))
        show("vs R  (secondary)", score(A, pairs(a[a.index("--rapprox") + 1])))
    elif len(a) == 2:
        show("score", score(pairs(a[0]), pairs(a[1])))
    else:
        sys.exit("usage: python3 score_global.py SUBMISSION.rdf REFERENCE.rdf\n"
                 "   or: python3 score_global.py SUBMISSION.rdf --rplus Rplus.rdf --rapprox Rapprox.rdf")
