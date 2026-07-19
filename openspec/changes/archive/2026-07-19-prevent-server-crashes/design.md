## Context

The backend runs Express 4.17 and Socket.IO 2.3 in one Node.js process. Express 4 does not automatically forward rejected handler promises to error middleware, and Socket.IO callbacks execute outside the Express middleware chain. Today, either kind of rejected asynchronous work can escape as an unhandled process failure.

The reported YouTube failure occurs inside `youtube-sr` before the library returns search records. The reported Socket.IO failure occurs because a server-side socket's `disconnect` handler calls the client-only `socket.connect()` method. Error containment also has no shared boundary, health state, or graceful fatal-shutdown coordinator.

A complete design must distinguish request or event failures that are safe to contain from fatal runtime failures where continuing could preserve corrupted state. No middleware alone can cover HTTP, realtime callbacks, startup, signals, resource exhaustion, and native runtime failures.

## Goals / Non-Goals

**Goals:**

- Keep the process available when YouTube or another recoverable HTTP operation fails.
- Convert rejected asynchronous HTTP and Socket.IO handlers into controlled errors at their respective framework boundaries.
- Perform idempotent room cleanup for every server-observed disconnect without server-side reconnection.
- Shut down cleanly and rely on the container supervisor to restore service after an unrecoverable process failure.
- Expose health state so orchestration can distinguish a ready process from one that is starting or shutting down.
- Add deterministic tests at HTTP, Socket.IO, room, and lifecycle boundaries.

**Non-Goals:**

- Guaranteeing availability under host failure, out-of-memory termination, native crashes, repeated startup failure, or unavailable infrastructure.
- Attempting to continue normal operation after an `uncaughtException` or otherwise unrecoverable failure.
- Replacing, forking, or patching `youtube-sr` inside `node_modules`.
- Persisting or restoring ephemeral room state after a process restart.
- Changing client reconnection configuration, event names, successful search payloads, or room payload schemas.

## Decisions

### Use a shared asynchronous HTTP boundary and terminal error middleware

Async Express handlers will be registered through a small wrapper that resolves their return value and forwards rejections to `next`. A terminal error middleware, mounted after all routes, will log the original error and return a stable non-sensitive response when headers have not already been sent. Expected upstream failures will carry an HTTP 502 classification; unexpected failures will use HTTP 500.

The video controllers will translate `youtube-sr` failures into an application error and let the shared boundary serialize it. This avoids duplicated response logic and prevents returning an empty successful result for a request that actually failed. The wrapper must cover every asynchronous HTTP handler in scope so later failures do not bypass the middleware.

### Normalize successful upstream results defensively

After a successful library call, video mapping will validate nested fields and omit records that cannot satisfy the existing client video shape. Optional display fields will receive safe fallbacks where permitted. If every returned record is unusable, the endpoint can return a successful empty page. This does not repair an exception thrown internally by `youtube-sr`; the HTTP error boundary handles that earlier failure.

### Delegate reconnection to clients and make departure idempotent

The server `disconnect` listener will call `roomsCtrl.leaveRoom(reason, socket)` for every reason and never call `socket.connect()`. Once disconnect fires, that socket is no longer a valid participant. A reconnected client establishes membership again through the existing join flow.

The explicit `WS_LEAVE_ROOM` event remains for immediate user departure. `leaveRoom` stays keyed by `socket.id` and becomes fully idempotent: a missing user mapping, missing room, or already-removed user is a no-op. Explicit leave followed by transport disconnect therefore cannot duplicate notifications or throw on absent state.

### Wrap asynchronous Socket.IO event handlers

Socket.IO handlers will use a shared wrapper that invokes the callback inside a promise chain and catches both synchronous throws and rejected promises. The boundary will log contextual event information, emit a generic notification to the initiating socket when it remains connected, and prevent the failure from becoming an unhandled rejection. It will not expose stack traces or raw payloads, and it will not manufacture a successful state update after a failed mutation.

This wrapper is necessary because Express error middleware cannot observe Socket.IO callbacks. Applying it consistently is preferable to adding `try/catch` only to the currently failing disconnect path.

### Fail safely and restart after unrecoverable errors

Top-level `unhandledRejection` and `uncaughtException` listeners are a final safety net, not a mechanism for continuing execution. They will log the fatal error, mark the service unready, stop accepting new HTTP and Socket.IO work, close the HTTP server and MongoDB connection with a bounded timeout, and exit non-zero. A single-flight shutdown guard prevents repeated signals or errors from running cleanup concurrently. `SIGTERM` and `SIGINT` reuse the orderly lifecycle path without being reported as application crashes.

The production deployment, which is managed outside this repository, must execute `npm start`, poll the lightweight health endpoint, and replace the service after a non-zero exit. The endpoint reports success only while the process is ready and fails during fatal shutdown before listeners close. Restarting a fresh process is the safe recovery for unknown fatal state. The repository's development Compose stack keeps Nodemon hot reload and is not the production supervisor. Because rooms are intentionally in memory, a fatal restart discards active rooms; preventing that requires a separate persistence design.

### Test boundaries without terminating the test runner

Video API tests will mock `youtube-sr` and generic rejected handlers. Socket registration tests will assert disconnect cleanup, rejected event containment, and absence of server-side reconnection. Room tests will cover repeated cleanup and missing state. Lifecycle tests will inject fatal errors behind an isolated module or child-process boundary and assert readiness transition, single cleanup, timeout behavior, and non-zero exit intent without terminating Jest itself.

## Risks / Trade-offs

- [YouTube parser changes can make all searches return 502] → Preserve diagnostic logging and a stable client response; dependency replacement remains a follow-up decision.
- [Skipping malformed records can produce short pages] → Prioritize safe payloads and document that upstream degradation can reduce results.
- [A transient disconnect removes the user before automatic reconnection] → This matches socket lifetime; the live socket rejoins through the existing flow.
- [Logs can expose request or payload details] → Record bounded context and errors without raw payloads, secrets, stack traces in responses, or upstream bodies.
- [Continuing after a fatal error can preserve corrupted state] → Fatal hooks initiate shutdown and never resume normal service.
- [Shutdown can hang] → Enforce a bounded timeout and exit non-zero if graceful cleanup does not finish.
- [Container restart loses active rooms] → Document the existing ephemeral-state consequence; durability remains out of scope.
- [Restart loops can hide persistent startup defects] → Pair restart policy with health state and visible logs so repeated failures are detectable.

## Migration Plan

Deploy as a backward-compatible backend update. No data migration is required. Validate focused Jest tests, the routine backend suite, and lint while separating pre-existing failures. In the external production environment, run `npm start`, poll `GET /health`, and configure replacement after a non-zero exit; validate that deployment contract there. Rollback is a code rollback with no stored schema restoration.

## Open Questions

None required for repository implementation. Production supervision is owned by the external deployment context; this repository supplies the start command, health contract, graceful shutdown, and non-zero fatal exit it needs. If `youtube-sr` continues failing after containment, evaluate upgrading or replacing it in a follow-up change using observed failure rates and payload compatibility evidence.
