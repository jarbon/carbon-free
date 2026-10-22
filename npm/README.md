# CARBON — AI testing harness with Jay

Free, open-source AI software testing inside your coding agent. **Jay** is CARBON's AI test manager: turn project context into risk-based checks, investigate bugs, and collect evidence in live local reports.

CARBON helps your agent with exploratory testing, regression checks, accessibility, test planning, triage, and confidence assessments. The host agent performs the investigation with its available browser, terminal, and model tools; this MCP server organizes workflows, evidence, settings, and reports. Installing it does not supply a model, browser controller, cloud VM, or autonomous testing service.

## Quick start

Requires **Node.js 22+**. Demo creation and full-workflow helpers also need **Python 3.10+**. No separate CARBON account, payment, or model API key is needed. Your host's subscription/API costs and limits still apply.

```sh
npx -y @testers-ai/carbon-mcp@__VERSION__ --doctor
npx -y @testers-ai/carbon-mcp@__VERSION__ --print-config
```

Add this version-pinned configuration using your MCP host's documented settings:

```json
{
  "mcpServers": {
    "carbon": {
      "command": "npx",
      "args": ["-y", "@testers-ai/carbon-mcp@__VERSION__"]
    }
  }
}
```

The configuration shape varies by host. The command is `npx`; the arguments are `-y` and `@testers-ai/carbon-mcp@__VERSION__`. No port or hosted endpoint is required. On Windows, your host may require `npx.cmd`. Restart/reconnect the MCP server after configuring it.

An unadorned invocation waits for MCP JSON-RPC on stdin; it is not an interactive terminal chat. `--help`, `--version`, `--doctor`, `--print-config`, and `--list-workflows` are safe terminal commands. They never install browsers or modify your agent's configuration.

## First use

Ask your agent to load CARBON's `jay` or `carbon` MCP prompt and test a specific project or URL. Confirm scope and permissions. Jay starts a bounded assessment, records observed evidence, and returns a protected localhost report URL. Ask your host to open that URL **as a browser page**, not an HTML source file. Unsupported embedded viewers can use the local browser URL while the server is running, or the saved HTML export afterward.

`carbon-settings` opens the settings page for budgets, scope, analytics, and testing mode. Installing through npm does not register host hooks or automatically start background checks. Selecting an automatic mode does not create an unavailable host hook. Follow the native plugin setup if you want supported automatic-check integration.

### Included workflow prompts

__COMMAND_LIST__

`j` remains a compatibility shortcut for **Jay**, not a different agent name. Prompt names and slash-command visibility depend on the host. The `carbon-pro` prompt only opens the public upgrade page; it does not ship paid testing capabilities.

### MCP tools

- `carbon_start`: start a scoped assessment and local live report.
- `carbon_update`: record checks, findings, evidence, and progress.
- `carbon_report`: open reports/maps and export saved evidence.
- `carbon_settings`: inspect or explicitly change settings.
- `carbon_demo`: create a new disposable demo without overwriting projects.
- `carbon_knowledge`: load testing-domain and specialist references.

This is a CLI/MCP package, not a stable JavaScript library API. Native Claude/Codex plugins additionally deliver host-specific skills and hooks; npm alone does not make every host expose the same features. Install only one CARBON server/edition per host namespace to avoid duplicate tools.

## Privacy and trust

Analytics is **off by default** for the npm edition. Optional events contain fixed event names, edition, and version—not source code, prompts, findings, target URLs, project paths, or stable user identifiers. `CARBON_ANALYTICS=off` or `DO_NOT_TRACK=1` forces it off. See [PRIVACY.md](PRIVACY.md).

Reports and evidence are stored in your project. Local viewers bind to loopback and protect evidence with private tokens. Your coding agent may still send context to its model provider. Local-first is not an air-gap guarantee. Do not expose report URLs publicly; review exports before sharing.

The npm package contains the MIT-licensed free edition only. It does not include CARBON Pro, customer evidence, or a remote license unlock. npm downloads are not verified installations or unique users; first activation and optional command events are separate, best-effort signals.

## Documentation and support

- [CARBON overview, documentation, and native plugins](https://testers.ai/carbon/)
- [Source](https://github.com/jarbon/carbon-free)
- [Report an issue](https://github.com/jarbon/carbon-free/issues)
- [CARBON Pro](https://testers.ai/carbon/#pro)

MIT License. Copyright testers.ai and Jason Arbon. Jay is an AI persona, not a human reviewer. Evidence and confidence assessments are not guarantees that software is defect-free.
