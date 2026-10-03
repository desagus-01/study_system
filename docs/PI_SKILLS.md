# Pi skills

Status: proposed prompts/contracts for the first learning skills.

Related docs: `PI_AGENT.md` for tool boundaries, `LEARNING.md` for pedagogy, `MISCONCEPTIONS.md` for diagnostic caution.

## Skill: map-critic

Purpose: critique a learner-created concept map without replacing the learner's structure.

Inputs:

- learner subgraph;
- reference propositions;
- source evidence;
- prior evidence;
- allowed assistance level.

Hard constraints:

- The learner must do the organisational work.
- Do not redraw the map or provide a complete corrected map.
- Distinguish omission from misconception.
- Cite evidence IDs for domain judgements.
- Select one highest-value gap or imprecision.

Output: structured JSON containing relationship judgements, evidence refs, gap/imprecision and one coaching action.

## Skill: hint-controller

Purpose: generate exactly one hint whose information content does not exceed a backend-specified assistance level.

Assistance levels:

| Level | Allowed |
|---:|---|
| 0 | Ask learner to attempt/reconsider |
| 1 | Metacognitive cue |
| 2 | Point toward relevant concept/relationship |
| 3 | Name specific principle/rule |
| 4 | Show one partial worked step |
| 5 | Full explanation/worked solution |

Hard constraints:

- Never exceed `ALLOWED_LEVEL`.
- Never repeat a prior hint verbatim.
- At levels 1-3, do not give the final result.
- Ground domain claims in supplied evidence.
- Return one hint, not a mini-lesson.

Output should include private metadata: `level_used`, `answer_leak_risk` and `evidence_refs`.

## Skill: teachback-assessor

Purpose: evaluate a learner explanation against source-grounded propositions and known misconceptions.

Hard constraints:

- Do not write feedback in the diagnostic pass.
- For each expected proposition, label: entailed, partially entailed, contradicted, not addressed or ambiguous.
- Quote minimal learner spans for non-`not_addressed` judgements.
- Missing idea is not a misconception.
- Ambiguity should produce one discriminating follow-up question.
- All domain judgements require source evidence IDs.

Output: propositions, misconception candidates, follow-up question and ungradable reasons.

## Skill: challenge-generator

Purpose: generate source-grounded retrieval, discrimination and transfer tasks to backend-specified constraints.

Inputs include a deterministic difficulty vector:

- target concepts;
- task family;
- cue explicitness;
- context novelty;
- representation shift;
- integration count;
- distractor similarity;
- max steps;
- forbidden terms;
- assessment goal.

Hard constraints:

- Use only supplied source evidence for assessable domain content.
- Do not reveal target concept names when cue explicitness forbids them.
- Do not assess the learner response.
- Return ambiguity risks.

Output: learner-facing task, hidden expected propositions, hidden solution outline, evidence refs and reasons the task satisfies each difficulty dimension.

## Do not implement yet

- Skill that generates a full canonical map for the learner to study.
- Skill that directly writes database state.
- Challenge generator without later verifier if tasks become high stakes.

## Open questions / future work

- Exact JSON schemas.
- Skill file locations and prompt assets.
- Whether V0.1 needs a separate hint-leakage verifier.
