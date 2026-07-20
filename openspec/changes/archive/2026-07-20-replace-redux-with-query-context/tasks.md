## 1. Query and HTTP foundation

- [x] 1.1 Add `@tanstack/react-query` to the client and run TanStack Intent discovery to record whether the installed version exposes compatible official Query skills
- [x] 1.2 Delete `proposal-react-query-skill.md` and, when compatible official skills exist, install or wire them for Codex without creating duplicate local guidance
- [x] 1.3 If no compatible official skill exists, use `skill-creator` to replace the deleted draft with a repository-local skill limited to Share-Videos state boundaries, HTTP errors, query UX, Socket.IO integration, testing, and migration checks, then run the skill's structural validation
- [x] 1.4 Create the application QueryClient configuration and mount its provider without changing current workflow behavior
- [x] 1.5 Add reusable client test helpers that create an isolated QueryClient with deterministic retry behavior
- [x] 1.6 Refactor the Axios wrapper so every HTTP method returns successful response data and rejects failures through one normalized application-error contract
- [x] 1.7 Add focused tests for successful, empty, network, classified 4xx, and server-error HTTP adapter outcomes

## 2. Room validation and video discovery

- [x] 2.1 Replace the manual room-validation effect with a keyed query that distinguishes pending, invalid-room, retryable failure, and success outcomes
- [x] 2.2 Create video search and autocomplete API functions and query option factories with normalized input, pagination keys, conditional execution, and Axios cancellation signals
- [x] 2.3 Migrate video search, autocomplete, result pagination, and related loading selectors from Rematch to query hooks
- [x] 2.4 Implement accessible initial-loading, empty, retained-results, background-fetching, inline-error, and retry UX for video discovery
- [x] 2.5 Add coverage for superseded searches, empty autocomplete input, pagination loading, retained cached results, and failed discovery recovery

## 3. Authentication and room creation

- [x] 3.1 Implement the current-user session query with explicit anonymous, authenticated, pending, and service-error outcomes
- [x] 3.2 Migrate login and registration to mutations that preserve form progress, prevent duplicate submissions, normalize feedback, and refresh or update session data
- [x] 3.3 Migrate logout to remove the token, reset the session, and clear identity-sensitive query data without unnecessarily discarding public data
- [x] 3.4 Migrate room creation to a mutation that retains the nickname and current route on failure and navigates only after success
- [x] 3.5 Replace route, navigation, login, registration, home, and room consumers of Redux authentication/loading selectors with the new session interfaces
- [x] 3.6 Add coverage for anonymous bootstrap, authenticated bootstrap, unavailable session service, failed credentials, duplicate submission prevention, logout cleanup, and failed room creation

## 4. Realtime room and transient client state

- [x] 4.1 Define the room reducer state and explicit actions for room snapshots, chat, playback, queue, membership, progress, current video, and route cleanup
- [x] 4.2 Refactor the Socket.IO provider into stable action and focused state boundaries while preserving the existing `/socket-io` path and event payloads
- [x] 4.3 Introduce transient guest identity ownership outside the authenticated session query and migrate room entry/name-dialog behavior
- [x] 4.4 Migrate Room, Chat, SharedPlaylist, player metadata, playback helpers, and room action components from Redux selectors and dispatches to focused room hooks
- [x] 4.5 Verify leaving or unmounting a room emits the existing leave event and clears route-scoped realtime state
- [x] 4.6 Add reducer/provider coverage for room snapshots, chat updates, playback progress, guest join, authenticated join, and cleanup

## 5. Feedback and Redux removal

- [x] 5.1 Replace the Redux notifier with Chakra toast or a minimal notification wrapper while keeping blocking request failures visible inline
- [x] 5.2 Audit every client HTTP call and record an intentional loading, empty, error, retry, and pending-mutation experience for each workflow
- [x] 5.3 Remove remaining `useSelector`, `useDispatch`, Rematch model, loading-plugin, store, and Redux provider usage after confirming no migrated resource has dual ownership
- [x] 5.4 Remove `@rematch/core`, `@rematch/loading`, and `react-redux` dependencies and delete obsolete model/store files
- [x] 5.5 Confirm repository search finds no remaining Redux/Rematch imports, selectors, dispatch calls, or stale loading flags

## 6. Documentation and validation

- [x] 6.1 Update client architecture documentation with QueryClient, HTTP query ownership, focused realtime context boundaries, transient guest identity, and notification behavior
- [x] 6.2 Update HTTP and WebSocket integration documentation for normalized client errors and unchanged wire contracts
- [x] 6.3 Update development guidance with TanStack Query/Intent discovery information and any new targeted test commands
- [x] 6.4 Run client lint and targeted automated tests for the migrated workflows, and configure `test:ci` to execute Cypress headlessly in Chrome
- [x] 6.5 Run the relevant Cypress room, home, and authentication journeys against aligned client/server ports and resolve regressions introduced by the migration
