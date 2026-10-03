# Data model

Status: proposed canonical schema direction; implement incrementally by milestone.

Related docs: `GRAPH_MODEL.md` for graph semantics, `LEARNING.md` for event semantics, `MISCONCEPTIONS.md` for misconception lifecycle, `RETRIEVAL_AND_SCHEDULING.md` for review units.

## Purpose

The database records canonical learning state and evidence. It should be auditable enough to distinguish cold retrieval, assisted success, source-visible construction and misconception recurrence.

## Invariants

- Prefer immutable/versioned records over overwriting learning history.
- Store Pi outputs as proposals, assessments or agent-run records, not unquestioned truth.
- Keep source provenance separate and explicit.
- Store learning events append-only.

## Core graph tables

```text
concepts
id UUID PK
course_id FK
kind enum
canonical_label text
status active | merged | archived
created_by user | import | pi_proposal
current_version_id FK
created_at timestamp

concept_versions
id UUID PK
concept_id FK
title text
user_definition text nullable
scope text nullable
importance smallint nullable
visual_anchor_id FK nullable
supersedes_id FK nullable
created_at timestamp

relationships
id UUID PK
course_id FK
source_concept_id FK
target_concept_id FK
relation_type enum
status draft | confirmed | rejected
created_by user | import | pi_proposal
current_version_id FK
created_at timestamp

relationship_versions
id UUID PK
relationship_id FK
proposition_text text
conditions json nullable
importance smallint nullable
supersedes_id FK nullable
created_at timestamp
```

## Provenance

```text
evidence_refs
id UUID PK
entity_type concept | relationship | rubric_claim
entity_id UUID
source_segment_id FK
support_type supports | contradicts | contextualises
created_by user | pi | import
verified boolean
```

## Learning events

```text
learning_events
id UUID PK
user_id FK
course_id FK
session_id FK
event_type text
target_type concept | relationship | cluster | misconception
target_id UUID
occurred_at timestamp
source_visible boolean
assistance_level 0..5
task_instance_id FK nullable
payload_json json
```

Important event types include:

- `attempt_started`
- `source_opened`
- `map_edge_created`
- `map_edge_changed`
- `hint_requested`
- `response_submitted`
- `assessment_completed`
- `misconception_observed`
- `misconception_corrected`
- `reconstruction_submitted`
- `review_scheduled`

## Misconceptions

See `MISCONCEPTIONS.md` for rules.

```text
misconceptions
id UUID PK
course_id FK
concept_id FK nullable
canonical_statement text
contradicts_claim_id FK nullable
severity minor | material | critical
state candidate | confirmed | resolved | recurring
first_seen_at timestamp
last_seen_at timestamp
resolved_at timestamp nullable

misconception_occurrences
id UUID PK
misconception_id FK
attempt_id FK
student_span_start integer
student_span_end integer
student_text text
assessor_confidence float
human_verified boolean nullable
occurred_at timestamp
```

## Supporting tables

- `source_segments`: immutable chunks/page anchors for evidence grounding.
- `study_sessions`: session/mode/course boundaries.
- `task_templates`: deterministic task definitions.
- `task_instances`: generated prompt and difficulty configuration.
- `attempts`: learner responses and attempt conditions.
- `attempt_evidence`: proposition-level LLM assessment.
- `review_units`: schedulable concept/relationship/cluster/misconception targets.
- `review_observations`: cold-retrieval outcomes used by the scheduler.
- `graph_snapshots`: immutable map/reconstruction/reference versions.
- `map_layout_state`: position, grouping, collapsed state and visual emphasis.
- `agent_runs`: prompt/skill/model versions, input hashes and structured outputs.

## Forbidden behavior

- Do not overwrite past attempts or event history.
- Do not store an LLM-generated `mastery` score as canonical state.
- Do not let generic chat history substitute for structured events.
- Do not give Pi a raw SQL/write-database path.

## Open questions / future work

- Exact migration implementation.
- UUID generation strategy.
- JSON schema details for task payloads and assessment evidence.
- How graph equivalence is represented for reconstruction comparisons.
