# CARBON for Grok Bot: privacy

The Grok adapter forcibly sets CARBON_ANALYTICS=off and DO_NOT_TRACK=1. The optional analytics behavior below applies only when the base entry point is used directly. The adapter does not enable background testing. Grok runs on the provider’s computer; data selected by the host is subject to the host’s policies and settings.

# CARBON npm distribution: privacy


## Optional completion milestones

A separate unchecked preference enables fixed aggregate events for first completed assessment, first return on a later UTC day, and Pro interest where supported. Basic usage analytics must also be enabled. Local state retains the first completion date and hashed run keys for deduplication; those keys, project data, and an installation identifier are never transmitted. Events are not unique people, installation counts, retention cohorts, purchases, or paid activation. A reset or another device can count again. Disabling this preference prevents queued milestone events from being sent. Environment privacy opt-outs still take priority. Codex offline exports do not send click events.
This package runs locally. Your host coding agent supplies model access and may send selected project context to its configured provider. Browser/API investigations contact the authorized target. Local-first does not mean offline or air-gapped.

Evidence is stored under the project .carbon directory. Reports can contain screenshots, test inputs, findings, and source context. Review and redact exports before sharing. Uninstalling the npm package does not delete project evidence or global CARBON preferences.

Live reports bind to 127.0.0.1, check Host, and require private tokens for evidence and settings. Do not forward their ports or share their private URLs. The server must remain running for live views. Offline reports remain available afterward.

## Optional analytics

The npm edition uses the existing internal `mcp-lite` telemetry namespace, with **defaultEnabled: false**. This internal key is not the public product name. No analytics is sent during npm installation or CLI help/configuration/diagnostic commands. An existing explicit preference for this namespace or CARBON_ANALYTICS=on can enable runtime analytics.

When explicitly enabled, fixed command names, first activation, assessment lifecycle, report/settings use, edition, and version are sent to Fathom at https://cdn.usefathom.com/. No prompt, code, project path, target URL, screenshot, finding, credential, or persistent user identifier is included. The receiver necessarily sees connection metadata. CARBON_ANALYTICS=off or DO_NOT_TRACK=1 overrides enabled preferences.

Use CARBON's settings or the packaged scripts/usage-analytics.mjs helper to inspect or explicitly change preferences. Failed deliveries may be retried on later activity; the local queue is capped at 200 events and seven days. There is no background uploader. Disabling clears queued events on the next helper invocation. HTTP acceptance does not prove dashboard ingestion; retries may duplicate receiver counts.

First activation is once per edition/local configuration, not an install or unique person. npm download totals may include automated downloads and reinstalls. No repeat-user tracking via stable identifiers is introduced by this distribution.

## Background checks and integrations

Installing or starting this MCP package does not register host hooks, start automatic testing, install browsers, or grant new permissions. Automatic checks require supported host integration and saved settings; global pause and environment disables remain effective. The free package has no paid benchmark or external reviewer service. Opening the Pro website does not upload project evidence.

Contact jason@testers.ai for privacy questions. This disclosure is not a compliance certification or data-residency guarantee.

## Grok-specific state location

Through bin/carbon-grok-bot.mjs, all global CARBON state described above is rooted beneath ~/.config/carbon-grok-bot/runtime-v1 (or an explicitly selected dedicated CARBON_GROK_STATE_DIR), rather than the shared CARBON home. Analytics-off queue clearing and settings writes therefore affect only this Grok runtime state. Project evidence paths are unchanged. Directly starting the base MCP entry point does not enable this isolation.
