## Why

Backend tests currently depend on `mongodb-memory-server`, which downloads and executes a MongoDB binary that is unavailable in the development container. The same tests pass on the host but fail inside Docker, so the test workflow should use the MongoDB service already available in local and container development while keeping test data isolated from normal application data.

## What Changes

- Remove the in-memory MongoDB test implementation and the `mongodb-memory-server` dependency.
- Configure the backend test command to connect to a real MongoDB instance using a dedicated test database name.
- Preserve deterministic test cleanup while preventing tests from deleting or overwriting the normal local-development database.
- Require MongoDB to be running before database-backed backend tests such as `auth.test.js` are executed, both on the host and in Docker.
- Update backend and development guidance to document the MongoDB prerequisite, host/container connection behavior, and test database isolation.

## Capabilities

### New Capabilities

- `backend-test-database`: Defines how database-backed backend tests connect to a real MongoDB instance, isolate their data in a dedicated test database, and clean up safely.

### Modified Capabilities

- `repository-context-documentation`: Development and backend guidance must describe the real-MongoDB test prerequisite, configuration, and host/container commands instead of the in-memory database workflow.

## Impact

- Backend test and database configuration under `server/jest/` and `server/config/`.
- `server/app/api/auth/auth.test.js` database setup and cleanup behavior.
- `server/package.json` and `server/package-lock.json` dependency and test-script configuration.
- Local and Docker test execution now depend on a reachable MongoDB service; no HTTP or WebSocket contract changes are expected.
- `docs/development.md` and scoped repository guidance must be kept consistent with the new workflow.
