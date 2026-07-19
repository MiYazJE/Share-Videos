## 1. Room Workspace Structure

- [x] 1.1 Refactor the Room page into a normal scrollable document with a compact header and responsive grid regions for player, search, playlist, and chat.
- [x] 1.2 Replace the fixed 700px React Player height with a responsive 16:9 media wrapper and keep current video metadata attached to the player region.
- [x] 1.3 Add a reusable, semantic panel presentation with consistent headings, surfaces, spacing, and responsive overflow rules for Room collaboration content.
- [x] 1.4 Move room identity, participant count, theme, and leave controls into the header with accessible names and responsive wrapping.

## 2. Embedded Collaboration Areas

- [x] 2.1 Render the existing search input, results, and pagination directly in the search panel, preserving loading, empty, and result behavior.
- [x] 2.2 Render the shared playlist in its panel and connected people in the header, preserving empty states, playback actions, removal, and reordering.
- [x] 2.3 Render chat directly in its panel, preserving message history scrolling, input access, and message submission.
- [x] 2.4 Replace playlist-to-search and other drawer-selection actions with accessible in-page focus or scroll navigation.

## 3. Remove Obsolete Overlay Navigation

- [x] 3.1 Reduce the Room modal composition to the guest nickname flow and remove the search, people, chat, and playlist Drawer wrappers from Room rendering.
- [x] 3.2 Remove the obsolete Room action-bar modal triggers, `ROOM_MODALS` usage, and modal-selection model state after verifying that no live consumer remains.

## 4. Verification and Documentation

- [x] 4.1 Add Cypress coverage that verifies all Room sections are present without opening overlays and that representative search, playlist, chat, and leave interactions remain reachable.
- [x] 4.2 Add desktop and phone viewport assertions for responsive reflow, lack of horizontal page overflow, responsive player sizing, and accessible section/control names.
- [x] 4.3 Update the relevant frontend architecture or Room documentation to describe the in-page workspace and preserved network behavior.
- [x] 4.4 Run `npm run lint` and `npm run test:ci` from `client/`, and resolve regressions introduced by the redesign.

## 5. Usability Refinements

- [x] 5.1 Move connected participant identity and invitation copy access into the Room header, and remove the standalone People panel.
- [x] 5.2 Confine chat autoscroll to the message history container and reveal the latest message without moving the document viewport.
- [x] 5.3 Remove the redundant View playlist action from search and replace full video cards in the shared playlist with compact queue rows.
- [x] 5.4 Update responsive tests and rerun frontend validation for the refined workspace.
