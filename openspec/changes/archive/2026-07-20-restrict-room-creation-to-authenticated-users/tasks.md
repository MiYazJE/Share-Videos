## 1. Secure the room creation API

- [x] 1.1 Harden the user-resolving bearer middleware so missing, invalid, expired, and valid-but-userless identities all return HTTP 401 without calling the route controller.
- [x] 1.2 Protect only `POST /rooms/create`, remove its creator-name request validation, and derive the room host from `req.user.name` while leaving room validation public.
- [x] 1.3 Add server route coverage proving authenticated creation uses the stored user name, supplied names cannot spoof the host, unauthorized requests create nothing, and `GET /rooms/:id/isValid` remains public.

## 2. Add the client authentication gate

- [x] 2.1 Update the room API and creation mutation so the client sends no creator nickname and navigates only after a successful response.
- [x] 2.2 Add an authentication-required popup that keeps Create room visible to anonymous visitors and offers transitions to the existing login and registration flows without issuing a create request.
- [x] 2.3 Track and cancel gate-specific pending creation intent, and consume it exactly once after successful login or post-registration login while ensuring independent authentication never creates a room.
- [x] 2.4 Make the Create room action unavailable while session restoration is pending, preserve public guest joining and its nickname input, and retain normalized notification handling without navigation for failed creation.

## 3. Verify client behavior

- [x] 3.1 Add client tests for anonymous gating, login and registration choices, cancellation, authentication failure, and the absence of premature create requests.
- [x] 3.2 Add client tests for exactly-once post-authentication creation, independent login without creation, restored-session behavior, pending-session gating, creation failure without navigation, and unchanged anonymous joining.

## 4. Update contracts and run validation

- [x] 4.1 Update `docs/contracts/http-api.md` and `docs/domain/rooms.md` with authenticated creation, server-derived host identity, the body-contract change, and public validation/join behavior.
- [x] 4.2 Run server lint and tests from `server/`, resolving regressions related to the change.
- [x] 4.3 Run client lint and `test:ci` from `client/`, recording any repository-documented test-runner caveat that prevents full execution.
