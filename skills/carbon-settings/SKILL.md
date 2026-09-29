---
name: carbon-settings
description: "Read or change project testing defaults and analytics preferences in a protected local settings page."
---

# CARBON Free · carbon-settings

Call `carbon_settings` for the project root, with an optional patch only for explicitly requested changes. Open the returned local settings UI. Supported keys are minutes, maxChecks, focus and analyticsEnabled. Never put credentials in focus text. Analytics is global; CARBON_ANALYTICS=off overrides stored preference. No separate testing run is needed.

Read `../../references/free-testing.md` for data safety and tool contracts.
