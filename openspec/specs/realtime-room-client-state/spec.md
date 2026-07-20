## Purpose

Define focused client ownership for ephemeral Socket.IO room state and actions.

## Requirements

### Requirement: Realtime room state is independent of the query cache
The client SHALL maintain Socket.IO-driven room membership, queue, playback, progress, current video, and chat in a focused React context state boundary and MUST NOT treat that state as a durable HTTP query resource.

#### Scenario: Server emits a room snapshot
- **WHEN** the client receives the room update event
- **THEN** the room state boundary applies the snapshot and subscribed room consumers render the new state

#### Scenario: Server emits a chat update
- **WHEN** the client receives the chat update event
- **THEN** the room state boundary updates chat without invalidating unrelated HTTP queries

### Requirement: Room actions remain stable Socket.IO operations
The client SHALL expose join, leave, queue, playback, progress, reorder, and chat actions through a stable room action interface that emits the existing Socket.IO contracts.

#### Scenario: Component emits a room action
- **WHEN** a room component invokes an exposed action with a valid payload
- **THEN** the client emits the corresponding existing Socket.IO event through the `/socket-io` connection

#### Scenario: Room component unmounts
- **WHEN** the active room route unmounts
- **THEN** the client emits the existing leave-room action and releases route-scoped room state

### Requirement: Guest identity remains transient client state
The client SHALL keep an unauthenticated participant nickname outside authenticated server-state queries and SHALL use it when joining or creating an ephemeral room.

#### Scenario: Anonymous participant supplies a nickname
- **WHEN** an unauthenticated participant accepts the room-name dialog
- **THEN** the client retains the nickname for the active client session and joins the room with it

#### Scenario: Authenticated participant enters a room
- **WHEN** the session query provides an authenticated identity
- **THEN** the client joins using that identity without requiring a guest nickname

### Requirement: Realtime state consumers avoid unrelated updates
The room state architecture MUST separate or scope frequently changing playback and chat state so components that do not consume a changed value are not required to depend on the full application state.

#### Scenario: Playback progress changes frequently
- **WHEN** progress updates are applied to the room state
- **THEN** HTTP session, authentication navigation, and unrelated application UI remain independent of those updates
