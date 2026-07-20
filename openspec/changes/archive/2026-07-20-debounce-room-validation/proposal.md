## Why

The Join room dialog currently validates on every keystroke, issuing requests before the visitor has expressed an intent to join and complicating the relationship between input and feedback. Room existence should be checked once when the visitor activates Join, with clear outcomes for an unknown room and an unavailable validation service.

## What Changes

- Stop automatic room-existence validation while the visitor types.
- Validate the normalized room identifier only when the visitor activates Join.
- Disable and show loading on the Join action while its validation request is pending, preventing duplicate submissions.
- Navigate to the room when validation confirms that it exists.
- Show “Room does not exist” when validation succeeds with a negative result.
- Show distinct recoverable feedback when the validation request fails or receives no usable response.
- Keep the visitor in the dialog after negative or failed validation so they can edit the identifier or retry.
- Preserve immediate TanStack Query validation when a visitor navigates directly to `/room/:id`.
- Add focused automated coverage for submission, duplicate prevention, all response outcomes, editing, retry, and direct-route validation.

## Capabilities

### New Capabilities

- `room-entry-validation`: Defines explicit, submission-driven validation of room identifiers in the Join room dialog while preserving immediate route validation.

### Modified Capabilities

None.

## Impact

- Client Join room dialog request orchestration and local pending/error state.
- Direct use of the existing room-validation API from the dialog without query caching or request cancellation for that interaction.
- Cypress coverage for the Home-to-Room entry flow.
- No server endpoint, Socket.IO event, room lifecycle, persistence, or direct Room route changes.
