# HTTP API contracts

Base URL is `VITE_API_URL` in the client, defaulting to `http://localhost:5000`. The Axios wrapper sends `Authorization` on all requests when a token exists. Every failed client request rejects with a normalized error containing status, safe message, response details, and diagnostic cause; successful responses without an entity resolve to `null`, never an error-shaped `undefined`. Validation failures return HTTP 400 with `{ message, path }`. Rejected asynchronous route handlers pass through the terminal error middleware: classified operational errors retain their safe status/message, while unexpected errors return HTTP 500 `{ message: "Internal server error" }`. Server logs retain diagnostic errors; responses do not expose stacks.

## Health

### `GET /health`

- Auth: none.
- Input: none.
- Ready response: HTTP 200 `{ status: "ready" }` after database connection and HTTP/Socket.IO startup complete.
- Unready response: HTTP 503 `{ status: "unready" }` during startup or shutdown.
- Consumer: Docker Compose health check.

## Authentication

### `POST /auth/register`

- Auth: none.
- Input: JSON `{ name: string, password: string }`; both required.
- Success: `{ error: false, msg }`; creates a MongoDB user and default playlist.
- Errors: 400 validation response; 400 `{ error: true, msg }` for duplicate nickname; unhandled storage errors can surface as server errors.
- Client: `client/src/api/auth.js` through the registration mutation in `client/src/pages/Home/Home.jsx`.
- Server: `server/app/api/auth/auth.router.js`, validation and controller.

### `POST /auth/login`

- Auth: none.
- Input: JSON `{ name: string, password: string }`; both required.
- Success: `{ user: { id, name, avatarBase64, color }, token: "Bearer ..." }`.
- Errors: 400 validation response; 401 `{ msg }` for invalid credentials.
- Client: `client/src/api/auth.js` through the login mutation in `client/src/pages/Home/Home.jsx`.
- Server: auth router/controller and Passport local strategy.

### `GET /auth/whoAmI`

- Auth: bearer JWT required by `userAuthMiddleware`.
- Input: none.
- Success: `{ auth: true, user: { id, name, avatarBase64, color } }`.
- Errors: 401 for missing, invalid or expired token.
- Client: `client/src/context/SessionContextProvider.jsx` through the shared session query.
- Server: auth router/controller and `server/app/middlewares/authMiddlewares.js`.

`/auth/logout` is not an active HTTP endpoint. The client enum declares it, but logout only removes the browser token.

## Rooms

### `POST /rooms/create`

- Auth: none.
- Input: JSON `{ name: string }`, minimum length 3.
- Success: full in-memory room object `{ id, host, chat, users, queue, progressVideo, currentVideo }`.
- Errors: 400 validation response; unexpected controller errors are not explicitly handled.
- Client: Home -> room-creation mutation using `client/src/api/rooms.js`.
- Server: rooms router/validation/controller and `server/lib/roomsController.js`.

### `GET /rooms/:id/isValid`

- Auth: none.
- Input: room ID path parameter.
- Success: JSON boolean.
- Errors: no explicit error response; unknown IDs return `false`.
- Client: `client/src/hooks/useRoom.js`.
- Server: rooms router/controller and in-memory controller lookup.

The server route includes a trailing slash in its declaration, but Express accepts the client's non-trailing form under current routing defaults.

## Videos

### `GET /videos/autocomplete/youtube/:q`

- Auth: none; an auth middleware import is unused.
- Input: required search text path parameter.
- Success: YouTube suggestion array returned by `youtube-sr`.
- Errors: 400 validation response; YouTube dependency failure returns HTTP 502 `{ message: "YouTube search is temporarily unavailable" }`.
- Client: room search autocomplete via `client/src/queries/videos.js`; empty normalized input disables the query and superseded requests receive an Axios cancellation signal.
- Server: videos router/validation/controller.

### `GET /videos/youtube/:q`

- Auth: none.
- Input: required search text; optional query `offset` (default 0) and `limit` (default 10).
- Success: `{ data: video[], isLastPage: boolean }`; videos are normalized with thumbnail, duration and channel fields while retaining upstream fields. Upstream records missing the required URL, title, thumbnail URL, or channel name are omitted; a completed result containing no usable records returns an empty `data` array.
- Errors: 400 validation response; YouTube dependency or parser failure returns HTTP 502 `{ message: "YouTube search is temporarily unavailable" }`.
- Client: paginated room search via `client/src/queries/videos.js`; query keys include normalized search, limit, and offset, and prior page data remains usable while another page loads.
- Server: videos router/validation/controller and external `youtube-sr` service.

## Playlists

### `GET /playlists/getAll`

- Auth: bearer JWT through Passport `jwtMiddleware`.
- Input: none.
- Intended success: `{ playlists: [{ id, title, videos }] }` for the authenticated user.
- Errors: Passport authentication response; controller has no explicit error mapping.
- Client: no current consumer and no corresponding client API enum.
- Server: playlists router/controller and `Playlist` model.
- Status: active route with known ownership-query and Passport setup findings; see [known issues](../known-issues.md).
