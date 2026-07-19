## Why

The Room page dedicates a fixed 700px height to the player inside a viewport-height layout and hides people, chat, playlist, and search in mutually exclusive drawers. Participants cannot see the room's activity at a glance, and common actions require repeatedly opening and closing overlays, especially on smaller screens.

## What Changes

- Replace the fixed-height Room composition with a responsive, scrollable layout that keeps the video prominent without forcing the rest of the page outside the viewport.
- Present room identity, connection count, theme, and leave controls in a clear page header.
- Render search, shared playlist, and chat as first-class sections of the Room page instead of action-bar drawers, and surface connected people and invitation controls directly in the room header.
- Keep the high-value playback, playlist, and conversation areas visible together on wide screens, while arranging every section in a usable single-column flow on narrow screens.
- Preserve the existing join-name dialog and all current room, playback, queue, search, people, and chat behavior.
- Add frontend coverage for the responsive Room composition and access to its core sections.

## Capabilities

### New Capabilities

- `room-workspace-layout`: Defines the responsive Room workspace, the information hierarchy, and persistent access to room collaboration content.

### Modified Capabilities

None.

## Impact

- Affects the React Room page and Room-specific presentation components under `client/src/pages/Room` and `client/src/components/Room`.
- Reuses existing Chakra UI, React Player, Rematch state, HTTP search, and Socket.IO interactions; no new dependency is expected.
- Removes the Room page's dependency on drawer-selection state for search, people, chat, and playlist presentation. The nickname dialog remains modal.
- Does not change HTTP routes, WebSocket events, persistence, or server room behavior.
- Requires corresponding updates to frontend-oriented documentation describing the Room interface.
