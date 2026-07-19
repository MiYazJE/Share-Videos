## Context

`Room.jsx` currently forces the page into a `100vh` shell, renders React Player at a fixed `700px`, and delegates room navigation to `RoomActionsBar`. That bar stores one `activeModal` value and opens a Drawer for people, chat, playlist, or search. The Drawer wrappers contain reusable domain components, but some of those components also navigate between drawers by writing `activeModal`.

The redesign is frontend-only. Existing Rematch state, Socket.IO events, HTTP search, player synchronization, and the mandatory guest-name dialog remain authoritative. Chakra UI's responsive props and the existing component set are sufficient; the layout must work without adding a UI dependency.

## Goals / Non-Goals

**Goals:**

- Make the Room a responsive workspace whose full set of collaboration areas is discoverable on the page.
- Keep playback visually dominant and expose current room activity without mutually exclusive overlays.
- Preserve all current search, queue, chat, people, playback, join, theme, and leave behaviors.
- Give each dynamic collection a usable boundary so a long chat, queue, or search result set does not distort the whole workspace.
- Establish semantic headings and labelled controls that remain usable with keyboard and assistive technology.

**Non-Goals:**

- Changing server events, room lifecycle, authorization, persistence, or synchronization semantics.
- Redesigning the Home or Room Not Found pages.
- Adding mobile-only drawers, tabs, or another navigation mode for core Room content.
- Fixing unrelated known findings or changing the visual identity of the entire application.

## Decisions

### Use one document layout with responsive CSS grid regions

The page will use a normal scrollable document rather than a fixed `100vh` outer stack. A compact header contains the room identifier, participant count and avatars, invitation copy action, theme control, and leave action. The main workspace uses responsive grid regions: the player and metadata form the primary region; chat and queue receive prominent adjacent panels on wide screens; search is an explicit panel in the same page. At narrow breakpoints, the regions become a deliberate single-column order: header, player metadata, search, playlist, and chat.

This makes every capability visible and reachable without changing modes. A permanently fixed dashboard was considered, but rejected because it would compress the player and create several nested scroll areas on common laptop heights. Tabs or accordions on mobile were also considered, but rejected because they reproduce the discoverability problem this change is intended to solve.

### Make the player responsive by aspect ratio

React Player will fill a 16:9 wrapper instead of using a fixed pixel height. The wrapper will be width-constrained by the workspace and preserve a useful video size across desktop, laptop, and phone viewports. Metadata stays directly below the media.

This avoids viewport overflow caused by the current 700px player and prevents hard-coded breakpoint heights.

### Separate panel content from Drawer presentation

Chat, playlist, and search domain content will be rendered inside reusable Room panel shells with a heading and consistent surface styling. Connected people and invitation are compact header content because they provide room-level context rather than a separate workflow. Drawer-only wrappers and the modal switch will no longer control these areas. The guest-name dialog remains in `RoomModals` (or is renamed to reflect its narrower responsibility).

Existing domain components will be reused where their structure fits. Where a component currently changes `activeModal`—for example, moving from an empty playlist to search—the interaction will become an in-page navigation/focus callback or anchor supplied by the Room workspace. This keeps the domain actions intact without coupling them to an overlay state machine.

### Bound dynamic content at the panel level

On wide screens, chat, playlist, and search results will have sensible maximum heights and internal overflow where needed; the page itself remains scrollable. Chat autoscroll is confined to its message container so new messages do not move the document viewport. The shared playlist uses compact rows instead of full discovery cards. On narrow screens, panels will avoid viewport-derived fixed heights and provide enough content height for touch use. Empty, loading, and populated states remain inside their panel so layout positions do not disappear when data changes.

This balances at-a-glance awareness with potentially unbounded chat and result collections.

### Preserve behavior and improve observable structure

No state payloads or network contracts will change. The implementation will add stable semantic landmarks/headings or accessible labels suitable for Cypress assertions. Icon-only global controls retain tooltips and gain explicit accessible names where necessary.

## Risks / Trade-offs

- [Rendering all areas increases initial visual density] → Use clear hierarchy, consistent panel surfaces, whitespace, and a wide-screen grid that prioritizes playback, queue, and chat.
- [Multiple dynamic lists can create awkward nested scrolling] → Limit internal scrolling to unbounded collections on wide screens and test representative laptop and phone viewport heights.
- [Existing components assume Drawer navigation] → Replace `activeModal` writes with explicit callbacks/anchors before removing the modal switch, and cover playlist-to-search navigation.
- [Responsive changes can regress player controls or chat input visibility] → Validate key flows at desktop and mobile Cypress viewport sizes in addition to linting.
- [Removing drawers may leave stale enum/model state] → Search all `ROOM_MODALS` and `activeModal` consumers and remove only state that becomes unused, preserving the guest-name dialog flow.

## Migration Plan

1. Introduce the responsive Room shell and panel presentation while reusing existing domain components.
2. Replace cross-drawer actions with in-page focus/navigation.
3. Remove obsolete Drawer wrappers, action-bar modal triggers, and unused modal-selection state.
4. Update Room interface documentation and run frontend lint and Cypress coverage.

The change can be rolled back as a frontend unit because it does not migrate stored data or alter network contracts.

## Open Questions

None required before implementation. Exact grid proportions, panel height caps, and breakpoint values can be tuned during implementation against the existing Chakra theme and supported viewport tests.
