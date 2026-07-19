# Share-Videos repository guidance

Share-Videos is a single-maintainer React/Vite and Node.js/Express application for watching YouTube videos together in ephemeral Socket.IO rooms. The owner uses Codex and OpenSpec to iterate on it; avoid team-oriented roles, approvals, handoffs, and onboarding process.

## Repository map

- `client/`: React 18 SPA, Chakra UI, Rematch state, Axios, Socket.IO client and Cypress.
- `server/`: Express API, Socket.IO room controller, Mongoose persistence and Jest tests.
- `docs/`: architecture, room lifecycle, integration contracts, development workflow and known findings.
- `openspec/`: specifications and change artifacts. Use OpenSpec for planned behavior changes.
- `.codex/skills/`: repository-local, task-specific Codex skills. Repository guidance and executable behavior take precedence over generic skill advice.

## System constraints

- MongoDB persists registered users and saved playlists. Rooms, connected users, playback, queues and chat exist only in server memory and disappear on restart or when the final user leaves.
- HTTP and Socket.IO share the same server. Socket.IO uses the non-default `/socket-io` path.
- The client reads `VITE_API_URL`, defaulting to `http://localhost:5000`. The server defaults to port `3000`, so local paired development should set `PORT=5000` or otherwise align both sides.
- Treat [known findings](docs/known-issues.md) as evidence, not intended behavior. Do not fix them incidentally.

## Commands and validation

Run commands in the owning directory:

- Client: `npm run dev`; routine validation is `npm run lint` and `npm run test:ci`.
- Server: `npm run dev`; routine validation is `npm run lint` and `npm test`.
- Containers: from the repository root, `docker compose up --build`.

Do not require `npm run build` routinely. Use it only when a task explicitly affects Vite, packaging or deployment. See [development guidance](docs/development.md) for prerequisites and current command caveats.

## Change discipline

- Use Conventional Commits. Client-only work uses `type(frontend): description`; server-only work uses `type(backend): description`.
- Split cross-area work into coherent frontend and backend commits when practical. Root documentation, OpenSpec and genuinely shared configuration may omit the scope, for example `docs: document room lifecycle`.
- When architecture, commands, configuration, HTTP routes, WebSocket events, persistence or room behavior changes, update the corresponding files under `docs/` and any affected OpenSpec artifacts.
- If documentation disagrees with code or tests, inspect the authoritative implementation and update or flag the stale documentation.

## Deeper context

- [Architecture](docs/architecture.md)
- [Room domain](docs/domain/rooms.md)
- [HTTP API](docs/contracts/http-api.md)
- [WebSocket events](docs/contracts/websocket-events.md)
- [Development](docs/development.md)
- [Known issues](docs/known-issues.md)

