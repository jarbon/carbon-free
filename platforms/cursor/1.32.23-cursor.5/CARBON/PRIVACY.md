# CARBON Cursor 1.32.23-cursor.5 — privacy and local state

This disclosure applies only to this Cursor MIT/free candidate, not other CARBON editions or the testers.ai web chat product.

## Host processing and evidence

Cursor supplies model access. The host may send selected project context, prompts, workflow/tool definitions and tool results to its configured provider. Its account, billing, retention and telemetry policies apply. Authorized browser/API testing contacts its target; local-first is not air-gapped.

Testing preferences and run evidence are stored beneath the selected project's `.carbon/free/`. New state directories use owner-only mode 0700 and state/report files 0600 on POSIX. Evidence can include screenshots, test input, source context and findings. Review/redact exports before sharing. Uninstalling does not delete project evidence. Live report servers bind to 127.0.0.1 and require private capability tokens; do not expose their ports or share their URLs.

## No CARBON analytics state

Analytics and completion milestones are stateless and disabled in this Cursor distribution, including direct packaged analytics-helper calls and attempts to enable them through settings. They do not read, create, modify or purge the user's shared CARBON config, mcp-lite usage queue or milestone files. Environment opt-ins do not enable them. There is no analytics queue or uploader for this candidate. Testing settings are project-local; there is no shared global preference write. Background testing is unsupported and disabled; no automatic host hooks are installed.

## Optional teammate drafts

The optional local form stores drafts separately at `~/.config/carbon-cursor/team-drafts-v1/`, outside the project, reports and shared CARBON draft store. Do not paste addresses into chat. Add, Skip, Manage later, edit/remove and deletion are available. Saving is local; invitations and shared-report delivery remain disabled. The store uses its existing private-file and symlink protections. Unsupported Windows private storage fails closed; no Windows ACL support is claimed. Normal MCP start/update/report/settings calls do not open or create this contact store. No real contacts are necessary for testing.

## Controls and support

Project evidence retention is user-controlled. Drafts can be managed/deleted through their local form. Do not send private evidence or credentials to support. Report privacy/security concerns to jason@testers.ai; general synthetic issue reports can use https://github.com/jarbon/carbon-free/issues. This disclosure is not a compliance certification, provider-retention promise or data-residency guarantee.
