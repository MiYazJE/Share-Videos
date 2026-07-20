# Authenticated Room Creation Specification

## Purpose

Define how room creation is restricted to authenticated users while preserving public access to existing rooms.

## Requirements

### Requirement: Only authenticated users can create rooms
The server SHALL require a valid bearer-authenticated user for `POST /rooms/create` and SHALL reject callers without a valid authenticated user with HTTP 401 without creating a room.

#### Scenario: Authenticated user creates a room
- **WHEN** a registered user sends `POST /rooms/create` with a valid bearer token
- **THEN** the server creates one ephemeral room and returns it successfully

#### Scenario: Anonymous caller attempts creation
- **WHEN** a caller sends `POST /rooms/create` without a bearer token
- **THEN** the server responds with HTTP 401 and creates no room

#### Scenario: Invalid or stale identity attempts creation
- **WHEN** a caller sends `POST /rooms/create` with an invalid or expired token, or with a valid token whose user no longer exists
- **THEN** the server responds with HTTP 401 and creates no room

### Requirement: Room creator identity is server-authoritative
The server MUST derive the new room host name from the authenticated user resolved by the bearer token and MUST NOT accept a client-supplied creator name as authoritative input.

#### Scenario: Authenticated creation establishes host
- **WHEN** an authenticated user creates a room
- **THEN** the room host equals the authenticated user's stored name

#### Scenario: Client attempts to supply another creator name
- **WHEN** an authenticated caller includes a creator name that differs from the authenticated user's stored name
- **THEN** the server does not use the supplied name as the room host

### Requirement: Anonymous visitors are guided to authentication
The client SHALL keep the Create room action visible to anonymous visitors and SHALL show an authentication-required popup with login and registration choices instead of sending a room-creation request when they activate it.

#### Scenario: Anonymous visitor selects Create room
- **WHEN** session restoration has completed as anonymous and the visitor activates Create room
- **THEN** the client opens the authentication-required popup and sends no `POST /rooms/create` request

#### Scenario: Visitor chooses an authentication path
- **WHEN** the authentication-required popup is open and the visitor chooses login or registration
- **THEN** the client opens the corresponding existing authentication flow

#### Scenario: Visitor cancels authentication
- **WHEN** the visitor closes the creation gate or exits its login or registration flow without authenticating
- **THEN** the client cancels the pending creation intent and creates no room

### Requirement: Creation resumes after gate-initiated authentication
The client SHALL preserve a room-creation intent initiated through the authentication-required popup and SHALL submit exactly one creation request after that visitor successfully authenticates.

#### Scenario: Login completes pending creation
- **WHEN** a visitor successfully logs in after selecting login from the creation gate
- **THEN** the client closes the authentication flow, sends one authenticated room-creation request, and navigates to the returned room

#### Scenario: Registration completes pending creation
- **WHEN** a visitor successfully registers and the existing post-registration login succeeds after selecting registration from the creation gate
- **THEN** the client sends one authenticated room-creation request and navigates to the returned room

#### Scenario: Independent login has no creation side effect
- **WHEN** a visitor logs in through a path that was not opened from a pending room-creation intent
- **THEN** the client authenticates the user without creating a room

#### Scenario: Authentication fails
- **WHEN** login or post-registration login fails while creation is pending
- **THEN** the client sends no room-creation request and does not navigate to a room

### Requirement: Session restoration prevents false anonymous gating
The client MUST NOT decide whether room creation is authorized until session restoration has settled.

#### Scenario: Session restoration is pending
- **WHEN** the Home page is restoring the current session
- **THEN** the Create room action is unavailable or visibly loading and neither the authentication-required popup nor a creation request is triggered

#### Scenario: Existing authenticated session is restored
- **WHEN** session restoration resolves to an authenticated user
- **THEN** activating Create room sends an authenticated creation request without showing the authentication-required popup

### Requirement: Public room entry remains available
The system SHALL keep room validation and Socket.IO room joining available without authentication.

#### Scenario: Anonymous visitor validates and joins an existing room
- **WHEN** an anonymous visitor supplies a nickname and enters the identifier of an existing room
- **THEN** the visitor can validate and join that room without first logging in or registering

#### Scenario: Anonymous visitor cannot turn joining into creation
- **WHEN** an anonymous visitor validates or attempts to join an unknown room identifier
- **THEN** the system does not create a room implicitly

### Requirement: Creation authorization failures do not navigate
The client SHALL present room-creation authorization failures through its normalized error notification behavior and SHALL remain outside the requested room.

#### Scenario: Token becomes invalid before creation
- **WHEN** the client submits a create request believing the user is authenticated and the server responds with HTTP 401
- **THEN** the client displays the request failure and does not navigate to a room
