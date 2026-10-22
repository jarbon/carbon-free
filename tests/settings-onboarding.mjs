import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import vm from 'node:vm';
import {spawn} from 'node:child_process';
import {createSupervisor} from '../background/engine.mjs';
const plugin=path.resolve(import.meta.dirname,'..');
async function setup(t,env={}){
 const temp=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'carbon-free-settings-')),home=path.join(temp,'home'),root=path.join(temp,'project');fs.mkdirSync(home);fs.mkdirSync(root);
 const supervisor=createSupervisor({home:path.join(home,'.config/carbon/background/v1')});
 const child=spawn(process.execPath,[path.join(plugin,'server/index.mjs')],{env:{...process.env,HOME:home,CARBON_ANALYTICS:'off',CARBON_BACKGROUND:'',...env},stdio:['pipe','pipe','pipe']});
 let id=0,errors='';const pending=new Map();child.stderr.on('data',b=>errors+=b);
 readline.createInterface({input:child.stdout}).on('line',line=>{const m=JSON.parse(line);pending.get(m.id)?.(m);pending.delete(m.id)});
 t.after(async()=>{child.stdin.end();await new Promise(resolve=>{const timer=setTimeout(()=>{child.kill();resolve()},2000);child.once('exit',()=>{clearTimeout(timer);resolve()})});fs.rmSync(temp,{recursive:true,force:true})});
 async function tool(name,args={}){const result=await new Promise((resolve,reject)=>{const n=++id,timer=setTimeout(()=>reject(Error('MCP timeout '+errors)),5000);pending.set(n,m=>{clearTimeout(timer);resolve(m)});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:n,method:'tools/call',params:{name,arguments:{root,...args}}})+'\n')});if(result.error||result.result?.isError)throw Error(JSON.stringify(result));return JSON.parse(result.result.content[0].text)}
 return {root,home,supervisor,tool};
}
function view(url){const u=new URL(url);return {endpoint:u.origin+'/settings?session='+u.searchParams.get('session'),snapshot:u.origin+'/snapshot?session='+u.searchParams.get('session'),auth:{Authorization:'Bearer '+u.hash.slice(1),Origin:u.origin,'Content-Type':'application/json'}}}
test('first use returns settings browser target; Save persists all preferences and real manual mode',async t=>{
 const {tool,root,supervisor}=await setup(t);
 const start=await tool('carbon_start',{command:'carbon',title:'Synthetic onboarding'});
 assert.equal(start.onboarding.needed,true);assert.equal(start.onboarding.openTarget.type,'browser');
 const settings=await tool('carbon_settings'),v=view(settings.url);
 assert.deepEqual(settings.openTarget,{type:'browser',url:settings.url});
 const html=await(await fetch(v.snapshot,{headers:v.auth})).text();
 for(const text of ['Meet Jay','/carbon:carbon-settings','Automatic quick checks','Manual only','name="minutes"','name="maxChecks"','name="focus"','name="analyticsEnabled"'])assert(html.includes(text),text);
 for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
 assert(supervisor.status(root).config.enabled,'Viewing does not change mode');
 const response=await fetch(v.endpoint,{method:'POST',headers:v.auth,body:JSON.stringify({minutes:17,maxChecks:31,focus:'Checkout <script>unsafe</script>',analyticsEnabled:false,backgroundMode:'manual'})});
 assert.equal(response.status,200);const saved=await response.json();assert.equal(saved.settings.background.mode,'manual');assert.equal(saved.settings.background.onboarding.needed,false);
 const reread=await tool('carbon_settings');assert.equal(reread.settings.minutes,17);assert.equal(reread.settings.maxChecks,31);assert.equal(reread.settings.focus,'Checkout <script>unsafe</script>');assert.equal(reread.settings.analyticsEnabled,false);assert.equal(supervisor.status(root).config.enabled,false);
 const refreshed=await(await fetch(v.snapshot,{headers:v.auth})).text();assert(refreshed.includes('value="manual" checked'));assert(!refreshed.includes('Checkout <script>unsafe</script>'));
 assert.equal((await tool('carbon_start',{command:'carbon',title:'Second use'})).onboarding,undefined);
 await assert.rejects(()=>tool('carbon_settings',{patch:{backgroundMode:'automatic',minutes:-1}}));assert.equal(supervisor.status(root).config.enabled,false,'Invalid form does not enable testing');
});
test('automatic selection preserves global pause and existing AI/test configuration',async t=>{
 const {tool,root,supervisor}=await setup(t);await supervisor.globalEnabled(false);
 const before=supervisor.status(root).config;
 const saved=await tool('carbon_settings',{patch:{backgroundMode:'automatic'}});
 assert.equal(saved.settings.background.enabled,true);assert.equal(saved.settings.background.globalPaused,true);assert.equal(saved.settings.background.effectiveEnabled,false);
 assert.equal(supervisor.status(root).config.aiReview,before.aiReview);assert.deepEqual(supervisor.status(root).config.tests,before.tests);
 const v=view(saved.url),html=await(await fetch(v.snapshot,{headers:v.auth})).text();assert(html.includes('paused globally'));
});
test('environment disable remains effective; foreign-origin saves fail',async t=>{
 const {tool}=await setup(t,{CARBON_BACKGROUND:'off'});
 const saved=await tool('carbon_settings',{patch:{backgroundMode:'automatic'}});
 assert.equal(saved.settings.background.envDisabled,true);assert.equal(saved.settings.background.effectiveEnabled,false);
 const v=view(saved.url);
 assert.equal((await fetch(v.endpoint,{method:'POST',headers:{...v.auth,Origin:'https://example.test'},body:'{"backgroundMode":"manual"}'})).status,400);
 assert.equal((await tool('carbon_settings')).settings.background.mode,'automatic');
});
