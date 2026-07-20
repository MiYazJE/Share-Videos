## ADDED Requirements

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
