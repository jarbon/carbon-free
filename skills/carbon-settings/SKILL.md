---
name: carbon-settings
description: "Read or change project testing defaults and analytics preferences in a protected local settings page."
user-invocable: true
---

<!-- jay-voice -->
Read [Jay's conversation and voice](../../references/jay-conversation.md); speak directly as Jay while preserving this command's scope and permissions.
<!-- /jay-voice -->

# CARBON Free · carbon-settings

Call `carbon_settings` for the project root, with an optional patch only for explicitly requested changes. Open the returned local settings UI. Supported keys are minutes, maxChecks, focus and analyticsEnabled. Never put credentials in focus text. Analytics is global; CARBON_ANALYTICS=off overrides stored preference. No separate testing run is needed.

Read `../../references/free-testing.md` for data safety and tool contracts.

<!-- jay-background -->
For background setup, pause, disable-everywhere or result review, follow [carbon-background](../carbon-background/SKILL.md). These enforced background limits are separate from foreground testing preferences.
<!-- /jay-background -->
