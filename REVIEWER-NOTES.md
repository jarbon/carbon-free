# Directory reviewer notes

## Update 1.32.22-free.11

Clarifies default model access and local data boundaries in plugin metadata and the README. Default testing uses the host coding agent's configured subscription or API access, with no separate CARBON model key. Local evidence storage is distinct from context processed by the host model provider. Plan limits, Pro licensing, integrations, and edition-specific analytics are explicitly qualified. No new runtime permissions, network destinations, tools, or background behavior. Package version metadata is synchronized.

This Light-only source bundle contains eight testing workflows, two conversational
aliases (`j` and `jay`), and one local stdio MCP server.
No CARBON service login or test account is required; four synthetic demo fixtures
provide sample data. Run `node tests/smoke.mjs .` for the isolated runtime checks.

## Update 1.32.22-free.9

The directory display name is now Testers.ai CARBON Test Harness. The stable
plugin identifier remains `carbon`, preserving existing command namespaces.
The description explains software testing and quality assurance, the eight
Light workflows, and the distinction between executed tests and untested work.
The latest source also includes the previously prepared Jay conversational
aliases and empty-target clarification. No Pro workflows or benchmark data are
included. The existing license, network destinations and permission boundaries
are unchanged.

## Image-related policy holds

`server/view.mjs` reads `assets/icon.png` and specialist portrait files as bytes,
encodes them as data URLs, and embeds them in local HTML. It does not execute them.
`tests/smoke.mjs` copies the icon into a temporary synthetic project to verify the
screenshot export path. `references/specialists.json` supplies local portrait paths.
Current reports show role-based WebP icons with an AI label, including Jay's
J-shaped icon. Dark and light assets are bundled. Unreferenced legacy portraits
are excluded from this release, with originals preserved outside the package.
Retained images are byte-for-byte unchanged, including provenance metadata.

## Update 1.32.22-free.7

The existing local report now offers Release Brief, Evidence Lens, Journey Atlas,
and Live Investigation views. The two new ui/report-workspace files are readable,
bundled JavaScript/CSS, inlined into portable reports. They make no network requests.
The journey input records ordered steps with evidence; it does not execute tests.
Unexecuted/unknown checks are not displayed as passes. Missing panels are hidden.
Screenshot zoom preserves focus and live updates preserve the last good snapshot.
The current evidence remains available as HTML/JSON exports and an expanded record.

No new services, destinations, permissions, dependencies, Pro code, or benchmark data.
Existing image provenance, isolated demo environment, eight skills, MCP annotations,
and existing consent boundaries are preserved. No automated upgrade advertisements.
Run node tests/report-workspace.mjs in addition to the existing smoke/safety checks.

## Update 1.32.22-free.6

Only the 50 specialist/manager assets referenced by the current catalogs are
bundled. The obsolete legacy portraits are not needed by current reports.
The demo-copy subprocess now receives an explicit platform-variable allowlist,
not the host environment. Python runs with -I -B: no user site packages,
PYTHONPATH injection, or bytecode writes. No API keys, access tokens, cloud
credentials or proxy variables are forwarded by this helper.

The scanner's UNREAD_ASSET_REFERENCED references point to image rendering,
catalog paths, documentation, and an image export test, not execution of images.
server/view.mjs uses fs.readFileSync plus a data:image URL in an img tag.
The subprocess executes only the bundled carbon_demo.py script. We request
human review if the preserved, referenced image assets still require it.

## Update 1.32.22-free.5

This release imports the October 1 Jay and role-icon update plus command, MCP,
and sub-agent documentation. It preserves the previously reviewed isolated demo
credential handling, MCP safety annotations, Light listing metadata, and limits on
unsolicited upgrade promotions. No new service, telemetry destination, permission,
Pro implementation, or private benchmark data is added.

The previous release's unused legacy portrait was flagged for embedded text.
It is no longer distributed because the current role-icon catalog supersedes it.
We did not strip or rewrite provenance to conceal content from the reviewer.

## Credentials and network

The API demo uses a deliberately public synthetic fixture value. It does not read
the installer's API_KEY. The Node MCP server has no model credential requirement.
The only built-in external runtime request is the disclosed default-enabled command
analytics request; `CARBON_ANALYTICS=off` disables it. Browser/API testing is performed
by the host agent against the target authorized by the user, not by this MCP server.
See README.md and PRIVACY.md for the complete data-handling disclosure.

## Scope of review evidence

CLI manifest and skill validation, MCP runtime regression checks and a Gitleaks
source scan passed before upload. These are not a substitute for Anthropic's
validation/security review, and are not an application-quality certification.
Source fixtures intentionally include bugs so users can test the workflow.

The Light plugin is open source under the MIT License. There are no
automatic Pro promotional messages in its skill responses or generated reports.
# Release 1.32.22-free.10: optional local hooks

This update adds reviewed command hooks, `background/engine.mjs`, and
`carbon-background`. Installation does not enable execution. Project consent,
global pause, duration/daily limits, one worker and activity cancellation are enforced
in code. Default checks parse changed JSON/JS without executing the application.
Explicit local test commands and Claude-only tool-free source review require separate
consent; the latter uses the signed-in provider and its allowance, not a CARBON API.
Once-daily per-chat reminders ask permission and recommend an installed command.
No transcript is stored: only a topic label, hashed chat key and timestamps.
Hosts without command hooks retain manual commands. See background/README.md.
