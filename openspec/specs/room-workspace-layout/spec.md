# Room Workspace Layout Specification

## Purpose

Define how the Room page presents its video and collaboration capabilities in a responsive, accessible workspace where participants can understand and use current room activity without mutually exclusive tabs or overlays.

## Requirements

### Requirement: Room content is available in one page workspace
The Room page SHALL present the video player, current video metadata, video search, shared playlist, and chat as identifiable sections in the page, while presenting connected people and invitation access in the room header, without requiring the participant to open a tab, drawer, or modal to discover or use those capabilities.

#### Scenario: Participant enters an active room
- **WHEN** a participant has joined a valid room
- **THEN** the Room page identifies the player, search, shared playlist, and chat sections in one scrollable page
- **AND** the header identifies connected people and provides invitation access
- **AND** no collaboration section is gated by mutually exclusive overlay navigation

#### Scenario: A section has no content
- **WHEN** the playlist, chat, or search results has no displayable entries
- **THEN** its section remains present in the workspace with an appropriate empty or initial state

### Requirement: Room workspace establishes a clear information hierarchy
The Room page SHALL give primary visual priority to the video player while keeping room identity, participant count, video metadata, collaboration sections, theme control, and leave action clearly identifiable.

#### Scenario: Room is viewed on a wide screen
- **WHEN** the available viewport supports a multi-column layout
- **THEN** the player remains the primary region
- **AND** current room activity such as playlist and chat is visible in adjacent workspace panels

#### Scenario: Participant needs room-level controls
- **WHEN** the Room workspace is displayed
- **THEN** the room identifier, connected participant count, theme control, and leave action are available from the page header

### Requirement: Room workspace adapts to narrow viewports
The Room page SHALL reflow into a readable single-column sequence on narrow viewports without horizontal page overflow, clipped primary controls, or fixed player heights that exceed the available viewport.

#### Scenario: Participant uses a phone-sized viewport
- **WHEN** the viewport is too narrow for the multi-column workspace
- **THEN** the player, metadata, search, playlist, and chat are arranged in a single-column flow beneath the room header
- **AND** each section remains usable without opening an alternate navigation surface

#### Scenario: Player width changes
- **WHEN** the Room workspace width changes
- **THEN** the player preserves its media aspect ratio and fits its containing region

### Requirement: Dynamic Room content remains manageable
The Room page SHALL prevent long chat histories, playlists, people lists, and search result collections from obscuring unrelated workspace sections while retaining access to all available items.

#### Scenario: A collection exceeds its panel display area
- **WHEN** a dynamic collection contains more content than its panel can display at once
- **THEN** the collection provides an appropriate scrolling or pagination mechanism within a bounded presentation
- **AND** the remaining Room sections remain reachable

#### Scenario: Search pagination changes results
- **WHEN** the participant requests another available search-results page
- **THEN** the search section displays the requested results without hiding the other workspace sections behind an overlay

#### Scenario: Chat receives a new message
- **WHEN** a new message is appended to the visible chat history
- **THEN** only the chat message container scrolls enough to reveal the latest message
- **AND** the Room document viewport does not jump to the bottom of the page

#### Scenario: Shared playlist contains videos
- **WHEN** the shared playlist displays queued videos beside the primary workspace
- **THEN** each queued video uses a compact row with its essential identity and playback controls
- **AND** discovery-only metadata does not crowd the playlist panel

### Requirement: Existing Room interactions are preserved
The redesigned Room page MUST retain existing join identity, playback synchronization, search, queue management, chat, people, theme, and leave behavior without changing HTTP or WebSocket contracts.

#### Scenario: Guest joins without a stored name
- **WHEN** a guest opens a valid room without a restored name
- **THEN** the existing nickname dialog is shown before joining the room

#### Scenario: Participant adds a searched video
- **WHEN** a participant adds a video from the in-page search results
- **THEN** the existing queue action is emitted and the shared playlist reflects the room update

#### Scenario: Empty playlist directs participant to search
- **WHEN** a participant follows the add-video action from an empty shared playlist
- **THEN** focus or page position moves to the in-page search section rather than opening a drawer

#### Scenario: Participant sends a chat message
- **WHEN** a participant submits a valid message from the in-page chat section
- **THEN** the existing chat action is emitted and subsequent room updates are rendered in that section

### Requirement: Room sections and controls are accessible
The Room page SHALL expose semantic or accessible names for collaboration sections and icon-only room-level controls, and SHALL support keyboard access to interactive elements and in-page section navigation.

#### Scenario: Assistive technology inspects the workspace
- **WHEN** a participant navigates the Room page with assistive technology
- **THEN** each collaboration section has an identifiable heading or label
- **AND** theme and leave controls have accessible names

#### Scenario: Keyboard user follows an in-page action
- **WHEN** a keyboard user activates an action that navigates to another Room section
- **THEN** the destination section receives a meaningful page position or focus indication
