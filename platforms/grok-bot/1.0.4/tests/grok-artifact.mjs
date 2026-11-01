// Test the extracted customer archive, not the source tree or an installed cache.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import readline from 'node:readline';
import {spawn, execFileSync} from 'node:child_process';
import {once} from 'node:events';

const archive = path.resolve(process.argv[2]);
const scratch = path.resolve('disposable/mcp-tests'); fs.mkdirSync(scratch,{recursive:true});
const root = fs.mkdtempSync(path.join(scratch, 'run-'));
execFileSync('tar', ['-xzf', archive, '-C', root]);
const home = path.join(root, 'isolated-home'); fs.mkdirSync(home);
const child = spawn(process.execPath, [path.join(root, 'package/bin/carbon-grok-bot.mjs')], {
  cwd: root, env: {...process.env, HOME: home, CARBON_BACKGROUND_TEST_HOME: path.join(root, 'background'), CARBON_ANALYTICS: 'on'}, stdio: ['pipe', 'pipe', 'pipe']
});
const exited = once(child, 'exit');
let seq = 0, stderr = '';
child.stderr.on('data', b => stderr += b);
const pending = new Map();
readline.createInterface({input: child.stdout}).on('line', line => {
  const m = JSON.parse(line), p = pending.get(m.id);
  if (p) {clearTimeout(p.timer); pending.delete(m.id); p.resolve(m);}
});
function rpc(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = 'client-' + ++seq;
    const timer = setTimeout(() => {pending.delete(id); reject(Error('Timeout: ' + method + stderr));}, 15000);
    pending.set(id, {resolve, timer});
    child.stdin.write(JSON.stringify({jsonrpc: '2.0', id, method, params}) + '\n');
  });
}
async function tool(name, args = {}) {
  const m = await rpc('tools/call', {name, arguments: {root, ...args}});
  assert(!m.error && !m.result.isError, JSON.stringify(m));
  return JSON.parse(m.result.content[0].text);
}
let checks = 0, toolInventory = [];
try {
  const init = await rpc('initialize', {protocolVersion: '2024-11-05', capabilities: {}, clientInfo: {name: 'isolated-grok-contract', version: '1'}});
  assert.equal(init.result.serverInfo.name, 'carbon-grok-bot'); checks++;
  child.stdin.write(JSON.stringify({jsonrpc: '2.0', method: 'notifications/initialized'}) + '\n');
  assert.deepEqual((await rpc('ping')).result, {}); checks++;
  const tools = (await rpc('tools/list')).result.tools;
  toolInventory = tools.map(t => ({name: t.name, declaredVisibility: t._meta?.ui?.visibility ?? null, visibilityInterpretation: t._meta?.ui?.visibility?.includes('app') && !t._meta.ui.visibility.includes('model') ? 'app-only metadata; host enforcement unverified' : 'agent-visible/default'}));
  assert.equal(tools.length, 9); assert.equal(tools.filter(t => t.name === 'carbon_workflow').length, 1); checks++;
  const prompts = (await rpc('prompts/list')).result.prompts; assert.equal(prompts.length, 13); checks++;
  for (const p of prompts) {
    const m = await rpc('tools/call', {name: 'carbon_workflow', arguments: {workflow: p.name, request: 'Inspect disposable demo only'}});
    assert(!m.error && !m.result.isError, JSON.stringify(m));
    assert(m.result.content.every(c => c.type === 'text'));
    assert.match(m.result.content[0].text, /not evidence that tests have run/);
    assert.match(m.result.content[0].text, /localhost/); checks++;
  }
  for (const args of [{workflow: 'proof'}, {workflow: '../secrets'}, {workflow: 'carbon', other: true}, {workflow: 'carbon', request: 1}, {workflow: 'carbon', request: 'x'.repeat(12001)}, null]) {
    assert((await rpc('tools/call', {name: 'carbon_workflow', arguments: args})).error); checks++;
  }
  const settings = await tool('carbon_settings');
  assert.equal(settings.settings.analyticsEnabled, false); checks++;
  const demo = await tool('carbon_demo', {fixture: 'testbucks', action: 'create'});
  assert(fs.existsSync(demo.destination)); checks++;
  const run = await tool('carbon_start', {command: 'carbon', title: 'Synthetic Grok adapter contract test', checks: [{id: 'archive', title: 'Fixture exists', risk: 'Packaging'}]});
  assert.equal(run.url, undefined); assert.equal(run.delivery.mode,'grok-file-artifact'); checks++;
  await tool('carbon_update', {runId: run.runId, checks: [{id: 'archive', status: 'passed', actual: 'Disposable TestBucks fixture exists', evidence: 'Filesystem assertion in tests/grok-bot.mjs'}], status: 'completed'});
  const report = await tool('carbon_report', {runId: run.runId});
  assert(fs.existsSync(report.htmlPath)); assert.equal(report.url,undefined); assert.equal(report.delivery.htmlPath,report.htmlPath); assert.equal(report.delivery.status,'attachment-required'); checks++;
  assert(!JSON.stringify(report).includes('http://127.0.0.1')); assert(!tools.some(t=>t._meta?.ui)); assert.deepEqual((await rpc('resources/list')).result.resources,[]); checks++;
  assert((await rpc('tools/call', {name: 'unknown'})).error); checks++;
  const simultaneous = await Promise.all([rpc('ping'), rpc('tools/list'), rpc('prompts/list')]);
  assert(simultaneous.every(m => !m.error)); checks++;
  child.stdin.end();
  const [code] = await Promise.race([exited, new Promise((_, reject) => {const t = setTimeout(() => reject(Error('Shutdown timeout')), 5000); t.unref();})]);
  assert.equal(code, 0); checks++;
  console.log(JSON.stringify({passed: true, checks, root, archive, toolInventory, liveGrokVerified: false, scope: 'Extracted archive MCP contract, demo creation and synthetic report lifecycle; not a live Grok browser assessment'}, null, 2));
} finally {child.kill(); for (const p of pending.values()) clearTimeout(p.timer);}
