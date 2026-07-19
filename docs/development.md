# Development

## Prerequisites

- Node.js 18 or newer (declared by `server/package.json`; use the same version for the client).
- npm, using the committed lockfiles.
- MongoDB for non-container server development, or Docker Compose.
- A browser for the Vite application and Cypress E2E tests.

## Install and run locally

Install independently:

```text
cd server
npm ci

cd ../client
npm ci
```

For paired local development, start the backend on the URL expected by the client:

```text
cd server
PORT=5000 URL_MONGO_DB=mongodb://localhost:27017 npm run dev
```

PowerShell equivalent:

```powershell
cd server
$env:PORT='5000'
$env:URL_MONGO_DB='mongodb://localhost:27017'
npm run dev
```

Then run `npm run dev` from `client/`; Vite listens on `http://localhost:3000`.

## Environment

| Variable | Side | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_API_URL` | Client | `http://localhost:5000` | Base HTTP and Socket.IO server URL |
| `PORT` | Server | `3000` | Express/Socket.IO listen port |
| `URL_MONGO_DB` | Server | `mongodb://mongo:27017` | MongoDB connection URL |
| `NAME_MONGO_DB` | Server | `share-videos` | MongoDB database name |
| `JWT_EXPIRES_IN` | Server | `7d` | JWT lifetime |
| `ACCESS_SECRET_TOKEN` | Server | placeholder | JWT signing secret; set a real secret outside source control |
| `SECRET_KEY` | Server | placeholder | Present in config; no active consumer was found |

## Docker Compose

The development images only bootstrap their applications; they do not install npm dependencies during the image build or container startup. From the repository root, install the frontend dependencies inside a one-off container before its first start:

```text
docker compose run --rm web npm ci
```

Run that command again whenever `client/package-lock.json` changes. The `client` directory is mounted at `/app`, so the installed dependencies and source files are available to the regular `web` service.

Then build and start the frontend, backend and MongoDB services:

```text
docker compose up --build
```

The Compose services and host endpoints are:

| Service | Purpose | Host endpoint |
| --- | --- | --- |
| `web` | Vite frontend development server | `http://localhost:3000` |
| `share-videos` | Express and Socket.IO backend | `http://localhost:5000` |
| `mongo` | MongoDB | `localhost:27018` |

The browser-loaded frontend continues to use `http://localhost:5000` as its default API URL. Compose mounts `~/.npmrc` into the Node.js services, so hosts without that file may need to adjust the mount (see known issues).

## Routine validation

Run only the affected areas:

```text
cd client
npm run lint
npm run test:ci

cd ../server
npm run lint
npm test
```

Database-backed server tests, including `auth.test.js`, require a reachable MongoDB instance. Jest always forces these tests to use the `share-videos-test` database, regardless of any `NAME_MONGO_DB` value in the shell, so they do not write to the normal `share-videos` database. `URL_MONGO_DB` remains configurable because the MongoDB address differs between the host and the Compose network.

To use the Compose MongoDB service while running tests from the host, start MongoDB from the repository root:

```text
docker compose up -d mongo
```

Then run the server tests against the published host port:

```powershell
cd server
$env:URL_MONGO_DB='mongodb://localhost:27018'
npm test
```

From a POSIX shell, use `URL_MONGO_DB=mongodb://localhost:27018 npm test` instead. To run the same tests inside the already-running backend container, use the Compose service hostname:

```text
docker compose exec -e URL_MONGO_DB=mongodb://mongo:27017 share-videos npm test
```

Jest does not provision MongoDB or fall back to an in-memory server. A connection failure therefore means that MongoDB is not running or that `URL_MONGO_DB` is incorrect for the current network context.

Client E2E tests require the frontend, backend and relevant database/services to be running. `npm run test:dev` opens Cypress interactively. Current script caveats are recorded in [known issues](known-issues.md).

`npm run build` is available in `client/`, but it is not a routine completion check. Run it only when a change explicitly affects Vite configuration, packaging or deployment.

## Commits

Use Conventional Commits: `type(frontend): ...` for client work and `type(backend): ...` for server work. Split cross-area changes when coherent. Root documentation, OpenSpec and genuinely shared configuration may omit the scope, for example `docs: clarify development validation`.

## Repository-local Codex skills

The selected skills live under `.codex/skills/` and are discovered when Codex starts a repository session:

- `frontend-design`: substantial visual frontend creation/redesign.
- `nodejs-backend-patterns`: applicable Node.js/Express/Mongoose/Socket.IO implementation work.
- `api-design-principles`: optional HTTP contract design/review.

Each directory contains provenance and license information. `skills-lock.json` records the imported source path and hash. Restart the Codex session after adding or updating a skill so its catalog is refreshed. The generic `npx skills list` command scans the installer's `.agents` location rather than this repository's explicit `.codex/skills/` scope, so it is not the discovery check for this layout.

Inspect third-party updates before accepting them. Repository `AGENTS.md`, OpenSpec artifacts, executable code and tests override generic skill examples.
