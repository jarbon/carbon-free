#!/usr/bin/env node
// Host adapter only: workflow retrieval is not test execution.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const commands = JSON.parse(fs.readFileSync(new URL('../commands.json', import.meta.url)));
const names = commands.map(c => c.name);
const args = process.argv.slice(2);
if (args.length && !(args.length === 1 && args[0] === '--stdio')) {
  console.error('Usage: node bin/carbon-grok-bot.mjs [--stdio]');
  process.exit(2);
}
const guidance = `CARBON Core for Grok Bot. The following is a workflow to execute, not evidence that tests have run.
Use only the Bot's authorized filesystem, terminal and browser tools, within the user's requested scope.
The server does not supply model access or a browser. If a required host capability is unavailable, report that limitation; never fabricate results.
Keep permission, destructive-action, credential and external-communication approvals intact. Do not enable unattended/background execution.
Different Bots can share this computer: isolate each project's output and never inspect unrelated Bot data.
Begin a bounded run with carbon_start, record observed evidence with carbon_update, and finish with carbon_report, including blocked/deferred checks.
Report localhost URLs live on this Bot's computer, not the user's Mac. Offer the generated HTML as a host-supported downloadable artifact after checking for secrets and personal data. Never expose the local server publicly or share capability tokens.
Core does not include the Pro proof workflow. Never imply whole-app certification or formal proof from a normal test report.
`;
const workflowTool = {
  name: 'carbon_workflow',
  description: 'Load a CARBON Core testing workflow for Grok Bot to execute with its own tools. Start with carbon (risk-based testing), jay (test manager), full, carbon-test, carbon-issues or carbon-accessibility. Returns instructions, not completed tests. No slash-command menu required.',
  inputSchema: {type: 'object', properties: {workflow: {type: 'string', enum: names}, request: {type: 'string', maxLength: 12000, description: 'User-authorized project path or URL and testing scope'}}, required: ['workflow'], additionalProperties: false},
  annotations: {title: 'CARBON workflow', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false}
};
// Dedicated runtime state prevents analytics-off purges and settings writes
// from touching another CARBON host's queue, preferences or onboarding state.
const systemHome = os.homedir();
const runtimeState = process.env.CARBON_GROK_STATE_DIR || path.join(systemHome, '.config/carbon-grok-bot/runtime-v1');
if (!path.isAbsolute(runtimeState)) throw Error('CARBON_GROK_STATE_DIR must be absolute');
const resolvedState = path.resolve(runtimeState);
const sharedCarbon = path.join(systemHome, '.config/carbon');
if (resolvedState === systemHome || resolvedState === sharedCarbon || resolvedState.startsWith(sharedCarbon + path.sep)) throw Error('Choose a dedicated Grok state directory outside shared CARBON state');
for (let current = resolvedState; ; current = path.dirname(current)) {
  try { if (fs.lstatSync(current).isSymbolicLink()) throw Error('Grok state directory must not use symlinks'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (current === path.dirname(current)) break;
}
fs.mkdirSync(resolvedState, {recursive:true, mode:0o700});
const child = spawn(process.execPath, [fileURLToPath(new URL('./carbon-mcp.mjs', import.meta.url))], {
  cwd: process.cwd(), env: {...process.env, CARBON_GROK_RUNTIME_HOME: resolvedState, CARBON_BACKGROUND_TEST_HOME: path.join(resolvedState, '.config/carbon/background/v1'), CARBON_ANALYTICS: 'off', DO_NOT_TRACK: '1', CARBON_BACKGROUND: 'off'}, stdio: ['pipe', 'pipe', 'inherit']
});
let sequence = 0;
const pending = new Map();
const send = message => process.stdout.write(JSON.stringify(message) + '\n');
const failure = (id, message, code = -32602) => send({jsonrpc: '2.0', id, error: {code, message}});
function lines(stream, receive) {
  stream.setEncoding('utf8');
  let buffer = '';
  stream.on('data', chunk => {
    buffer += chunk;
    let end;
    while ((end = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
      if (line.length > 12 * 1024 * 1024) return stop('MCP frame too large');
      if (line.trim()) receive(line);
    }
    if (buffer.length > 12 * 1024 * 1024) stop('MCP frame too large');
  });
  stream.on('end', () => {if (buffer.trim()) receive(buffer);});
}
function stop(reason) {
  for (const p of pending.values()) {clearTimeout(p.timer); failure(p.id, reason, -32603);}
  pending.clear(); child.kill(); process.exitCode = 1; process.stdin.destroy();
}
lines(process.stdin, line => {
  let message;
  try {message = JSON.parse(line);} catch {return failure(null, 'Invalid JSON', -32700);}
  if (!message || Array.isArray(message) || message.jsonrpc !== '2.0' || typeof message.method !== 'string') return failure(message?.id ?? null, 'Invalid request', -32600);
  if (message.id === undefined) {child.stdin.write(JSON.stringify(message) + '\n'); return;}
  if (typeof message.id !== 'string' && typeof message.id !== 'number' && message.id !== null) return failure(null, 'Invalid request ID', -32600);
  let transform = message.method;
  if (message.method === 'tools/call' && message.params?.name === 'carbon_workflow') {
    const a = message.params.arguments;
    if (!a || Array.isArray(a) || typeof a !== 'object' || !names.includes(a.workflow) || Object.keys(a).some(k => !['workflow', 'request'].includes(k)) || (a.request !== undefined && (typeof a.request !== 'string' || a.request.length > 12000))) return failure(message.id, 'Choose an included Core workflow and a request of at most 12000 characters.');
    transform = 'workflow';
    message = {...message, method: 'prompts/get', params: {name: a.workflow, arguments: {request: a.request || ''}}};
  }
  const id = ++sequence;
  const timer = setTimeout(() => {pending.delete(id); failure(message.id, 'CARBON request timed out', -32603);}, 120000);
  pending.set(id, {id: message.id, transform, timer});
  child.stdin.write(JSON.stringify({...message, id}) + '\n');
});
lines(child.stdout, line => {
  let response;
  try {response = JSON.parse(line);} catch {return stop('Invalid upstream MCP output');}
  const p = pending.get(response.id);
  if (!p) return;
  pending.delete(response.id); clearTimeout(p.timer);
  if (response.result && p.transform === 'tools/list') response.result.tools.push(workflowTool);
  if (response.result && p.transform === 'initialize') response.result.serverInfo = {...response.result.serverInfo, name: 'carbon-grok-bot'};
  if (response.result && p.transform === 'workflow') response.result = {content: [{type: 'text', text: guidance}, ...response.result.messages.map(m => m.content)]};
  send({...response, id: p.id});
});
process.stdin.on('end', () => child.stdin.end());
child.stdin.on('error', () => stop('CARBON process input closed'));
child.on('error', () => stop('Could not start CARBON'));
child.on('exit', code => {
  for (const p of pending.values()) {clearTimeout(p.timer); failure(p.id, 'CARBON process exited', -32603);}
  pending.clear(); process.exit(code ?? 1);
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {child.kill(signal);});
