# Misconceptions

Status: authoritative for misconception semantics and lifecycle.

Related docs: `LEARNING.md` for pedagogical invariants, `DATA_MODEL.md` for tables, `PI_AGENT.md` for assessment rules.

## Core rule

An omission is not a misconception.

If a learner fails to mention independence when explaining MLE, record a missing or unaddressed critical proposition. If the learner says likelihood is `P(theta | data)` under a non-Bayesian MLE context, that may be a misconception because it explicitly contradicts the target proposition.

## Required evidence

Promote a misconception only when there is:

- an explicit contradictory learner span; or
- strong repeated evidence across attempts; or
- human verification.

Ambiguous writing should produce a discriminating follow-up question, not an immediate correction or confirmed misconception.

## Lifecycle

States:

- `candidate`: possible misconception observed.
- `confirmed`: sufficient evidence or verification exists.
- `resolved`: learner has corrected it with adequate evidence.
- `recurring`: a resolved or previously observed misconception reappears.

## Assessment behavior

Pi assessment should return:

- minimal learner span;
- proposition contradicted;
- evidence refs;
- confidence;
- whether this is an omission, contradiction or ambiguity;
- one follow-up question when ambiguous.

The backend validates and stores lifecycle changes. Pi must not directly change the lifecycle state.

## User-facing behavior

Prefer cautious language for candidates:

- “Possible misconception”
- “Pi is not yet certain this is what you meant”
- “Follow-up question”

Do not overstate uncertain diagnosis.

## Forbidden behavior

- Do not flag missing coverage as misconception.
- Do not infer mental state from writing style.
- Do not confirm misconceptions without contradictory evidence.
- Do not allow Pi to mutate canonical misconception state directly.

## Open questions / future work

- Thresholds for repeated evidence.
- Human-review workflow.
- Misconception-specific review tasks and recurrence metrics.
