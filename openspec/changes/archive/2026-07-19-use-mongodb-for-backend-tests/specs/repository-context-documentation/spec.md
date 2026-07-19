## MODIFIED Requirements

### Requirement: Verified development guidance
The repository SHALL document installation, configuration, local execution, container execution, testing, linting, and available build workflows using commands and environment behavior verified against repository configuration. It SHALL distinguish available build commands from the routine lint-and-test validation baseline, and SHALL identify MongoDB as a prerequisite for database-backed backend tests together with the dedicated test-database behavior.

#### Scenario: Owner or Codex starts the application locally
- **WHEN** the owner or an assisting Codex session follows the development documentation
- **THEN** they can identify required dependencies, working directories, ports, environment variables, and commands for both client and server

#### Scenario: Owner or Codex validates a documentation change
- **WHEN** repository context documentation is changed
- **THEN** the guidance provides proportionate checks for links, documented commands, contracts, and affected project tests or builds

#### Scenario: Owner runs database-backed backend tests
- **WHEN** the owner follows the backend test guidance from the host or the backend container
- **THEN** they can identify the required MongoDB service, the correct connection URL for that network context, and that test data is forced into a dedicated database rather than the normal application database
