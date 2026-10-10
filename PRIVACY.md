# CARBON Free data handling

Local-first does not mean air-gapped. Your coding agent processes project context
using its configured model provider. CARBON does not control that provider's region,
retention or account policy. Browser/API tests contact the authorized target and
potentially that target's third parties.

Evidence stays in project `.carbon/free/` by default. It can include screenshots,
test inputs, source context and findings. You control retention. HTML/JSON exports
contain that evidence: review and redact them before sharing. Uninstall does not
delete project evidence or global configuration.

Live views bind to 127.0.0.1, check the Host header and require a random bearer token
for evidence access and settings changes. Keep live links private. They expire with
the MCP process. Offline report and map snapshots contain no live access tokens.

Default-enabled analytics sends fixed command event names to https://cdn.usefathom.com/
with a synthetic page path and per-event random value. No prompt, project path, target
URL, screenshot, findings, password or stable user ID is included. Network metadata
is visible to the receiving service. Set CARBON_ANALYTICS=off before startup or disable
it in Settings. The environment opt-out overrides stored preferences.

Free has no remote benchmark lookup or external reviewer service. Pro inquiries are
optional and submitted through the website, not by uploading local project evidence.
Contact jason@testers.ai for privacy, retention or licensing questions. This disclosure
does not claim SOC 2, a DPA or universal data-residency compliance.

<!-- jay-background -->
## Optional Jay background checks

After an explicit per-project choice and host hook trust, Jay checks changed code during breaks. Defaults: 2-minute idle delay, 3-minute runs, maximum 10 minutes per run, one worker, 3 runs and 10 reserved minutes per UTC day across projects. No automatic fixes or live-site testing. Local checks and outcome counts stay on this machine. Optional Claude-only AI source review requires separate consent to provider processing and allowance use. Codex checks do not launch Claude. Use `carbon-background` to enable, pause, review, or disable everywhere. See [behavior, controls and privacy](background/README.md). Unsupported hosts retain manual testing.
<!-- /jay-background -->

<!-- usage-analytics:start -->
## Optional usage analytics

Analytics records fixed command names, first activation, assessment lifecycle,
report/settings use, edition and version. It never includes prompts, code,
project paths, target URLs, screenshots, findings, credentials or a persistent
user identifier. Enabled events go to Fathom at https://cdn.usefathom.com/;
the service necessarily sees connection metadata such as IP address.

Claude editions retain default-enabled analytics. Codex editions default off;
enabling requires the user's explicit choice. Run `node <plugin>/scripts/usage-analytics.mjs
status`, `on`, or `off`. Global `CARBON_ANALYTICS=off`, `DO_NOT_TRACK=1`, or
the global analytics-disabled setting overrides edition preferences. An explicit
`CARBON_ANALYTICS=on` enables analytics unless DO_NOT_TRACK is set.

Failed deliveries are retried on later activity, with at most 200 local event
records and seven days of retention, in ~/.config/carbon/usage/<edition>.
Disabling analytics clears pending events on the next helper invocation.
There is no background uploader. HTTP acceptance does not prove dashboard
ingestion; retries after uncertain failures may duplicate receiver counts.
First activation is once per edition/local configuration, not an install or a
unique person. Installs come from publisher dashboards. Command telemetry is
best effort: hosts that do not execute the skill's helper cannot be counted.
<!-- usage-analytics:end -->
