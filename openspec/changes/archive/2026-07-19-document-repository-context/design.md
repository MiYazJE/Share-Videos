## Context

Share-Videos is split into a React/Vite client and a Node.js/Express server. They communicate through HTTP and Socket.IO, while MongoDB persists users and saved playlists. Room state—including participants, playback, the shared queue, and chat—is held in server memory. The current README does not expose these boundaries or the complete development workflow, and some of its setup and roadmap statements no longer agree with the code.

The repository has a single maintainer who uses Codex and OpenSpec to iterate on it. The primary consumers of the new context are therefore the owner and future AI-assisted sessions, not a team of contributors. Context must be discoverable at session start, concise enough to load routinely, and detailed enough to prevent repeated source-code archaeology. At the same time, volatile implementation inventories must not overwhelm stable architectural guidance or create team-process overhead that provides no value to the owner.

## Goals / Non-Goals

**Goals:**

- Give Codex an accurate repository-wide orientation before it changes code.
- Help the owner recover context and iterate safely across separate Codex and OpenSpec sessions.
- Provide scoped guidance for client and server work without making the root context excessively large.
- Describe architecture, state ownership, persistence boundaries, runtime flows, and external integrations from the current code.
- Make HTTP and WebSocket contracts explicit and traceable to both sides of each integration.
- Provide verified development commands and configuration guidance.
- Separate intended behavior from suspected defects, stale code, and technical debt.
- Define an update discipline that keeps context aligned with future changes.
- Provide a small, repository-local set of skills for recurring frontend and backend work.

**Non-Goals:**

- Document every file, function, component prop, or internal helper.
- Change application behavior or fix issues discovered while documenting it.
- Replace source code, automated tests, or OpenSpec behavioral specifications.
- Generate API documentation from a new dependency or introduce a documentation site.
- Promise compatibility with every AI assistant; the structure is optimized for Codex while remaining readable Markdown.
- Introduce contributor roles, approval chains, handoffs, onboarding procedures, or collective review policies for a multi-person team.
- Build a large general-purpose skill catalog or allow external skills to override repository-specific guidance.

## Decisions

### Use layered `AGENTS.md` guidance

Create a concise root `AGENTS.md` for product purpose, repository topology, system-wide constraints, commands, and links. Add `client/AGENTS.md` and `server/AGENTS.md` for area-specific architecture and validation instructions.

This matches Codex's hierarchical context model and keeps local instructions close to the code they govern. A single comprehensive root file was rejected because it would load irrelevant detail for most tasks and become harder to maintain.

### Separate orientation, architecture, contracts, and operational guidance

Use the following documentation shape:

```text
README.md
AGENTS.md
client/AGENTS.md
server/AGENTS.md
docs/
├── architecture.md
├── development.md
├── known-issues.md
├── domain/
│   └── rooms.md
└── contracts/
    ├── http-api.md
    └── websocket-events.md
```

The README remains a concise public entry point. `AGENTS.md` files provide operational instructions to Codex. `docs/architecture.md` explains stable component relationships and ownership. Domain and contract documents hold detail that is needed only for related tasks.

Alternatives considered were placing everything in the README or using only OpenSpec specs. The README is not suitable for detailed agent instructions, while OpenSpec captures required behavior rather than repository navigation and development practice.

### Document behavior from authoritative implementation paths

Each topic will be verified against its source of truth:

- HTTP routes: server routers/controllers and client API route usage.
- WebSocket contracts: server constants/controller and client event context/enums.
- Persistent data: Mongoose models and authentication/business logic.
- Ephemeral room state: `roomsController` and room consumers.
- Commands and configuration: package scripts, Docker Compose, Vite config, and environment access.

Documents will name important source paths rather than reproduce large code fragments. This reduces duplication while preserving traceability.

### Treat inconsistencies as findings, not specifications

Suspected defects, unused constants, stale roadmap entries, mismatched field names, and command discrepancies will be recorded in `docs/known-issues.md`. Intended architecture documents will not normalize those findings into desired behavior.

This prevents future agents from preserving accidental behavior. Fixing any finding requires a separate change with its own requirements and validation.

### Describe contracts in structured Markdown

Each HTTP endpoint will record method, path, authentication, input, response, ownership, and notable errors. Each WebSocket event will record direction, payload shape, receivers, state mutation, and emitted follow-up events.

Structured Markdown is preferred over generated OpenAPI or AsyncAPI for this change because no authoritative schemas currently exist and adopting either format would introduce a separate contract-design effort. A later change can formalize machine-readable schemas if desired.

### Add explicit maintenance rules

Root guidance will require owner-driven changes to update relevant documentation when they alter architecture, commands, configuration, HTTP routes, WebSocket events, persistence, or domain behavior. Validation for the change should compare duplicated client/server event definitions and documentation against the implementation without introducing team-oriented review ceremonies.

