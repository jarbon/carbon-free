# Directory reviewer notes

This Free-only source bundle contains eight skills and one local stdio MCP server.
No CARBON service login or test account is required; four synthetic demo fixtures
provide sample data. Run `node tests/smoke.mjs .` for the isolated runtime checks.

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

The plugin is source-available under PolyForm Perimeter 1.0.0. There are no
automatic Pro promotional messages in its skill responses or generated reports.
