# CARBON Core for Antigravity — 1.32.22-mcp.2

MIT/free source and exact reviewed package. Plugin root is `package/`, containing `plugin.json`, `mcp_config.json`, the bundled square logo, 13 skills and eight MCP tools. Node.js 22+ and Python 3.10+ are required. No CARBON account or model credits are included.

## Verification and limitations

A bounded native global-registration smoke test recognized CARBON Core and connected eight tools. One synthetic TestBucks logic flow used demo/start/update/report and the host terminal. An initial update schema error was corrected. This was not browser end-to-end testing. The saved report was independently rendered at desktop/mobile sizes without page errors, external requests or horizontal overflow; full report interaction coverage was not established. Workspace registration remained unresolved. App-only status-tool visibility enforcement and inline MCP Apps rendering remain unverified.

Strict `agy plugin validate --strict ./package` has NOT run successfully; CLI availability is unresolved. Do not represent this prerelease as strict-validator certified or marketplace approved. The packaged README and reviewer notes retain build-time status; this outer README supplies later qualified evidence. No raw native conversation, private paths, report data or account configuration is included.

## Installation and state

Follow the official Antigravity local-plugin procedure after completing strict validation. The host must provide an existing, dedicated absolute `PLUGIN_DATA` directory. Missing, relative or home-equal values fail closed. Do not substitute a shared CARBON directory. Keep the full package together. No installer, account change or permission expansion is performed by this source distribution.

Read [host-specific privacy](PRIVACY.md), [MIT license](package/LICENSE), [notices](package/NOTICE.md), [security](package/SECURITY.md) and [packaged setup](package/README.md). Support: https://github.com/jarbon/carbon-free/issues .

## Exact artifact identity

Archive: `carbon-antigravity.tgz`. SHA-256: `75180b5eff769d57fbe797fad5c6322217ff3ef2742558a65fab4a9869a692a1`.
`FILES.json` identifies all 203 packaged source files. `python3 verify.py /path/to/carbon-antigravity.tgz` verifies the exact archive and its equality to this source tree without extraction. The original tar builder includes filesystem metadata; byte-identical archive rebuilding from a fresh Git checkout is not claimed. Preserve the reviewed release asset rather than rebuilding it under the same identity.
