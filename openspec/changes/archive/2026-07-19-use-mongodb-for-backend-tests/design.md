## Context

Jest currently loads `server/jest/config.dev.js`, which enables `IN_MEMORY_DATABASE`. `server/config/createDatabase.js` then selects `database.dev.js`, where `mongodb-memory-server` downloads and starts its own MongoDB binary. That binary is not part of the Alpine development image, so `npm test` behaves differently on the host and in the backend container even though Docker Compose already provides a MongoDB service.

The production MongoDB adapter already accepts `URL_MONGO_DB` and `NAME_MONGO_DB`. Tests can reuse that connection path, but they must force a test-only database name before application modules load and must retain cleanup between test cases. The normal application database defaults to `share-videos`; the test database must never share that name.

## Goals / Non-Goals

**Goals:**

- Make database-backed Jest tests use a reachable local or Docker MongoDB instance.
- Make `npm test` select a dedicated test database automatically.
- Keep test cases isolated by removing test-created data between cases.
- Remove the runtime binary download and `mongodb-memory-server` dependency.
- Document the exact host and container prerequisites and commands.

**Non-Goals:**

- Provision or start MongoDB from Jest.
- Change authentication behavior, schemas, routes, or persisted production data.
- Make rooms or other ephemeral state persistent.
- Add MongoDB to the backend Dockerfile; Compose remains responsible for the database service.

## Decisions

### Reuse the normal Mongoose connection adapter

Tests will connect through the same Mongoose adapter as the running application. The in-memory adapter, selector flag, and `mongodb-memory-server` package will be removed. This exercises the supported database path and avoids a container-specific MongoDB binary.

An alternative was to install the required binary or compatibility libraries in the backend image. That retains duplicate database implementations, increases image and maintenance cost, and continues to make test startup dependent on binary download behavior.

### Force a dedicated database name in Jest setup

Jest setup will assign a fixed, clearly test-only `NAME_MONGO_DB` (for example, `share-videos-test`) before the database configuration is imported. It will not replace `URL_MONGO_DB`: the URI remains environment-selectable so host execution can use `mongodb://localhost:27018` with Compose while container execution can use `mongodb://mongo:27017`.

The database name will be forced rather than merely supplied as a fallback. This prevents a caller's normal development `NAME_MONGO_DB` value from causing tests to write to or clean the application database.

An alternative was to encode the database name in `URL_MONGO_DB`. Keeping address and database selection separate matches the existing configuration contract and makes the safety invariant explicit.

### Clean only the models owned by the test suite

`auth.test.js` will delete test-created `User` and `Playlist` documents between cases while connected to the dedicated test database. Cleanup will not expose or reuse an unrestricted production `dropDatabase` helper. Connection shutdown will disconnect Mongoose without deleting any non-test database.

This is narrower than dropping the whole database and protects unrelated collections if the test database later gains additional suites. The dedicated name remains the primary boundary; targeted cleanup provides per-test determinism.

### Treat MongoDB availability as an explicit prerequisite

The test runner will fail normally with a connection error if MongoDB is unavailable rather than silently provisioning an alternative. Documentation will show the appropriate URI for tests launched from the host and from the `share-videos` Compose service, and will state that at least database-backed suites such as `auth.test.js` require MongoDB.

## Risks / Trade-offs

- **MongoDB is not running or is not yet ready** → Document the prerequisite and use Compose service addressing for container execution; connection failures remain visible and actionable.
- **A test cleanup regression could leave data behind** → Force a dedicated database name in Jest setup and perform cleanup in lifecycle hooks.
- **Concurrent test processes could share the same database** → The current suite and command use one fixed test database; unique per-worker databases can be introduced later if parallel database suites create collisions.
- **Real MongoDB tests can be slower than an in-memory process** → Accept the integration cost in exchange for consistent host/container behavior and a single supported database implementation.

## Migration Plan

1. Change Jest setup to force the dedicated test database name and remove the in-memory selector.
2. Update authentication test cleanup and the shared database configuration to use the normal MongoDB adapter.
3. Remove the in-memory adapter and package dependency, regenerating the lockfile through npm.
4. Update server guidance and development documentation with host/container commands and prerequisites.
5. Validate lint and run backend tests against the Compose MongoDB service from both relevant network contexts where available.

Rollback consists of restoring the removed dependency, in-memory adapter, selector, and prior test setup. No application-data migration is required because production schemas and the normal database name do not change.

## Open Questions

None. The implementation can use `share-videos-test` as the fixed database name and the existing `URL_MONGO_DB` contract for network location.
