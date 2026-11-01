# CARBON Core for Grok Bot 1.0.3

Grok-specific saved HTML delivery: export with carbon_report, then use Grok's supported attachment tool to provide a real clickable file card or host-returned link. Paths and cloud localhost URLs are not user delivery. Reports are snapshots; regenerate/attach after updates. No public hosting, tunnel or invented URL. If the host cannot attach the file, report delivery blocked. See package/GROK-BOT.md and PRIVACY.md.

Submission revision 1.0.3, adapter implementation 1.1.0, core 1.32.22-mcp.2 with existing Grok state routing. Nine tools and 13 workflows. This adapter does not advertise inline MCP Apps; other hosts retain unchanged shared inline implementation through bin/carbon-mcp.mjs. Grok-specific adapter starts with package/bin/carbon-grok-bot.mjs.

Public 1.0.2 baseline's saved HTML artifact was clicked in Grok and its report views/disclosure interacted successfully on 2026-11-01. This changed 1.0.3 candidate has local tests only; native release verification remains pending. Prior inline mounting did not work in the tested chat. No marketplace approval claimed.

Build: python3 scripts/package.py . Archive SHA256 4398f5c900acb838aec7c0848ffa84a0277fca6567e8af5cc5fbc78dfeef6938. Tests: node tests/grok-artifact.mjs carbon-grok-bot-1.0.3.tgz and node tests/delivery-policy.mjs. Contract tests use synthetic loopback listeners and isolated temporary state. Support: https://github.com/jarbon/carbon-free/issues .
