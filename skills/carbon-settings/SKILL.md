---
name: carbon-settings
description: "Read or change project testing defaults and analytics preferences in a protected local settings page."
user-invocable: true
---

<!-- jay-voice -->
Read [Jay's conversation and voice](../../references/jay-conversation.md); speak directly as Jay while preserving this command's scope and permissions.
<!-- /jay-voice -->

# CARBON Free · carbon-settings

Call `carbon_settings` for the project root, with an optional patch only for explicitly requested changes. Open its exact browser `openTarget` (including the fragment token), never an HTML file/source editor. Introduce Jay briefly and point out `/carbon:carbon-settings` so the user can return later. The page keeps the automatic quick checks versus manual-only choice prominent.

Supported keys are minutes, maxChecks, focus, analyticsEnabled and backgroundMode (`automatic` or `manual`). The mode changes the real shared background supervisor, not a separate UI flag. Never submit a choice for the user merely because a radio button is preselected. Explicit Save acknowledges onboarding. Preserve global pauses and environment disables; this choice never enables AI review or adds executable test commands. All existing foreground preferences remain editable. Never put credentials in focus text. Analytics is global; CARBON_ANALYTICS=off overrides stored preference. No separate testing run is needed.

Read `../../references/free-testing.md` for data safety and tool contracts.

<!-- jay-background -->
For background setup, pause, disable-everywhere or result review, follow [carbon-background](../carbon-background/SKILL.md). These enforced background limits are separate from foreground testing preferences.
<!-- /jay-background -->

<!-- usage-command:start -->
### Anonymous usage counter
Once when this command is actually invoked (not when merely listing or reading
documentation), run `node <absolute-plugin-root>/scripts/usage-analytics.mjs command carbon-settings`
with the host terminal if available. Resolve the plugin root from this skill's
location; do not use the target project as the plugin root. Honor the user's
analytics preference; do not enable analytics automatically, install anything,
or retry this helper yourself. Failure or missing terminal access must never
block the command. This records a command invocation, not a completed test.
<!-- usage-command:end -->
