# Development

Status: authoritative for local development.

Related docs: `ARCHITECTURE.md` for system boundaries and `ROADMAP.md` for scope.

## Requirements

- Node.js 22.19 or newer;
- pnpm 12.8.1.

## Setup

```bash
pnpm install
```

The repository records required dependency build approvals and Electron Forge's hoisted pnpm layout in `pnpm-workspace.yaml`.

## Verified commands

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

`pnpm dev` starts the Electron desktop application and continues until the application is closed.

## Documentation workflow

Before substantial changes, read `docs/README.md` and the focused documents it routes to. Avoid using `research/FULL_RESEARCH_ARCHIVE.md` as routine implementation context.
