# Delta for personal-os-config

## MODIFIED Requirements

### Requirement: Project Configuration

The system MUST maintain a valid SDD configuration in `.atl/openspec/config.yaml` that reflects the current state of the PersonalOS.

The configuration MUST include:
- Current version (v3.0 Consequences)
- Tech stack detected
- Testing capabilities status
- Persistence mode (hybrid)
- Skill registry references

#### Scenario: Configuration with duplicate sections

- GIVEN a config.yaml with duplicate `rules:` and `testing:` sections
- WHEN the system processes the configuration
- THEN it SHOULD deduplicate the sections automatically or warn about duplicates
- AND keep only one instance of each section

#### Scenario: Hardcoded Windows paths

- GIVEN `.mcp.json` contains hardcoded paths like `C:\Users\sebas\...`
- WHEN the system processes the MCP configuration
- THEN it SHOULD document these as "known issues" in config.yaml
- AND provide guidance for path normalization

---

## ADDED Requirements

### Requirement: Known Issues Documentation

The system MUST document known issues in the SDD configuration to aid future maintenance.

The config MUST include a section called `known_issues:` that lists:
- Hardcoded paths that need fixing
- Configuration drift issues
- Areas requiring manual intervention

#### Scenario: Document new known issue

- GIVEN a new issue is discovered during audit
- WHEN the system updates the config
- THEN it MUST add the issue to the `known_issues:` section
- AND include severity level (critical, medium, low)

### Requirement: Version Tracking

The system MUST track the current version of the PersonalOS in the skill registry.

The registry MUST include:
- Current version (v3.0 Consequences)
- Last update date
- Skills count
- Agents count
- HUBs count

#### Scenario: Version mismatch

- GIVEN skill-registry shows v2.0 but config.yaml shows v3.0
- WHEN the system validates consistency
- THEN it SHOULD flag the mismatch as a warning
- AND prioritize config.yaml as the source of truth