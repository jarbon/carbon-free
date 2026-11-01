# CARBON Core for Cursor

Free, open-source AI testing with Jay, the CARBON test manager. MIT licensed.

## Requirements

Node.js 22+ on PATH; Python 3.10+ for demo and full-workflow helpers. Cursor supplies model, terminal and browser access; this package does not include model usage or cloud testing credits.

## Use

After installing the plugin, approve its local CARBON MCP server when Cursor asks. Check that eight CARBON MCP tools are registered: seven agent tools and one app-only panel polling tool. Use the carbon command for risk-based testing, jay for the test manager, full for a comprehensive campaign, or carbon-accessibility for focused accessibility checks. The plugin provides 13 command entry points and MCP prompts. Commands retrieve workflows; the agent executes them using its authorized tools.

For a disposable first run, request: "Use CARBON carbon-demo to create a TestBucks project, test it, and show the HTML report. Record real evidence and clearly mark anything blocked."

Run reports and preferences stay local. Open the browser target returned by carbon_report. Remote environments require their host's safe artifact delivery; do not expose localhost report servers or share capability tokens.

Analytics is forced off in this Cursor configuration. No account, CARBON API key, install scripts, automatic hooks or unattended background execution. Core includes full, but not the Pro-only formal proof workflow. Read PRIVACY.md and SECURITY.md before sharing reports.

## Publisher status

This directory is a locally generated submission candidate, not an approved marketplace listing. Cursor requires the plugin in a public Git repository and a separate submission at https://cursor.com/marketplace/publish. The canonical source repository is https://github.com/jarbon/carbon-free; the presence of that link does not mean this candidate has been pushed there.

## Rebuild

From this local submission bundle: python3 build.py. This repacks the reviewed CARBON directory deterministically; it does not pull canonical working-tree changes.

https://testers.ai/carbon/

## Exact tool contract

Agent tools: `carbon_start`, `carbon_update`, `carbon_report`, `carbon_settings`, `carbon_demo`, `carbon_panel`, `carbon_knowledge`.
The eighth tool, `carbon_status`, is read-only and marked `ui.visibility: ["app"]`. The bundled MCP App polls it; it is not an agent command. Hosts without MCP Apps use the local report/browser fallback. Cursor may list all eight in configuration; host enforcement of app-only visibility requires native verification.

## Local candidate setup and limits

Extract the archive preserving its `CARBON/` directory. Select that directory (containing `.cursor-plugin/plugin.json`), not its parent, when loading a local repository. The manifest identifier is `carbon-core`; the archive root is CARBON. The old hook-loaded candidate appeared as Package; the generic `package/` basename is a suspected contributor, not a verified root cause. Final CARBON capitalization is pending native confirmation.

Use only an isolated disposable Cursor environment for validation. The prior candidate was discovered through a workspaceOpen hook and showed 13 commands and eight connected tools in Cursor 3.27.22. That is not an end-to-end agent test. This new version has not been loaded in Cursor. A separate user-data launch on the test Mac was denied with macOS -10826; do not change permissions or reuse account state to work around it.

A future authorized smoke prompt: “In this synthetic workspace only, use CARBON to check that cart.json price 5 times quantity 3 equals expectedTotal 15, record the observed evidence, and generate a local HTML report. Do not contact external targets or enable analytics/background checks.” Verify the loaded candidate source and version before sending it.

## Optional teammate drafts

First-use guidance offers Add, Skip, or Manage later in a protected local form. Never paste addresses into chat. Draft addresses stay outside project evidence; invitations and shared reports remain disabled. Windows draft storage fails closed until private ACL support is implemented and verified. No real contacts are needed for testing.

## Support and privacy

Support: https://github.com/jarbon/carbon-free/issues (synthetic reproductions only).
Privacy disclosure for this candidate: [PRIVACY.md](PRIVACY.md). The public repository privacy page exists at https://github.com/jarbon/carbon-free/blob/main/PRIVACY.md but describes an older distribution; it is not proof this candidate disclosure is published. Publisher contact from existing package: jason@testers.ai (mailbox ownership/deliverability not independently verified).

Cursor runtime state is project-local under `.carbon/free/`; analytics/milestones are stateless and disabled even if legacy preferences or environment opt-ins request them. The optional contact form uses `~/.config/carbon-cursor/team-drafts-v1/` and retains fail-closed Windows behavior. No shared usage queue is purged.

## Distinct Cursor identity (cursor.5)

Human branding and archive directory remain CARBON. The Cursor plugin identifier and MCP server key are both `carbon-core`, distinguishing the MIT/free edition from an existing `carbon` plugin. The documented approval identity is `plugin-carbon-core-carbon-core`. Verify that exact source and eight-tool contract before invoking tools; never substitute the existing carbon server. Internal MCP prompt/tool names remain unchanged and server-scoped.

Native command wrappers are `carbon-core`, `carbon-core-accessibility`, `carbon-core-background`, `carbon-core-demo`, `carbon-core-help`, `carbon-core-issues`, `carbon-core-map`, `carbon-core-pro`, `carbon-core-settings`, `carbon-core-test`, `carbon-core-full`, `carbon-core-j`, and `carbon-core-jay`. Each explicitly selects its original MCP prompt from carbon-core. Earlier short names in generic workflow documentation are MCP prompt names, not these distinct native command identifiers.

The cursor.4 native test confirmed CARBON branding and 13 commands, but revealed a same-name server collision. Those results do not validate cursor.5. This revision needs a fresh native attribution check; no account plugin should be disabled to force a pass.
