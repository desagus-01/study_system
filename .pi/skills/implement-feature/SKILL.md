---
name: implement-feature
description: Implement a meaningful Pi Learn feature while preserving established patterns and scope. Use for non-trivial feature work.
---

# Implement a feature

Follow this workflow:

```text
read relevant docs
        ↓
inspect existing implementation
        ↓
understand current patterns
        ↓
implement smallest coherent change
        ↓
test
        ↓
typecheck
        ↓
inspect diff
        ↓
summarize important decisions
```

Keep the change focused. Do not perform unrelated cleanup while implementing a feature.

## Documentation checklist

Start with `docs/README.md`, then load the smallest relevant set:

- Product/scope feature: `docs/PRODUCT.md`, `docs/ROADMAP.md`.
- Architecture/IPC/storage boundary: `docs/ARCHITECTURE.md`.
- Database/schema: `docs/DATA_MODEL.md`; for maps also `docs/GRAPH_MODEL.md`.
- Retrieval/scheduling/evidence/assistance: `docs/LEARNING.md`, `docs/RETRIEVAL_AND_SCHEDULING.md`.
- Misconceptions: `docs/MISCONCEPTIONS.md`.
- Pi SDK/tools/skills: `docs/PI_AGENT.md`, `docs/PI_SKILLS.md`.
- UI learning flow: `docs/UX_WORKFLOWS.md`, `docs/LEARNING.md`.
- Evaluation/analytics: `docs/EVALUATION.md`.
