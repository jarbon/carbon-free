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

<!-- jay-entrypoints:start -->
## Talk to Jay

| Conversational entrypoint | Purpose |
|---|---|
| `/jay` | Talk directly to Jay about testing, risks, results, and next steps. |
| `/j` | Short alias for the same Jay conversation. |

Use `/jay` or `/j` to talk directly to **Jay · AI Test Manager Agent**. The MCP
prompt router also accepts `J`. Skill names are lowercase; if a host does not
resolve `/J`, use `/j`. Claude commonly prefixes these as `/carbon:jay` and
`/carbon:j`; Codex may show a plugin-prefixed command or `$jay` in its skill picker.
The plugin cannot reserve a global slash name in every host.

- `/jay What should we test next?` — discuss risks and the evidence we have.
- `/j Test this project` — run this edition's normal CARBON assessment.
- `/jay Explain the last report` — interpret recorded results without rerunning.
- `/carbon` remains the direct broad-testing command.

Jay replies in first person, in a frank, practical tone inspired by Jason Arbon.
He is an AI persona, not Jason. With no clear testing target he asks for a URL,
folder/repository, API, app/feature, or requirements. He does not create a demo
unless asked. Questions do not automatically start tests, and fixes still need
authorization. Lite keeps its existing capabilities; these are two conversational
entrypoints, not two new testing workflows or an upgrade to Pro.

Jay's bundled icon appears in compatible command pickers and CARBON report views.
Host chat avatars and image sizing are host-controlled; text-only chat uses
“Jay · AI test manager” instead of a large image.
<!-- jay-entrypoints:end -->

<!-- carbon-pro-command:start -->
## Explore CARBON Pro

Run `/carbon-pro` to open [CARBON Pro features and pricing](https://testers.ai/carbon/#pro).
In Claude Code or Cowork, the plugin-prefixed command is `/carbon:carbon-pro`.
In Codex, choose `carbon-pro` from the plugin skill picker (or use `$carbon-pro`).
MCP clients expose the `carbon-pro` prompt; the full runtime also accepts `carbon_pro`.
This is a navigation shortcut available in every edition, not a paid testing workflow.
It does not run tests, start checkout, install Pro, or expose customer downloads.
<!-- carbon-pro-command:end -->
