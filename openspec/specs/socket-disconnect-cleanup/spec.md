## Purpose

Define resilient Socket.IO cleanup, runtime health, and fatal-process recovery behavior for the server.

## Requirements

### Requirement: Server-observed disconnects clean room membership
The Socket.IO server SHALL treat every `disconnect` event as the end of that socket's membership and MUST delegate cleanup without attempting to reconnect the disconnected server socket.

#### Scenario: Transport connection closes
- **WHEN** a joined socket disconnects with reason `transport close`
- **THEN** the server removes its membership and updates or deletes the affected room

#### Scenario: Socket disconnects for another reason
- **WHEN** a joined socket disconnects for any Socket.IO reason other than `transport close`
- **THEN** the server performs the same membership cleanup and does not call a server-side `connect` method

#### Scenario: Client reconnects after disconnection
- **WHEN** the Socket.IO client establishes a connection after its prior socket was cleaned up
- **THEN** membership is established only through the existing room join flow for the live socket

### Requirement: Room departure cleanup is idempotent
Room departure cleanup MUST be safe to invoke more than once or after related ephemeral state has already been removed, and SHALL emit departure effects at most once for a socket membership.

#### Scenario: Explicit leave is followed by disconnect
- **WHEN** a socket emits `WS_LEAVE_ROOM` and later produces a `disconnect` event
- **THEN** the participant is removed once and no duplicate room update or departure notification is emitted

#### Scenario: Room is already absent during cleanup
- **WHEN** cleanup finds a socket membership whose in-memory room no longer exists
- **THEN** it removes any stale socket membership and completes without throwing

#### Scenario: Unknown socket disconnects
- **WHEN** a socket with no membership mapping disconnects
- **THEN** cleanup completes without changing room state or throwing

### Requirement: Asynchronous realtime failures are contained
The server MUST catch synchronous throws and rejected promises from registered Socket.IO event handlers, SHALL log bounded event context, and MUST NOT allow the failure to become an unhandled process rejection.

#### Scenario: Socket event handler rejects
- **WHEN** an asynchronous room event handler rejects while processing a connected socket's event
- **THEN** the server records the failure, sends only a generic error notification when possible, and remains able to process later events

#### Scenario: Socket event handler throws synchronously
- **WHEN** a registered Socket.IO handler throws before returning a promise
- **THEN** the same realtime error boundary contains the failure without exposing stack or payload details to the client

### Requirement: Fatal runtime failures trigger supervised recovery
The server MUST treat an uncaught exception or otherwise uncontained rejection as fatal, SHALL stop reporting readiness and attempt bounded graceful shutdown, and MUST exit non-zero so the configured supervisor can replace the process.

#### Scenario: Uncaught exception reaches the process boundary
- **WHEN** an uncaught exception reaches the final process safety boundary
- **THEN** the server logs it as fatal, becomes unready, stops accepting new work, attempts to close HTTP, Socket.IO, and database resources, and exits non-zero

#### Scenario: Fatal shutdown exceeds its deadline
- **WHEN** one or more resources do not close within the configured shutdown timeout
- **THEN** the process exits non-zero without waiting indefinitely

#### Scenario: Multiple shutdown triggers occur
- **WHEN** fatal errors or termination signals arrive while shutdown is already running
- **THEN** cleanup is coordinated once and concurrent shutdown sequences are not started

#### Scenario: Production supervisor observes fatal process exit
- **WHEN** the server exits non-zero after a fatal runtime failure
- **THEN** the external production supervisor can detect the exit and start a fresh process using `npm start`

### Requirement: Runtime health reflects readiness
The server SHALL expose a lightweight health signal that succeeds only while the application is ready to accept work and MUST fail during startup or fatal shutdown.

#### Scenario: Server is ready
- **WHEN** required startup has completed and shutdown has not begun
- **THEN** the health check reports the process as ready

#### Scenario: Fatal shutdown begins
- **WHEN** the process starts fatal shutdown
- **THEN** the health check reports an unhealthy state before the process exits
