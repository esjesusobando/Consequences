# Delta for skill-registry

## MODIFIED Requirements

### Requirement: Version Tracking in Registry

The skill registry MUST reflect the current PersonalOS version to maintain consistency with config.yaml.

#### Scenario: Version mismatch between files

- GIVEN `skill-registry.md` shows v2.0 but project is at v3.0 Consequences
- WHEN validation runs
- THEN it SHOULD update skill-registry.md version field
- AND update the last_updated date to current date
- AND verify counts match actual resources

#### Scenario: Skills count out of sync

- GIVEN skill-registry.md lists ~80 skills but actual count is ~297
- WHEN the system validates
- THEN it SHOULD flag this as a HIGH priority issue
- AND recommend regenerating the registry

---

## ADDED Requirements

### Requirement: Skill Registry Counts

The skill registry MUST maintain accurate counts of all system resources.

For each resource type, the registry MUST show:
- Actual count (verified by scanning)
- Last verified date
- Source of truth (path)

#### Scenario: Verify skills count

- GIVEN the system should verify skills count
- WHEN running validation
- THEN it SHOULD scan both user-level and project-level skill directories
- AND compare against the documented count
- AND report discrepancies