The documentation will include a last-resort verification principle: when documentation and executable code disagree, investigate the code and update the stale documentation rather than silently relying on it.

### Keep a small repository-local skill set

Store selected third-party skills under `.codex/skills/` so the owner's recurring Codex workflow is reproducible and scoped to this repository. Start with:

- `frontend-design` from `am-will/codex-skills` for intentional, accessible frontend visual design.
- `nodejs-backend-patterns` from `wshobson/agents` for Node.js and Express implementation patterns.
- `api-design-principles` from `wshobson/agents` as an optional skill for work that changes HTTP contracts.

Each imported skill will retain its source and license information and will be inspected before inclusion. Repository `AGENTS.md` guidance, current application patterns, executable code, tests, and OpenSpec artifacts take precedence over generic third-party recommendations. Skills will be invoked only for matching work rather than treated as mandatory instructions for every task.

A broad role-based skill such as `senior-backend` was rejected as the default because it can encourage architecture and process intended for larger systems or teams. A large skill collection was also rejected because overlapping instructions would increase context, maintenance work, and the chance of contradictory guidance.

### Use scoped Conventional Commits and proportionate validation

All commits will follow Conventional Commits. Changes confined to the client use the `frontend` scope, such as `feat(frontend): add room search modal`; changes confined to the server use the `backend` scope, such as `fix(backend): validate room before joining`. Common types include `feat`, `fix`, `refactor`, `test`, `docs`, and `chore`.

When a change affects both application areas, split it into `frontend` and `backend` commits when the separation remains coherent. Repository-wide documentation, OpenSpec, or shared configuration changes that do not belong to either application area may omit the scope, for example `docs: document room lifecycle` or `chore: update openspec context`.

Validation follows the affected area and the scripts defined in its `package.json`:

- Frontend changes run `npm run lint` and `npm run test:ci` from `client/`.
- Backend changes run `npm run lint` and `npm test` from `server/`.
- Cross-area changes run both sets.

The frontend build is not a routine completion check. Run `npm run build` only when a future change explicitly requires it, such as work on Vite configuration, packaging, or deployment. This keeps feedback proportional while preserving an escape hatch for build-specific changes.

## Risks / Trade-offs

- **Documentation can drift from the code** → Link claims to authoritative paths, keep documents topic-focused, and add update expectations to `AGENTS.md` and implementation tasks.
- **Root context can become too large** → Keep root guidance concise and route specialized detail to nested guidance and `docs/`.
- **Current defects can be presented as intended behavior** → Isolate suspected defects in `known-issues.md` and avoid normative language for them.
- **Manual contract documentation duplicates code** → Document payload semantics and ownership rather than copying implementations, and validate both client and server definitions during changes.
- **Too much documentation can make navigation worse** → Use a small, stable document hierarchy with explicit links and avoid per-component documentation.
- **English documentation may be less convenient for the repository owner** → Use clear technical English for consistency with the codebase while allowing collaboration with Codex in Spanish.

- **Third-party skills can become stale, unsafe, or conflict with the repository** -> Inspect and version the selected skills locally, record their provenance, update them deliberately, and make repository-specific guidance authoritative.
- **Too many skills can increase context and produce contradictory advice** -> Keep the initial set limited to two core skills and one task-specific optional skill.
- **Area scopes do not describe repository-wide changes** -> Permit an omitted scope for root documentation, OpenSpec, and genuinely shared configuration instead of assigning a misleading application scope.
- **Skipping routine builds can miss bundling-only failures** -> Require a build only for changes that explicitly affect Vite, packaging, or deployment; use lint and tests as the normal validation baseline.

## Migration Plan

1. Inspect the selected third-party skills, their licenses, and their compatibility with Codex before copying them into `.codex/skills/` with provenance recorded.
2. Add the root and scoped guidance files without changing runtime code.
3. Add architecture, domain, contract, development, and known-issue documents based on current implementation.
4. Update the README to point to the deeper documents and correct verified setup information.
5. Document when each repository-local skill should be used and state the precedence of repository-specific guidance.
6. Validate skill discovery, links, commands, route/event inventories, and statements against the repository.
7. Review the final diff to ensure no secrets or generated artifacts were included and no application behavior changed.

Rollback consists of reverting the documentation-only commit; no data or runtime migration is required.

## Open Questions

- Whether the project should later adopt OpenAPI and AsyncAPI as machine-readable sources of truth.
- Whether future domain capabilities such as synchronized playback and live chat should be backfilled into separate main OpenSpec specs after this repository-context work.
- Whether repeated use shows a need for a custom Share-Videos-specific backend skill beyond the initial generic Node.js patterns.
