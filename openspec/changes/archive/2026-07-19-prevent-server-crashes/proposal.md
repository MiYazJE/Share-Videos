## Why

Uncaught failures from the third-party YouTube parser and invalid server-side Socket.IO disconnect recovery currently terminate the Node.js process. Recoverable failures must degrade only the affected request or connection, while genuinely fatal runtime failures must trigger an observable, orderly shutdown and automatic process replacement instead of leaving the application unavailable until manual intervention.

## What Changes

- Contain YouTube search and autocomplete failures and return a stable service-unavailable HTTP response instead of allowing rejected controller promises to escape Express.
- Normalize only usable YouTube results and skip malformed upstream items when a partial result set can still be served.
- Treat every disconnected server socket as departed and perform idempotent in-memory room cleanup; remove the invalid server-side reconnection attempt.
- Introduce shared asynchronous error boundaries and terminal Express error middleware so unexpected HTTP handler failures become controlled responses.
- Contain rejected asynchronous Socket.IO handlers so a failed event cannot become an unhandled process rejection.
- Add fatal-process logging, graceful HTTP/Socket.IO/database shutdown, health signaling, and a documented production-supervisor contract for failures that cannot be handled safely in-process.
- Add focused backend tests for malformed YouTube data, upstream rejection, disconnect reasons, repeated cleanup, HTTP/Socket.IO error boundaries, and shutdown behavior.
- Document failure responses, disconnect cleanup, runtime recovery semantics, and retire the corresponding known finding.

## Capabilities

### New Capabilities

- `video-search-resilience`: Defines stable video search behavior when YouTube or `youtube-sr` fails and controlled HTTP behavior when asynchronous request handling fails.
- `socket-disconnect-cleanup`: Defines safe room cleanup, containment of asynchronous realtime failures, and supervised recovery from fatal process failures.

### Modified Capabilities

None.

## Impact

- Affects the video API controller/router boundary, shared Express middleware, Socket.IO registration, room membership cleanup, server lifecycle, health signaling, production deployment requirements, logging, and backend tests.
- Updates `docs/architecture.md`, `docs/contracts/http-api.md`, `docs/contracts/websocket-events.md`, `docs/development.md`, and `docs/known-issues.md`.
- Keeps successful HTTP payloads and existing WebSocket event names/payloads compatible; failed YouTube requests gain an explicit HTTP status and body.
- No room persistence, client-side reconnection policy, or replacement of `youtube-sr` is required by this change. Fatal restarts still discard ephemeral rooms by design.
