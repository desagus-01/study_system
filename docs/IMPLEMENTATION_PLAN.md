# Implementation plan

Status: proposed working plan.

Related docs:

- `README.md`
- `PRODUCT.md`
- `ROADMAP.md`
- `ARCHITECTURE.md`
- `DATA_MODEL.md`
- `GRAPH_MODEL.md`
- `LEARNING.md`
- `RETRIEVAL_AND_SCHEDULING.md`
- `MISCONCEPTIONS.md`
- `PI_AGENT.md`
- `PI_SKILLS.md`
- `UX_WORKFLOWS.md`
- `EVALUATION.md`

## Purpose

This document expands `ROADMAP.md` into a developer-facing execution sequence. `ROADMAP.md` remains authoritative for milestone intent and scope; this file explains how implementation should proceed stage by stage.

Revise this plan as implementation evidence accumulates. If the code, user testing or technical constraints contradict this sequence, update the plan explicitly rather than silently drifting.

## Current implementation stage

Current stage: **Stage 2 — Canonical study model**.

Agents doing implementation work must state this current implementation stage in their working plan and final summary. When implementation completes enough exit criteria to move forward, update this section in the same change. Do not silently continue under an outdated stage label.

The central architecture rule still applies throughout: the deterministic application owns truth, state, evidence, scheduling and learner modelling. Pi/LLMs provide constrained semantic help such as critique, hints, assessment, proposals and task wording.

## Current coding state

At the time this plan was created:

- the working tree was clean on `master`;
- source code existed only in the shared IPC/type layer:
  - `src/shared/ipc.ts`;
  - `src/shared/schemas.ts`;
  - `src/shared/types.ts`;
- Electron Forge configuration expected entry files that were not yet implemented:
  - `src/main/main.ts`;
  - `src/preload/preload.ts`;
  - `src/renderer/...`;
- no tests existed;
- no `node_modules` directory existed;
- no `pnpm-lock.yaml` existed;
- package scripts existed for:
  - `dev`;
  - `test`;
  - `typecheck`;
  - `build`;
- documentation was ahead of implementation and already defined the intended architecture, learning constraints and product scope.

## Stage summary

High-level stages:

1. Foundation / V0
2. Canonical study model
3. Manual learner workspace
4. Learning evidence engine
5. First learning loop
6. Constrained Pi coaching
7. Misconceptions and learner model
8. Challenge generation and transfer
9. Evaluation, hardening, and V1 adaptation

Dependency chain:

```text
Runnable shell
  → local canonical data
  → manual study workspace
  → learning events and attempts
  → graph workspace
  → reconstruction
  → review scheduling
  → constrained Pi help
  → assessment and misconceptions
  → challenge generation
  → interpretable learner model
  → analytics
  → adaptive scheduling
  → hardening and polish
```

## Stage 1: Foundation / V0

Goal: create a runnable, verified Electron app foundation.

Deliverables:

- Electron main process;
- preload script;
- minimal React renderer;
- typed `getSystemStatus()` IPC using the existing shared contract;
- status screen reporting Electron, preload, SQLite and Pi runtime status;
- SQLite bootstrap in the main process;
- Pi runtime status detection;
- initial tests for shared schemas/status contracts and database bootstrap where practical;
- verified `pnpm` commands:
  - `pnpm install`;
  - `pnpm typecheck`;
  - `pnpm test`;
  - `pnpm build`;
  - `pnpm dev`.

Exit criteria:

- the app launches;
- the renderer can call the main process only through preload;
- SQLite status is reported;
- Pi status is reported as available, not configured or error;
- typecheck, test and build commands are verified and documented.

Why this stage:

- the current repo is scaffolded but not runnable;
- all later work depends on the Electron main/preload/renderer boundary being real;
- local storage must exist before canonical study state exists;
- this directly matches V0 scope: secure local shell, renderer/main/preload separation, local storage foundation, Pi runtime status and verified commands.

## Stage 2: Canonical study model

Goal: implement the first durable study domain model.

Deliverables:

- database migration/bootstrap mechanism;
- `courses`;
- `sources`;
- `source_segments`;
- `concepts`;
- `concept_versions`;
- `relationships`;
- `relationship_versions`;
- `evidence_refs`;
- repository/service functions in the main process;
- Zod schemas and TypeScript types for IPC-facing payloads;
- typed IPC operations for explicit actions;
- tests for schema initialization, validation and versioning.

Exit criteria:

- course, source, source segment, concept and relationship data can be persisted;
- concept updates create versions instead of overwriting history;
- relationship updates create versions instead of overwriting history;
- evidence refs can be attached;
- renderer code has no direct database access;
- no generic SQL IPC exists.

