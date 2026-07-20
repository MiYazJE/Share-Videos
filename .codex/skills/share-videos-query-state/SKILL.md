---
name: share-videos-query-state
description: Implement or review Share-Videos client state using TanStack Query for HTTP server state and focused React contexts for ephemeral Socket.IO room state. Use for query and mutation hooks, Axios errors, authentication lifecycle, video discovery UX, Redux/Rematch migration, realtime room state, or related client tests and documentation in this repository.
---

# Share-Videos query and realtime state

Classify ownership before editing:

- Manage HTTP-backed resources with TanStack Query.
- Manage Socket.IO room snapshots, membership, queue, playback, progress, and chat with focused React context state.
- Keep form and transient visual state local.
- Keep the guest nickname outside the authenticated session query.
- Use Chakra feedback for transient outcomes and inline feedback for blocking content failures.

Inspect the installed `@tanstack/react-query` version and prefer official version-matched guidance when it becomes available through TanStack Intent. Do not reproduce generic library documentation here.

## Implement HTTP state

1. Define API functions independently from hooks.
2. Ensure every API failure rejects; never convert failures to successful `undefined` data.
3. Normalize Axios failures with status, a safe public message, and the original cause.
4. Define query keys with every variable that changes the resource.
5. Configure retry, stale time, refetching, and cache lifetime per resource. Do not retry deterministic authentication, authorization, validation, or not-found responses.
6. Forward the query function `AbortSignal` to Axios for video search and autocomplete.
7. Use mutations for login, registration, and room creation. Prevent duplicate submission and preserve form input on failure.
8. Update cached canonical data directly when the mutation response is sufficient; otherwise invalidate the smallest affected key.

## Preserve Share-Videos boundaries

- Treat `whoAmI` as the authenticated session query. Resolve an expected unauthenticated response as anonymous, but expose service failures as recoverable errors.
- Keep JWT storage outside QueryClient. On logout, clear identity-sensitive cache entries without discarding unrelated public room or discovery data.
- Do not store room state in QueryClient merely to replace Redux.
- Preserve the `/socket-io` path and existing event names and payloads.
- Clear route-scoped room state and emit leave when the room route unmounts.
- Avoid one global context. Separate stable socket actions from changing room state and scope high-frequency playback updates to their consumers.

## Design request UX

For every request, identify and implement:

- initial pending without usable data;
- successful empty data;
- successful content;
- background fetching with retained content;
- blocking failure with safe contextual feedback and retry when recoverable;
- background failure with retained content and non-blocking feedback;
- mutation pending, success, validation failure, and retry.

Do not use a transient toast as the only representation of unavailable primary content.

## Migrate safely

Migrate complete vertical workflows so a resource never has simultaneous Query/Context and Redux ownership. Remove Redux selectors, dispatches, models, provider, loading plugin, and dependencies only after repository search confirms no consumers remain. Do not fix unrelated entries in `docs/known-issues.md`.

## Validate

Run commands from `client/`:

- `npm run lint`
- focused automated tests for the changed query, mutation, reducer, and provider behavior;
- relevant Cypress journeys with client and server ports aligned.

Create a fresh QueryClient per test and disable retries unless retry behavior is the subject of the test. Run `npm run test:ci` only with the frontend and backend available; it executes the E2E suite headlessly in Chrome.
