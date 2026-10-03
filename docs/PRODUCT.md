# Pi Learn product

Status: authoritative for product scope.

Related docs: `ARCHITECTURE.md` for system boundaries, `LEARNING.md` for pedagogical rules, `ROADMAP.md` for milestone scope.

## Purpose

Pi Learn is a local-first Linux desktop study environment. Its central artefact is the learner's developing model of a subject, not a chat transcript. Pi is the coach beside that artefact.

AI should increase the learner's cognition rather than perform important cognitive work for them.

## Product principles

- The learner creates the primary organisation of knowledge.
- Pi critiques, diagnoses, hints, explains and generates tasks within backend permissions.
- Retrieval, reconstruction, teach-back, interleaving and transfer matter as much as initial encoding.
- The app should make source visibility, hints, answer reveal and assistance level explicit.
- Learning state should be evidence-based and interpretable, not a fake-precise mastery percentage.

## Current milestone: V0

V0 is only a minimal technical foundation:

- secure local desktop shell;
- canonical local storage;
- narrow renderer-to-main boundary;
- Pi runtime status.

V0 is not yet a full study application. It does not include source ingestion, course management, concept maps, tutoring, retrieval scheduling or learning workflows unless explicitly requested.

## Near milestone: V0.1

V0.1 may introduce the first coherent study loop:

- sources and source segments;
- learner-created concepts and labelled relationships;
- immutable learning events;
- reconstruction mode;
- teach-back mode;
- basic review queue;
- Pi coaching panel;
- evidence-grounded assessment;
- deterministic cold-vs-assisted attempt tracking.

## Non-goals unless explicitly requested

- Chat-first tutor as the primary product.
- AI-generated full concept maps as the default workflow.
- Autonomous database-writing agent tools.
- Reinforcement-learning scheduling.
- Vector database, LangChain, LlamaIndex, REST backend, GraphQL backend or microservices.
- Single opaque `mastery = 82%` style learner model.

## Open questions / future work

- Exact V0.1 source-ingestion pipeline.
- Migration strategy after initial SQLite schema stabilises.
- Whether V1 adopts FSRS, a custom half-life model or both.
- How much agent isolation is necessary beyond direct Pi SDK embedding.
