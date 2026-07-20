## Context

`DialogJoinRoom` currently passes its input directly to `useRoom`, so its TanStack Query executes `GET /rooms/:id/isValid` whenever the query key changes. That behavior validates partial identifiers as the visitor types. The dialog only needs the result at the moment the visitor asks to join, and it does not benefit from caching or background synchronization for this one-shot decision.

The Room route also uses `useRoom` to validate `/room/:id` before joining through Socket.IO. That route-level resource lifecycle remains a suitable TanStack Query use case and must remain immediate. The shared `validateRoom` API function already rejects normalized HTTP errors and can be called directly by the dialog.

## Goals / Non-Goals

**Goals:**

- Start exactly one room-existence request when the visitor activates Join.
- Prevent duplicate submissions while validation is pending.
- Distinguish an existing room, a confirmed missing room, and a request/service failure.
- Preserve the input and dialog after non-successful outcomes so the visitor can edit or retry.
- Normalize surrounding whitespace before validation and navigation.
- Keep direct Room URL validation on TanStack Query and immediate.

**Non-Goals:**

- Changing the public `GET /rooms/:id/isValid` HTTP contract.
- Caching, aborting, retrying automatically, or background-refetching dialog validation.
- Changing `useRoom` or its route-level behavior.
- Persisting, reserving, or implicitly creating room identifiers.
- Changing authentication, guest nicknames, or Socket.IO joining.

## Decisions

### Validate only from the Join action

The dialog will retain its input as local state and will not mount a query for that input. Its Join handler will trim the identifier, report the existing required-field error when empty, and otherwise call `validateRoom({ id })` directly.

Debounce was rejected because no request is needed before submission. TanStack Query was rejected for the dialog because this is an imperative, one-shot validation tied to an action rather than server state that the rendered dialog must continuously synchronize or share.

### Use an explicit local request lifecycle

The dialog will own local pending and feedback state. Before the request it clears prior feedback and sets pending. While pending, Join is disabled and displays a loading state, so repeated activation cannot start another request. The pending state is cleared in `finally` for every outcome.

No `AbortController` is needed for this interaction because input changes do not start or supersede requests and duplicate submission is disabled. If the dialog closes while a request is pending, the implementation must avoid navigating or updating dialog state after closure, using a small mounted/open guard if required by the component lifecycle.

### Map the three request outcomes explicitly

- `true`: close the dialog and navigate using the normalized identifier.
- `false`: remain in the dialog and show “Room does not exist”.
- rejection or unusable response: remain in the dialog and show contextual recoverable feedback such as “Unable to validate the room. Try again.”

A negative boolean is a valid domain result, not an exception. Transport, server, and malformed-response failures are operational errors and must not be presented as “Room does not exist”. The shared Axios normalization remains responsible for safe error objects; the dialog provides the user-facing context.

### Retry is another explicit Join attempt

After a failure, the action may be labelled Retry or Join according to the established UI pattern. Activating it calls the endpoint again with the current normalized input. Editing the input clears obsolete feedback and the next action validates the edited value.

Automatic retries were rejected because the visitor explicitly controls attempts and the endpoint's negative result is deterministic.

### Preserve route-level query validation

`useRoom`, its query key, short stale time, and Axios signal forwarding remain unchanged for the Room route. A visitor opening `/room/:id` therefore receives immediate declarative validation, including the existing loading, retry, and not-found navigation behavior.

## Risks / Trade-offs

- [The room can disappear between successful dialog validation and route validation] → The Room route validates again before Socket.IO joining and redirects when the room no longer exists.
- [The visitor closes the dialog during a pending request] → Guard post-request effects against a closed or unmounted dialog; do not navigate after cancellation by dismissal.
- [The endpoint returns a non-boolean success payload] → Treat it as an unusable response and show the recoverable validation-service message.
- [Repeated manual retries can generate traffic] → Disable duplicate requests while pending; deliberate retries after settlement remain allowed.
- [The change directory name still mentions debounce] → Keep the existing OpenSpec identifier to preserve change history; artifacts define the revised submission-driven behavior.

## Migration Plan

1. Remove dialog usage of `useRoom` and call `validateRoom` from its Join handler.
2. Add local pending/feedback state and outcome mapping without changing the shared hook.
3. Add focused Cypress coverage and run client validation.

Rollback restores query-driven dialog validation; no server or stored-data migration is involved.

## Open Questions

None.
