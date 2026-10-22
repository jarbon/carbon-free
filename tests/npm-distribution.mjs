// Offline tarball installation and actual executable MCP contract. No public writes.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import {spawn,execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {inspect} from '../scripts/build-npm.mjs';
const archive=path.resolve(process.argv[2]);
const root=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'carbon-npm-test-'));
const install=path.join(root,'clean install with spaces');fs.mkdirSync(install);
const env={...process.env,HOME:path.join(root,'isolated-home'),CARBON_ANALYTICS:'off',DO_NOT_TRACK:'1',CARBON_BACKGROUND:'off',CARBON_BACKGROUND_TEST_HOME:path.join(root,'isolated-background')};
fs.mkdirSync(env.HOME);
execFileSync('npm',['install','--prefix',install,'--offline','--ignore-scripts','--no-audit','--no-fund','--package-lock=false',archive],{env,stdio:'pipe'});
const plugin=path.join(install,'node_modules/@testers-ai/carbon-mcp');
const cli=path.join(install,'node_modules/.bin/carbon-mcp');
const meta=JSON.parse(fs.readFileSync(path.join(plugin,'package.json')));
assert.equal(meta.name,'@testers-ai/carbon-mcp');assert.equal(meta.license,'MIT');assert(!meta.private);
assert.equal(meta.mcpName,'io.github.jarbon/carbon');assert.equal(meta.publishConfig.access,'public');
assert(!meta.scripts&&!meta.dependencies&&!meta.optionalDependencies,'No lifecycle hooks or runtime npm dependencies');
assert.match(fs.readFileSync(path.join(plugin,'bin/carbon-mcp.mjs'),'utf8'),/^#!\/usr\/bin\/env node\n/);
const exec=(args)=>execFileSync(cli,args,{env,cwd:root,encoding:'utf8'});
assert.equal(exec(['--version']).trim(),meta.version);
assert.equal(execFileSync('npm',['exec','--offline','--prefix',install,'--','carbon-mcp','--version'],{env,cwd:root,encoding:'utf8'}).trim(),meta.version);
assert.match(exec(['--help']),/Jay/);
const config=JSON.parse(exec(['--print-config']));assert.deepEqual(config.mcpServers.carbon.args,['-y',meta.name+'@'+meta.version]);
assert.equal(JSON.parse(exec(['--doctor'])).configurationChanged,false);
assert.equal(JSON.parse(exec(['--list-workflows'])).length,13);
assert.throws(()=>exec(['--unknown']));
assert(!fs.existsSync(path.join(env.HOME,'.config')),'Helper commands must not create global config or analytics');
const files=inspect(plugin);assert(!files.some(f=>/proof|pro-benchmarks|feedback-service|\.npmrc/.test(f.path)));
for(const dir of ['server','scripts']) {
  const product=JSON.parse(fs.readFileSync(path.join(plugin,dir,'analytics-product.json')));
  assert.equal(product.defaultEnabled,false);assert.equal(product.edition,'mcp-lite');
  const {createUsageAnalytics}=await import(pathToFileURL(path.join(plugin,dir,'usage-analytics.mjs')));
  const sent=[];const usage=createUsageAnalytics({product,home:env.HOME,env:{},send:async u=>{sent.push(u);return {status:200}}});
  assert.equal(usage.enabled(),false);await usage.record('Command Invoked','carbon');assert.equal(sent.length,0);
}
const child=spawn(cli,[],{cwd:root,env,stdio:['pipe','pipe','pipe']});
let next=0,stderr='';const pending=new Map();child.stderr.on('data',b=>stderr+=b);
const lines=readline.createInterface({input:child.stdout});
lines.on('line',line=>{let msg;try{msg=JSON.parse(line)}catch{for(const p of pending.values())p.reject(Error('Non-JSON MCP stdout'));return;}const p=pending.get(msg.id);if(p){clearTimeout(p.timer);pending.delete(msg.id);p.resolve(msg)}});
child.on('exit',code=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('MCP exited '+code+' '+stderr))}pending.clear()});
function rpc(method,params={}){return new Promise((resolve,reject)=>{const id=++next;const timer=setTimeout(()=>{pending.delete(id);reject(Error('MCP timeout '+method+' '+stderr))},10000);pending.set(id,{resolve,reject,timer});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n')})}
async function tool(name,args={}) {const msg=await rpc('tools/call',{name,arguments:{root,...args}});assert(!msg.error&&!msg.result?.isError,JSON.stringify(msg));return JSON.parse(msg.result.content[0].text)}
try {
  const init=await rpc('initialize',{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'carbon-npm-distribution-test',version:'1.0.0'}});
  assert.equal(init.result.serverInfo.version,meta.version);
  child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n');
  const prompts=(await rpc('prompts/list')).result.prompts;assert.equal(prompts.length,13);
  for(const prompt of prompts)assert(!(await rpc('prompts/get',{name:prompt.name})).error,prompt.name);
  assert((await rpc('prompts/get',{name:'proof'})).error);
  assert.equal((await rpc('tools/list')).result.tools.length,6);
  const run=await tool('carbon_start',{command:'carbon',title:'npm installation fixture',checks:[{id:'one',title:'Synthetic evidence check',risk:'Package contract'}]});
  assert.equal(run.openTarget.type,'browser');assert.equal(run.openTarget.url,run.url);
  const url=new URL(run.url);assert.equal(url.hostname,'127.0.0.1');
  const response=await fetch(url);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/^text\/html;\s*charset=utf-8$/i);assert(!response.headers.get('content-disposition')?.includes('attachment'));
  const snapshot=url.origin+'/snapshot?session='+url.searchParams.get('session');
  assert.equal((await fetch(snapshot)).status,403);
  const protectedResponse=await fetch(snapshot,{headers:{Authorization:'Bearer '+url.hash.slice(1)}});assert.equal(protectedResponse.status,200);assert.match(await protectedResponse.text(),/Jay/);
  await tool('carbon_update',{runId:run.runId,checks:[{id:'one',status:'passed',actual:'Synthetic packaging check completed',evidence:'npm-distribution.mjs fixture'}],confidence:{scope:'One packaging fixture',rationale:'One recorded synthetic result',limitations:'Not a product quality or cross-platform claim'},status:'completed'});
  const report=await tool('carbon_report',{runId:run.runId});assert.equal(report.openTarget.type,'browser');assert.equal(report.openTarget.url,report.url);assert(fs.existsSync(report.htmlPath));
  const map=await tool('carbon_report',{runId:run.runId,view:'map'});assert.equal(map.openTarget.type,'browser');assert.equal(map.openTarget.url,map.url);
  assert(!fs.readFileSync(report.htmlPath,'utf8').includes(url.hash.slice(1)));
  const demo=await tool('carbon_demo',{action:'create',fixture:'testbucks',destination:'demo',testProfile:'without-existing-tests'});assert(demo);
} finally {
  lines.close();child.stdin.end();child.kill();
}
// Run the broader existing six-tool, five-fixture, lifecycle and security contract against installed bytes.
execFileSync(process.execPath,[path.join(import.meta.dirname,'smoke.mjs'),plugin],{env,cwd:root,stdio:'pipe',timeout:60000});
console.log(JSON.stringify({passed:true,archive,package:meta.name,version:meta.version,installedAt:plugin,platform:process.platform,arch:process.arch,checks:['offline clean tarball install with lifecycle scripts disabled','executable npm bin from unrelated directory with spaces','help/version/config/doctor without config writes','all 13 prompts and six MCP tools','Pro proof excluded','analytics off in both helpers','protected rendered HTML reports; no attachment disposition','report lifecycle and TestBucks demo','existing broader smoke suite against installed bytes'],limitations:['Linux and Windows not executed','MCP host UI not exercised','Not published']},null,2));
