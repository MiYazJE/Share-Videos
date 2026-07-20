## Context

The React client currently uses Rematch models for authentication, room state, video discovery, mutation effects, notifications, and loading flags. Socket.IO events mutate the same room model used by HTTP requests, even though the room is ephemeral real-time state rather than a durable HTTP resource. The custom Axios wrapper also handles methods inconsistently: `post` rejects on failure while several other methods log and return `undefined`, preventing consumers from reliably distinguishing errors from empty data.

The migration crosses the application provider tree, routing bootstrap, authentication, video discovery, room creation, Socket.IO event handling, and user feedback. Successful HTTP and WebSocket contracts must remain compatible, and room state must continue to disappear when the final participant leaves or the server restarts.

## Goals / Non-Goals

**Goals:**

- Give HTTP-backed server state an explicit cache, lifecycle, cancellation, retry, and mutation model through TanStack Query.
- Represent Socket.IO-driven room state through a focused React context and reducer without treating it as durable query data.
- Normalize failed HTTP requests into rejected structured errors.
- Give each asynchronous workflow intentional initial-loading, background-fetching, empty, error, retry, and pending-action UX.
- Remove Redux/Rematch and its loading plugin after preserving existing user-visible behavior.
- Keep guidance aligned with the installed TanStack Query version by preferring official Intent-discovered skills when available.

**Non-Goals:**

- Changing HTTP routes, successful response bodies, WebSocket event names, or the `/socket-io` path.
- Persisting rooms, playback, queues, membership, or chat.
- Moving Socket.IO room state into the TanStack Query cache.
- Introducing Suspense, server rendering, a new router, or TypeScript as part of this migration.
- Fixing unrelated findings in `docs/known-issues.md`.
- Authoring a generic replacement for official TanStack Query skills.

## Decisions

### Use TanStack Query only for HTTP-owned state

Create a single application `QueryClient` and provider. Domain query option factories and hooks will own session bootstrap, room validation, video search, suggestions, and other reads. Mutations will own login, registration, and room creation.

Query defaults will be conservative and resource-specific. Retry, staleness, focus refetching, and cache lifetime will be decided per operation rather than hidden in a broad global policy. Client validation and authentication failures will not be retried automatically. Query keys will include every input that changes the returned resource.

Alternative considered: replace Redux entirely with TanStack Query, including room snapshots. This was rejected because room data is pushed by Socket.IO, is ephemeral, and includes playback coordination whose lifecycle does not match an HTTP cache.

### Split realtime room state from client session state

Extend the Socket.IO provider into a focused room-state boundary, or compose it with a `RoomStateProvider`, backed by `useReducer`. Incoming room and chat events will dispatch explicit reducer actions. Socket emission functions will remain stable and separate from state consumption to limit unnecessary renders.

Authenticated identity will derive from the session query. A guest nickname is transient client state and will live in a small session/room-entry context or the nearest stable route boundary. It will not be inserted into the server-state cache as an authenticated user.

Alternative considered: one application-wide context replacing the Redux store. This was rejected because it would preserve the current coupling and cause unrelated consumers to rerender on frequent playback or chat updates.

### Make the HTTP adapter reject consistently

The Axios adapter will return response data on success and throw a normalized application error on every failed HTTP method. The normalized shape will retain diagnostic cause/status for program logic while exposing a safe display message. Query functions must never convert failures into `undefined` success values.

Authentication bootstrap will explicitly classify an expected unauthenticated response as an anonymous session. Other failures remain observable so the UI can distinguish an unavailable service from a signed-out user.

Alternative considered: normalize errors independently in every hook. This was rejected because it duplicates classification and allows method-specific inconsistencies to return.

### Design feedback at workflow boundaries

Initial loading that blocks meaningful content will use an inline or page-level state. Background refetches will preserve usable cached content and use non-blocking feedback. Empty results will be distinct from errors. Recoverable read failures will expose retry close to the failed content. Mutation failures will retain user input, re-enable the action, and show contextual feedback; pending mutations will prevent duplicate submission.

