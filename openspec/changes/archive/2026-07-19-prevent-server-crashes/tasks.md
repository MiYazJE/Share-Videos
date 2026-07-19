## 1. Shared HTTP failure containment

- [x] 1.1 Add an asynchronous Express handler wrapper and tests proving synchronous throws and rejected promises reach `next(error)`.
- [x] 1.2 Add classified application errors and terminal Express error middleware that logs failures, preserves safe statuses/messages, returns a non-sensitive HTTP 500 fallback, and delegates when headers were already sent.
- [x] 1.3 Register the terminal middleware after all routes and wrap every asynchronous HTTP route handler in scope.
- [x] 1.4 Add integration tests proving a failed asynchronous request receives a controlled response and the application serves a subsequent request.

## 2. Video search resilience

- [x] 2.1 Add focused video API tests that mock `youtube-sr` and cover valid responses, search/autocomplete rejection, malformed records, stable HTTP 502 bodies, and continued request handling.
- [x] 2.2 Translate YouTube search and autocomplete dependency failures into classified upstream-service errors handled by the shared HTTP boundary.
- [x] 2.3 Refactor video normalization to validate required nested fields and omit unusable records without throwing while preserving successful response shapes.

## 3. Socket.IO failure containment and disconnect cleanup

- [x] 3.1 Add a shared Socket.IO handler wrapper and tests covering synchronous throws, rejected promises, bounded logging context, generic client notification, and continued event handling.
- [x] 3.2 Register asynchronous room event callbacks through the realtime wrapper without logging raw payloads or exposing internal errors.
- [x] 3.3 Add Socket.IO registration tests proving every disconnect reason delegates to room cleanup and no server-side reconnection method is called.
- [x] 3.4 Simplify the disconnect handler to clean membership for every reason and remove invalid `socket.connect()` recovery.
- [x] 3.5 Extend room controller tests for repeated departure, unknown sockets, and stale mappings whose room is absent.
- [x] 3.6 Make `leaveRoom` idempotent for explicit-leave/disconnect races and missing ephemeral state, emitting departure effects at most once.

## 4. Fatal lifecycle and supervised recovery

- [x] 4.1 Extract a single-flight server lifecycle coordinator that tracks readiness and performs bounded HTTP, Socket.IO, and MongoDB shutdown.
- [x] 4.2 Register `SIGTERM` and `SIGINT` for orderly shutdown and final `unhandledRejection`/`uncaughtException` hooks that log fatal context, mark unready, clean up, and request non-zero exit without continuing normal operation.
- [x] 4.3 Add lifecycle tests using injected resources or an isolated child process to verify readiness transition, one-time cleanup, shutdown deadline, signal behavior, and non-zero fatal exit intent without terminating Jest.
- [x] 4.4 Add a lightweight health endpoint and tests for starting, ready, and shutting-down states.
- [x] 4.5 Preserve Nodemon hot reload in development Compose and document the external production contract: execute `npm start`, poll `/health`, and replace the service after a non-zero exit.

## 5. Contracts and validation

- [x] 5.1 Update HTTP documentation with shared error behavior, stable YouTube dependency responses, malformed-result handling, and the health endpoint.
- [x] 5.2 Update WebSocket documentation with realtime error containment, all-reason disconnect cleanup, and client-owned reconnection semantics.
- [x] 5.3 Update architecture and development documentation with recoverable-versus-fatal behavior, graceful shutdown, health checks, restart supervision, and the loss of ephemeral rooms after restart.
- [x] 5.4 Remove the resolved disconnect finding from known issues and record any remaining deployment limitation as evidence rather than intended behavior.
- [x] 5.5 Run focused Jest tests, the routine server suite, server lint, lifecycle recovery tests, OpenSpec validation, and Compose configuration validation; distinguish pre-existing failures from regressions and defer external supervisor integration testing to its owning production context.
