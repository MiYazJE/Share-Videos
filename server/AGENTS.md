# Server guidance

This directory contains the Node.js/Express/Socket.IO backend. Follow the repository-wide guidance in `../AGENTS.md` first.

## Structure and ownership

- `server.js` connects MongoDB, starts Express and attaches Socket.IO at `/socket-io`.
- `app.js` configures Express; `app/routes/routes.js` mounts API routers.
- `app/api/` contains routers, validation, controllers and user mapping logic.
- `app/models/` contains the persistent Mongoose `User` and `Playlist` models.
- `lib/socketIo.js` registers inbound events; `lib/roomsController.js` owns all ephemeral room state; `lib/eventsHandler.js` wraps emissions.
- `config/config.js` is the environment contract; `config/createDatabase.js` exposes the shared Mongoose database client.

## Conventions and boundaries

- Keep routers thin, validate request shapes with Yup and place behavior in controllers or focused domain modules.
- Authentication uses bearer JWTs. Never document or commit real secrets; the checked-in fallback values are development placeholders and a known risk.
- Do not persist room state without an explicit OpenSpec change. Rooms, membership, playback, queues and chat intentionally live in memory today.
- Keep Socket.IO names and payloads synchronized with the client provider and enum; update `../docs/contracts/websocket-events.md` with contract changes.
- Use `nodejs-backend-patterns` for applicable Node/Express work and optional `api-design-principles` when designing HTTP contracts. Existing code, tests, OpenSpec and repository guidance take precedence.

## Commands

From `server/`:

- `npm ci`: install the locked dependency set.
- `npm run dev`: start with nodemon; set environment variables described in `../docs/development.md`.
- `npm run lint`: routine lint command; note its current root-file-only coverage in `../docs/known-issues.md`.
- `npm test`: Jest tests against a reachable MongoDB instance. Jest forces the database name to `share-videos-test`; configure `URL_MONGO_DB` for the current host or Compose network as documented in `../docs/development.md`.

Use Conventional Commit scope `backend`, for example `fix(backend): validate room membership`.
