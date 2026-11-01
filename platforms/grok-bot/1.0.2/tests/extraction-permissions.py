"""Check fresh archive extraction and writable disposable demos inside task workspace."""
from pathlib import Path
import hashlib, json, os, stat, subprocess, tarfile, tempfile
root = Path(__file__).resolve().parents[1]
work = root / 'disposable'
work.mkdir(exist_ok=True)
fresh = Path(tempfile.mkdtemp(prefix='permissions-', dir=work))
archive = root / 'output/carbon-grok-bot-1.0.2.tgz'
with tarfile.open(archive) as tar:
    tar.extractall(fresh, filter='data')
package = fresh / 'package'
script = package / 'runtime/carbon/scripts/carbon_demo.py'
fixtures = package / 'runtime/carbon/demo-fixtures'
before = {str(p.relative_to(fixtures)):hashlib.sha256(p.read_bytes()).hexdigest() for p in fixtures.rglob('*') if p.is_file()}
nonwritable = [str(p.relative_to(package)) for p in package.rglob('*') if not p.stat().st_mode & stat.S_IWUSR]
assert not nonwritable, nonwritable
manifest = json.loads((fixtures/'manifest.json').read_text())
checks = []
for fixture in manifest['fixtures']:
    for profile in ['without-existing-tests','with-existing-tests']:
        target = f"{fixture['id']}-{profile}"
        proc = subprocess.run(['python3','-I','-B',str(script),'create','--root',str(fresh),'--fixture',fixture['id'],'--test-profile',profile,'--destination',target], capture_output=True,text=True)
        assert proc.returncode == 0, proc.stderr
        demo = Path(json.loads(proc.stdout)['destination'])
        assert (demo/'.carbon-demo.json').is_file()
        for p in [demo, *demo.rglob('*')]:
            assert p.stat().st_mode & stat.S_IWUSR, str(p)
            if p.is_dir():
                probe=p/'.permission-probe'; probe.write_text('synthetic'); probe.unlink()
            elif p.is_file():
                with p.open('ab'): pass
        checks.append({'fixture':fixture['id'],'profile':profile,'created':True,'allDirectoriesWritable':True,'allFilesOpenForWrite':True})
after = {str(p.relative_to(fixtures)):hashlib.sha256(p.read_bytes()).hexdigest() for p in fixtures.rglob('*') if p.is_file()}
assert before == after
print(json.dumps({'passed':True,'root':str(fresh),'archiveSha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'fixtureSourceUnchanged':True,'permissionCorrections':0,'checks':checks},indent=2))
