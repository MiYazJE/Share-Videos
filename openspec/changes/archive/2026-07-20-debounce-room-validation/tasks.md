## 1. Implement submission-driven dialog validation

- [x] 1.1 Remove `useRoom` from `DialogJoinRoom` and call the existing `validateRoom` API only from the Join handler after trimming and checking the identifier.
- [x] 1.2 Add local pending and feedback state, clear obsolete feedback when the input changes, and prevent duplicate requests while pending.
- [x] 1.3 Map a boolean `true` response to closing and normalized Room navigation, and map boolean `false` to the “Room does not exist” inline message without navigation.
- [x] 1.4 Map rejected requests and non-boolean successful payloads to “Unable to validate the room. Try again.” while preserving the input and allowing an explicit retry.
- [x] 1.5 Guard completion effects when the visitor closes or the dialog unmounts during a pending request, without introducing dialog request cancellation or caching.
- [x] 1.6 Confirm `useRoom`, Axios signal forwarding, and the Room route remain unchanged for immediate direct-URL validation.

## 2. Add focused behavior coverage

- [x] 2.1 Add Cypress coverage proving typing sends no validation request, submitting sends one normalized request, and empty or whitespace-only submission sends none.
- [x] 2.2 Add Cypress coverage proving the Join action is loading and disabled during a delayed request and repeated activation cannot start a duplicate request.
- [x] 2.3 Add Cypress coverage for successful navigation, missing-room feedback, validation-service failure, unusable responses, editing after feedback, and manual retry without cached results.
- [x] 2.4 Add Cypress coverage proving dismissal during a pending request does not navigate and direct `/room/:id` validation remains immediate.

## 3. Validate the client change

- [x] 3.1 Run client lint and resolve errors introduced by the change.
- [x] 3.2 Run the focused room-entry Cypress journey with client and server ports aligned.
- [x] 3.3 Run `npm run test:ci` when the paired services are available and record any repository-documented runner caveat.
