# Evaluation

Status: proposed evaluation strategy.

Related docs: `RETRIEVAL_AND_SCHEDULING.md` for scheduler metrics, `PI_AGENT.md` for LLM assessment validation, `LEARNING.md` for target behaviors.

## Principle

Proximal success is not the main metric. An AI tutor can improve within-session correctness while reducing independent cognition. Measure delayed and independent learning.

## Primary metrics

- Cold retrieval success after meaningful delays.
- Critical relationship/proposition recovery.
- Transfer success in novel contexts.
- Discrimination accuracy in unlabelled mixed sets.
- Misconception recurrence after correction.
- Highest assistance level per attempt.
- Reduction in assistance needed over time.
- Independent learning gain per minute.
- Reconstruction node/edge/proposition recovery.
- Learner confidence calibration.
- Scheduler recall calibration and Brier score.
- LLM proposition-label agreement with human annotations.
- Misconception false-positive rate.
- Feedback faithfulness to supplied evidence.

## LLM assessment validation

Create a manually annotated gold set from real course responses. Label at proposition level, not only correct/incorrect. Compare Pi output with human labels using per-class precision/recall and agreement metrics.

## Useful experiments

| Experiment | A | B | Primary outcome |
|---|---|---|---|
| Learner construction | User builds map, Pi critiques | Pi generates initial map | Delayed reconstruction + transfer |
| Edge semantics | Generic lines | Required proposition labels | Relationship retrieval |
| Mapping + retrieval | Source-visible map only | Map then source-hidden reconstruction | Delayed retention |
| Hint control | Immediate answer | Progressive hint ladder | Later unaided performance |
| Feedback structure | One-pass feedback | Diagnostic → validate → coaching | Misconception false positives |
| Interleaving | Blocked similar problems | Confusable problem types interleaved | Method-selection accuracy |
| Scheduler | Fixed interval | Learned timing | Retention/time trade-off |

## Single-user evaluation

For one learner, use matched topic sets and alternating-treatment or crossover designs. Pair concepts by approximate initial difficulty, alternate conditions, pre-test where practical and compare delayed outcomes.

## Do not implement yet

- Complex experimentation framework before events are reliable.
- Learned scheduler metrics before cold-retrieval labels are trustworthy.

## Open questions / future work

- Gold-set annotation UI.
- Human-review process for Pi assessment outputs.
- Exact delayed-test schedule.
