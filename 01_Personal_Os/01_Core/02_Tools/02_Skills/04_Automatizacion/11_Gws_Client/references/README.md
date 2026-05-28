# References — GWS CLI: Google Workspace Terminal

## External Resources

- [Official Repo](https://github.com/googleworkspace/cli)
- [Documentation](https://github.com/googleworkspace/cli#readme)

## Quick Command Reference (from skill)

| Service | Key Commands |
|---------|-------------|
| Auth | `gws auth login --account`, `gws auth status` |
| Gmail | `messages list --query`, `messages get`, `send`, `messages modify` |
| Calendar | `events list`, `events create --add-meet --attendees` |
| Drive | `drive list --folder`, `drive upload --recursive --progress` |
| Sheets | `sheets read --format csv`, `sheets append`, `sheets write --from-csv` |

## Tips
- Use `--format json` + `jq` for scripting
- Plan OAuth scopes before first login (re-login with `--force` to add scopes)
- Use ISO 8601 with timezone for Calendar events
- Use Drive folder IDs instead of names for reliable upload paths
