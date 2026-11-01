---
name: carbon-core-jay
description: "Talk directly to Jay, CARBON's AI test manager: ask questions, discuss evidence, choose what to test, or request an assessment."
---
# CARBON Core — jay

Load the MCP prompt named `jay` from the `carbon-core` MCP server (CARBON MIT/free), passing the user's request as its request argument. Follow that workflow with Cursor's authorized tools. If prompt loading is unavailable, read `skills/jay/SKILL.md` relative to this plugin's root and the shared `references/free-testing.md` before proceeding.

Use only the user's requested workspace or target, not the installed plugin directory. Loading instructions is not execution evidence. Preserve approvals and report unavailable capabilities honestly. Record actual checks with carbon_start and carbon_update; finish assessment runs with carbon_report and open its protected browser target when available. Do not publish report capability tokens. No automatic background hooks are installed.

Use only tools from MCP server `carbon-core` (documented approval identity `plugin-carbon-core-carbon-core`). Never substitute an existing `carbon` server; stop if the selected source cannot be verified.
