# References — n8n Workflow Patterns

## Pattern Detail Files (in skill root)

| File                                                  | Content                                             |
| ----------------------------------------------------- | --------------------------------------------------- |
| [webhook_processing.md](../webhook_processing.md)     | Webhook patterns, data structure, response handling |
| [http_api_integration.md](../http_api_integration.md) | REST APIs, authentication, pagination, retries      |
| [database_operations.md](../database_operations.md)   | Queries, sync, transactions, batch processing       |
| [ai_agent_workflow.md](../ai_agent_workflow.md)       | AI agents, tools, memory, langchain nodes           |
| [scheduled_tasks.md](../scheduled_tasks.md)           | Cron schedules, reports, maintenance tasks          |

## The 5 Core Patterns

1. **Webhook Processing** (most common, 35%) — Receive → Process → Respond
2. **HTTP API Integration** — Fetch → Transform → Store
3. **Database Operations** — Query → Sync → Verify
4. **AI Agent Workflow** — Trigger → AI Agent (Model + Tools + Memory) → Output
5. **Scheduled Tasks** — Schedule → Fetch → Process → Deliver → Log