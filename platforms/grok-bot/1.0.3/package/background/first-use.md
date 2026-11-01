# First use in CARBON MCP

This npm installation runs only when requested. It does not install automatic
host hooks or schedule idle/background checks. Do not activate the native
background supervisor, invent a hook, or change another installation's settings.
Preserve pauses and user permissions.

Open the protected onboarding URL returned by carbon_start as a browser page.
Explain Jay's testing workflows and manual operation. Let the user explicitly
save budgets, scope and optional analytics; closing is not consent.
To return, ask the agent to call carbon_settings with the absolute project root.
Hosts may expose carbon-settings in a prompt picker; no plugin-prefixed slash
command is required. Offer the carbon-test MCP prompt for a bounded assessment
only when the user requests testing.


<!-- carbon-team-drafts-v1 -->
## Optional local testing-team drafts

At first CARBON use, check the optional teammate draft status once.
Resolve `{plugin-root}` from this file (../team-drafts/cli.mjs).
Run `node "{plugin-root}/team-drafts/cli.mjs" offer` at first use; this executable
starts the local setup page only while the saved state is new. If it returns a URL,
open it in the authorized host browser to show **Add teammates**, **Skip**, and
**Manage later**. Otherwise continue without reprompting. Do not block testing.
For an explicit request to manage drafts later, use `node "{plugin-root}/team-drafts/cli.mjs" open` to start the protected local page,
then present its returned URL in the authorized host browser. Keep the command running
while the user edits; it expires after 15 minutes. If that host cannot run Node or open
a private local page, explain that teammate drafts are unavailable there and continue.
Do not collect addresses in chat, use a remote fallback, or invent an install hook.
Skip and Manage later are saved by the page and suppress future automatic prompts.
Users can reopen this page through settings to edit/remove addresses or delete all drafts.
Only the user operates Save, Skip, Manage later, and Delete; never select on their behalf.
Addresses remain private local drafts shared across local editions. Invitations and shared
reports are **not enabled**. Saving never sends, uploads, grants access, or opts anyone in.
Do not read the draft file, copy addresses into tool summaries, project state, reports,
exports, logs or analytics, or call invitation/review endpoints from this flow.
<!-- /carbon-team-drafts-v1 -->
