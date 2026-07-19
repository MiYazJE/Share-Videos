## ADDED Requirements

### Requirement: Frontend development image is bootstrap-only
The frontend development Dockerfile SHALL prepare a Node.js 18 development runtime with `/app` as its working directory and SHALL start the existing frontend development script without copying application sources or installing npm dependencies during image build.

#### Scenario: Building the frontend image
- **WHEN** a developer builds the frontend development image
- **THEN** the build completes without running `npm install` or `npm ci` and without embedding the client source tree in the image

#### Scenario: Starting a prepared frontend container
- **WHEN** the client source and installed dependencies are available at `/app` and the container starts with its default command
- **THEN** the container runs the Vite development server listening on port 3000 for connections from outside the container

### Requirement: Compose provides the web development service
Docker Compose SHALL define a service named `web` that builds the frontend development Dockerfile, mounts the local `client` directory at `/app`, and publishes container port 3000 as host port 3000.

#### Scenario: Accessing the frontend from the host
- **WHEN** dependencies have been installed and the `web` service is running
- **THEN** a developer can open `http://localhost:3000` in a browser and receive the Vite application

#### Scenario: Editing frontend source
- **WHEN** a developer modifies a file under the mounted local `client` directory while `web` is running
- **THEN** the changed file is visible inside `/app` so the Vite development workflow can reload the application without rebuilding the image

### Requirement: Frontend dependencies are installed explicitly inside the service container
The development workflow SHALL require frontend dependencies to be installed from the committed lockfile by running `npm ci` in a container created from the `web` service, rather than installing them in the Dockerfile.

#### Scenario: Preparing a fresh checkout
- **WHEN** a developer runs the documented Compose command for `npm ci` from a checkout without frontend dependencies
- **THEN** npm installs the locked frontend dependencies in the mounted client working directory used by `web`

#### Scenario: Lockfile changes
- **WHEN** `client/package-lock.json` changes
- **THEN** the documented workflow directs the developer to rerun `npm ci` through the `web` service before relying on the updated frontend environment

### Requirement: Docker development workflow is documented
The development documentation SHALL describe the frontend dependency-installation command, the full Compose startup command, the `web` service name, and the browser URL for the frontend.

#### Scenario: Following Docker setup documentation
- **WHEN** a developer follows the Docker Compose instructions from a fresh checkout with Docker available
- **THEN** the developer can install frontend dependencies inside the `web` service container, start the development services, and identify `http://localhost:3000` as the frontend URL
