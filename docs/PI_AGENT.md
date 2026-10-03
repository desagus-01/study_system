# Pi agent integration

Status: authoritative for Pi/application boundary.

Related docs: `ARCHITECTURE.md` for process ownership, `PI_SKILLS.md` for skill prompts, `LEARNING.md` for pedagogy, `DATA_MODEL.md` for stored outputs.

## Purpose

Pi is a semantically powerful but non-authoritative worker. The backend constructs context, calls Pi for reasoning or wording, validates structured output and stores accepted evidence/proposals.

## Assessment-first pipeline

Use two phases for important learner responses:

```text
learner response
  → deterministic context builder
  → Pi diagnostic pass
  → structured evidence
  → backend validation
  → Pi coaching pass
  → one pedagogical intervention
```

Do not combine diagnosis, grading, domain recall and tutoring into one uncontrolled free-form answer.

## Allowed backend tool shape

Read tools may expose:

- `get_active_course()`
- `get_current_task()`
- `get_source_segments(ids)`
- `search_source(query, course_id)`
- `get_concept(id)`
- `get_relationship_neighbourhood(id, depth)`
- `get_reference_propositions(task_id)`
- `get_recent_learning_evidence(target_id)`
- `get_known_misconceptions(target_id)`
- `get_current_assistance_level()`

Proposal/assessment tools may expose:

- `submit_assessment(...)`
- `propose_relationship(...)`
- `propose_concept(...)`
- `propose_misconception(...)`
- `submit_generated_challenge(...)`

These tools should write proposals or assessment records for backend validation, not mutate canonical learning state directly.

## Forbidden tools

Do not expose these to Pi:

- `execute_sql()`
- `write_database()`
- `delete_concept()`
- `change_mastery()`
- `set_due_date()`
- `rewrite_graph()`
- `mark_learned()`
- unrestricted filesystem access;
- shell access for learning workflows.

## Structured assessment rules

Pi assessment should return evidence-grounded records with:

- expected proposition or claim id;
- status: supported, partially supported, contradicted, ambiguous or not addressed;
- minimal learner span when applicable;
- source evidence refs;
- confidence;
- misconception candidate only for explicit contradiction or strong evidence.

Missing propositions are not misconception candidates.

## Session orchestration

The backend selects mode and target. Pi may recommend a useful next task, but the application decides eligibility from due reviews, course priorities and evidence state.

## Do not implement yet

- General autonomous agent with broad project tools inside the app.
- Pi directly mutating SQLite.
- Pi setting scheduler state, mastery or capability.
- Agent isolation via RPC/container before direct SDK integration needs hardening.

## Open questions / future work

- Exact Zod schemas for each structured output.
- Agent-run provenance fields.
- Whether high-stakes hints/challenges need verifier passes in V0.1 or V1.
