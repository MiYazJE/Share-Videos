## Why

Room creation is currently available to anonymous visitors and trusts a client-supplied host name. Restricting creation to authenticated users gives registered accounts a meaningful privilege and makes the server, rather than the UI, the authority for creator identity.

## What Changes

- Require a valid authenticated session to create an ephemeral room.
- Derive the room host identity from the authenticated server-side user instead of accepting a creator name from the request body.
- Keep room validation and room joining available to anonymous visitors.
- Keep the Create room action visible to anonymous visitors, but show an authentication-required popup offering login and registration instead of sending a create request.
- Resume the pending room creation automatically after successful login or registration initiated from that popup.
- Prevent room creation while client session restoration is still pending, and surface authorization failures through the existing notification behavior.
- **BREAKING**: `POST /rooms/create` changes from an unauthenticated endpoint accepting `{ name }` to an authenticated endpoint that does not accept the creator identity from the client.

## Capabilities

### New Capabilities

- `authenticated-room-creation`: Authorization, trusted creator identity, anonymous-user guidance, and post-authentication resumption for room creation while preserving public room joining.

### Modified Capabilities

None.

## Impact

- Server room router, authentication middleware integration, room controller, and HTTP route tests.
- Client room API, Home orchestration, creation controls, authentication modals, session-loading behavior, and Cypress coverage.
- The HTTP API and room lifecycle documentation.
- No room persistence or Socket.IO joining contract changes are introduced.
