## Why

The client currently mixes remote HTTP data, transient UI state, authentication, and Socket.IO room state in Rematch/Redux, while several request paths suppress errors or provide no recoverable user feedback. Separating these concerns with TanStack Query and focused React contexts will make request state explicit, preserve the real-time room model, and provide consistent loading, empty, failure, and retry experiences.

## What Changes

- Introduce TanStack Query as the owner of HTTP-backed server state, including authentication bootstrap, room validation, room creation, video search, and autocomplete suggestions.
- Introduce focused React context state for Socket.IO-driven room state and the minimal client session state that is not owned by an HTTP resource.
- Normalize the client HTTP contract so every failed request rejects with structured, safe error information instead of returning `undefined`.
- Define consistent UX behavior for initial loading, background fetching, empty results, recoverable failures, mutation failures, retries, and duplicate-submit prevention.
- Cancel or supersede stale video discovery requests so older responses cannot replace newer searches.
- Remove Rematch, React Redux, the loading plugin, models, selectors, and Redux provider after all consumers have migrated.
- Prefer version-matched official TanStack skills discovered through TanStack Intent when available. Remove `proposal-react-query-skill.md` after discovery; if no compatible official skill exists, replace that draft with a validated repository-local skill limited to Share-Videos-specific state boundaries, request UX, and migration constraints.
- **BREAKING**: Replace the internal Redux/Rematch state and dispatch interfaces used by client components and hooks. HTTP and WebSocket wire contracts remain unchanged.

## Capabilities

### New Capabilities

- `client-server-state-management`: Defines ownership, caching, lifecycle, cancellation, mutation, and authentication behavior for HTTP-backed client state.
- `client-request-error-ux`: Defines normalized client request failures and consistent loading, empty, error, retry, and mutation feedback behavior.
- `realtime-room-client-state`: Defines how Socket.IO room snapshots, chat, queue, playback, membership, and transient guest identity are represented without Redux.

### Modified Capabilities

- `video-search-resilience`: Extends resilient video discovery behavior to the client, including request cancellation, stale-response protection, retained results, and recoverable feedback for search and autocomplete failures.

## Impact

- Affects `client/src/store.js`, `client/src/models/`, Redux selectors and consumers, application providers, the Socket.IO context, HTTP utilities, authentication UI, room routing, video search, notifications, and related Cypress coverage.
- Adds `@tanstack/react-query`; removes `@rematch/core`, `@rematch/loading`, and `react-redux` after migration.
- Does not change server persistence, ephemeral room lifetime, HTTP routes, successful response shapes, Socket.IO event names, or the `/socket-io` path.
- Requires updates to client architecture, HTTP contract, WebSocket state ownership, development guidance, affected OpenSpec documentation, and either official Intent skill wiring or a validated repository-local fallback skill.
