import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {inspect,build} from '../scripts/build-npm.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'carbon-npm-safety-'));
for(const forbidden of ['.env','.npmrc','.carbon/state.json','node_modules/x.js','feedback-service/index.js','server/pro-benchmarks.mjs','runtime/carbon/scripts/carbon_proof.py']) {
  const dir=fs.mkdtempSync(path.join(root,'denied-')),file=path.join(dir,forbidden);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'synthetic');
  assert.throws(()=>inspect(dir),/Forbidden package path/);
}
const linked=path.join(root,'links');fs.mkdirSync(linked);fs.symlinkSync('../',path.join(linked,'loop'));assert.throws(()=>inspect(linked),/Symlink/);
const secrets=path.join(root,'secret');fs.mkdirSync(secrets);fs.writeFileSync(path.join(secrets,'fake.json'),JSON.stringify({test:'npm_'+'x'.repeat(36)}));assert.throws(()=>inspect(secrets),/Possible secret/);
const pro=path.join(root,'wrong-edition');fs.mkdirSync(pro);fs.writeFileSync(path.join(pro,'package.json'),'{"license":"MIT"}');fs.writeFileSync(path.join(pro,'EDITION.json'),'{"edition":"pro","publicDistribution":false}');fs.writeFileSync(path.join(pro,'commands.json'),'[]');assert.throws(()=>build(pro,path.join(root,'must-not-build')));assert(!fs.existsSync(path.join(root,'must-not-build')));
console.log('PASS: forbidden files, credentials, symlinks and wrong-edition source rejected');
