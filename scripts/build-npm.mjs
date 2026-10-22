// Stage only the canonical MIT free edition. Never publish from the full Pro tree.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
export const entries=['.claude-plugin/plugin.json','LICENSE','NOTICE.md','SECURITY.md','COMMANDS.md','MCP_SERVER.md','EDITION.json','commands.json','assets','background','references','runtime','server','skills','ui','scripts/usage-analytics.mjs','scripts/fathom-analytics.mjs','scripts/analytics-product.json'];
const denied=/(^|\/)(?:\.git|\.carbon|\.env(?:\..*)?|\.npmrc|node_modules|output|__pycache__|\.DS_Store|feedback-service|feedback-loop|private-pro)(?:\/|$)|(?:^|\/)(?:carbon_proof\.py|pro-benchmarks\.mjs)$/;
export function inspect(root) {
  const result=[];
  function visit(dir) {
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      const full=path.join(dir,entry.name),relative=path.relative(root,full).split(path.sep).join('/');
      assert(!entry.isSymbolicLink(),'Symlink not permitted: '+relative);
      assert(!denied.test(relative),'Forbidden package path: '+relative);
      if(entry.isDirectory()){visit(full);continue;}
      assert(entry.isFile(),'Unsupported file: '+relative);
      const bytes=fs.readFileSync(full);
      if(/\.(md|mjs|js|cjs|json|py|txt|yaml|yml|html|css)$/.test(relative)) {
        const content=bytes.toString('utf8');
        assert(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bsk-(?:proj-|ant-)[A-Za-z0-9_-]{30,}|\bnpm_[A-Za-z0-9]{30,}/.test(content),'Possible secret: '+relative);
      }
      result.push({path:relative,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
    }
  }
  visit(root);return result.sort((a,b)=>a.path.localeCompare(b.path));
}
export function build(source,out) {
  source=fs.realpathSync(source);out=path.resolve(out);
  assert(!fs.existsSync(out),'Use a fresh output directory');
  const read=name=>JSON.parse(fs.readFileSync(path.join(source,name)));
  const upstream=read('package.json'),edition=read('EDITION.json'),commands=read('commands.json');
  assert.equal(edition.edition,'free');assert.equal(edition.publicDistribution,true);assert.equal(upstream.license,'MIT');
  assert.equal(upstream.version,edition.version);assert.match(upstream.version,/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/);
  assert(fs.readFileSync(path.join(source,'LICENSE'),'utf8').startsWith('MIT License\n'));
  const expected=['carbon','carbon-demo','carbon-test','carbon-issues','carbon-accessibility','carbon-map','carbon-help','carbon-settings','j','jay','carbon-background','carbon-pro','full'];
  assert.deepEqual(commands.map(c=>c.name).sort(),expected.sort(),'Review changed edition surface before packaging');
  const stage=path.join(out,'package');fs.mkdirSync(stage,{recursive:true});
  for(const name of entries) {
    const input=path.join(source,name),dest=path.join(stage,name);
    // Inspect before copying so symlinks cannot be followed into private sources.
    if(fs.lstatSync(input).isSymbolicLink())throw Error('Symlink source: '+name);
    if(fs.statSync(input).isDirectory()) inspect(input);
    fs.mkdirSync(path.dirname(dest),{recursive:true});fs.cpSync(input,dest,{recursive:true,errorOnExist:true,force:false});
  }
  // Publishing metadata belongs to this distribution; keep native plugin manifests intact.
  const meta={name:'@testers-ai/carbon-mcp',version:upstream.version,description:'CARBON AI testing harness with Jay: risk-based software testing, exploratory and regression checks, accessibility, triage, and local evidence reports via MCP.',type:'module',license:'MIT',engines:{node:'>=22'},bin:{'carbon-mcp':'bin/carbon-mcp.mjs'},files:[...entries,'bin','README.md','PRIVACY.md','server.json'],homepage:'https://testers.ai/carbon/',repository:{type:'git',url:'git+https://github.com/jarbon/carbon-free.git'},bugs:{url:'https://github.com/jarbon/carbon-free/issues'},author:{name:'testers.ai',url:'https://testers.ai'},keywords:['mcp','mcp-server','carbon','jay','ai-test-manager','testing','software-testing','test-harness','test-automation','qa','quality-assurance','regression-testing','exploratory-testing','accessibility','browser-testing'],mcpName:'io.github.jarbon/carbon',publishConfig:{access:'public',registry:'https://registry.npmjs.org/',tag:'latest'}};
  const write=(name,value)=>fs.writeFileSync(path.join(stage,name),JSON.stringify(value,null,2)+'\n');
  write('package.json',meta);
  write('EDITION.json',{...edition,distribution:'npm',npmPackage:meta.name,agentName:'Jay'});
  for(const dir of ['server','scripts'])write(dir+'/analytics-product.json',{edition:'mcp-lite',version:meta.version,defaultEnabled:false});
  fs.mkdirSync(path.join(stage,'bin'));fs.copyFileSync(path.join(source,'npm/cli.mjs'),path.join(stage,'bin/carbon-mcp.mjs'));fs.chmodSync(path.join(stage,'bin/carbon-mcp.mjs'),0o755);
  fs.writeFileSync(path.join(stage,'README.md'),fs.readFileSync(path.join(source,'npm/README.md'),'utf8').replaceAll('__VERSION__',meta.version).replace('__COMMAND_LIST__',commands.map(c=>'- `'+c.name+'`: '+c.description).join('\n')));
  fs.copyFileSync(path.join(source,'npm/PRIVACY.md'),path.join(stage,'PRIVACY.md'));
  write('server.json',{$schema:'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json',name:meta.mcpName,title:'CARBON',description:'AI testing harness with Jay: risk-based checks, bug investigation, and local evidence reports.',version:meta.version,websiteUrl:meta.homepage,repository:{url:'https://github.com/jarbon/carbon-free',source:'github'},packages:[{registryType:'npm',identifier:meta.name,version:meta.version,transport:{type:'stdio'},environmentVariables:[{name:'CARBON_ANALYTICS',description:'Optional content-free analytics. Off by default; set off to force-disable.',isRequired:false,isSecret:false,choices:['off','on']},{name:'DO_NOT_TRACK',description:'Set 1 to disable analytics regardless of preferences.',isRequired:false,isSecret:false,choices:['1']}]}]});
  const files=inspect(stage);
  fs.writeFileSync(path.join(out,'FILES.json'),JSON.stringify({version:meta.version,files},null,2)+'\n');
  const packed=JSON.parse(execFileSync('npm',['pack',stage,'--ignore-scripts','--json','--pack-destination',out],{encoding:'utf8'}))[0];
  const archive=path.join(out,packed.filename);
  const publishedFiles=packed.files.map(f=>f.path);
  for(const required of ['bin/carbon-mcp.mjs','.claude-plugin/plugin.json','server/index.mjs','skills/jay/SKILL.md','runtime/carbon/scripts/carbon_demo.py','LICENSE','server.json'])assert(publishedFiles.includes(required),'Missing packed file: '+required);
  for(const f of publishedFiles)assert(!denied.test(f),'Forbidden tar entry: '+f);
  const sha256=createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  fs.writeFileSync(path.join(out,'SHA256SUMS'),`${sha256}  ${packed.filename}\n`);
  const result={package:meta.name,version:meta.version,agent:'Jay',stage,archive,sha256,size:packed.size,unpackedSize:packed.unpackedSize,files:packed.entryCount,analyticsDefault:false,published:false};
  fs.writeFileSync(path.join(out,'BUILD.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  if(!process.argv[2])throw Error('Usage: node scripts/build-npm.mjs NEW_OUTPUT_DIRECTORY');
  console.log(JSON.stringify(build(path.resolve(import.meta.dirname,'..'),process.argv[2]),null,2));
}
