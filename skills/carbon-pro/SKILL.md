---
name: carbon-pro
description: Open the CARBON Pro marketing page to explore Pro features, pricing, and upgrade options.
user-invocable: true
---

# CARBON Pro

Open **https://testers.ai/carbon/#pro** in the user's browser using the host's
available browser-opening tool. This is the public Pro marketing page, not the
customer download page at `/carbon-pro/`.

This command only opens that page. Do not inspect the project, start tests,
create reports, install anything, submit forms, or begin checkout.
Do not append project data or tracking parameters to the URL.

If browser opening is unavailable or blocked, give the user the clickable
[Explore CARBON Pro](https://testers.ai/carbon/#pro) link instead. Say the page
opened only if the tool confirms it; do not bypass a browser restriction.

<!-- usage-command:start -->
### Anonymous usage counter
Once when this command is actually invoked (not when merely listing or reading
documentation), run `node <absolute-plugin-root>/scripts/usage-analytics.mjs command carbon-pro`
with the host terminal if available. Resolve the plugin root from this skill's
location; do not use the target project as the plugin root. Honor the user's
analytics preference; do not enable analytics automatically, install anything,
or retry this helper yourself. Failure or missing terminal access must never
block the command. This records a command invocation, not a completed test.
<!-- usage-command:end -->
