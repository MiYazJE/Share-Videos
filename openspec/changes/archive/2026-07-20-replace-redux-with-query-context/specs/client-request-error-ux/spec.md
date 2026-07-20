## ADDED Requirements

### Requirement: HTTP failures have a consistent client contract
The client HTTP adapter MUST reject every failed request with normalized status, safe message, and diagnostic cause information, regardless of HTTP method, and query functions MUST NOT translate a failed request into successful `undefined` data.

#### Scenario: Any HTTP method fails
- **WHEN** Axios rejects a GET, POST, PUT, PATCH, or DELETE request
- **THEN** the calling query or mutation receives a rejected normalized error

#### Scenario: Successful response has no entity
- **WHEN** an endpoint succeeds without an entity payload
- **THEN** the API adapter returns the endpoint's intentional empty representation rather than using `undefined` to conceal a failure

### Requirement: Read workflows distinguish pending, empty, and failed outcomes
The client SHALL present initial pending, successful empty, recoverable failure, and successful data as distinct states at the nearest useful content boundary.

#### Scenario: Content has not loaded yet
- **WHEN** a blocking read is pending and no usable cached data exists
- **THEN** the client presents an accessible loading state for the affected content

#### Scenario: Read succeeds without records
- **WHEN** a read succeeds with an empty collection
- **THEN** the client presents an empty state and does not label the outcome as an error

#### Scenario: Blocking read fails
- **WHEN** a read fails and no usable data exists
- **THEN** the client presents a safe contextual error with a retry action when the operation is recoverable

#### Scenario: Background refresh fails
- **WHEN** a refetch fails while usable cached data exists
- **THEN** the client retains the data and presents non-blocking failure feedback

### Requirement: Mutation failures preserve user progress
The client MUST preserve relevant user input after a failed mutation, SHALL restore the ability to retry, and SHALL display safe contextual feedback.

#### Scenario: Login or registration fails
- **WHEN** the server rejects submitted credentials or registration data
- **THEN** the form retains appropriate entered values, exposes the server-safe validation outcome, and permits correction and resubmission

#### Scenario: Room creation fails
- **WHEN** room creation does not complete
- **THEN** the client remains on the current workflow, retains the nickname, and offers a recoverable action without navigating to a room

### Requirement: Feedback matches failure scope
The client MUST use inline or page-level feedback for failures that block primary content and MAY use transient notifications for non-blocking outcomes, but MUST NOT rely solely on a transient notification for unavailable primary content.

#### Scenario: Primary route content cannot load
- **WHEN** a required route-level resource fails without cached data
- **THEN** the failure remains visible in the route until the user retries, navigates away, or the resource succeeds

#### Scenario: Non-blocking action fails
- **WHEN** an ancillary action fails without making the current content unusable
- **THEN** the client may use a transient notification while keeping the current content available

