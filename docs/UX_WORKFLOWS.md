# UX workflows

Status: proposed user-facing workflow direction.

Related docs: `PRODUCT.md` for scope, `GRAPH_MODEL.md` for map semantics, `LEARNING.md` for pedagogy, `PI_AGENT.md` for coach behavior.

## Main workspace

The map/source/task should be visually dominant; chat is supporting UI.

Suggested layout:

```text
SOURCE | MY MODEL | COACH
```

The learner works on the artefact while Pi asks targeted questions, critiques relationships and provides permitted hints.

## Relationship creation

Dragging an edge should require the learner to complete a proposition:

```text
[source concept]
  -- relation type + proposition text -->
[target concept]
```

The UI should ask for relation type and “in your own words” text before committing the relationship.

## Proposal overlay

Visual meanings:

- solid node/edge: learner committed;
- ghost/dashed edge: Pi proposal;
- warning badge: Pi critique;
- source icon: evidence attached;
- clock icon: retrieval due;
- recurrence marker: misconception reappeared.

Clicking a proposal should offer:

- why did Pi suggest this?
- try to explain it myself;
- show source evidence;
- accept;
- reject.

## Reconstruction mode

Reconstruction mode hides source and reference graph. The learner reconstructs concepts/relationships from memory. The backend records source visibility, assistance level and submission conditions.

After submission, the backend may compute structural differences, but Pi should usually turn the highest-value difference into another cognitive act before revealing a full corrected report.

## Teach-back mode

The learner explains a target concept/cluster in prose or speech. Pi assesses against expected propositions, known misconceptions and source evidence. The UI should show:

- clearly explained propositions;
- worth strengthening;
- possible misconception with cautious language;
- next follow-up question.

Do not display an opaque mastery percentage.

## Review queue

Review UI should distinguish due target type:

- concept;
- relationship;
- cluster;
- misconception;
- discrimination set;
- transfer schema.

It should also distinguish cold, source-visible and assisted attempts.

## Forbidden behavior

- Do not make chat the primary study artefact.
- Do not add an “AI organise my whole lecture” primary workflow.
- Do not show complete corrections before the learner has attempted retrieval when the mode is intended to be cold.

## Open questions / future work

- Exact React Flow components.
- Source viewer design.
- Audio recording/transcription for teach-back.
- How to progressively reveal reconstruction diffs.
