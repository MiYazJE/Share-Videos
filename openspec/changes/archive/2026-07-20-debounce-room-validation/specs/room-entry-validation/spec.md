## ADDED Requirements

### Requirement: Dialog validation occurs on explicit submission
The client SHALL validate room existence from the Join room dialog only when the visitor activates the Join action with a non-empty normalized identifier.

#### Scenario: Visitor types a room identifier
- **WHEN** the visitor enters or edits a room identifier without activating Join
- **THEN** the client sends no room-validation request

#### Scenario: Visitor submits an identifier
- **WHEN** the visitor activates Join with a non-empty normalized identifier
- **THEN** the client sends one validation request for that identifier

#### Scenario: Visitor submits surrounding whitespace
- **WHEN** the visitor activates Join with an identifier containing leading or trailing whitespace
- **THEN** the client validates the trimmed identifier without the surrounding whitespace

#### Scenario: Visitor submits empty input
- **WHEN** the visitor activates Join with an input that normalizes to an empty identifier
- **THEN** the client sends no request and displays the required-room feedback

### Requirement: Pending validation prevents duplicate submission
The client MUST disable the Join action and display a loading state while a dialog validation request is pending.

#### Scenario: Visitor activates Join during validation
- **WHEN** a room-validation request is already pending and the visitor attempts to activate Join again
- **THEN** the client does not start another validation request

#### Scenario: Validation settles
- **WHEN** the pending room-validation request succeeds or fails
- **THEN** the client removes the pending state and allows an applicable next action

### Requirement: Existing room continues to the Room page
The client SHALL navigate to the Room page only when explicit validation returns the boolean value `true`.

#### Scenario: Submitted room exists
- **WHEN** validation returns `true` for the submitted normalized identifier
- **THEN** the client closes the dialog and navigates to `/room/:id` using exactly that normalized identifier

#### Scenario: Dialog closes while validation is pending
- **WHEN** the visitor dismisses the dialog before its validation request settles
- **THEN** the eventual response does not navigate the visitor to a Room page

### Requirement: Missing room is a domain outcome
The client SHALL treat the boolean value `false` as confirmation that the submitted room does not exist and SHALL distinguish it from a request failure.

#### Scenario: Submitted room does not exist
- **WHEN** validation returns `false`
- **THEN** the client remains in the dialog, displays “Room does not exist”, and does not navigate

#### Scenario: Visitor edits after a missing-room result
- **WHEN** the visitor edits the identifier after “Room does not exist” is displayed
- **THEN** the client clears the obsolete feedback and waits for another explicit Join action

### Requirement: Validation service failure is recoverable
The client SHALL distinguish a rejected request or unusable successful response from a confirmed missing room and SHALL present contextual feedback that permits a manual retry.

#### Scenario: Validation request fails
- **WHEN** the validation request fails because of network, server, timeout, or another normalized HTTP error
- **THEN** the client remains in the dialog, displays “Unable to validate the room. Try again.”, and does not navigate

#### Scenario: Validation response is unusable
- **WHEN** the validation endpoint succeeds without returning a boolean result
- **THEN** the client treats the outcome as a validation-service failure rather than as a missing room

#### Scenario: Visitor retries after failure
- **WHEN** the visitor activates the available action again after a validation-service failure
- **THEN** the client starts one new request using the current normalized identifier

#### Scenario: Visitor edits after failure
- **WHEN** the visitor edits the identifier after validation-service feedback is displayed
- **THEN** the client clears the obsolete feedback and waits for another explicit Join action

### Requirement: Dialog validation is not query-cached
The Join room dialog SHALL execute its explicit validation without using TanStack Query caching, background refetching, automatic retries, or supersession cancellation.

#### Scenario: Visitor validates the same identifier again
- **WHEN** a previous dialog validation has settled and the visitor explicitly submits the same identifier again
- **THEN** the client sends a new validation request instead of serving a cached dialog result

### Requirement: Direct room route validation remains immediate
The client SHALL continue using the existing query lifecycle to validate a room identifier obtained from `/room/:id` immediately.

#### Scenario: Visitor opens a room URL directly
- **WHEN** the Room route mounts with a non-empty identifier
- **THEN** the client starts room validation without waiting for a Join dialog action
