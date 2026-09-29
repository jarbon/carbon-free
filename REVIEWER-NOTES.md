# Directory reviewer notes

This Free-only source bundle contains eight skills and one local stdio MCP server.
No CARBON service login or test account is required; four synthetic demo fixtures
provide sample data. Run `node tests/smoke.mjs .` for the isolated runtime checks.

## Image-related policy holds

`server/view.mjs` reads `assets/icon.png` and specialist portrait files as bytes,
encodes them as data URLs, and embeds them in local HTML. It does not execute them.
`tests/smoke.mjs` copies the icon into a temporary synthetic project to verify the
screenshot export path. `references/specialists.json` supplies local portrait paths.
The reports show specialist portraits in grayscale with an AI label.

The initial directory validation also reported a download-and-execute pattern and
large printable text in `assets/specialists/nia-gray.png`. A PNG chunk inspection
found an IHDR, a caBX content-credentials chunk, IDAT image chunks and IEND. The
runtime treats this file only as image data. We have retained the asset for human
review rather than treating the scanner's warning as approval or running its bytes.

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
