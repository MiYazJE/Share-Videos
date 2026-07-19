## 1. Frontend development image

- [x] 1.1 Add `client/Dockerfile.dev` based on Node.js 18 Alpine with `/app` as working directory, port 3000 exposed, and `npm run dev` as its bootstrap command.
- [x] 1.2 Verify the Dockerfile contains no dependency-installation or source-copying steps and that its image builds independently of `node_modules`.

## 2. Docker Compose integration

- [x] 2.1 Add the `web` service to `docker-compose.yml` with the client build context, `Dockerfile.dev`, interactive development settings, and the `client` bind-mounted at `/app`.
- [x] 2.2 Publish `3000:3000`, attach `web` to the existing Compose network, and preserve the browser-facing backend URL behavior.
- [x] 2.3 Validate the resolved Compose configuration and confirm the service is addressable by the exact name `web`.

## 3. Development documentation

- [x] 3.1 Update `docs/development.md` to document `docker compose run --rm web npm ci` as the explicit first-run and lockfile-change dependency step.
- [x] 3.2 Document starting the complete environment with Docker Compose and opening the frontend at `http://localhost:3000`, alongside the existing backend and MongoDB endpoints.

## 4. End-to-end validation

- [x] 4.1 From a prepared client tree, start the Compose services and verify that `web` runs Vite without installing dependencies during image build or container bootstrap.
- [x] 4.2 Confirm the frontend responds at `http://localhost:3000` and that a mounted source edit is visible to the running Vite development workflow without rebuilding the image.
