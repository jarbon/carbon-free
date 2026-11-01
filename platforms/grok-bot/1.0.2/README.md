# CARBON Core for Grok Bot — 1.0.2

This versioned directory contains the reproducible Grok command-MCP distribution. Submission revision 1.0.2 uses adapter implementation 1.0.1 and upstream core 1.32.22-mcp.2 with Grok-specific runtime-state separation. It has passed local protocol and synthetic-state tests. Native Grok validation and marketplace review are still pending; no in-app pass is claimed.

See [installation instructions](output/package/GROK-BOT.md), [privacy](PRIVACY.md), [MIT license](output/package/LICENSE) and [runtime metadata](output/package/ADAPTER.json). Support: https://github.com/jarbon/carbon-free/issues .

Build with `python3 scripts/package.py`. Expected archive SHA256: `111152f4e22cc66f5b8d27c9798826941cc10c8fbaef91e013c2da92bd7dc79c`. Validate with `node tests/state-isolation.mjs output/carbon-grok-bot-1.0.2.tgz`, `node tests/grok-bot.mjs output/carbon-grok-bot-1.0.2.tgz`, and `python3 tests/extraction-permissions.py`. Tests use synthetic data and need local loopback listeners; do not commit generated output archives or disposable directories.

Install the reviewed release archive by following the instructions on the Bot computer. A repository source path is not a hosted MCP endpoint. This package does not supply model access or a browser, and creates no automatic host integration. A separate Grok account-wide installation approval is required where applicable.
