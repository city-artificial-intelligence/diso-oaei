# Task 1 - Global Alignment: Submission Format

DISO-OAEI Task 1 is a standard OAEI global alignment over 6 ontology pairs:

* [thinkhome-brick](./references/thinkhome-brick/Rapprox.rdf)
* [brick-smartenv](./references/brick-smartenv/Rapprox.rdf)
* [city-brick](./references/city-brick/Rapprox.rdf)
* [jc3iedm-mio](./references/jc3iedm-mio/Rapprox.rdf)
* [jc3iedm-brick](./references/jc3iedm-brick/Rapprox.rdf)
* [jc3iedm-facility](./references/jc3iedm-facility/Rapprox.rdf)

For each pair you submit one complete alignment in the [OAEI Alignment RDF format](https://moex.gitlabpages.inria.fr/alignapi/format.html). Submissions are scored with P/R/F1 (under [partial semantics](./alignment_task_index.md)) against their repaired silver-standard reference.

## File format

Root is `rdf:RDF`. The default namespace (`xmlns=`) is the OAEI Alignment namespace **without a trailing `#`**: `http://knowledgeweb.semanticweb.org/heterogeneity/alignment`. (The Python validator and scorer — `scripts/validate_global.py`, `scripts/score_global.py` — parse namespace-tolerantly, so a trailing-`#` variant still scores; the RelaxNG schema `scripts/alignment.rng` likewise accepts both forms, with or without the trailing `#`. Emit without `#`.) Exactly one `<Alignment>` with a header (`<xml>yes</xml>`, `<level>0</level>`, `<type>??</type>`, and `<onto1>`/`<onto2>` URIs). Each correspondence is a `<map>` wrapping one `<Cell>`:
  
  - `<entity1 rdf:resource="IRI"/>` — the source ontology entity IRI (class, property, or individual),
  - `<entity2 rdf:resource="IRI"/>` — the target ontology entity IRI (class, property, or individual),
  - `<relation>=</relation>` — equivalence (Task 1 scores `=` only; subsumptions are ignored),
  - `<measure rdf:datatype="http://www.w3.org/2001/XMLSchema#float">1.0</measure>` — confidence in `[0,1]`.

The scorer accepts one file per pair. Entity IRIs MUST be absolute. The order of `<map>` elements is irrelevant; entity orientation is not — `<entity1>` must come from `onto1` and `<entity2>` from `onto2`, as a reversed cell can never match the reference. **All named-entity equivalences in the reference are scored, including `owl:NamedIndividual` pairs** (the JC3IEDM-derived references are predominantly individual–individual, e.g. 230 of jc3iedm-mio's 267 pairs), so systems that skip individuals forfeit that recall. A prediction is excluded from the precision denominator only when neither of its entities occurs in the reference, regardless of entity type.

## Worked example (illustrative)

The cells below are quoted from the real reference `tasks/global/references/thinkhome-brick/Rapprox.rdf` — they illustrate the exact cell shape:

```xml
<?xml version="1.0" encoding="utf-8"?>
<rdf:RDF xmlns="http://knowledgeweb.semanticweb.org/heterogeneity/alignment"
         xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:xsd="http://www.w3.org/2001/XMLSchema#">
  <Alignment>
    <xml>yes</xml>
    <level>0</level>
    <type>??</type>
    <onto1>http://www.semanticweb.org/dave/ontologies/thinkhome</onto1>
    <onto2>https://brickschema.org/schema/1.4/Brick</onto2>
    <map>
      <Cell>
        <entity1 rdf:resource="https://www.auto.tuwien.ac.at/downloads/thinkhome/ontology/EnergyResourceOntology.owl#CoolCommand"/>
        <entity2 rdf:resource="https://brickschema.org/schema/Brick#Cooling_Command"/>
        <relation>=</relation>
        <measure rdf:datatype="http://www.w3.org/2001/XMLSchema#float">1.0</measure>
      </Cell>
    </map>
    <!-- note: an illustrative example using xQuery:
    {
      let $correspondences := ...
      for $c in $correspondences
      return
        <map>
          <Cell>
            <entity1 rdf:resource="{$c/@e1}"/>
            <entity2 rdf:resource="{$c/@e2}"/>
            <relation>{$c/@rel/string()}</relation>
            <measure rdf:datatype="http://www.w3.org/2001/XMLSchema#float">{$c/@conf/string()}</measure>
          </Cell>
        </map>
    }
    -->
  </Alignment>
</rdf:RDF>
```

## Minimal copy-paste template

```xml
<?xml version="1.0" encoding="utf-8"?>
<rdf:RDF xmlns="http://knowledgeweb.semanticweb.org/heterogeneity/alignment"
         xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:xsd="http://www.w3.org/2001/XMLSchema#">
  <Alignment>
    <xml>yes</xml>
    <level>0</level>
    <type>??</type>
    <onto1>SOURCE_ONTOLOGY_URI</onto1>
    <onto2>TARGET_ONTOLOGY_URI</onto2>
    <map>
      <Cell>
        <entity1 rdf:resource="SOURCE_IRI"/>
        <entity2 rdf:resource="TARGET_IRI"/>
        <relation>=</relation>
        <measure rdf:datatype="http://www.w3.org/2001/XMLSchema#float">1.0</measure>
      </Cell>
    </map>
  </Alignment>
</rdf:RDF>
```

## Local Scoring: Example

From the package root, for `thinkhome-brick`:

```bash
python3   scripts/score_global.py  my-submission.rdf  --rplus   \
    tasks/global/references/_for_use/thinkhome-brick.silver.rdf  --rapprox \
    tasks/global/references/_unrepaired/thinkhome-brick.silver.unrepaired.rdf
```
