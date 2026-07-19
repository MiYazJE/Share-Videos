# Share-Videos

Share-Videos is a web application for watching YouTube videos with other people in realtime rooms. Participants share playback state, progress, a video queue and chat through Socket.IO. Registered users and saved playlists use MongoDB; active room state is ephemeral and owned by the running server process.

## Technology

- React 18, Vite, Chakra UI and Rematch on the client.
- Node.js, Express and Socket.IO on the server.
- MongoDB/Mongoose for users and saved playlists.
- Jest for server tests and Cypress for browser flows.

## Quick start

Install locked dependencies from each application directory:

```text
cd server
npm ci

cd ../client
npm ci
```

Start MongoDB, then run the server on port 5000 and the client on port 3000. On PowerShell:

```powershell
cd server
$env:PORT='5000'
$env:URL_MONGO_DB='mongodb://localhost:27017'
npm run dev
```

In another terminal:

```text
cd client
npm run dev
```

For the containerized backend and MongoDB, run `docker compose up --build` from the repository root. See [development documentation](docs/development.md) for environment variables, validation commands and current caveats.

## Features

- Create and join rooms through a room ID/link.
- Search YouTube and manage a shared room queue.
- Synchronize selected video, play/pause state and progress.
- Exchange ephemeral room chat messages.
- Register/login with JWT authentication; registration creates a default saved playlist record.

## Documentation

- [Architecture and state ownership](docs/architecture.md)
- [Room lifecycle](docs/domain/rooms.md)
- [HTTP API contracts](docs/contracts/http-api.md)
- [WebSocket event contracts](docs/contracts/websocket-events.md)
- [Development workflow](docs/development.md)
- [Known issues and inconsistencies](docs/known-issues.md)

Repository-specific Codex instructions are in `AGENTS.md`, with scoped guidance under `client/` and `server/`.

