## Purpose

Define how backend tests use an external MongoDB instance while isolating test data from normal application data.

## Requirements

### Requirement: Backend tests use an external MongoDB instance
Database-backed backend tests SHALL connect through the application's supported Mongoose connection path to the MongoDB instance identified by `URL_MONGO_DB`, and SHALL NOT download, create, or start an in-memory MongoDB server.

#### Scenario: Tests run from the host
- **WHEN** MongoDB is reachable at the host-configured `URL_MONGO_DB` and the owner runs `npm test` from `server/`
- **THEN** database-backed tests connect to that MongoDB instance without requiring a downloaded MongoDB binary

#### Scenario: Tests run inside the backend container
- **WHEN** the Compose MongoDB service is reachable at the container-configured `URL_MONGO_DB` and the owner runs the backend tests inside the container
- **THEN** database-backed tests use the Compose MongoDB service and do not depend on a MongoDB binary in the backend image

#### Scenario: MongoDB is unavailable
- **WHEN** a database-backed backend test starts and the configured MongoDB instance is not reachable
- **THEN** the test run fails with a database connection error instead of provisioning an in-memory substitute

### Requirement: Test data is isolated from application data
The backend test command SHALL force a dedicated test database name before application database configuration is loaded, regardless of the normal local-development database name.

#### Scenario: Normal database configuration exists
- **WHEN** the owner runs backend tests while their environment identifies the normal application database
- **THEN** Jest connects to the dedicated test database and does not write test fixtures to the normal application database

#### Scenario: Authentication tests clean up fixtures
- **WHEN** an authentication test case completes after creating users or playlists
- **THEN** its test-owned user and playlist data is removed from the dedicated test database before the next case runs

#### Scenario: Test connection closes
- **WHEN** the database-backed test suite finishes
- **THEN** Mongoose disconnects without deleting or modifying the normal application database

### Requirement: In-memory MongoDB support is removed
The backend SHALL NOT retain the in-memory database selector, adapter, or `mongodb-memory-server` package after database-backed tests migrate to real MongoDB.

#### Scenario: Backend dependencies are installed
- **WHEN** the backend dependency set is installed from its manifest and lockfile
- **THEN** `mongodb-memory-server` and its MongoDB binary tooling are absent
