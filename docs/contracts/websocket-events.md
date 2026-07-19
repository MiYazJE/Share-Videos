# WebSocket event contracts

Socket.IO connects to the HTTP server with path `/socket-io`. Client definitions live in `client/src/enums/messages.ws.js` and `client/src/context/SocketEventsContextProvider.jsx`; server registration and behavior live in `server/lib/constants.js`, `server/lib/socketIo.js`, and `server/lib/roomsController.js`.

## Client to server

| Event | Payload | Mutation and follow-up |
| --- | --- | --- |
| `WS_JOIN_ROOM` | `{ roomId, name, isLogged }` | Adds participant/socket mapping and join chat entry; joins Socket.IO room; sends full `WS_UPDATE_ROOM` to caller, partial update to room, and `WS_NOTIFY_MESSAGE` notifications |
| `WS_ADD_VIDEO` | `{ video, id, name }`, where `id` is room ID | Gives video an ID, appends queue; broadcasts queue update and notification. Sender notification currently has an argument bug |
| `WS_REMOVE_VIDEO` | `{ idVideo, roomId, name? }` | Removes queue item; may select next current video; broadcasts full room and notifications |
| `WS_VIEW_VIDEO` | `{ video, roomId }` | Sets current video, progress 0 and playing; broadcasts partial room and notification |
| `WS_SEND_PLAYER_STATE` | `{ state, roomId, name? }` | Sets `isPlaying` based on `state === "play"`; broadcasts partial room |
| `WS_SEND_PROGRESS` | `{ progress, roomId, seekVideo? }` | Stores progress; broadcasts progress to all and `seekVideo` to peers |
| `WS_SEND_MESSAGE` | `{ name, msg, roomId, color }` | Appends chat entry, trims to 40; broadcasts `WS_UPDATE_CHAT` |
| `WS_REORDER_PLAYLIST` | `{ playlist, roomId }` | Replaces queue and broadcasts queue update |
| `WS_LEAVE_ROOM` | no payload | Removes caller; deletes empty room or reassigns host and broadcasts users/notification |

The server invokes idempotent leave behavior for every Socket.IO `disconnect` reason. It never attempts to reconnect a disconnected server socket; client reconnection and the subsequent `WS_JOIN_ROOM` establish the new live membership. Explicit leave followed by disconnect produces departure effects only once.

All inbound asynchronous handlers pass through a realtime error boundary. A synchronous throw or rejected promise is logged with the event name and socket ID but without the raw payload. When the socket is still connected, it receives a generic `WS_NOTIFY_MESSAGE`; internal error details are never emitted, and later events remain processable.

## Server to client

| Event | Payload | Recipients and client effect |
| --- | --- | --- |
| `WS_UPDATE_ROOM` | Full room or partial fields such as `{ users, chat }`, `{ queue }`, `{ isPlaying }`, `{ progressVideo }`, `{ seekVideo }` | Caller, peers, or entire room depending on operation; client shallow-merges into Rematch room state |
| `WS_UPDATE_CHAT` | Chat entry array | Entire room; client replaces `room.chat` |
| `WS_NOTIFY_MESSAGE` | `{ msg, variant }` | Caller, peers or entire room; client enqueues notifier state |

## Definition matrix

| Event | Client definition | Server definition/handler | Classification |
| --- | --- | --- | --- |
| `WS_JOIN_ROOM` | emit | inbound handler | Active |
| `WS_ADD_VIDEO` | emit | inbound handler | Active |
| `WS_REMOVE_VIDEO` | emit | inbound handler | Active |
| `WS_VIEW_VIDEO` | emit | inbound handler | Active |
| `WS_SEND_PLAYER_STATE` | emit | inbound handler | Active |
| `WS_SEND_PROGRESS` | emit | inbound handler | Active |
| `WS_SEND_MESSAGE` | emit | inbound handler | Active |
| `WS_REORDER_PLAYLIST` | emit | inbound handler | Active |
| `WS_LEAVE_ROOM` | emit | inbound handler | Active |
| `WS_UPDATE_ROOM` | listener | emitted by controller | Active |
| `WS_UPDATE_CHAT` | listener | emitted by controller | Active |
| `WS_NOTIFY_MESSAGE` | listener | emitted by controller | Active |
| `WS_GET_VIDEO` | constant only | absent | Client-only, unused/legacy |
| `WS_UPDATE_PROGRESS_VIDEO` | constant only | absent | Client-only, unused/legacy |

Payloads are plain JavaScript objects with no shared schema. Contract changes must compare both sides and update this document.
