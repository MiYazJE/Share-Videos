# Client guidance

This directory contains the React/Vite frontend. Follow the repository-wide guidance in `../AGENTS.md` first.

## Structure and state

- `src/index.jsx` composes Redux/Rematch, Chakra UI and `SocketEventsContextProvider`.
- `src/App.jsx` restores authentication and mounts `src/routes/Routes.jsx`.
- `src/models/` contains Rematch models. `room.js` owns HTTP-driven room/search state; `user.js` owns authentication state.
- `src/context/SocketEventsContextProvider.jsx` is the client Socket.IO boundary. Keep event names and payloads aligned with `../server/lib/constants.js`, `socketIo.js` and `roomsController.js`.
- `src/enums/api-routes.js` and `src/enums/messages.ws.js` centralize client contract names.
- Page orchestration belongs in `src/pages/`; reusable UI belongs in `src/components/`; reusable behavior belongs in `src/hooks/`.

## Conventions

- Preserve the existing JavaScript/JSX, functional-component, hooks, Chakra UI and Rematch patterns unless an OpenSpec change explicitly replaces them.
- Use the `src` Vite alias for application imports.
- Route HTTP through `src/utils/http.js`; it injects the stored bearer token and uses `VITE_API_URL` or `http://localhost:5000`.
- Route realtime operations through `useSocketEvents`; do not create ad hoc Socket.IO connections in components.
- For substantial visual creation or redesign, use the repository-local `frontend-design` skill, while these project conventions remain authoritative.

## Commands

From `client/`:

- `npm ci`: install the locked dependency set.
- `npm run dev`: serve on `http://localhost:3000`.
- `npm run lint`: routine static validation.
- `npm run test:ci`: configured Cypress command; see `../docs/known-issues.md` for its current caveat.
- `npm run test:dev`: interactive Cypress UI.
- `npm run build`: available, but only required for Vite, packaging or deployment changes.

Use Conventional Commit scope `frontend`, for example `fix(frontend): keep room state in sync`.

