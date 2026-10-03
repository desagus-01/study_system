# Pi Learn docs

Status: authoritative documentation index.

Use this file to choose the smallest useful context before changing code. Prefer focused implementation docs over the archived long-form research report.

## Start here

- Product scope and non-goals: `PRODUCT.md`
- System boundaries and ownership: `ARCHITECTURE.md`
- Pedagogical invariants: `LEARNING.md`
- Development commands and setup: `DEVELOPMENT.md`

## Task routing for Pi agents

| Task | Read first |
|---|---|
| Database schema, migrations, persistence types | `DATA_MODEL.md`; for graph semantics also `GRAPH_MODEL.md` |
| Concept maps, edges, reconstruction graphs, Pi proposals | `GRAPH_MODEL.md`, `LEARNING.md` |
| Retrieval, reviews, scheduling, capability states | `RETRIEVAL_AND_SCHEDULING.md`, `LEARNING.md` |
| Misconception detection or lifecycle | `MISCONCEPTIONS.md`, `LEARNING.md`, `PI_AGENT.md` |
| Pi SDK integration, custom tools, agent boundaries | `PI_AGENT.md`, `PI_SKILLS.md`, `ARCHITECTURE.md` |
| Skill prompt design | `PI_SKILLS.md`, `PI_AGENT.md`, `LEARNING.md` |
| Renderer learning flows or screens | `UX_WORKFLOWS.md`, `LEARNING.md`, `PRODUCT.md` |
| Analytics, experiments, validation, gold sets | `EVALUATION.md`, `RETRIEVAL_AND_SCHEDULING.md` |
| Scope or sequencing decisions | `ROADMAP.md`, `PRODUCT.md` |
| Research justification | `research/LEARNING_SCIENCE.md`, `research/SOURCE_REVIEW.md` |

## Document statuses

- `authoritative`: implementation should follow this unless the user explicitly changes the decision.
- `proposed`: design direction, but implementation should confirm scope before relying on it.
- `future`: do not implement in the current milestone unless requested.
- `research background`: evidence and rationale, not a direct implementation contract.

## Archive

The original full research report is preserved at `research/FULL_RESEARCH_ARCHIVE.md`. Do not load it by default for routine work; use the focused docs above.
