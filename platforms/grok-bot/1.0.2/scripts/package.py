"""Build a deterministic private review archive from output/package."""
from pathlib import Path
import gzip, hashlib, io, json, tarfile
root = Path(__file__).resolve().parents[1]
stage = root / 'output/package'
out = root / 'output/carbon-grok-bot-1.0.2.tgz'
files = sorted(p for p in stage.rglob('*') if p.is_file())
assert not any(p.is_symlink() for p in stage.rglob('*'))
manifest = {str(p.relative_to(stage)): hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
with out.open('wb') as raw, gzip.GzipFile(filename='', fileobj=raw, mode='wb', mtime=0) as compressed, tarfile.open(fileobj=compressed, mode='w') as tar:
    for p in files:
        info = tar.gettarinfo(str(p), 'package/' + str(p.relative_to(stage)))
        info.uid = info.gid = info.mtime = 0
        info.uname = info.gname = ''
        info.mode = 0o755 if p.suffix == '.mjs' and p.parent.name == 'bin' else 0o644
        tar.addfile(info, io.BytesIO(p.read_bytes()))
digest = hashlib.sha256(out.read_bytes()).hexdigest()
(root/'output/FILES.sha256.json').write_text(json.dumps(manifest, indent=2)+'\n')
(root/'output/SHA256SUMS').write_text(f'{digest}  {out.name}\n')
print(json.dumps({'archive':str(out), 'sha256':digest, 'files':len(files)}, indent=2))
