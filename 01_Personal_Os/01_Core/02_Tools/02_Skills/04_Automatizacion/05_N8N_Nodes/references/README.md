# References — n8n Node Configuration

## Detailed Guides (in skill root)

| File                                              | Content                                                 |
| ------------------------------------------------- | ------------------------------------------------------- |
| [DEPENDENCIES.md](../DEPENDENCIES.md)             | Deep dive into property dependencies and displayOptions |
| [OPERATION_PATTERNS.md](../OPERATION_PATTERNS.md) | Common configuration patterns by node type              |

## Core Principles

- **Operation-aware**: Different operations = different required fields (even on same node)
- **Progressive disclosure**: Start minimal, add fields as needed
- **Dependency-aware**: displayOptions control field visibility based on other field values
- **Validation-driven**: Let validate_node errors guide your configuration iteration