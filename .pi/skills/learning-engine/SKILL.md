---
name: learning-engine
description: Safely change Pi Learn retrieval, scheduling, evidence, assistance, misconceptions, reconstruction, concept relationships, or learner-state logic.
---

# Learning-engine changes

Before any meaningful change, check and state the current implementation stage from `docs/IMPLEMENTATION_PLAN.md`, then read the focused docs relevant to the change:

```text
docs/LEARNING.md
docs/RETRIEVAL_AND_SCHEDULING.md
docs/MISCONCEPTIONS.md
docs/DATA_MODEL.md
docs/GRAPH_MODEL.md
```

Also read `docs/ARCHITECTURE.md` when the change touches process boundaries, IPC, storage ownership, or Pi integration.

Preserve the deterministic-application versus LLM semantic-reasoning boundary. Keep learning state interpretable and canonical in deterministic storage and code. Do not silently invent a major pedagogical rule when behavior is unclear; identify it as a decision requiring product or research input.
