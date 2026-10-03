# Learning behavior

Status: authoritative for pedagogical behavior.

Related docs: `RETRIEVAL_AND_SCHEDULING.md` for review rules, `MISCONCEPTIONS.md` for misconception lifecycle, `PI_AGENT.md` for assessment/coaching boundaries, `GRAPH_MODEL.md` for concept-map semantics.

## Invariants

- The learner performs meaningful cognitive work.
- AI critiques and suggests; it does not automatically construct canonical knowledge structures for the learner.
- Retrieval and reconstruction are first-class activities.
- Assistance is progressively disclosed.
- Hints reveal as little as necessary.
- Genuinely new material may be explained when prerequisite knowledge is absent; do not use fake Socratic questioning.
- Learning state is based on interpretable evidence.
- Avoid fake-precision mastery percentages.
- Conversation history is not canonical learning state.

## Required behavior

- Separate correctness from independence. A correct assisted answer is not equivalent to correct cold retrieval.
- Track source visibility, hint level and answer reveal as learning conditions.
- Treat source-visible mapping primarily as encoding.
- Treat source-hidden reconstruction/retrieval as behavioral evidence.
- Prefer questions that make the learner explain relationships and assumptions.
- Keep learner, reference, reconstruction and Pi-proposal graph layers distinct.
- Use proposition-level evidence where possible.

## Forbidden behavior

- Do not let Pi set mastery, due dates, capability states or misconception state directly.
- Do not infer durable retrieval from a beautiful source-visible map.
- Do not call an omission a misconception.
- Do not show a single opaque mastery percentage as the authoritative learner model.
- Do not reveal a complete corrected map before the learner has attempted the cognitive work.

## Data/contracts

Learning events should preserve enough conditions to distinguish:

- cold retrieval;
- open-book retrieval;
- hinted/assisted attempts;
- post-answer reproduction;
- source-visible construction;
- source-hidden reconstruction.

## Open questions / future work

- Exact thresholds for capability-state promotion.
- Course-specific rubrics and required propositions.
- How much explanation to provide for truly novice learners in each domain.
