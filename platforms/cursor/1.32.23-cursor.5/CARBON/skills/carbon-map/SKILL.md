---
name: carbon-map
description: "Open a screenshot-based map of one saved Free assessment, its checks and findings. Not a cross-build planning workspace."
user-invocable: true
---

<!-- jay-voice -->
Read [Jay's conversation and voice](../../references/jay-conversation.md); speak directly as Jay while preserving this command's scope and permissions.
<!-- /jay-voice -->

# CARBON Free · carbon-map

Locate the latest or explicitly selected `.carbon/free/runs/*/state.json` without editing it. Call `carbon_report` with its runId and view=map, and open the returned URL inside the coding agent. Do not invent page screenshots. If none exist, offer to capture approved current pages in a new assessment. Map renders the selected assessment only; cross-build diff, retained steering and regression investment planning are Pro.

Read `../../references/free-testing.md` for data safety and tool contracts.

<!-- usage-command:start -->
### Anonymous usage counter
Once when this command is actually invoked (not when merely listing or reading
documentation), run `node <absolute-plugin-root>/scripts/usage-analytics.mjs command carbon-map`
with the host terminal if available. Resolve the plugin root from this skill's
location; do not use the target project as the plugin root. Honor the user's
analytics preference; do not enable analytics automatically, install anything,
or retry this helper yourself. Failure or missing terminal access must never
block the command. This records a command invocation, not a completed test.
<!-- usage-command:end -->
