## Context

Rooms are ephemeral objects held by `server/lib/roomsController.js`. The Home page currently sends a visitor-entered nickname to unauthenticated `POST /rooms/create`; the server trusts that value as the room host, then the client navigates to the room and joins through the existing public Socket.IO flow. Authentication is restored asynchronously by `SessionContextProvider`, bearer tokens are already attached by the shared Axios wrapper, and Home already owns the login and registration modal orchestration.

This change crosses the HTTP contract, authentication boundary, Home interaction state, tests, and documentation. It must preserve anonymous room joining and must not persist rooms or require Socket.IO authentication.

## Goals / Non-Goals

**Goals:**

- Make the server authoritative about whether a caller may create a room and who the creator is.
- Give anonymous visitors a clear path to authenticate without hiding the Create room action.
- Preserve the visitor's creation intent across login or registration and complete it after authentication.
- Avoid treating a temporarily unresolved client session as anonymous.
- Keep public room validation and guest joining unchanged.

**Non-Goals:**

- Restricting room discovery, validation, joining, playback, queue, or chat operations to authenticated users.
- Authenticating the Socket.IO handshake or redesigning the client-supplied `isLogged` join payload.
- Persisting rooms, ownership, or host reassignment in MongoDB.
- Introducing roles, subscription tiers, or additional privileges beyond room creation.
- Redesigning the general login and registration experiences.

## Decisions

### Protect only the room creation route

`POST /rooms/create` will use the established user-resolving bearer middleware. `GET /rooms/:id/isValid` and `WS_JOIN_ROOM` remain public, so an anonymous visitor can validate and enter a room created by somebody else.

Protecting the router as a whole was rejected because it would also make validation private and prevent the intended guest-entry flow. UI-only enforcement was rejected because direct HTTP clients could bypass it.

### Derive the host from the authenticated user

The create controller will pass `req.user.name` to the in-memory room controller. The endpoint will no longer accept `name` as creator identity, and the client room API will issue the request without a nickname payload.

Retaining a client-supplied name was rejected because authorization without trusted identity would still allow host-name spoofing. The internal room controller may continue accepting a host name because it is also a focused domain unit with direct tests; trust is established at the HTTP boundary.

The authentication middleware will reject a validly signed token whose referenced user no longer exists, ensuring the controller never creates a room with an absent identity.

### Gate creation in Home while retaining a visible action

The Create room control remains visible. While session restoration is pending, it is disabled or loading so the UI does not briefly classify a token-bearing user as anonymous. Once restoration resolves:

- authenticated activation starts the create mutation directly;
- anonymous activation records a pending-create intent and opens an authentication-required popup;
- the popup offers actions that transition into the existing login or registration modal flows.

Hiding or permanently disabling the action for visitors was rejected because it obscures the privilege and offers no direct conversion path.

### Resume only creation initiated through the authentication gate

After login succeeds, including the automatic login already performed after successful registration, Home checks the pending-create intent. If present, it clears the intent and starts one room creation request. Authentication initiated independently from the navigation bar does not create a room.

The intent is cleared before starting the request to avoid duplicate creation from repeated renders or callbacks. Closing the gate, login, or registration flow without successful authentication cancels the pending intent. A failed login keeps the user in the authentication flow but does not send a create request.

Requiring a second click after authentication was considered simpler, but it needlessly discards a clear user intent. Automatically creating after every login was rejected because normal navigation-bar login must not have that side effect.

### Preserve existing failure presentation

Create-request failures continue through the normalized Axios error and notification path. A backend `401` remains authoritative for expired or invalid credentials even if the client believed the session was authenticated; no room navigation occurs on failure.

## Risks / Trade-offs

- [Pending intent can cause duplicate rooms if handled in an effect with unstable dependencies] → Consume and clear the intent synchronously in the successful authentication orchestration before invoking the mutation, and cover the behavior with a single-request test.
- [Session restoration can fail for reasons other than anonymous access] → Continue distinguishing expected `401`/missing-token state from operational failures and do not offer creation until restoration reaches a settled usable state.
- [JWT may be valid while its user has been deleted] → Make the user-resolving middleware return `401` when lookup produces no user.
- [The nickname field currently serves both creation and guest joining concepts] → Stop using it as creation input; preserve it only where guest joining requires a display name and avoid a broader Home redesign in this change.
- [Changing the create request body breaks older clients] → Treat this as an intentional API contract change; coordinated client and server deployment is required.

## Migration Plan

1. Add server authorization and trusted-user handling with route tests.
2. Update the client API and Home authentication-gate orchestration with UI tests.
3. Update HTTP and room lifecycle documentation in the same change.
4. Deploy server and client together because old anonymous clients will receive `401` and the creator-name request body is no longer authoritative.

Rollback consists of restoring the former route and request body contract together with the former client creation flow; no stored room data requires migration.

## Open Questions

None. The proposal adopts automatic post-authentication creation only when authentication began from the creation gate.
