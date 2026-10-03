// CARBON Free: bounded investigations and current-run evidence, not Pro orchestration.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import readline from 'node:readline';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {demoEnvironment} from './demo-environment.mjs';
import {homedir} from 'node:os';
import {trackFathomEvent, eventForCommandStart, analyticsEnabled} from './fathom-analytics.mjs';
import {render} from './view.mjs';

const plugin=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(plugin,'.claude-plugin/plugin.json')));
const commands=JSON.parse(fs.readFileSync(path.join(plugin,'commands.json')));
const sessions=new Map();
const allowedStatus=new Set(['planned','running','passed','failed','blocked','deferred']);
const terminal=new Set(['completed','partial','blocked','canceled']);
let web;
const now=()=>new Date().toISOString();
const clean=(v,max=12000)=>String(v??'').slice(0,max).replace(/\b(?:sk-|ghp_)[A-Za-z0-9_-]{16,}|Bearer\s+[A-Za-z0-9._~-]{16,}/g,'[REDACTED]');
function object(v){if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Expected an object');return v}
function rootFor(v){if(typeof v!=='string'||!path.isAbsolute(v))throw Error('Use an absolute project root');const r=fs.realpathSync(v);if(!fs.statSync(r).isDirectory())throw Error('Project root must be a directory');return r}
function under(root,rel){
 const result=path.resolve(root,rel);if(!result.startsWith(root+path.sep))throw Error('Path must stay inside the project');
 let current=root;for(const part of path.relative(root,result).split(path.sep)){current=path.join(current,part);if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())throw Error('Symlinked state paths are not supported');}
 return result;
}
function atomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});const temp=file+'.'+crypto.randomBytes(6).toString('hex');fs.writeFileSync(temp,value,{mode:0o600});fs.renameSync(temp,file)}
function read(file,fallback){try{return JSON.parse(fs.readFileSync(file,'utf8'))}catch(e){if(e.code==='ENOENT')return fallback;throw e}}
function preferences(root){return read(under(root,'.carbon/free/settings.json'),{minutes:20,maxChecks:20,focus:''})}
function setPreferences(root,patch){
 object(patch);const next=preferences(root);
 for(const k of Object.keys(patch))if(!['minutes','maxChecks','focus','analyticsEnabled'].includes(k))throw Error('Unsupported preference');
 for(const k of ['minutes','maxChecks'])if(k in patch){if(!Number.isInteger(patch[k])||patch[k]<1||patch[k]>240)throw Error(k+' must be between 1 and 240');next[k]=patch[k]}
 if('focus' in patch)next.focus=clean(patch.focus,2000);
 if('analyticsEnabled' in patch){if(typeof patch.analyticsEnabled!=='boolean')throw Error('analyticsEnabled must be boolean');
  const home=rootFor(homedir()),file=under(home,'.config/carbon/config.json');atomic(file,JSON.stringify({...read(file,{}),analyticsEnabled:patch.analyticsEnabled},null,2));}
 atomic(under(root,'.carbon/free/settings.json'),JSON.stringify(next,null,2));return {...next,analyticsEnabled:analyticsEnabled()};
}
function runFolder(root,id){if(!/^free-[a-f0-9]{16}$/.test(id))throw Error('Invalid run ID');return under(root,'.carbon/free/runs/'+id)}
function load(root,id){const state=read(path.join(runFolder(root,id),'state.json'));if(!state||state.schema!=='carbon.free-run/v1')throw Error('Run not found');return state}
function save(root,state){const folder=runFolder(root,state.id);atomic(path.join(folder,'state.json'),JSON.stringify(state,null,2));atomic(path.join(folder,'report.html'),render(state));atomic(path.join(folder,'map.html'),render(state,'map'))}
function normalizeCheck(c,i){object(c);if(!c.title)throw Error('Every check needs a title');const status=c.status||'planned';if(!allowedStatus.has(status))throw Error('Invalid check status');
 if(['passed','failed'].includes(status)&&(!String(c.actual||'').trim()||!String(c.evidence||'').trim()))throw Error('Executed checks need observed results and evidence');
 return {id:clean(c.id||'check-'+(i+1),80),title:clean(c.title,500),domain:clean(c.domain||'Functionality',100),type:clean(c.type||'positive',80),lane:clean(c.lane||'directed',80),risk:clean(c.risk,2000),steps:clean(c.steps,8000),expected:clean(c.expected,4000),actual:clean(c.actual,6000),evidence:clean(c.evidence,6000),status,page:clean(c.page,2000)};
}
function normalizeFinding(f){object(f);if(!f.title||!f.consequence)throw Error('Findings need a title and consequence');return {id:clean(f.id||crypto.randomBytes(6).toString('hex'),80),title:clean(f.title,500),severity:clean(f.severity||'medium',50),strength:clean(f.strength||'suspected',80),consequence:clean(f.consequence),steps:clean(f.steps),evidence:clean(f.evidence),remediation:clean(f.remediation),verification:clean(f.verification),page:clean(f.page,2000)}}
function screenshot(root,value){
 if(!value)return '';if(typeof value!=='string'||!path.isAbsolute(value))throw Error('Screenshot must be an absolute project-local file');
 const rel=path.relative(root,fs.realpathSync(value)),file=under(root,rel);const ext=path.extname(file).toLowerCase();if(!['.png','.jpg','.jpeg','.webp'].includes(ext))throw Error('Only PNG, JPEG and WebP screenshots are supported');
 const bytes=fs.readFileSync(file);if(bytes.length>5*1024*1024)throw Error('Screenshot exceeds 5 MB; resize first');
 const valid=ext==='.png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):ext==='.webp'?bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP':bytes[0]===255&&bytes[1]===216;
 if(!valid)throw Error('Image file signature does not match extension');return 'data:image/'+(ext==='.jpg'?'jpeg':ext.slice(1))+';base64,'+bytes.toString('base64');
}
function normalizePage(root,p){object(p);if(!p.title)throw Error('Page title required');return {id:clean(p.id||crypto.randomBytes(6).toString('hex'),80),title:clean(p.title,500),url:clean(p.url,2000),image:screenshot(root,p.screenshot),description:clean(p.description,3000)}}
async function ensureWeb(){
 if(web)return web;
 web=http.createServer(async(req,res)=>{
  const address=web.address(),host='127.0.0.1:'+address.port;
  if(req.headers.host!==host){res.writeHead(403);return res.end('Invalid host')}
  const url=new URL(req.url,'http://'+host),s=sessions.get(url.searchParams.get('session'));
  const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"};
  if(!s){res.writeHead(404,headers);return res.end('This local view expired. Reopen the saved report with CARBON.')}
  if(url.pathname==='/view'&&req.method==='GET'){res.writeHead(200,headers);return res.end(render(null,s.mode,true))}
  const auth=req.headers.authorization==='Bearer '+s.token;
  if(!auth){res.writeHead(403,headers);return res.end('Private report: missing access token')}
  try{
   if(url.pathname==='/snapshot'&&req.method==='GET'){
    res.writeHead(200,headers);return res.end(s.mode==='settings'?render({settings:preferences(s.root),analyticsEnabled:analyticsEnabled()},'settings'):render(load(s.root,s.run),url.searchParams.get('mode')==='map'?'map':s.mode));
   }
   if(url.pathname==='/settings'&&req.method==='POST'&&s.mode==='settings'){
    if(req.headers.origin!=='http://'+host)throw Error('Same-origin request required');
    let body='';for await(const chunk of req){body+=chunk;if(body.length>16000)throw Error('Request too large')}
    const settings=setPreferences(s.root,JSON.parse(body));res.writeHead(200,{...headers,'Content-Type':'application/json'});return res.end(JSON.stringify({ok:true,settings}));
   }
   res.writeHead(404,headers);res.end('Not found');
  }catch(e){res.writeHead(400,{...headers,'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:clean(e.message,300)}))}
 });
 try{await new Promise((resolve,reject)=>{web.once('error',reject);web.listen(0,'127.0.0.1',resolve)});return web}catch(error){web=null;throw error}
}
async function viewer(root,run,mode='report'){
 await ensureWeb();const session=crypto.randomBytes(18).toString('hex'),token=crypto.randomBytes(32).toString('base64url');sessions.set(session,{root,run,mode,token});
 return 'http://127.0.0.1:'+web.address().port+'/view?session='+session+'#'+token;
}
const str={type:'string'},obj={type:'object'},arr={type:'array',items:obj};
const definitions=[
 ['carbon_start','Start a bounded Free assessment. Returns a live report URL; does not open the browser or execute tests itself.',{root:str,command:{type:'string',enum:commands.map(c=>c.name)},title:str,target:str,checks:arr},['root','command','title']],
 ['carbon_update','Record actual checks, findings, pages, persona journeys, blockers and confidence for one run. Merge by IDs; no findings are hidden.',{root:str,runId:str,current:str,why:str,summary:str,status:{type:'string',enum:['running',...terminal]},checks:arr,findings:arr,pages:arr,journeys:arr,personas:arr,blockers:{type:'array',items:str},confidence:obj},['root','runId']],
 ['carbon_report','Reopen a saved report or current-run map; returns portable HTML and JSON paths.',{root:str,runId:str,view:{type:'string',enum:['report','map']}},['root','runId']],
 ['carbon_settings','Read or update local preferences and global analytics opt-out; returns a local settings UI.',{root:str,patch:obj},['root']],
 ['carbon_demo','List or create a fresh disposable demo; never overwrites an existing project.',{root:str,action:{type:'string',enum:['list','create']},fixture:str,destination:str,testProfile:{type:'string',enum:['without-existing-tests','with-existing-tests']}},['root','action']],
 ['carbon_knowledge','Read bundled testing-domain, specialist or accessibility reference data.',{kind:{type:'string',enum:['domains','specialists','accessibility']},domain:str},['kind']]
];
async function call(name,a){
 object(a);if(name==='carbon_knowledge'){
  const file={domains:'testing-domains.json',specialists:'specialists.json',accessibility:'wcag22-criteria.json'}[a.kind];if(!file)throw Error('Unknown knowledge kind');const data=read(path.join(plugin,'references',file));if(a.domain&&data.domains)data.domains=data.domains.filter(d=>d.id===a.domain);return data;
 }
 const root=rootFor(a.root);
 if(name==='carbon_start'){
  if(!commands.some(c=>c.name===a.command))throw Error('Command not included in Free');if(!a.title)throw Error('Run title required');
  const checks=(a.checks||[]).map(normalizeCheck);if(new Set(checks.map(c=>c.id)).size!==checks.length)throw Error('Duplicate check IDs');
  const state={schema:'carbon.free-run/v1',edition:'free',id:'free-'+crypto.randomBytes(8).toString('hex'),command:a.command,title:clean(a.title,500),target:clean(a.target,2000),createdAt:now(),updatedAt:now(),status:'running',current:'Inspecting the target and selecting meaningful checks',why:'Start with the most consequential customer journeys',settings:preferences(root),checks,findings:[],pages:[],personas:[],history:[],blockers:[]};
  save(root,state);void trackFathomEvent(eventForCommandStart(a.command));return {runId:state.id,url:await viewer(root,state.id),reportPath:path.join(runFolder(root,state.id),'report.html'),defaults:state.settings};
 }
 if(name==='carbon_update'){
  const state=load(root,a.runId);if(terminal.has(state.status))throw Error('Run is closed; start a new assessment, preserving this evidence');
  for(const k of ['current','why','summary'])if(k in a)state[k]=clean(a[k]);
  const merge=(key,rows)=>{const map=new Map((state[key]||[]).map(v=>[v.id,v]));for(const v of rows)map.set(v.id,v);state[key]=[...map.values()]};
  if(a.checks)merge('checks',a.checks.map((c,i)=>normalizeCheck({...state.checks.find(x=>x.id===c.id),...c},i)));
  if(a.findings)merge('findings',a.findings.map(normalizeFinding));
  if(a.pages)merge('pages',a.pages.map(p=>normalizePage(root,p)));
  if(a.journeys)merge('journeys',a.journeys.slice(0,100).map(j=>{object(j);if(!j.id||!j.title||!Array.isArray(j.steps))throw Error('Journey requires id, title, and ordered steps');return {id:clean(j.id,80),title:clean(j.title,500),intent:clean(j.intent),steps:j.steps.slice(0,100).map(s=>{object(s);if(['passed','failed'].includes(s.status)&&!String(s.evidence||'').trim())throw Error('Journey outcomes require recorded evidence');return {title:clean(s.title,500),page:clean(s.page,2000),status:allowedStatus.has(s.status)?s.status:'unrecorded',evidence:clean(s.evidence)}})}}));
  if(a.personas)merge('personas',a.personas.map(p=>({id:clean(p.id||crypto.randomBytes(6).toString('hex'),80),specialist:clean(p.specialist||'jason',80),intent:clean(p.intent),journey:clean(p.journey),reaction:clean(p.reaction),evidence:clean(p.evidence)})));
  if(a.blockers)state.blockers=a.blockers.map(x=>clean(x));
  if(a.confidence){const c=object(a.confidence);if(!c.rationale||!c.scope)throw Error('Confidence requires scope and rationale');if(c.score!==undefined&&(!Number.isFinite(c.score)||c.score<0||c.score>100))throw Error('Score must be between 0 and 100');state.confidence={...(c.score!==undefined?{score:c.score}:{}),scope:clean(c.scope),rationale:clean(c.rationale),limitations:clean(c.limitations)};}
  if(a.status){if(a.status!=='running'&&!terminal.has(a.status))throw Error('Invalid run status');if(a.status==='completed'&&state.checks.some(c=>['planned','running'].includes(c.status)))throw Error('Mark unexecuted checks deferred or blocked before completion');state.status=a.status}
  state.updatedAt=now();state.history.push({at:state.updatedAt,current:state.current,why:state.why});save(root,state);return {runId:state.id,status:state.status,checks:state.checks.length,findings:state.findings.length,reportPath:path.join(runFolder(root,state.id),'report.html')};
 }
 if(name==='carbon_report'){load(root,a.runId);const view=a.view==='map'?'map':'report';return {url:await viewer(root,a.runId,view),htmlPath:path.join(runFolder(root,a.runId),view+'.html'),jsonPath:path.join(runFolder(root,a.runId),'state.json'),portable:'Copy the HTML file to share; images are embedded. Review for sensitive data before sharing.'}}
 if(name==='carbon_settings')return {settings:a.patch?setPreferences(root,a.patch):{...preferences(root),analyticsEnabled:analyticsEnabled()},url:await viewer(root,null,'settings')};
 if(name==='carbon_demo'){
  const script=path.join(plugin,'runtime/carbon/scripts/carbon_demo.py');const args=a.action==='list'?['list']:['create','--root',root,'--fixture',a.fixture||'web-static','--test-profile',a.testProfile||'without-existing-tests',...(a.destination?['--destination',a.destination]:[])];
  return JSON.parse(execFileSync('python3',['-I','-B',script,...args],{encoding:'utf8',timeout:30000,env:demoEnvironment()}));
 }
 throw Error('Tool not available in CARBON Free');
}
async function dispatch(m){
 if(m.method==='initialize')return {protocolVersion:'2024-11-05',capabilities:{tools:{},prompts:{}},serverInfo:{name:'carbon-free',version:manifest.version}};
 if(m.method==='ping')return {};
 if(m.method==='tools/list')return {tools:definitions.map(([name,description,properties,required])=>({name,description,inputSchema:{type:'object',properties,required,additionalProperties:false},annotations:{title:name.replaceAll('_',' '),readOnlyHint:['carbon_knowledge','carbon_report'].includes(name),destructiveHint:false,idempotentHint:['carbon_knowledge','carbon_report','carbon_settings'].includes(name),openWorldHint:name==='carbon_start'}}))};
 if(m.method==='tools/call'){
  if(!definitions.some(d=>d[0]===m.params.name))throw Error('Unknown Free tool');
  try{return {content:[{type:'text',text:JSON.stringify(await call(m.params.name,m.params.arguments||{}))}]}}catch(e){return {isError:true,content:[{type:'text',text:clean(e.message,1000)}]}}
 }
 if(m.method==='prompts/list')return {prompts:commands.map(c=>({name:c.name,description:c.description,arguments:[{name:'request',description:'Target or testing scope',required:false}]}))};
 if(m.method==='prompts/get'){/* Jay conversational prompt entrypoints */ const promptName=m.params.name==='J'?'j':m.params.name;const c=commands.find(c=>c.name===promptName);if(!c)throw Error('Unknown Free command');return {messages:[{role:'user',content:{type:'text',text:fs.readFileSync(path.join(plugin,'references','jay-conversation.md'),'utf8')+'\n\nPlugin skills directory: '+path.join(plugin,'skills')+'\n\n'+fs.readFileSync(path.join(plugin,'skills',c.name,'SKILL.md'),'utf8')+'\nUser scope: '+clean(m.params.arguments?.request)}}]}}
 throw Error('Unsupported method');
}
const input=readline.createInterface({input:process.stdin,crlfDelay:Infinity});
let queue=Promise.resolve();
input.on('line',line=>{queue=queue.then(async()=>{let m;try{if(line.length>12*1024*1024)throw Error('Request too large');m=JSON.parse(line);if(m.id===undefined)return;const result=await dispatch(m);process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:m.id,result})+'\n')}catch(e){process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:m?.id??null,error:{code:-32602,message:clean(e.message,300)}})+'\n')}})});
input.on('close',()=>{queue.finally(()=>{web?.close();process.exit(0)})});