Why this stage:

- the learner's model is the central product artefact;
- concepts and proposition-labelled relationships are foundational for maps, reconstruction, review, assessment and Pi critique;
- source provenance must exist before evidence-grounded Pi feedback or assessment.

## Stage 3: Manual learner workspace

Goal: create a simple usable UI for building the learner's model manually.

Deliverables:

- course selection/opening UI;
- source creation UI;
- basic source segment viewer;
- concept create/edit/list UI;
- relationship create/edit/list UI;
- evidence attachment UI;
- relationship form requiring:
  - source concept;
  - target concept;
  - relation type;
  - proposition text;
- renderer state kept noncanonical, with all canonical changes routed through typed IPC.

Exit criteria:

- a learner can manually create the basic study artefacts;
- every relationship has a readable proposition, not just a line;
- all canonical changes go through typed IPC;
- the renderer has no direct filesystem or database access.

Why this stage:

- it validates the data model before graph-editor complexity;
- it keeps the learner responsible for primary knowledge organisation;
- a list/form workspace is easier to debug than a graph editor.

## Stage 4: Learning evidence engine

Goal: make meaningful learning actions observable, append-only and interpretable.

Deliverables:

- `study_sessions`;
- `learning_events`;
- `task_templates`;
- `task_instances`;
- `attempts`;
- `attempt_evidence`;
- deterministic attempt lifecycle:
  - start attempt;
  - open source;
  - request hint;
  - submit response;
  - complete assessment;
- recording of learning conditions:
  - source visibility;
  - reference graph visibility;
  - answer reveal;
  - assistance level;
  - response submitted before feedback;
  - target type/id;
- deterministic cold retrieval classification;
- tests for event immutability and cold/source-visible/assisted classification.

Exit criteria:

- learning events are append-only;
- attempts record source visibility and assistance conditions;
- cold retrieval is computed deterministically;
- source-visible and assisted attempts are not mislabeled as cold retrieval.

Why this stage:

- learning state must be evidence-based and interpretable;
- scheduling and assessment are unreliable without clean events;
- the app must distinguish cold retrieval, open-book retrieval, hinted attempts, post-answer reproduction and source-visible construction before making learner-state claims.

## Stage 5: First learning loop

Goal: support learner-created maps, source-hidden reconstruction and deterministic review.

Deliverables:

- React Flow / XYFlow graph workspace;
- concept nodes;
- labelled directed relationship edges;
- edge creation requiring relation type, direction and proposition text;
- `map_layout_state`, separate from semantic graph truth;
- reconstruction mode with source/reference hidden;
- `graph_snapshots`;
- reconstruction graph stored separately from learner/reference graphs;
- deterministic reconstruction comparison for recovered/missing concepts and relationships;
- `review_units`;
- `review_observations`;
- deterministic interval ladder:
  - 1 day;
  - 3 days;
  - 7 days;
  - 14 days;
  - 30 days;
  - 60 days;
- review queue UI.

Exit criteria:

- the learner can build a map as the primary study artefact;
- layout state does not mutate graph semantics;
- the learner can reconstruct from memory;
- reconstruction creates valid learning evidence;
- review units are scheduled deterministically from evidence.

Why this stage:

- this turns the app into a real study system rather than only a data-entry tool;
- reconstruction is a strong source of independent learning evidence;
- deterministic scheduling should come before learned scheduling;
- graph, reconstruction and review form the first coherent learning loop.

## Stage 6: Constrained Pi coaching

Goal: integrate Pi as a structured semantic helper, not a state owner.

Deliverables:

- main-process Pi integration layer;
- Pi configuration/status handling;
- `agent_runs` table;
- structured output validation with Zod;
- deterministic context builders;
- `hint-controller` skill;
- backend-owned assistance levels 0-5;
- teach-back assessor diagnostic pass;
- separate coaching pass after validated diagnosis;
- map critic skill;
- proposal overlays for noncanonical Pi suggestions;
- accept/reject proposal flow through normal backend validation/versioning.

Exit criteria:

- Pi cannot mutate canonical state directly;
- Pi cannot set due dates, mastery, capability or misconception state;
- Pi outputs are validated before use;
- agent runs are auditable;
- hints respect backend-owned assistance level;
- map proposals remain noncanonical until explicitly accepted.

Why this stage:

- Pi should be added after deterministic state, attempts and evidence exist;
- structured constraints preserve the core architecture;
- hinting, assessment and critique are useful only when their conditions and evidence can be recorded.

