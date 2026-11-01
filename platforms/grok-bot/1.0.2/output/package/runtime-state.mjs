// State location only; does not isolate host accounts, projects, or plugins.
import os from 'node:os';
import path from 'node:path';
export function runtimeHome() {
  const configured = process.env.CARBON_GROK_RUNTIME_HOME;
  if (!configured) return os.homedir();
  if (!path.isAbsolute(configured)) throw Error('CARBON_GROK_RUNTIME_HOME must be absolute');
  return configured;
}
