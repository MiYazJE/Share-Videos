# Known issues and inconsistencies

These are source-backed findings, not specifications or fixes. Resolve each through a separate OpenSpec change when desired.

| Finding | Evidence | Likely impact |
| --- | --- | --- |
| Local port defaults conflict | `client/src/utils/http.js` and the Socket provider default to server port 5000; `server/config/config.js` defaults to 3000 | Starting both defaults puts Vite and Express on port 3000 while the client calls 5000 |
| Playlist ownership query uses the wrong field | model defines `userId`; `server/app/api/playlists/playlists.controller.js` queries `{ user: id }` | Authenticated playlist retrieval can return no saved playlists |
| Add-video self-notification has incorrect arguments | `roomsController.addVideo` calls `emitToMe(socket, roomId, NOTIFY_MESSAGE, ...)`, but `eventsHandler.emitToMe` accepts `(socket, event, payload)` | Sender may receive an event named by room ID instead of `WS_NOTIFY_MESSAGE` |
| Client declares unmatched events | `WS_GET_VIDEO` and `WS_UPDATE_PROGRESS_VIDEO` exist only in `client/src/enums/messages.ws.js` | They can be mistaken for active contracts |
| Client declares `/auth/logout`, server does not | `client/src/enums/api-routes.js`; auth router has no logout route and client logout is local-only | Contract inventory can incorrectly imply a server logout endpoint |
| Playlists route has no current client consumer | server playlists router versus client API enum/usage | Saved playlists are not exposed through the current UI |
| Host is reassigned after every departure | `server/lib/roomsController.js` selects a random remaining user unconditionally | A non-host leaving can change the host unexpectedly |
| Logged-in room join does not handle missing lookup | `usersBll.getUserByName` can return null; join appends the result | Stale client identity can place null in `room.users` and later leave logic can fail |
| Passport middleware ordering/session setup is inconsistent | routes are mounted before `passport.initialize()` in `server/app.js`; `passport.session()` is used without session middleware | Passport-backed `/playlists/getAll` may fail or behave unexpectedly |
| Default JWT secret is insecure outside local development | `server/config/config.js` supplies `ACCESS_SECRET_TOKEN` fallback | Tokens are predictable if deployment omits the variable |
| Server lint covers only root files | `server/package.json` runs `eslint *.js` | Most files under `app/`, `lib/` and `config/` are not linted by the routine script |
| Server lint currently fails | `npm run lint` reports missing trailing comma and final newline in `server/.eslintrc.js`; it also reports a console warning in `server.js` | Routine backend validation is red before application changes are made |
| Random color generation is not zero-padded | `server/app/helpers/getRandomColor.js`; auth test expected 7 characters but observed `#cb01f` during validation | Registration can store an invalid short hex color and the auth suite is nondeterministically red |
| Jest reports open handles | `npm test -- --runInBand` reports two Supertest server handles from auth tests | Test process lifecycle is not fully clean even when assertions finish |
| Root Cypress config differs from client config | root `cypress.config.js` and `client/cypress.config.js` define different options | Running Cypress from the wrong directory produces different behavior |
| Docker metadata is inconsistent | `server/Dockerfile.dev` exposes 5000 while the process defaults to 3000; Compose correctly maps host 5000 to container 3000 | Direct image users can infer the wrong internal port |
| Compose assumes a host npmrc | `docker-compose.yml` bind-mounts `~/.npmrc` | Startup may fail on machines without that file or with incompatible path expansion |
| Fatal backend restart loses active rooms | A production supervisor can restart a fatally failed backend, while room, membership, playback, queue, and chat state exists only in server memory | Service availability recovers automatically, but participants must create or rejoin a new room |
| Development backend is not a production supervisor | `Dockerfile.dev` runs Nodemon, which can remain alive after its Node child crashes even though Compose uses a restart policy | Local hot reload is preserved, but automatic fatal recovery requires a production runtime that executes and supervises `npm start` directly |
| README roadmap is stale | registration exists and registration creates a default playlist, while README lists playlists as future work | Public orientation understates implemented backend behavior and overstates UI completeness |
| Video validation message names the wrong domain | `server/app/api/videos/videos.validation.js` reports “Room name is required” for missing search query | API validation feedback is misleading |
| Unused authentication import in videos router | `userAuthMiddleware` is imported but not used | Readers may incorrectly assume video search requires authentication |

## Validation snapshot

Validated during the `document-repository-context` change:

- Client `npm run lint`: exits 0 with two unused-parameter warnings in `client/cypress.config.js`.
- Client `npm run test:ci`: exits 0 after printing Cypress CLI help; no E2E specs run.
- Server `npm run lint`: exits 1 with two errors in `.eslintrc.js` and one console warning.
- Server `npm test -- --runInBand`: the sandbox run could not spawn MongoDB; an approved unrestricted rerun executed all suites, with 16/17 tests passing and the random-color assertion failing. Jest also reported two open handles.
- No build was run because this documentation and skill change does not affect Vite, packaging, or deployment.