Global notifications remain appropriate for transient success or non-blocking failure messages, but they will not be the only representation of a blocking content error. The existing Redux notifier can be replaced by Chakra's toast facilities or a minimal notification boundary.

### Cancel superseded discovery requests

Video query functions will consume TanStack Query's `AbortSignal` and forward it to Axios. Search and autocomplete keys will include normalized input and pagination variables. Empty input will disable the request. Previous usable page data may remain visible while a new page loads, but results for an older search term must never replace the active term.

### Migrate by vertical workflow before removing Redux

The provider and HTTP foundation will be introduced first. Workflows will then migrate in bounded slices: room validation and video discovery, authentication, room creation, realtime room state, and notifications. Redux remains temporarily only for unmigrated consumers. Dependencies and legacy files will be removed after repository search confirms there are no remaining imports, selectors, models, or dispatch calls.

### Treat TanStack Intent as development guidance

After installing TanStack Query, implementation will run Intent discovery to determine whether the installed package ships compatible official skills. If it does, those version-matched skills will be installed or wired for Codex and `proposal-react-query-skill.md` will be deleted as superseded guidance.

If no compatible official skill exists, `proposal-react-query-skill.md` will still be deleted and replaced through the repository's `skill-creator` workflow by a valid local skill folder. The fallback skill will document only Share-Videos-specific state classification, HTTP error requirements, query/mutation UX, Socket.IO boundaries, testing conventions, and migration checks. It will not reproduce generic TanStack documentation, become a runtime application dependency, or duplicate instructions into application code. The created skill must pass its structural validation before migration work relies on it.

## Risks / Trade-offs

- [Temporary dual state sources can diverge during migration] → Migrate complete workflows end to end and avoid mirroring the same resource in both systems.
- [A broad context can rerender the room on frequent progress events] → Separate state and actions, memoize provider values, and keep rapidly changing state scoped to its actual consumers.
- [Default retries can repeat inappropriate authentication or validation calls] → Configure retry by status and operation; do not retry deterministic 4xx responses.
- [Clearing all query data at logout can disrupt public room/search data] → Remove or reset identity-sensitive queries explicitly and document which public caches may remain.
- [Cancellation may be ineffective if Axios does not receive the signal] → Thread `signal` through the API function and cover superseded searches with tests.
- [Changing loading semantics can expose stale selectors or routing races] → Replace the known stale startup selector with query status and test anonymous, authenticated, unavailable, and slow bootstrap paths.
- [Cypress E2E depends on live local services and an installed browser] → Keep `test:ci` explicitly headless on Chrome and run it only after aligning the client and server ports.

## Migration Plan

1. Install TanStack Query and discover compatible official skills through Intent. Delete `proposal-react-query-skill.md`; wire the official skill when available, otherwise create and validate the scoped repository-local fallback skill.
2. Add the application QueryClient provider and isolated query-test utilities.
3. Normalize the HTTP adapter and error classification without changing successful data shapes.
4. Migrate room validation and video search/autocomplete, including cancellation and visible retry states.
5. Migrate session bootstrap, login, registration, logout, and room creation.
6. Introduce the room reducer/context and migrate all Socket.IO-driven selectors and updates.
7. Replace Redux-backed notifications and remaining local UI selections.
8. Remove Redux/Rematch providers, models, store, selectors, loading plugin, and dependencies.
9. Update architecture, development, and contract documentation; run client lint and relevant tests.

During the transitional commits, rollback can restore the previous workflow slice because server contracts are unchanged. After final removal, rollback requires restoring the Redux dependencies and the last Redux-backed client files together.

## Open Questions

- Whether Chakra toast alone is sufficient for transient notifications or a minimal wrapper is useful for consistent error mapping; blocking failures still require inline states either way.
