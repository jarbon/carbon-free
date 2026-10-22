# CARBON npm release procedure

Public brand: **CARBON**. AI test manager: **Jay**. The `j` prompt remains a compatibility alias. This distribution is the MIT-licensed free runtime, not CARBON Pro and not a new cloud service.

## Build and check

From the canonical carbon-free checkout:

```sh
node scripts/build-npm.mjs /absolute/path/to/a-new-output-folder
node tests/npm-build-safety.mjs
node tests/npm-distribution.mjs /absolute/path/to/output/testers-ai-carbon-mcp-VERSION.tgz
node tests/package-safety.mjs
node --test tests/settings-onboarding.mjs tests/report-workspace.mjs background/engine.test.mjs background/lifecycle.test.mjs
```

The builder refuses an existing output directory, verifies the free/MIT boundary, copies only allowed roots, rejects symlinks/private paths/credential patterns, and records file and archive hashes. Native package.json remains private; only the generated npm package is publishable. A pattern scan is not proof that arbitrary future source contains no secrets: review the actual packed file inventory before every public release.

Validate generated package/server.json against the schema URL declared in that file. The npm package name and version must match the registry metadata. Check the actual tarball, not just the source tree. Do not include output folders, credentials, customer evidence, or the full Pro source. No install lifecycle scripts are used.

## Publish gates

1. Jason creates/signs into npm, accepts the applicable terms, enables 2FA, and confirms ownership of the chosen scope. Proposed scope is `@testers-ai`; no ownership is assumed. If unavailable, choose the intended account scope and update both the builder and README template before rebuilding/retesting.
2. Confirm public repository source corresponds to this artifact. The local checkout can have unrelated uncommitted work; do not push all of it blindly. Stage/review the intended release changes separately.
3. Verify archive hashes and run `npm publish ARCHIVE --dry-run --ignore-scripts --access public --tag latest`. This is only a dry run.
4. With authorized publishing credentials, run `npm publish ARCHIVE --ignore-scripts --access public --tag latest`. The explicit latest tag is required because the retained upstream edition version has a prerelease suffix. Jason completes any required authentication/approval.
5. Re-read the public npm version/dist integrity and independently install that exact version from the registry in a clean temporary project. Repeat the executable MCP tests. Only then call the npm release published and usable.
6. Publish generated server.json with the official `mcp-publisher` CLI after GitHub identity authorization. `io.github.jarbon/carbon` uses the verified existing GitHub account; npm package metadata contains the matching mcpName. Do not assume GitHub CLI sign-in authenticates mcp-publisher. Registry ownership validation also needs the live npm package. Re-read the public registry entry afterward.
7. Submit/claim Glama using the public repository and verified npm release; Jason signs in and handles terms/permissions. Do not create a misleading hosted endpoint for a stdio server.
8. Submit PulseMCP only when its intake reopens. As observed October 22, 2026, its submission page says new submissions/listing changes are paused. No submission was made.

Smithery and Docker are follow-on distribution work, not part of this initial npm/registry/directory launch. No paid hosting or automatic cloud access is enabled.

## Listing copy

**Title:** CARBON — AI testing harness with Jay

**Short description:** AI testing harness with Jay: risk-based checks, bug investigation, and local evidence reports.

**Description:** CARBON brings Jay, an AI test manager, into MCP-compatible coding agents. The free, MIT-licensed runtime supports risk-based testing workflows, exploratory and regression checks, accessibility investigation, bug triage, disposable demos, and protected local evidence reports. The host supplies model access, browser control, and shell execution. No separate CARBON model key is required; host usage charges still apply. Includes 13 workflow prompts and six MCP tools. Analytics defaults off for the npm distribution. Skills, slash commands, report presentation, and automatic checks depend on host capabilities and setup. Pro is separately distributed and is not included.

**Website:** https://testers.ai/carbon/

**Repository:** https://github.com/jarbon/carbon-free

**Categories:** Developer Tools; Software Testing; Quality Assurance; Browser Testing.

**Keywords:** CARBON, Jay, test, testing, QA, test harness, regression, exploratory testing, accessibility, bug triage, MCP.

Never count npm downloads as installs, unique people, or repeat users. Keep downloads, optional activation/command telemetry, registry publication, and directory acceptance distinct.
