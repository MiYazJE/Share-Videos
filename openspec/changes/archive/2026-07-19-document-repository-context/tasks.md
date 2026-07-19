## 1. Establish the Verified Source Inventory

- [x] 1.1 Inventory client and server entry points, package scripts, configuration files, environment variables, runtime ports, and external services, recording the authoritative source path for each claim.
- [x] 1.2 Inventory active HTTP routes by matching server routers/controllers to client consumers and identify endpoints with no current client consumer.
- [x] 1.3 Inventory WebSocket events by matching server constants/handlers to client enums/emitters/listeners and classify unmatched or unused definitions.
- [x] 1.4 Inventory state ownership and lifecycle for users, saved playlists, rooms, participants, playback, shared queue, and chat.
- [x] 1.5 Record suspected defects, stale statements, and unresolved inconsistencies as documentation findings without changing application code.

## 2. Add Layered Codex Guidance

- [x] 2.1 Create root `AGENTS.md` with the product summary, repository map, system-wide architecture constraints, authoritative commands, proportionate validation expectations, maintenance rules, and links to deeper documents.
- [x] 2.2 Create `client/AGENTS.md` covering React/Vite structure, routing, Rematch state, HTTP and Socket.IO boundaries, component conventions, and the routine `npm run lint` plus `npm run test:ci` validation commands.
- [x] 2.3 Create `server/AGENTS.md` covering Express startup, MongoDB persistence, authentication, in-memory room ownership, Socket.IO handling, API organization, and the routine `npm run lint` plus `npm test` validation commands.
- [x] 2.4 Review the guidance hierarchy to remove duplicated detail and ensure each instruction lives at the narrowest useful scope.
- [x] 2.5 Document Conventional Commits using the `frontend` scope for client changes and `backend` for server changes, permit omitted scope for root documentation, OpenSpec, or genuinely shared configuration, and recommend splitting cross-area work when coherent.

## 3. Document Architecture and Domain Behavior

- [x] 3.1 Create `docs/architecture.md` describing component topology, HTTP and WebSocket communication, external integrations, deployment shape, state ownership, and persistence boundaries with source references.
- [x] 3.2 Create `docs/domain/rooms.md` describing room creation, validation, joining, identity selection, synchronized playback, queue operations, chat retention, leaving, host reassignment, and deletion.
- [x] 3.3 Add compact diagrams for the system boundary and room lifecycle where they materially clarify component or state transitions.
- [x] 3.4 Verify architecture and room-domain claims against the current client and server implementation and distinguish observed behavior from product intent.

## 4. Document Integration Contracts

- [x] 4.1 Create `docs/contracts/http-api.md` listing each active endpoint's method, path, authentication, input, response, errors, client consumer, and server implementation.
- [x] 4.2 Create `docs/contracts/websocket-events.md` listing each active event's direction, payload, recipients, state mutation, follow-up events, and client/server definitions.
- [x] 4.3 Mark unmatched, unused, or legacy HTTP and WebSocket definitions explicitly rather than presenting them as active contracts.
- [x] 4.4 Cross-check contract names and payload semantics on both sides of each client-server boundary.

## 5. Document Development and Known Issues

- [x] 5.1 Create `docs/development.md` with prerequisites, dependency installation, local and Docker startup, working directories, ports, environment variables, available build commands, linting, unit tests, Cypress workflows, and a clear distinction between available builds and routine validation.
- [x] 5.2 Execute or otherwise verify each safe documented lint and test command, label commands requiring external services or interactive execution appropriately, and do not run a build routinely unless the change explicitly affects Vite, packaging, or deployment.
- [x] 5.3 Create `docs/known-issues.md` containing source-backed stale documentation, configuration mismatches, model/query inconsistencies, unused contracts, and other suspected defects found during inventory.
- [x] 5.4 Ensure known issues describe evidence and impact without silently fixing them or defining them as desired behavior.

## 6. Refresh Public Orientation

- [x] 6.1 Update `README.md` with an accurate product description, current feature summary, technology overview, concise setup entry points, and links to architecture and development documentation.
- [x] 6.2 Reconcile or remove stale roadmap and setup statements based on the verified inventory while preserving useful public project information.

## 7. Validate Documentation Quality

- [x] 7.1 Check that all referenced paths, internal Markdown links, skill files, provenance records, and licenses exist and that no secrets, unsafe instructions, local credentials, generated outputs, or environment-specific values were added.
- [x] 7.2 Compare the completed documentation and repository-local skills against the `repository-context-documentation` spec, covering every requirement and scenario.
- [x] 7.3 Run the applicable frontend and/or backend lint and test scripts to confirm documented expectations, without requiring a routine build, and record any pre-existing failures in known issues.
- [x] 7.4 Review the final diff to confirm the change does not modify application behavior or runtime dependencies, terminology is consistent, root context remains concise, and specialized detail is discoverable through links.

## 8. Add Repository-Local Codex Skills

- [x] 8.1 Inspect the selected skills' instructions, source, license, and Codex compatibility before incorporating them, rejecting unsafe or conflicting instructions.
- [x] 8.2 Add `frontend-design` under `.codex/skills/` with its required files and provenance preserved.
- [x] 8.3 Add `nodejs-backend-patterns` and optional `api-design-principles` under `.codex/skills/` with their required files and provenance preserved.
- [x] 8.4 Document each skill's purpose and activation scope and state that repository `AGENTS.md`, OpenSpec artifacts, executable code, and tests take precedence.
- [x] 8.5 Validate that Codex discovers the repository-local skills, that they add no application runtime dependencies, and that they do not impose contributor roles or multi-person approval processes.
