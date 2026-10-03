# Architecture

Status: authoritative for system boundaries.

Related docs: `PRODUCT.md` for scope, `LEARNING.md` for learning-state ownership, `PI_AGENT.md` for Pi tool boundaries, `DATA_MODEL.md` for persistence.

## Intended shape

```text
Electron desktop application

Renderer: React + TypeScript
        │
        │ narrow typed IPC
        ▼
Preload
        │
        ▼
Electron main process
        │
        ├── SQLite
        ├── filesystem
        ├── deterministic learning engine
        └── Pi SDK
```

Pi Learn runs locally; it does not need a web backend. Intended technologies are Electron, React, TypeScript, Vite, pnpm, SQLite, `better-sqlite3`, Zod, Vitest, React Flow / XYFlow and the Pi SDK.

## Ownership rule

The deterministic application owns truth and state. Pi/LLMs own semantic reasoning.

The application owns:

- database state;
- concept and relationship identity/versioning;
- source visibility;
- assistance levels;
- attempt conditions;
- review scheduling;
- capability/retrievability computation;
- misconception lifecycle;
- reconstruction comparisons;
- learning-event history.

Pi may provide:

- semantic critique;
- proposition-level diagnosis;
- hint wording;
- teach-back interpretation;
- challenge surface forms;
- explanations within allowed assistance level;
- proposals that the backend validates and the learner may accept/reject.

Pi must not own canonical state.

## Electron separation

### Main process

Owns SQLite, filesystem access, Pi SDK integration, deterministic learning logic and privileged desktop functionality.

### Renderer

Owns UI, interaction and visual state. It must not have raw Node.js, filesystem or database access.

### Preload

Exposes a narrow typed API between renderer and main. IPC handlers validate renderer input and expose specific operations rather than generic messaging.

## Do not implement yet

Do not add these without an explicit product decision:

- FastAPI, Express, REST APIs or GraphQL;
- Docker/Postgres/microservices;
- Rust/Tauri migration;
- vector databases;
- LangChain or LlamaIndex;
- Redux, Prisma or Drizzle;
- Pi RPC isolation before direct SDK embedding proves insufficient.

## Open questions / future work

- Exact source-ingestion and storage pipeline.
- Migration format beyond the first schema.
- Packaging/release strategy.
- Whether V1 hardens Pi behind RPC/container isolation.
