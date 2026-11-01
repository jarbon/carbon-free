# Antigravity-specific privacy and local state

This note applies to the exact CARBON Antigravity 1.32.22-mcp.2 package. It supplements the broader npm disclosure retained inside the tested archive.

The configured native MCP launch sets CARBON_ANALYTICS=off, DO_NOT_TRACK=1 and CARBON_BACKGROUND=off. No automatic lifecycle hooks are packaged. Antigravity provides model and execution tools and may transmit selected project context, prompts and results to its providers; host account, retention and billing policies apply. Local storage is not an offline guarantee.

Global CARBON settings, disabled-analytics queue cleanup and related state are routed under the host-provided PLUGIN_DATA directory. The directory must already exist and be absolute and dedicated; the loader rejects missing, relative, home-equal and filesystem-root values. This is runtime-state routing, not an account sandbox or a project-root access boundary. The host controls the directory and access. Do not launch against unrelated or shared state. Direct helper invocation or altered environment can differ from the configured native launch.

Project evidence remains under the selected project's .carbon directory and may contain code, screenshots, test inputs and findings. Review/redact exports before sharing. Uninstall does not erase this evidence. Local live reports use loopback and private capability tokens; do not expose their ports or share token URLs.

No teammate-contact onboarding is included in this 203-file Antigravity archive. No automatic invitations or shared-report delivery is provided. General support: https://github.com/jarbon/carbon-free/issues . Do not attach secrets or private evidence to public issues.
