import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {demoEnvironment} from '../server/demo-environment.mjs';

const root=path.resolve(import.meta.dirname,'..');
const refs=new Set();
function collect(value) {
  if(typeof value==='string' && value.startsWith('assets/specialists/')) refs.add(value);
  else if(value && typeof value==='object') Object.values(value).forEach(collect);
}
for(const name of ['specialists','jay']) collect(JSON.parse(fs.readFileSync(path.join(root,'references',name+'.json'))));
const bundled=fs.readdirSync(path.join(root,'assets/specialists')).map(f=>'assets/specialists/'+f);
assert.deepEqual([...refs].sort(),bundled.sort(),'Only referenced specialist assets are shipped');
for(const file of refs) {
  const bytes=fs.readFileSync(path.join(root,file));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
}
const synthetic={
  PATH:process.env.PATH, LANG:'en_US.UTF-8',
  API_KEY:'synthetic-not-a-credential', OPENAI_API_KEY:'synthetic-openai',
  AWS_SECRET_ACCESS_KEY:'synthetic-aws', HTTPS_PROXY:'https://example.invalid',
  PYTHONPATH:'/does-not-exist', NODE_OPTIONS:'--inspect', HOME:'/not-forwarded'
};
const env=demoEnvironment(synthetic);
assert.deepEqual(Object.keys(env).sort(),['LANG','PATH','PYTHONDONTWRITEBYTECODE'].sort());
const observed=JSON.parse(execFileSync('python3',['-I','-B','-c',
  'import json, os, sys; print(json.dumps({"env": dict(os.environ), "isolated": sys.flags.isolated, "no_user_site": sys.flags.no_user_site, "no_bytecode": sys.dont_write_bytecode}))'
],{env,encoding:'utf8'}));
for(const key of ['API_KEY','OPENAI_API_KEY','AWS_SECRET_ACCESS_KEY','HTTPS_PROXY','PYTHONPATH','NODE_OPTIONS','HOME'])
  assert.equal(observed.env[key],undefined,key+' must not reach Python');
assert.equal(observed.isolated,1);assert.equal(observed.no_user_site,1);assert.equal(observed.no_bytecode,true);
const manifests=['package.json','server/package.json','.claude-plugin/plugin.json','.codex-plugin/plugin.json','EDITION.json']
  .filter(f=>fs.existsSync(path.join(root,f))).map(f=>JSON.parse(fs.readFileSync(path.join(root,f))).version);
assert.ok(manifests.every(v=>v==='1.32.22-free.6'));
console.log(JSON.stringify({passed:true,retainedImages:refs.size,isolatedPython:true,credentialInheritance:false,versions:manifests}));
