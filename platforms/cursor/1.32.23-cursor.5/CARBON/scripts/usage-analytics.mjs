// Cursor helper is deliberately stateless, even if invoked directly by a workflow.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {usage} from '../server/cursor-state.mjs';
export {createUsageAnalytics,usage} from '../server/cursor-state.mjs';
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 if(process.argv[2]==='on'){console.error('Analytics is disabled in the Cursor distribution');process.exitCode=1;}
 else console.log(JSON.stringify(usage().status()));
}
