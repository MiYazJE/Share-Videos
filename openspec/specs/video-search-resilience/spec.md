## Purpose

Define resilient HTTP and YouTube discovery behavior that contains dependency and asynchronous request failures.

## Requirements

### Requirement: Upstream video discovery failures are contained
The server SHALL convert failures from the YouTube discovery dependency into an HTTP 502 response with a stable, non-sensitive error message, and MUST remain able to process subsequent requests.

#### Scenario: YouTube search rejects
- **WHEN** the YouTube dependency rejects while handling `GET /videos/youtube/:q`
- **THEN** the server returns HTTP 502 without exposing an upstream stack trace and continues serving later requests

#### Scenario: YouTube autocomplete rejects
- **WHEN** the YouTube dependency rejects while handling `GET /videos/autocomplete/youtube/:q`
- **THEN** the server returns HTTP 502 without terminating the Node.js process

### Requirement: Search result normalization tolerates malformed records
The server MUST inspect upstream video records defensively and SHALL omit any record that cannot be represented by the existing video response contract rather than throwing during application mapping.

#### Scenario: Search contains both valid and malformed records
- **WHEN** a completed YouTube search returns valid records together with records missing required nested video, thumbnail, or channel data
- **THEN** the response is successful and contains only records that can be normalized safely

#### Scenario: Every returned record is malformed
- **WHEN** a completed YouTube search returns no record that can satisfy the video response contract
- **THEN** the server returns a successful response with an empty `data` array and a boolean `isLastPage`

### Requirement: Successful video discovery remains compatible
The server SHALL preserve the existing successful response shapes for YouTube search and autocomplete.

#### Scenario: Search dependency returns valid data
- **WHEN** the YouTube dependency completes with valid video records
- **THEN** `GET /videos/youtube/:q` returns HTTP 200 with `{ data, isLastPage }` and normalized video fields expected by the client

#### Scenario: Autocomplete dependency returns suggestions
- **WHEN** the YouTube dependency completes with suggestions
- **THEN** `GET /videos/autocomplete/youtube/:q` returns HTTP 200 with the suggestion array

### Requirement: Asynchronous HTTP failures reach a terminal error boundary
The server MUST forward rejected asynchronous HTTP handlers to terminal Express error middleware, which SHALL log the failure and return a stable non-sensitive response when the response has not already completed.

#### Scenario: Unexpected asynchronous route failure
- **WHEN** an asynchronous HTTP handler rejects with an unexpected error
- **THEN** the terminal middleware returns HTTP 500 without exposing a stack trace and the process remains available

#### Scenario: Classified upstream failure
- **WHEN** an asynchronous HTTP handler reports a classified external-service failure
- **THEN** the terminal middleware preserves its safe HTTP status and public message while logging the underlying error

#### Scenario: Response headers were already sent
- **WHEN** an error reaches the terminal middleware after response headers were sent
- **THEN** the middleware delegates to Express connection handling rather than attempting a second response

### Requirement: Client video discovery contains request failures
The client SHALL expose search and autocomplete failures as recoverable discovery states and MUST keep the room workspace usable after either request fails.

#### Scenario: Video search request fails
- **WHEN** the video search endpoint rejects or returns a classified upstream failure
- **THEN** the search area presents safe failure feedback with a retry action and the participant can continue using the room

#### Scenario: Autocomplete request fails
- **WHEN** the autocomplete endpoint rejects
- **THEN** the client stops its pending indication, avoids rendering failed data as suggestions, and keeps the search input usable

### Requirement: Superseded discovery requests cannot replace active results
The client MUST associate search and autocomplete data with normalized input and pagination variables and SHALL cancel or ignore superseded requests.

#### Scenario: Search input changes before an earlier response completes
- **WHEN** the participant starts a second search before the first request settles
- **THEN** a later response for the first search does not replace results belonging to the active search

#### Scenario: Autocomplete input becomes empty
- **WHEN** the normalized autocomplete input is empty
- **THEN** the client does not request suggestions and displays no stale suggestion list

### Requirement: Discovery refresh preserves usable data
The client SHALL distinguish initial discovery loading from subsequent fetching and MUST retain applicable usable results while a pagination or background request is pending or fails.

#### Scenario: Next result page is pending
- **WHEN** the participant requests another page for the same search
- **THEN** the current results remain visible while the client indicates that the next page is loading

#### Scenario: Background discovery refresh fails
- **WHEN** cached results exist and a refresh for the same query fails
- **THEN** the client retains the cached results and presents non-blocking failure feedback
