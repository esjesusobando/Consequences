# Delta for mcp-registry

## MODIFIED Requirements

### Requirement: MCP Server-hardcoded paths

The system MUST NOT contain hardcoded Windows user paths in `.mcp.json` for portability reasons.

#### Scenario: Hardcoded path in filesystem MCP

- GIVEN `.mcp.json` contains `"C:\\Users\\sebas\\Downloads"` in filesystem MCP args
- WHEN the system processes this configuration
- THEN it SHOULD use environment variables like `${HOME}` or `${USERPROFILE}` where supported
- AND document the recommended configuration in comments

#### Scenario: Hardcoded path in obsidian MCP

- GIVEN `.mcp.json` contains `"C:\\Users\\sebas\\Downloads\\01 Revisar\\06 Context Bunker\\AI Strong Bunker"` in obsidian MCP
- WHEN the system processes this configuration
- THEN it SHOULD note this requires manual configuration per machine
- AND add to known_issues in config.yaml

#### Scenario: Hardcoded path in excalidraw MCP

- GIVEN `.mcp.json` contains `"C:\\Users\\sebas\\Documents\\Diagramas Excalidraw"` in EXCALIDRAW_VAULT_PATH
- WHEN the system processes this configuration
- THEN it SHOULD document this as a critical path dependency
- AND update known_issues

---

### Requirement: MCP Server Failover Duplicates

The system SHOULD avoid duplicate MCP server configurations unless they serve as explicit failovers.

#### Scenario: Duplicate obsidian configuration

- GIVEN `.mcp.json` contains both `mcp-obsidian` and `obsidian-api` pointing to the same vault
- WHEN the system validates the configuration
- THEN it SHOULD comment the duplicate clearly as a failover
- AND ensure only one is active by default

---

## ADDED Requirements

### Requirement: MCP Path Validation

The system MUST validate MCP paths and flag hardcoded user directories.

The validation MUST detect:
- Any path containing `C:\Users\` or `/Users/`
- Any path referencing a specific username
- Any vault path that is machine-specific

#### Scenario: New MCP with hardcoded path

- GIVEN a new MCP is added with hardcoded path
- WHEN validation runs
- THEN it SHOULD warn and suggest env variable alternative
- AND log the issue to known_issues