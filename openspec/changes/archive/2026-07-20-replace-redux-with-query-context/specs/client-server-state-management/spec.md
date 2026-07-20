## ADDED Requirements

### Requirement: HTTP-backed state uses a query lifecycle
The client SHALL manage HTTP-backed reads through TanStack Query and MUST key each query with every variable that can change its returned resource.

#### Scenario: A resource is requested repeatedly
- **WHEN** multiple mounted consumers request the same resource with the same inputs
- **THEN** the client shares the query result and request lifecycle instead of storing duplicate Redux state

#### Scenario: Query inputs change
- **WHEN** an input that affects the returned resource changes
- **THEN** the client uses a distinct query key and resolves data for the new input

### Requirement: Data modifications use explicit mutations
The client SHALL represent login, registration, room creation, and other HTTP modifications as mutations and MUST prevent duplicate submissions while the corresponding mutation is pending.

#### Scenario: User submits a mutation twice while pending
- **WHEN** a mutation-triggering action is already pending
- **THEN** the client prevents a second equivalent submission until the first settles

#### Scenario: Mutation returns canonical updated data
- **WHEN** a successful mutation response is sufficient to update an affected cached resource
- **THEN** the client updates that resource directly or invalidates it according to the resource contract

### Requirement: Authentication has an explicit session lifecycle
The client SHALL derive authenticated identity from a session query, SHALL retain token storage outside the query cache, and MUST clear identity-sensitive cached data when the user logs out.

#### Scenario: Stored credentials identify a user
- **WHEN** application bootstrap successfully resolves the current user
- **THEN** authenticated consumers receive the resolved identity and bootstrap completes

#### Scenario: Stored credentials are absent or rejected as unauthenticated
- **WHEN** application bootstrap receives the expected unauthenticated outcome
- **THEN** the client resolves an anonymous session without presenting a service-failure message

#### Scenario: Session service is unavailable
- **WHEN** application bootstrap fails for a reason other than the expected unauthenticated outcome
- **THEN** the client exposes a recoverable session error instead of treating the user as definitively anonymous

#### Scenario: User logs out
- **WHEN** logout removes the local token
- **THEN** the client resets the session to anonymous and removes identity-sensitive cached data

### Requirement: Query behavior is selected per resource
The client MUST define retry, staleness, refetch, and cache behavior according to each resource's semantics and MUST NOT retry deterministic authentication, authorization, validation, or not-found failures by default.

#### Scenario: Recoverable read fails transiently
- **WHEN** a read fails with a retryable network or server condition
- **THEN** the client follows the bounded retry policy defined for that resource

#### Scenario: Read fails with deterministic client status
- **WHEN** a read fails with a classified non-retryable 4xx response
- **THEN** the client presents the outcome without automatic repeated requests

