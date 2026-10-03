# Graph model

Status: authoritative for concept-map semantics.

Related docs: `DATA_MODEL.md` for storage, `LEARNING.md` for pedagogical invariants, `UX_WORKFLOWS.md` for user interactions.

## Purpose

Pi Learn should not treat “the concept map” as one graph. It maintains distinct layers so the learner's model remains the central artefact.

## Graph layers

| Layer | Owner | Purpose |
|---|---|---|
| Learner graph | User | The learner's present organisation of the subject |
| Reference graph | Backend/course model | Source-grounded critical propositions and acceptable relationships |
| Reconstruction graph | User | A source-hidden retrieval attempt |
| Proposal overlay | Pi | Suggested concepts, relationships or critique targets shown as noncanonical proposals |

Pi proposals are ghost objects until accepted. The learner or backend must commit canonical changes.

## Node kinds

Start with one stable concept identity and a modest `kind` field:

- `concept`
- `principle`
- `procedure`
- `representation`
- `problem_family`
- `example`
- `reference_detail`

`reference_detail` should normally be visually collapsed so reference material does not overwhelm conceptual structure.

## Relationship rules

Edges are more important than nodes. A relationship must be a readable proposition, not just a line.

Required edge properties:

- source concept;
- target concept;
- direction;
- `relation_type`;
- `proposition_text`;
- optional conditions;
- optional importance;
- source provenance when available.

`related_to` may exist only as a temporary draft state.

## Initial relation taxonomy

- `is_a`
- `part_of`
- `requires`
- `enables`
- `causes_or_influences`
- `derived_from`
- `transforms_to`
- `applies_to`
- `contrasts_with`
- `analogous_to`

## Visual grouping

Visual grouping is layout state, not ontology. A cluster drawn around “estimation methods” may be a thinking aid and should not automatically rewrite semantic relationships.

## Forbidden behavior

- Do not make an AI-generated graph the object the learner studies by default.
- Do not silently merge proposal overlays into learner graphs.
- Do not store final relationships without proposition text.
- Do not treat layout groups as semantic truth.

## Open questions / future work

- Exact graph comparison algorithm for reconstruction scoring.
- Whether V1 adds Cytoscape.js for headless graph analysis.
- How to represent equivalence between learner wording and reference propositions.
