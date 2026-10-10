# Testers.ai CARBON Test Harness

## Your agent's plan. Your local workspace.

**Use the model access you already have.** In Claude Code, Codex, and other coding
agents, CARBON's default testing workflows use the host's configured model access.
When the host uses an eligible subscription, CARBON uses that allowance—no separate
CARBON model API key is required. If the host uses API credentials or a company LLM
proxy, that billing and data policy apply instead. Plan limits and extra-usage
charges still apply; CARBON Pro licensing is separate.

**Local execution and local reports—not a promise that no data leaves your machine.**
For local runs, project files, test evidence, and reports are stored in your local
workspace. Your coding agent can send selected code, screenshots, prompts, and
other context to its configured model provider. Local CARBON is not automatically
offline or air-gapped. Cloud runs, external integrations, and optional direct-model
checks have separate data flows and may have separate costs. Command-usage analytics
vary by edition; review that edition's privacy policy and settings.

To confirm your billing route, check `/status` in Claude Code or `codex login status`
in Codex. A configured API key can select API billing instead of subscription usage.
Standalone MCP clients must supply their own model access and execution tools;
installing an MCP server does not include a model subscription.

**Light edition.** AI software testing and quality assurance inside Claude.

AI testing inside your coding agent. Built by [testers.ai](https://testers.ai).

CARBON gives your coding agent risk-based testing instructions and a local evidence
runtime. The agent inspects your authorized project, runs checks using its available
browser, terminal or API tools, and records findings in a live report. CARBON's MCP
server does not independently run the investigation or manufacture results.

## New in 1.32.22-free.7

Four compact report views help you move from a decision to its evidence:

- **Release Brief:** findings, next actions and outcomes for the selected checks.
- **Evidence Lens:** page screenshots linked to checks, reproduction and fixes.
- **Journey Atlas:** recorded paths and step outcomes, without invented connections.
- **Live Investigation:** the current check, its purpose and recent activity.

Zoom screenshots, keep the full record one click away, and export portable HTML/JSON.
Live reports retain their last good snapshot and quietly reconnect after interruption.
Unknown and deferred checks remain distinct from passing checks.

## Role-based AI testing team

Jay, the AI test manager, now introduces the assessment and appears in reports.
Specialist profiles use role-based names and new light/dark icon identities rather
than human names and photographs. They remain AI perspectives, not human reviewers.
See the [AI testing team](SUB-AGENTS.md), [visual profile gallery](sub-agents.html),
[command guide](COMMANDS.md), and [MCP tool reference](MCP_SERVER.md).
The eight-command scope, license, data handling and permission boundaries are unchanged.

## Eight workflows

| Skill | Purpose |
| --- | --- |
| `carbon` | Bounded risk-based assessment, including business value and persona journeys |
| `carbon-demo` | Create a disposable sample project, then assess it |
| `carbon-test` | Test one named behavior, feature or change |
| `carbon-issues` | Bug hunt with at least half the budget for stateful and persona exploration |
| `carbon-accessibility` | Focused accessibility investigation with evidence and limitations |
| `carbon-map` | Explore screenshots, checks and findings from the current assessment |
| `carbon-help` | Choose an appropriate Free workflow |
| `carbon-settings` | Change local planning defaults and analytics preference |

All recorded findings, persona journeys, HTML/JSON exports and current-run maps are
included. No CARBON account, payment or finding unlock is required. Your coding-agent
subscription or API usage is separate. The usual 20-minute/20-check planning default
is adjustable, not a coverage guarantee or hard run quota.

## Install and start in Claude Code

Requirements: Node.js 22 or later; Python 3.10 or later for the optional demo creator.
No npm install is needed for the MCP runtime. Browser automation depends on the tools
your coding agent has available. Optional demo tests have their own documented dependencies.

```sh
git clone https://github.com/jarbon/carbon-free.git
claude --plugin-dir /absolute/path/to/carbon-free
```

Replace the path with your checkout. Claude Code normally prefixes plugin skills
with the plugin name. Try these three examples:

1. `/carbon:carbon` — assess the current project. If the folder is empty or the target is unclear, Jay asks what to test: a URL, folder/repository, API, app/feature, or requirements. With a clear target, he runs a broad assessment and reports findings, evidence-qualified confidence, gaps, and next steps.
2. `/carbon:carbon-issues ./my-app` — investigate bugs, including state transitions and multi-step journeys, in an authorized project.
3. `/carbon:carbon-accessibility http://localhost:3000` — test an app you control; report actual evidence and untested criteria separately.

Use `/carbon:carbon-map` for the latest assessment or `/carbon:carbon-settings` to
adjust defaults. Names and embedded-browser support can vary by host/version; use
the host's skill picker. Install one CARBON edition at a time because editions share
the `carbon` namespace. This repository is not a claim of Anthropic approval or listing.

The bundle also contains a Codex manifest. Other MCP hosts may launch
`node /absolute/path/to/carbon-free/server/index.mjs`, then expose the bundled skills
through their supported mechanism. A chat host without local process/browser access
cannot provide the same runtime behavior. Test the surface you intend to use.

## What runs, writes and connects

- The declared MCP entry point is `server/index.mjs`, using Node standard libraries.
- Demo creation invokes bundled `runtime/carbon/scripts/carbon_demo.py` via Python.
  Fixtures are synthetic examples, some intentionally imperfect; never deploy them as production apps.
- Evidence and report snapshots are saved under your project's `.carbon/free/`.
  Existing reports are retained. Uninstalling does not erase evidence.
- Live report/settings views bind to `127.0.0.1` and use random access tokens.
  The agent opens them with its own browser/panel tool where supported. Saved HTML
  remains usable after the runtime stops. Review exports before sharing.
- Anonymous command analytics is **enabled by default** and sends fixed command
  event names to `https://cdn.usefathom.com/`. It does not send prompts, source,
  target URLs, screenshots, findings, credentials or a stable user identifier.
  Network metadata is visible to that service. Set `CARBON_ANALYTICS=off` before
  startup or disable analytics in settings. No telemetry is sent merely by importing the module.
- Global analytics preference and delivery diagnostics use `.config/carbon/` in
  your user home. Project evidence has no automatic expiration; you control retention.
- Your coding agent's model provider still processes the context you share with it.
  Browser/API checks contact the authorized target and potentially its third parties.
  Local-first does not mean air-gapped.

See the [privacy policy](https://github.com/jarbon/carbon-free/blob/main/PRIVACY.md)
for data handling, retention and contact details. There is no private benchmark
fetch, reviewer service, remote MCP backend or Pro unlock code in this bundle.

## Interpreting results

Only recorded evidence is displayed. Unexecuted tests remain blocked or deferred;
suspected issues are distinguished from demonstrated failures. Confidence is scoped
engineering judgment, not a calibrated probability that the whole product is correct.
AI persona feedback is simulated, not human research. Accessibility results are not
a certification or legal opinion. This Free runtime does not generate formal DOCX
conformance documents or run continuous automatic repair.

## Troubleshooting and support

- Missing tools: check Node with `node --version`, reload the plugin and inspect the
  host's MCP connection status. Run `claude plugin validate .` from the checkout.
- Expired live link: reopen the saved run with `carbon_report` or open its saved HTML.
- No browser available: run authorized static/API checks and disclose untested UI scope.
- Demo setup failure: check `python3 --version` and the selected fixture's README.
- Do not post private code, report tokens, screenshots or customer records in public issues.

Product/security support: [jason@testers.ai](mailto:jason@testers.ai).
Reproducible non-sensitive problems: [GitHub issues](https://github.com/jarbon/carbon-free/issues).

## Runtime regression checks

From the repository root, run `node tests/smoke.mjs .`. The checks use temporary
synthetic projects and disable analytics. They exercise the MCP interface, demo
copying, report lifecycle, evidence exports, settings persistence, authentication,
cross-origin rejection and symlink protection. They do not certify accessibility,
security, or performance of an application under test.

## License and product information

Open source under the MIT License for CARBON Light on both Claude and Codex. Read [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md).
Product edition information is available on the [CARBON website](https://testers.ai/carbon/).

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

<!-- jay-background -->
## Optional Jay background checks

After an explicit per-project choice and host hook trust, Jay checks changed code during breaks. Defaults: 2-minute idle delay, 3-minute runs, maximum 10 minutes per run, one worker, 3 runs and 10 reserved minutes per UTC day across projects. No automatic fixes or live-site testing. Local checks and outcome counts stay on this machine. Optional Claude-only AI source review requires separate consent to provider processing and allowance use. Codex checks do not launch Claude. Use `carbon-background` to enable, pause, review, or disable everywhere. See [behavior, controls and privacy](background/README.md). Unsupported hosts retain manual testing.
<!-- /jay-background -->

<!-- carbon-pro-command:start -->
## Explore CARBON Pro

Run `/carbon-pro` to open [CARBON Pro features and pricing](https://testers.ai/carbon/#pro).
In Claude Code or Cowork, the plugin-prefixed command is `/carbon:carbon-pro`.
In Codex, choose `carbon-pro` from the plugin skill picker (or use `$carbon-pro`).
MCP clients expose the `carbon-pro` prompt; the full runtime also accepts `carbon_pro`.
This is a navigation shortcut available in every edition, not a paid testing workflow.
It does not run tests, start checkout, install Pro, or expose customer downloads.
<!-- carbon-pro-command:end -->
