# CARBON Core for Cursor — 1.32.23-cursor.5

MIT/free source prerelease candidate. Plugin identifier: `carbon-core`; server key: `carbon-core`. The exact distribution is in [CARBON/](CARBON/README.md), including [privacy](CARBON/PRIVACY.md), [MIT license](CARBON/LICENSE), [notice](CARBON/NOTICE.md) and bundled logo. Support: https://github.com/jarbon/carbon-free/issues .

Build with `python3 package.py`. Output SHA-256 must be `5166e1b1def430f4f8cdee9aa5b852741be3753a64236a6e0235ea42b61ddd98`. FILES.json records original archive modes, including modes Git does not preserve, and verifies all 221 source files. No dependency installation is required for packaging.

## Verification scope

Local protocol regression: 174 assertions; read-only demo regression: 347 assertions; draft-state isolation: 10 assertions. Cursor 3.27.22 loaded the exact candidate as CARBON with 13 commands and eight tools. A bounded native synthetic workflow exercised carbon_demo, carbon_start, carbon_update and carbon_report, recording three passed local HTTP smoke checks (HTML serving, assets/missing-path handling, and brand/navigation shell). This was not interactive checkout, rewards, persistence or accessibility testing. Host account isolation, app-only enforcement and permission persistence are not established. No marketplace acceptance is claimed.

## Discovery and setup

The plugin root is `platforms/cursor/1.32.23-cursor.5/CARBON`. Cursor multi-plugin repository discovery requires a root `.cursor-plugin/marketplace.json` entry pointing there; the additive subtree alone is not a complete discovery configuration. The prepared root entry names carbon-core and points to this exact plugin root; publication/submission remains separately gated. See the official Cursor plugin reference: https://cursor.com/docs/reference/plugins . Use Node.js 22+ and Python 3.10+ for the bundled local runtime/demo. Host installation and permissions require user authorization.

Analytics are stateless and disabled. Optional teammate addresses remain local drafts, with no invitations/shared report delivery. Windows private draft storage fails closed. Review the host-specific privacy disclosure before using real project context.
