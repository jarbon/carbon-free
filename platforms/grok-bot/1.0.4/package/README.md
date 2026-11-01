# CARBON Core for Grok Bot

Free, MIT-licensed CARBON workflows and evidence reports on the Bot's own computer.
This is a custom command-based MCP integration, not an xAI catalog listing or a
claim that xAI has reviewed this package. It does not require a CARBON account,
API key, public server, or tunnel to your Mac. Grok access is provided by xAI.

## Setup on the Bot's computer

1. Upload `carbon-grok-bot-1.0.4.tgz` to your Grok Bot and ask it to extract the archive
   into a dedicated directory on its computer. Keep the complete `package` folder.
2. Ensure Node.js 22+ and Python 3.10+ are available there. Run
   `node /ABSOLUTE/PATH/package/bin/carbon-mcp.mjs --doctor`.
3. Ask Grok Bot to add a custom command MCP server named `carbon`:
   - Command: `node` (or its absolute path on the Bot's computer)
   - Arguments: `/ABSOLUTE/PATH/package/bin/carbon-grok-bot.mjs`
   - Transport: standard input/output (stdio)
4. Replace the placeholder with the actual extracted path. Do not use a path
   from your Mac and do not paste JSON unless the host explicitly accepts it.

xAI documents adding custom MCP servers by command running on the Bot's computer:
https://docs.x.ai/grok-bot/computer-and-apps

## First assessment

Tell the Bot:

> Use carbon_workflow with workflow carbon-demo. Create a disposable TestBucks
> demo, assess it using the browser and terminal tools available on your computer,
> record actual evidence, and give me the completed HTML report. Do not change
> unrelated files or connect external services.

For an existing project:

> Use carbon_workflow with workflow carbon and request "Test [project path or URL]
> for checkout and sign-in risks." Execute the bounded workflow, not just a plan.
> Use carbon_start, carbon_update and carbon_report to record the results. Include
> blocked/deferred checks and make the generated HTML available as an artifact.

`carbon_workflow` is a tool that retrieves instructions. Grok executes those
instructions with its authorized tools; retrieval alone is not test execution.
There are 13 Core workflows and nine MCP tools, including this adapter tool.
Use `jay` for the test manager, `full` for a comprehensive campaign, or focused
`carbon-test`, `carbon-issues` and `carbon-accessibility` workflows. The Pro-only
`proof` workflow is not included. Slash commands are not required.

## Boundaries

- Protocol-tested locally; live execution inside a Grok Bot still needs verification.
- No public exposure, credentials, automatic installations or account changes.
- Analytics is forced off by this adapter. Background execution remains manual.
- Bots may share a computer. Keep assessment directories separate and scope access.
- Local report links are local to the Bot VM. Download the generated HTML using
  the host's artifact support; do not forward localhost capability URLs or tokens.
- Reports may contain source, findings or screenshots. Review/redact before sharing.
- Missing host browser/terminal capabilities must be reported, not fabricated.

## Other MCP hosts

The Grok-specific adapter selects artifact delivery. Other hosts should use the unchanged base entry point `bin/carbon-mcp.mjs` to retain shared MCP Apps inline behavior. No Cursor or other host implementation is changed by this adapter revision.

## Package identity

Grok submission revision 1.0.4; adapter implementation 1.1.1; core 1.32.22-mcp.2. This local archive is the installation source for review. The public Core repository is not yet verified to contain this adapter revision. See ADAPTER.json.

## Runtime state isolation

This adapter stores CARBON preferences, analytics queues, funnel milestones, background state and team-draft state under `~/.config/carbon-grok-bot/runtime-v1` on the Bot computer. It overrides inherited background-state settings and leaves HOME unchanged. An absolute `CARBON_GROK_STATE_DIR` can select another dedicated directory; shared CARBON paths and symlinked directories are rejected. Existing shared settings are not imported. Project evidence still uses the selected project’s `.carbon` directory. This isolates runtime state only, not Bot accounts, projects, plugins or cloud permissions.

## Grok-specific report delivery

The Grok adapter returns saved HTML paths and instructs the Bot to attach the reviewed file using its supported file/artifact tool. Open the actual clickable report card or host-returned link in chat. A cloud filesystem path or localhost URL is not a user-facing report link. Never invent a URL, publish private reports, or expose a local server. If attachment delivery is unavailable, say it is blocked. Reports are snapshots: export and attach again after changes. Grok inline MCP Apps is not the delivery route for this adapter; the shared base server and other hosts retain inline capability. Version 1.0.4 adds delivery wording to the 1.0.3 behavior; this copy-only revision has not been retested in-app.


### Open the interactive report

After attaching the reviewed HTML, say: **Open the attached interactive report. Choose Preview to view the report; Source shows its HTML.** Only label an actual host-returned artifact URL **Open interactive report**, preserving the URL unchanged. Without a returned URL, refer to the actual file card. Never invent a URL or append a preview parameter. This wording does not force or refresh Grok’s viewer.

Grok documents Preview for generated HTML. Our public 1.0.3 native test opened Preview first but stayed blank; Source → Preview then rendered the report, with view switching and evidence disclosure working. This is an observed workaround, not a guaranteed fix or proof that Source is the default.
