# References — GWS CLI: Google Workspace Terminal

## External Resources

- [Official Repo](https://github.com/googleworkspace/cli)
- [Documentation](https://github.com/googleworkspace/cli#readme)

## Quick Command Reference (from skill)

| Service  | Key Commands                                                           |
| -------- | ---------------------------------------------------------------------- |
| Auth     | `gws auth login --account`, `gws auth status`                          |
| Gmail    | `messages list --query`, `messages get`, `send`, `messages modify`     |
| Calendar | `events list`, `events create --add-meet --attendees`                  |
| Drive    | `drive list --folder`, `drive upload --recursive --progress`           |
| Sheets   | `sheets read --format csv`, `sheets append`, `sheets write --from-csv` |

## Tips
- Use `--format json` + `jq` for scripting
- `--dry-run` simulates destructive operations
- `--account` flag for multi-account workflows
- `GWS_TOKEN_JSON` for CI/CD environments