## Stage 7: Misconceptions and learner model

Goal: add cautious misconception tracking and interpretable learner-state summaries.

Deliverables:

- `misconceptions`;
- `misconception_occurrences`;
- lifecycle states:
  - candidate;
  - confirmed;
  - resolved;
  - recurring;
- omission-vs-misconception safeguards;
- misconception-targeted review units;
- deterministic capability states:
  - `UNKNOWN`;
  - `BUILDING`;
  - `CONNECTED`;
  - `RETRIEVABLE`;
  - `TRANSFERABLE`;
  - `FLUENT`;
- evidence-backed learner model UI.

Exit criteria:

- omissions do not create misconception records;
- explicit contradiction evidence can create candidates;
- backend rules own lifecycle transitions;
- Pi may propose evidence but does not own misconception state;
- learner model summaries are interpretable and avoid fake mastery percentages.

Why this stage:

- misconception tracking requires proposition-level assessment evidence;
- implementing it earlier would encourage false positives;
- capability state should summarize accumulated evidence, not replace it with an opaque score.

## Stage 8: Challenge generation and transfer

Goal: generate retrieval, discrimination and transfer tasks under backend constraints.

Deliverables:

- `challenge-generator` skill;
- deterministic difficulty vector including:
  - target concepts;
  - task family;
  - cue explicitness;
  - context novelty;
  - representation shift;
  - integration count;
  - distractor similarity;
  - max steps;
  - forbidden terms;
  - assessment goal;
- generated `task_instances`;
- hidden expected propositions;
- hidden solution outlines;
- ambiguity-risk metadata;
- discrimination tasks;
- transfer tasks;
- interleaving foundations.

Exit criteria:

- the backend chooses targets and constraints;
- Pi generates task surface forms and supporting structured metadata only;
- generated tasks are source-grounded and schema-validated;
- generated task use feeds the same attempt/evidence/review pipeline.

Why this stage:

- challenge generation depends on stable sources, concepts, relationships, assessments and review units;
- transfer work should come after the basic retrieval loop;
- backend-owned constraints prevent Pi from silently controlling curriculum or difficulty.

## Stage 9: Evaluation, hardening, and V1 adaptation

Goal: make the app measurable, safe and ready for adaptive improvements.

Deliverables:

- local analytics views for:
  - cold retrieval success;
  - assistance trends;
  - reconstruction recovery;
  - relationship recovery;
  - transfer success;
  - misconception recurrence;
  - review schedule performance;
- data export for local analysis;
- gold-set format for Pi assessment validation;
- proposition-label agreement tracking;
- misconception false-positive tracking;
- feedback faithfulness checks;
- source ingestion improvements;
- local source search;
- backup/export/import;
- packaged app verification;
- scheduler evaluation;
- FSRS/custom scheduler comparison;
- optional Pi isolation if direct SDK embedding proves insufficient.

Exit criteria:

- learning outcomes can be inspected from event/attempt/assessment history;
- local data can be backed up and restored;
- packaging works;
- adaptive scheduling is attempted only after enough clean cold-retrieval evidence exists;
- any added Pi isolation is justified by observed need.

Why this stage:

- advanced adaptation needs reliable event history;
- hardening matters once real learner data exists;
- scheduler changes should be compared against the deterministic baseline;
- Pi isolation adds complexity and should not be introduced before it is needed.

## Do not start yet

Do not implement these before their prerequisites are met or unless an explicit product decision changes scope:

- learned scheduler before clean cold-retrieval observations;
- reinforcement-learning policy;
- autonomous tutor agent;
- Pi-owned database writes;
- raw SQL tools exposed to Pi;
- Pi-owned mastery, due dates, capability states or misconception states;
- single opaque mastery percentage;
- chat-first product direction;
- AI-generated full concept map as the default workflow;
- vector database, LangChain or LlamaIndex;
- REST/GraphQL/microservice backend;
- RPC/container Pi isolation before direct SDK integration proves insufficient.

## How to use this plan

- For implementation sequencing, read this document with `ROADMAP.md`.
- Before implementation work, check and state the `Current implementation stage` above.
- For each stage, also read the focused docs listed in `README.md` before coding.
- Split stages into smaller tickets as needed.
- Check the active stage's exit criteria before moving to the next stage.
- If work completes enough exit criteria to change stages, update `Current implementation stage` in this document.
- Keep changes small and coherent.
- If implementation evidence contradicts this plan, revise the plan explicitly.
- `ROADMAP.md` remains the milestone authority; this file remains the staged build plan.
