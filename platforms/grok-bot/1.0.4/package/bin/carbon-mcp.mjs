#!/usr/bin/env node
// No install hooks, automatic configuration writes, or telemetry in CLI helpers.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const meta=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url)));
const args=process.argv.slice(2);
const commands=JSON.parse(fs.readFileSync(new URL('../commands.json',import.meta.url)));
if(args.length>1 || (args.length && !['--stdio','--help','-h','--version','-v','--print-config','--doctor','--list-workflows'].includes(args[0]))) {
  console.error('Unknown argument. Run carbon-mcp --help.'); process.exitCode=2;
} else if(['--help','-h'].includes(args[0])) {
  console.log(`CARBON — AI testing harness with Jay\n\nUsage: carbon-mcp [--stdio]\n\nStarts the free local MCP server over standard input/output. Your MCP host\nprovides model access and browser/shell tools. No account or CARBON API key.\nRequires Node.js 22+. Demo and full-workflow helpers require Python 3.10+.\n\n--print-config     Print a version-pinned MCP configuration; change nothing\n--doctor           Check local runtime prerequisites; change nothing\n--list-workflows   List included workflow prompts\n--version          Print the package version\n\nInstall this server in your host's MCP settings. Skills, automatic checks and\nslash commands require host-specific setup; npm installation does not enable them.\nAnalytics defaults off for this npm distribution. See README.md and PRIVACY.md.\nhttps://testers.ai/carbon/`);
} else if(['--version','-v'].includes(args[0])) {
  console.log(meta.version);
} else if(args[0]==='--print-config') {
  console.log(JSON.stringify({mcpServers:{carbon:{command:'npx',args:['-y',`${meta.name}@${meta.version}`]}}},null,2));
} else if(args[0]==='--list-workflows') {
  console.log(JSON.stringify(commands,null,2));
} else if(args[0]==='--doctor') {
  const python=spawnSync('python3',['--version'],{encoding:'utf8',timeout:5000});
  const pythonVersion=(python.stdout||python.stderr||'').trim();
  const match=/Python (\d+)\.(\d+)/.exec(pythonVersion);
  const pythonSupported=python.status===0&&!!match&&(Number(match[1])>3||(Number(match[1])===3&&Number(match[2])>=10));
  const nodeSupported=Number(process.versions.node.split('.')[0])>=22;
  console.log(JSON.stringify({name:'CARBON',agent:'Jay',version:meta.version,node:{version:process.versions.node,supported:nodeSupported},python:{version:pythonVersion||null,supported:pythonSupported,requiredFor:'Demo creation and full-workflow helpers'},model:'Provided by your MCP host; not included',browser:'Provided by your host; not detected or installed',analyticsDefault:'off',configurationChanged:false},null,2));
  if(!nodeSupported) process.exitCode=1;
} else {
  await import('../server/index.mjs');
}
