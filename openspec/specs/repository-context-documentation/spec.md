## Purpose

Define the repository context documentation and local AI guidance that support accurate, low-friction iteration by the single maintainer and Codex.

## Requirements

### Requirement: Layered repository guidance
The repository SHALL provide a concise root guidance document for Codex and scoped guidance documents for the client and server that describe responsibilities, important paths, conventions, commands, validation expectations, and links to deeper context.

#### Scenario: Codex starts a repository-wide task
- **WHEN** Codex begins work from the repository root
- **THEN** the root guidance provides enough context to identify the product, major subsystems, system-wide constraints, authoritative commands, and relevant deeper documents

#### Scenario: Codex works in one application area
- **WHEN** Codex works within the client or server directory
- **THEN** the corresponding scoped guidance describes the area's architecture, conventions, integration boundaries, and validation commands without requiring unrelated area detail in the root guidance

### Requirement: Code-grounded architecture documentation
The repository SHALL document the current component topology, communication paths, state ownership, persistence boundaries, external integrations, and principal runtime flows using claims verified against authoritative implementation paths.

#### Scenario: Reader investigates room state
- **WHEN** a reader consults the architecture and room-domain documentation
- **THEN** the documentation identifies room membership, playback, queue, and chat as server-memory state and distinguishes them from MongoDB-persisted users and saved playlists

#### Scenario: Reader traces room lifecycle
- **WHEN** a reader needs to understand room creation, validation, joining, synchronization, leaving, or deletion
- **THEN** the documentation explains the participating client, HTTP, WebSocket, and server components and identifies the source paths that implement the flow

### Requirement: HTTP contract documentation
The repository SHALL document every active application HTTP endpoint with its method, path, authentication requirement, input, response, responsible implementation, and notable error behavior.

#### Scenario: Reader changes an HTTP endpoint
- **WHEN** a reader locates an endpoint in the HTTP contract document
- **THEN** the reader can identify its client consumer and server route/controller or determine that no client consumer currently exists

### Requirement: WebSocket contract documentation
The repository SHALL document every active WebSocket event with its direction, payload shape, recipients, room-state effects, emitted follow-up events, and corresponding client and server definitions.

#### Scenario: Reader changes a real-time interaction
- **WHEN** a reader locates a real-time interaction in the WebSocket contract document
- **THEN** the reader can determine which side emits it, which side handles it, which state it changes, and which definitions must remain synchronized

#### Scenario: Event definition is not active on both sides
- **WHEN** an event constant is unused or exists on only one side of the client-server boundary
- **THEN** the documentation marks it as legacy, unused, or inconsistent rather than presenting it as an active contract

### Requirement: Verified development guidance
The repository SHALL document installation, configuration, local execution, container execution, testing, linting, and available build workflows using commands and environment behavior verified against repository configuration. It SHALL distinguish available build commands from the routine lint-and-test validation baseline.

#### Scenario: Owner or Codex starts the application locally
- **WHEN** the owner or an assisting Codex session follows the development documentation
- **THEN** they can identify required dependencies, working directories, ports, environment variables, and commands for both client and server

#### Scenario: Owner or Codex validates a documentation change
- **WHEN** repository context documentation is changed
- **THEN** the guidance provides proportionate checks for links, documented commands, contracts, and affected project tests or builds

### Requirement: Commit and validation policy
Repository guidance SHALL require Conventional Commits with application-area scopes and SHALL define lint and tests, rather than a routine build, as the normal validation baseline.

#### Scenario: Change affects only the frontend
- **WHEN** a commit changes only the client application
- **THEN** it uses a Conventional Commit type with the `frontend` scope and validation runs `npm run lint` and `npm run test:ci` from `client/`

#### Scenario: Change affects only the backend
- **WHEN** a commit changes only the server application
- **THEN** it uses a Conventional Commit type with the `backend` scope and validation runs `npm run lint` and `npm test` from `server/`

#### Scenario: Change affects both application areas
- **WHEN** frontend and backend work can be separated into coherent commits
- **THEN** the work is split into commits using the corresponding `frontend` and `backend` scopes and both areas' lint and test commands are run

