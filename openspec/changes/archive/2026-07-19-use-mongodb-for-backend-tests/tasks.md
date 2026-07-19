## 1. Replace the in-memory test database

- [x] 1.1 Update Jest setup to force the dedicated `share-videos-test` database name before backend modules load while leaving `URL_MONGO_DB` configurable for host and container execution.
- [x] 1.2 Simplify backend database creation to always use the normal Mongoose adapter, remove the `IN_MEMORY_DATABASE` configuration contract, and delete the in-memory database adapter.
- [x] 1.3 Remove `mongodb-memory-server` from `server/package.json` and regenerate `server/package-lock.json` with npm.

## 2. Preserve authentication test isolation

- [x] 2.1 Update `auth.test.js` lifecycle cleanup to delete test-created user and playlist documents from the dedicated test database between cases and disconnect cleanly after the suite.
- [x] 2.2 Add or adjust test assertions/setup as needed to prove the configured database name is test-only and the authentication cases remain independent.

## 3. Document the real-MongoDB workflow

- [x] 3.1 Update `docs/development.md` with the MongoDB prerequisite, forced test database name, and verified commands/URLs for running backend tests from the host and inside Docker Compose.
- [x] 3.2 Update `server/AGENTS.md` and any affected configuration guidance to remove references to `mongodb-memory-server` and the in-memory database selector.

## 4. Validate host and container behavior

- [x] 4.1 Run `npm run lint` from `server/` and resolve regressions introduced by the change.
- [x] 4.2 With MongoDB running, run `npm test` from `server/` against the host-reachable Compose MongoDB endpoint and confirm the dedicated test database is used.
- [x] 4.3 Run the backend tests inside the Compose backend service against `mongodb://mongo:27017`, confirming `auth.test.js` passes without a MongoDB binary in the backend image and normal application data remains intact.
