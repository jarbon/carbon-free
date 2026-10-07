import {spawn} from 'node:child_process';
import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
const plugin=path.resolve(process.argv[2]||'.'),root=fs.mkdtempSync(path.join(os.tmpdir(),'carbon-free-check-'));
const child=spawn('node',[path.join(plugin,'server/index.mjs')],{cwd:root,env:{...process.env,CARBON_ANALYTICS:'off'}});
let id=0;const pending=new Map();let errors='';child.stderr.on('data',b=>errors+=b);
readline.createInterface({input:child.stdout}).on('line',line=>{const m=JSON.parse(line);pending.get(m.id)?.(m);pending.delete(m.id)});
function rpc(method,params={}){return new Promise((resolve,reject)=>{const n=++id;const timeout=setTimeout(()=>reject(Error('MCP timeout '+errors)),10000);pending.set(n,m=>{clearTimeout(timeout);resolve(m)});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:n,method,params})+'\n')})}
async function tool(name,args){const r=await rpc('tools/call',{name,arguments:args});if(r.error||r.result?.isError)throw Error(JSON.stringify(r));return JSON.parse(r.result.content[0].text)}
async function bad(name,args){const r=await rpc('tools/call',{name,arguments:args});assert.ok(r.error||r.result?.isError)}
try{
 const init=await rpc('initialize');assert.equal(init.result.serverInfo.name,'carbon-free');
 const tools=(await rpc('tools/list')).result.tools;assert.equal(tools.length,6);
 for(const t of tools){assert.equal(typeof t.annotations.title,'string');for(const k of ['readOnlyHint','destructiveHint','idempotentHint','openWorldHint'])assert.equal(typeof t.annotations[k],'boolean')}
 const names=(await rpc('prompts/list')).result.prompts.map(p=>p.name);assert.equal(names.length,11);assert.ok(names.includes('j')&&names.includes('jay')&&names.includes('carbon-background'));assert.ok(!names.includes('proof'));assert.ok(!names.includes('carbon-auto'));
 for(const name of ['proof','carbon_proof'])assert.ok((await rpc('prompts/get',{name})).error, name+' must be Pro-only');
 assert.ok(!fs.existsSync(path.join(plugin,'runtime/carbon/scripts/carbon_proof.py')));
 for(const name of names){const p=await rpc('prompts/get',{name});assert(!p.error,name);assert(p.result.messages[0].content.text.length>100,name);}
 assert(!(await rpc('prompts/get',{name:'J'})).error);
 for(const kind of ['domains','specialists','accessibility'])assert(Object.keys(await tool('carbon_knowledge',{kind})).length>0,kind);
 await bad('carbon_auto',{root});assert.ok((await rpc('prompts/get',{name:'carbon-forever'})).error);
 const skill=await rpc('prompts/get',{name:'carbon-issues'});assert.ok(skill.result.messages[0].content.text.includes('50%'));
 assert.ok(!skill.result.messages[0].content.text.includes('https://testers.ai/carbon/#pro'));
 const listing=await tool('carbon_demo',{root,action:'list'});assert.equal(listing.fixtures.length,4);
 for(const fixture of listing.fixtures) for(const profile of ['with-existing-tests','without-existing-tests'])
  await tool('carbon_demo',{root,action:'create',fixture:fixture.id,testProfile:profile,destination:fixture.id+'-'+profile});
 await bad('carbon_demo',{root,action:'create',fixture:'web-static',destination:'web-static-with-existing-tests'});
 const start=await tool('carbon_start',{root,command:'carbon',title:'Free synthetic assessment',checks:[{id:'x',title:'State round-trip',lane:'stateful',risk:'Loss of work'}]});
 const url=new URL(start.url),token=url.hash.slice(1),base=url.origin,session=url.searchParams.get('session');
 assert.equal((await fetch(base+'/snapshot?session='+session)).status,403);
 let snapshot=await fetch(base+'/snapshot?session='+session,{headers:{Authorization:'Bearer '+token}});assert.equal(snapshot.status,200);assert.ok(!(await snapshot.text()).includes('Confidence in the tested scope'));
 await bad('carbon_update',{root,runId:start.runId,status:'completed'});
 await bad('carbon_update',{root,runId:start.runId,checks:[{id:'x',status:'passed'}]});
 await bad('carbon_update',{root,runId:start.runId,journeys:[{id:'path',title:'Recorded path',steps:[{title:'Save',status:'passed'}]}]});
 await tool('carbon_update',{root,runId:start.runId,journeys:[{id:'path',title:'Recorded path',steps:[{title:'Save',status:'passed',evidence:'Synthetic saved confirmation'}]}]});
 const persisted=JSON.parse(fs.readFileSync(path.join(root,'.carbon/free/runs',start.runId,'state.json'),'utf8'));
 assert.equal(persisted.journeys[0].steps[0].status,'passed');
 const img=path.join(root,'evidence.png');fs.copyFileSync(path.join(plugin,'assets/icon.png'),img);
 await tool('carbon_update',{root,runId:start.runId,current:'Checked recovery',why:'Saved work must survive reload',checks:[{id:'x',status:'failed',actual:'Value lost after reload',evidence:'Synthetic fixture assertion',page:'p'}],findings:[{title:'<script>alert(1)</script>',consequence:'Lost work',steps:'Save then reload',evidence:'Fixture assertion',strength:'demonstrated',remediation:'Persist the value',verification:'Repeat save/reload',page:'p'}],pages:[{id:'p',title:'Synthetic screen',screenshot:img}],personas:[{id:'user',specialist:'jason',intent:'Keep work',journey:'Saved and reloaded',reaction:'Synthetic persona saw lost state',evidence:'Fixture assertion'}],confidence:{score:35,scope:'One synthetic state check',rationale:'The only tested journey failed',limitations:'Not an app-quality estimate'},status:'completed'});
 const opened=await tool('carbon_report',{root,runId:start.runId,view:'map'});const html=fs.readFileSync(opened.htmlPath,'utf8');assert.ok(html.includes('data:image/png;base64'));assert.ok(html.includes('data-panel="map"'));assert.ok(html.includes('&lt;script&gt;alert(1)'));assert.ok(!html.includes('<script>alert(1)'));assert.ok(!html.includes(token));
 await bad('carbon_update',{root,runId:start.runId,current:'Do not rewrite history'});
 const settings=await tool('carbon_settings',{root,patch:{minutes:15,maxChecks:12,focus:'Recovery'}});assert.equal(settings.settings.minutes,15);
 const su=new URL(settings.url),endpoint=su.origin+'/settings?session='+su.searchParams.get('session'),auth={Authorization:'Bearer '+su.hash.slice(1),'Content-Type':'application/json'};
 const settingsPage=await fetch(settings.url);assert.equal(settingsPage.status,200);assert.match(await settingsPage.text(),/Connecting to your local report/);
 const settingsSnapshot=await fetch(su.origin+'/snapshot?session='+su.searchParams.get('session'),{headers:auth});assert.equal(settingsSnapshot.status,200);assert.match(await settingsSnapshot.text(),/settings-form/);
 assert.equal((await fetch(endpoint,{method:'POST',headers:{...auth,Origin:'https://evil.example'},body:'{"minutes":10}'})).status,400);
 const saved=await fetch(endpoint,{method:'POST',headers:{...auth,Origin:su.origin},body:'{"minutes":10}'});assert.equal(saved.status,200);assert.equal((await saved.json()).settings.minutes,10);
 await bad('carbon_settings',{root,patch:{minutes:-5}});
 const poison=fs.mkdtempSync(path.join(os.tmpdir(),'carbon-symlink-check-'));fs.symlinkSync(root,path.join(poison,'.carbon'));await bad('carbon_start',{root:poison,command:'carbon',title:'No symlink writes'});
 console.log(JSON.stringify({passed:true,checks:['11 prompt commands plus J alias resolve; no Pro tools/prompts','all 6 MCP tools exercised; 3 knowledge domains','both demo profiles; no overwrite','live auth; XSS escaping; no token in offline export','partial and complete lifecycle','screenshots and personas','settings page and snapshot load; settings persist; cross-origin writes blocked','symlink protection'],root,report:opened.htmlPath},null,2));
}finally{child.stdin.end();setTimeout(()=>child.kill(),2000).unref()}