#### Scenario: Change is repository-wide planning or documentation
- **WHEN** a commit changes only root documentation, OpenSpec artifacts, or genuinely shared configuration
- **THEN** it follows Conventional Commits and may omit the scope rather than use a misleading application-area scope

#### Scenario: Ordinary change is validated
- **WHEN** a change does not explicitly affect build configuration, packaging, or deployment
- **THEN** successful applicable lint and test commands are sufficient and a build is not required as a routine completion check

#### Scenario: Build-specific change is validated
- **WHEN** a change explicitly affects Vite configuration, packaging, or deployment
- **THEN** its plan may require the relevant build command in addition to lint and tests

### Requirement: Separation of intended behavior and known issues
The repository SHALL keep suspected defects, stale statements, unused definitions, and unresolved inconsistencies separate from normative architecture and contract descriptions.

#### Scenario: Documentation discovers a likely defect
- **WHEN** code inspection reveals behavior that appears inconsistent with models, consumers, configuration, or documented product intent
- **THEN** the finding is recorded as a known issue with supporting source paths and is not silently described as intended behavior or fixed within this documentation change

### Requirement: Public project orientation
The README SHALL provide an accurate concise product description, current high-level feature summary, verified setup entry points, and links to detailed architecture and development documentation.

#### Scenario: Owner resumes work in a new session
- **WHEN** the owner or a new Codex session reads the README
- **THEN** they can understand the purpose of Share-Videos, its principal technologies, the basic way to run it, and where to find detailed guidance

### Requirement: Documentation maintenance policy
Repository guidance SHALL require relevant context documents to be reviewed whenever a change alters architecture, commands, configuration, HTTP routes, WebSocket events, persistence, or domain behavior.

#### Scenario: Future change alters a documented contract
- **WHEN** a future implementation changes a documented route, event, payload, or state transition
- **THEN** its task and review scope include updating the corresponding contract or domain documentation

#### Scenario: Documentation conflicts with executable behavior
- **WHEN** the owner or Codex detects a disagreement between documentation and executable code
- **THEN** they investigate the authoritative implementation and update or flag the stale documentation rather than assuming it is correct

### Requirement: Repository-local AI skills
The repository SHALL provide a minimal, inspectable set of repository-local Codex skills for recurring frontend and backend work, with activation scope, provenance, licensing, and precedence documented.

#### Scenario: Codex discovers repository-local skills
- **WHEN** Codex starts a session for this repository
- **THEN** it can discover the selected skills under `.codex/skills/` without installing application runtime dependencies

#### Scenario: Frontend design work activates specialized guidance
- **WHEN** a task creates or substantially revises frontend visual design
- **THEN** `frontend-design` supplies design guidance while repository-specific client conventions remain authoritative

#### Scenario: Backend work activates specialized guidance
- **WHEN** a task changes Node.js or Express backend implementation
- **THEN** `nodejs-backend-patterns` supplies applicable backend patterns without imposing unrelated large-team architecture or process

#### Scenario: HTTP contract work activates optional API guidance
- **WHEN** a task designs or changes an HTTP endpoint or payload contract
- **THEN** `api-design-principles` can be invoked for that task without becoming mandatory for unrelated backend work

#### Scenario: Third-party skill is incorporated or updated
- **WHEN** a third-party skill is added to or refreshed in the repository
- **THEN** its instructions are inspected and its source and license information are preserved or documented before use

#### Scenario: Generic skill guidance conflicts with repository context
- **WHEN** a skill recommendation conflicts with `AGENTS.md`, OpenSpec artifacts, executable code, or tests
- **THEN** the repository-specific and executable sources take precedence and the generic recommendation is not applied silently

#### Scenario: Skill is irrelevant to the current task
- **WHEN** a task does not match a repository-local skill's documented activation scope
- **THEN** the skill is not treated as mandatory and does not introduce contributor roles, approval chains, handoffs, or collective review procedures
