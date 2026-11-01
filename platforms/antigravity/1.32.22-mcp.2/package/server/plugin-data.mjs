import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
export function pluginDataRoot() {
  const value = process.env.PLUGIN_DATA;
  if (!value || !path.isAbsolute(value)) throw Error('Antigravity requires an absolute PLUGIN_DATA directory; no shared-home fallback is permitted.');
  const root = fs.realpathSync(value);
  if (root === fs.realpathSync(os.homedir()) || root === path.parse(root).root) throw Error('PLUGIN_DATA must be a dedicated plugin state directory.');
  return root;
}
