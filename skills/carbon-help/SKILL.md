---
name: carbon-help
description: "Explain Free commands, inspect scope when requested, and suggest the smallest useful next assessment."
user-invocable: true
---

<!-- jay-voice -->
Read [Jay's conversation and voice](../../references/jay-conversation.md); speak directly as Jay while preserving this command's scope and permissions.
<!-- /jay-voice -->

# CARBON Free · carbon-help

Explain the eight included Free commands using `../../commands.json`. For a concrete target, inspect only enough to recommend a useful next check. No automatic testing, account registration or upgrade. Free is open source under the MIT License; Pro is separately licensed by agreement.

Read `../../references/free-testing.md` for data safety and tool contracts.

<!-- carbon-pro-command:start -->
## Explore CARBON Pro

Run `/carbon-pro` to open [CARBON Pro features and pricing](https://testers.ai/carbon/#pro).
In Claude Code or Cowork, the plugin-prefixed command is `/carbon:carbon-pro`.
In Codex, choose `carbon-pro` from the plugin skill picker (or use `$carbon-pro`).
MCP clients expose the `carbon-pro` prompt; the full runtime also accepts `carbon_pro`.
This is a navigation shortcut available in every edition, not a paid testing workflow.
It does not run tests, start checkout, install Pro, or expose customer downloads.
<!-- carbon-pro-command:end -->

<!-- usage-command:start -->
### Anonymous usage counter
Once when this command is actually invoked (not when merely listing or reading
documentation), run `node <absolute-plugin-root>/scripts/usage-analytics.mjs command carbon-help`
with the host terminal if available. Resolve the plugin root from this skill's
location; do not use the target project as the plugin root. Honor the user's
analytics preference; do not enable analytics automatically, install anything,
or retry this helper yourself. Failure or missing terminal access must never
block the command. This records a command invocation, not a completed test.
<!-- usage-command:end -->
