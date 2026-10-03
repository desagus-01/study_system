# Pi Learn agent instructions

## Philosophy

Write straightforward TypeScript that a Python or R programmer can review quickly. Prefer small functions, descriptive names, explicit types, early returns, obvious data flow, plain SQL, simple modules, and direct implementations.

Avoid advanced generics unless necessary, type-level cleverness, metaprogramming, unnecessary classes, enterprise patterns, premature abstractions, wrappers, dependencies, and framework proliferation. Inspect existing patterns before adding new ones. Make the smallest coherent change.

## Architecture

**The deterministic application owns truth and state. Pi/LLMs own semantic reasoning.**

Deterministic code owns database state, learning evidence, retrieval history, review scheduling, assistance levels, misconceptions, session state, concept relationships, and reconstruction comparisons. Pi/LLMs may provide explanations, semantic critique and diagnosis, hint wording, teach-back interpretation, and transfer or interleaved questions.

Never make conversation history canonical state. Never let an LLM arbitrarily assign or mutate a fake mastery score. See `docs/ARCHITECTURE.md` and `docs/LEARNING.md`.

## Working agreement

For substantial work: inspect relevant code and docs, plan before broad changes, implement the smallest coherent solution, run relevant tests and type checks, inspect the final diff, and report meaningful architectural decisions. Do not silently add significant dependencies or architecture. Start with `docs/README.md` to choose the smallest relevant documentation set.

## Documentation routing

- Product/scope work: read `docs/PRODUCT.md` and `docs/ROADMAP.md`.
- Architecture, IPC, storage, or process-boundary work: read `docs/ARCHITECTURE.md`.
- Database/schema work: read `docs/DATA_MODEL.md`; for concept-map semantics also read `docs/GRAPH_MODEL.md`.
- Learning-engine work: read `docs/LEARNING.md`, `docs/RETRIEVAL_AND_SCHEDULING.md`, and `docs/MISCONCEPTIONS.md` as relevant.
- Pi SDK/tool/agent work: read `docs/PI_AGENT.md` and `docs/PI_SKILLS.md`.
- UI learning workflows: read `docs/UX_WORKFLOWS.md` and `docs/LEARNING.md`.
- Evaluation/analytics work: read `docs/EVALUATION.md`.
- Research/citation questions: consult `docs/research/LEARNING_SCIENCE.md`, `docs/research/SOURCE_REVIEW.md`, or the archive at `docs/research/FULL_RESEARCH_ARCHIVE.md`.
