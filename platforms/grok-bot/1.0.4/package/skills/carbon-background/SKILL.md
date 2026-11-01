---
name: carbon-background
description: Explain MCP background-check availability and offer manual testing.
---

# CARBON MCP background checks

This npm MCP server does not install automatic host hooks, a scheduler, a daemon,
or a background supervisor. Report automatic checking as unavailable here, even
if a native plugin has saved an automatic preference. Do not enable or modify that
plugin's settings. Preserve all existing pauses and permission gates.

Offer a bounded manual assessment via the `carbon-test` MCP prompt for a named
change, or explain separately installing a supported native CARBON plugin.
Prompt pickers and slash-command exposure vary by host. Reopen preferences by
asking the agent to call `carbon_settings` with the absolute project root.
Do not launch tests merely because the user asks about availability.
