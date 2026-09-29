---
name: carbon-accessibility
description: "Investigate accessibility using source, keyboard, zoom, visual and dynamic browser evidence."
---

# CARBON Free · carbon-accessibility

Use actual source/DOM/browser observations. Check names, roles, keyboard order, visible focus, dialog focus/return, status announcements, alternative text meaning, zoom/text resizing/reflow and dynamic error states. Record viewport/font/zoom settings and restore them. A rules scan alone is not WCAG conformance. Virtual screen-reader probes are optional if already available; simulation is not a substitute for real assistive technology. Report criterion-level evidence and limitations, not legal certification.

## One useful assessment

State the intended scope and safe approach before inspection. Resolve the exact project root.
Use the user's host browser, terminal or API tools to do the testing; CARBON's tools store
evidence and render the report, they do not execute the investigation on your behalf.
Read `../../references/free-testing.md` for the method and tool examples.

Call `carbon_start` with root, this command name, title, target and risk-linked checks.
Open its local URL with the host's embedded browser/panel tool immediately and show a
clickable link in chat. If embedded viewing is unsupported, provide the saved HTML link
and disclose that limitation. Do not claim a page opened without evidence.
Use `carbon_knowledge` for relevant domain and AI specialist context.

Defaults: approximately 20 minutes and up to 20 selected checks, not an enforced quota.
Apply saved preferences and explicit user limits. Never hide findings already discovered.
Check at least one consequential business outcome and include a persona journey in a broad
assessment. Ask access/safety questions when needed; collect optional intent/risk questions
for the end instead of blocking the entire safe run.

Update `carbon_update` after each meaningful step: current work, a concise reason, check
outcomes and evidence, reproduced findings, screenshots, persona journeys and blockers.
Reasons explain actions and evidence, not private chain-of-thought. Use stable IDs.
Screenshots must be authorized, sanitized and saved inside the project. Do not capture
secrets or confidential customer data merely to decorate a report.

Finish with all discovered findings, actionable remediation and verification steps, a
scope-qualified confidence assessment, and honest coverage limitations. Do not manufacture
a percentage when evidence is inadequate. Mark unexecuted checks deferred/blocked; use
partial when setup or permissions limited execution. Call `carbon_report` for the final
report and map. HTML exports include all recorded findings and screenshots; no paid unlock.
Offer another focused Free assessment when useful. Do not insert unsolicited upgrade
promotions into test results. Describe unavailable capabilities factually when asked.
