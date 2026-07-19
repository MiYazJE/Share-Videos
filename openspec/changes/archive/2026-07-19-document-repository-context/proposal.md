## Why

The repository currently lacks a reliable, structured source of context for its owner and for Codex sessions assisting that owner. The existing README gives only a brief product overview and contains stale or incomplete information, forcing each new AI-assisted iteration to rediscover the architecture, runtime contracts, development workflow, and known inconsistencies from the code.

This is a single-maintainer repository. Its documentation should optimize the owner's iterative workflow with Codex and OpenSpec, not introduce processes, roles, or coordination overhead intended for a multi-person team.

## What Changes

- Introduce layered Codex guidance at the repository root and within the client and server areas.
- Document the system architecture, including component boundaries, data ownership, persistence, and the room lifecycle.
- Document the active HTTP and WebSocket contracts shared by the client and server.
- Document installation, configuration, execution, testing, and validation workflows based on commands verified against the repository.
- Record known inconsistencies and technical debt separately from intended system behavior.
- Update the public README so that its product description and setup guidance agree with the deeper documentation.
- Establish lightweight maintenance rules so future owner-driven OpenSpec and Codex iterations update the relevant context documentation.
- Add a minimal repository-local skill set for recurring frontend and backend work, with explicit provenance, activation scope, and precedence rules.
- Document Conventional Commits with `frontend` and `backend` scopes and define affected-area lint and tests as the routine validation baseline, without requiring a build except for explicitly build-related work.

## Capabilities

### New Capabilities

- `repository-context-documentation`: Provides layered, discoverable, code-grounded repository context for the repository owner and Codex, covering guidance, architecture, contracts, development workflows, known issues, a small set of task-specific skills, and lightweight maintenance expectations.

### Modified Capabilities

None.

## Impact

- Adds or updates repository guidance files such as `AGENTS.md`, `client/AGENTS.md`, and `server/AGENTS.md`.
- Adds focused documentation under `docs/` and updates `README.md`.
- Adds selected third-party skill packages under `.codex/skills/`, preserving their source and license information; these are Codex instructions rather than application runtime dependencies.
- Adds a main OpenSpec capability specification describing documentation requirements.
- Does not change application behavior, HTTP routes, WebSocket events, persistence, runtime dependencies, or deployment behavior.
- Requires validation against the current React/Vite client, Node/Express/Socket.IO server, MongoDB models, tests, Docker configuration, and Codex skill discovery.
- Requires repository-specific guidance and executable behavior to take precedence over generic third-party skill recommendations.
- Documents a commit convention without adding commit tooling, hooks, or runtime dependencies and does not modify existing `package.json` scripts.
- Treats builds as targeted validation for Vite, packaging, or deployment changes rather than a general completion requirement.
