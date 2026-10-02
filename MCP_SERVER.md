# CARBON Free MCP tools

This reference is for the small Free evidence runtime, not the Pro server.
Start it with `node /absolute/path/to/carbon/server/index.mjs` (Node.js 22+).
Host-specific configuration is in the packaged `.mcp.json`; do not copy Pro setup.

| Tool | Purpose |
|---|---|
| `carbon_start` | Start a saved assessment; returns run ID and protected live-report URL. |
| `carbon_update` | Record actual checks, findings, screenshots, personas, blockers and confidence. |
| `carbon_report` | Reopen a selected run's report or map and return HTML/JSON export paths. |
| `carbon_settings` | Read/change minutes, maxChecks, focus and analytics preferences. |
| `carbon_demo` | List fixtures or create a new disposable demo without overwriting a project. |
| `carbon_knowledge` | Load testing domains, AI specialist context or accessibility criteria. |

The host agent supplies browser, shell and model execution. No separate LLM API
key is required by this Free server; host subscription/API costs still apply.
Demo creation requires Python 3.10+. Free exposes eight prompts, not the full Pro catalog.

Evidence lives under `.carbon/free/runs/<runId>/`. Live views require the local
process and private view token; HTML/JSON exports remain usable afterward.
Review reports for sensitive information before sharing. Read PRIVACY.md.
See references/free-testing.md for input examples, evidence and safety contracts.
