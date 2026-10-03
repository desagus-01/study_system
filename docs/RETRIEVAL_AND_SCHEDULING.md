# Retrieval and scheduling

Status: authoritative for V0.1 principles; future scheduler sections are proposed/future.

Related docs: `LEARNING.md` for pedagogical invariants, `DATA_MODEL.md` for review tables, `MISCONCEPTIONS.md` for misconception effects, `EVALUATION.md` for scheduler metrics.

## Review units

Schedule knowledge units, not just flashcards. A `review_unit` may target:

- concept;
- relationship;
- cluster;
- misconception;
- discrimination set;
- procedure;
- transfer schema.

## Cold retrieval definition

An attempt qualifies as cold retrieval only if:

```text
source_visible == false
AND reference_graph_visible == false
AND answer_shown == false
AND max_assistance_level == 0
AND response_submitted_before_feedback == true
```

If the source is opened, a hint is requested or the answer was previously shown, the attempt can still be useful but is not cold retrieval.

## Retrieval task ladder

- Free recall / brain dump.
- Relationship explanation.
- Map reconstruction.
- Derivation reconstruction.
- Example generation.
- Contrast question.
- Unlabelled mixed problem.
- Representation shift.
- Counterexample or boundary case.

## Assistance state

The backend controls assistance level. Pi must never escalate its own permissions.

```text
requestHint(attempt):
  nextLevel = min(attempt.assistanceLevel + 1, 5)
  append `hint_requested`
  update attempt assistance level
  call Pi with allowedLevel = nextLevel
```

Opening the source sets `sourceVisible = true` and disqualifies cold retrieval.

## V0.1 scheduler

Use an auditable deterministic interval ladder before learned scheduling:

```text
1d → 3d → 7d → 14d → 30d → 60d
```

Rules:

- Cold + sound: advance interval.
- Cold + incomplete/unsound: reduce or reset interval and retry soon.
- Critical misconception: target misconception and retry soon.
- Assisted success: useful remediation, not proof of retrieval; schedule later cold retest.

## Capability vs retrievability

Do not use one opaque mastery number.

- Capability: highest behavior demonstrated.
- Current retrievability: estimated likelihood knowledge can be retrieved now.

Initial capability states:

- `UNKNOWN`
- `BUILDING`
- `CONNECTED`
- `RETRIEVABLE`
- `TRANSFERABLE`
- `FLUENT`

Promotion must be computed by deterministic rules from valid evidence.

## Future scheduler directions

Possible V1 directions:

- FSRS baseline.
- Custom half-life / MLE memory model.
- Explicit difficulty dimensions and staircase.
- Contextual bandit for task-type selection after enough clean data exists.

## Do not implement yet

- Reinforcement-learning scheduler.
- Learned scheduler before clean cold-retrieval observations exist.
- Treating assisted success as positive unaided recall label.
- LLM-chosen due dates or mastery states.

## Open questions / future work

- Exact V0.1 interval tuning.
- Thresholds for `RETRIEVABLE`, `TRANSFERABLE` and `FLUENT`.
- Scheduler behavior near known exam dates.
- How relationship/cluster observations map into future memory models.
