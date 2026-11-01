---
name: carbon-settings
description: Read or explicitly change CARBON MCP testing preferences.
---

# CARBON MCP settings

Call the MCP tool `carbon_settings` with the absolute project root. Open its exact
`openTarget` as a browser page, preserving the private URL token. Introduce Jay,
the AI test manager, and tell the user they can return by asking their agent to
open CARBON settings. Hosts may expose the `carbon-settings` prompt in a picker;
do not assume a slash command or native plugin prefix.

The npm distribution runs on request. It does not install or detect host hooks.
Automatic background checks cannot be enabled here. Do not configure the native
background supervisor or change existing native-plugin pauses or permissions.

Supported preferences: minutes, maxChecks, focus, analyticsEnabled and
backgroundMode (manual only). Save only the user's explicit choices. A manual Save
acknowledges this distribution's onboarding locally without changing a native
plugin's configuration. Analytics is optional and global; environment opt-outs
still override it. Never enter credentials in project focus.


<!-- carbon-team-drafts-v1 -->
## Optional local testing-team drafts

When managing settings, offer the optional local teammate draft page.
Resolve `{plugin-root}` from this file (../../team-drafts/cli.mjs).
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
