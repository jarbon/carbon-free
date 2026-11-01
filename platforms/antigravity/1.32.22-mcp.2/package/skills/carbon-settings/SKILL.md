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
