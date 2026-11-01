import fs from 'node:fs';
export const isMcpDistribution = JSON.parse(fs.readFileSync(new URL('../EDITION.json', import.meta.url))).distribution === 'npm';
export const mcpGuidance = 'Cursor MIT/free identity: use only MCP server carbon-core (documented approval identity plugin-carbon-core-carbon-core). Do not substitute the existing carbon server. Tool names such as carbon_start are scoped to carbon-core. If the server source is ambiguous or absent, stop. MCP distribution: use the host prompt picker or ask the agent to load a named MCP prompt. Prompt names are not guaranteed slash commands. Reopen settings by asking the agent to call carbon_settings with the absolute project root. This npm installation does not register automatic/background hooks; testing is manual. Do not enable a background supervisor or infer installed hooks from saved native-plugin preferences.';

export const cursorServerIdentity = "carbon-core";
