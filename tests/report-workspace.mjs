import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {render} from '../server/view.mjs';
const sandbox={module:{exports:{}}};
vm.runInNewContext(fs.readFileSync(new URL('../ui/report-workspace.js',import.meta.url),'utf8'),sandbox);
const ui=sandbox.module.exports;
const empty=ui.normalize({status:'completed'});
assert.equal(ui.verdict(empty),'Review the recorded evidence.');
assert.equal(Object.values(ui.counts(empty)).reduce((a,b)=>a+b),0);
assert.equal(empty.journeys.length,0);
const counts=ui.counts(ui.normalize({checks:[{status:'passed'},{status:'planned'},{status:'deferred'},{status:'unknown'}]}));
assert.equal(counts.passed,1);assert.equal(counts.unrecorded,1);
for(const src of ['https://example.com/tracker.png','javascript:alert(1)','data:image/svg+xml;base64,AAAA'])
  assert.equal(ui.image(src),'');
const state={id:'fixture',title:'<screen>',summary:'A < B </script>',status:'partial',checks:[],findings:[],pages:[],personas:[],blockers:[],history:[]};
for(const mode of ['report','map']){
 const html=render(state,mode);
 const blocks=[...html.matchAll(/<script id="run-data" type="application\/json">([\s\S]*?)<\/script>/g)];
 assert.equal(blocks.length,1);
 assert.deepEqual(JSON.parse(blocks[0][1]),state,'Evidence JSON round-trips special characters');
 for(const tag of ['Release brief','Evidence lens','Journey atlas','Live investigation'])assert.ok(html.includes(tag),tag);
 assert.ok(!html.includes('https://testers.ai/carbon/#pro'),'No unsolicited upgrade promotion');
 for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
}
console.log('PASS: four report views, honest empty states, image safety, special-character round-trip, script syntax');
