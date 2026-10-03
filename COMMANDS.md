# CARBON Free command reference

Free is a bounded assessment, not a continuous test-fix loop. It includes every recorded finding, current-assessment reports and portable HTML/JSON exports. Your coding agent executes the checks; CARBON records the evidence.

| Included command | What it does in Free |
|---|---|
| `/carbon` | Run a bounded risk-based assessment of a project or URL, including business value, stateful checks, persona exploration and an evidence-qualified report. |
| `/carbon-demo` | Create a disposable demo project, optionally with existing tests, and perform a first CARBON assessment. |
| `/carbon-test` | Test one named feature, flow, API or behavior with reproducible steps and evidence. |
| `/carbon-issues` | Hunt bugs with stateful multi-step journeys and persona exploration, not just a static checklist. |
| `/carbon-accessibility` | Investigate accessibility using source, keyboard, zoom, visual and dynamic browser evidence. |
| `/carbon-map` | Open a screenshot-based map of one saved Free assessment, its checks and findings. Not a cross-build planning workspace. |
| `/carbon-help` | Explain Free commands, inspect scope when requested, and suggest the smallest useful next assessment. |
| `/carbon-settings` | Read or change project testing defaults and analytics preferences in a protected local settings page. |

## Edition boundaries

Free Map shows one saved assessment, not cross-build comparisons or retained steering. Free Settings supports minutes, maxChecks, focus and analyticsEnabled; it is not a model-credential or integration manager. Dedicated security, privacy and performance commands are Pro, but relevant risks in those areas remain part of a Free assessment.

For installation see README.md. For the six MCP tools see MCP_SERVER.md. For reports and evidence handling see references/free-testing.md.

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
