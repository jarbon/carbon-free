// Demo copying needs platform basics, not credentials, proxies or language hooks.
export function demoEnvironment(source = process.env) {
  const result = {};
  for (const key of ['PATH', 'Path', 'SystemRoot', 'WINDIR', 'TEMP', 'TMP', 'LANG', 'LC_ALL']) {
    if (typeof source[key] === 'string') result[key] = source[key];
  }
  result.PYTHONDONTWRITEBYTECODE = '1';
  return result;
}
