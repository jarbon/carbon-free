from pathlib import Path
import hashlib,json,sys,tarfile
root=Path(__file__).resolve().parent
archive=Path(sys.argv[1])
assert hashlib.sha256(archive.read_bytes()).hexdigest()=="75180b5eff769d57fbe797fad5c6322217ff3ef2742558a65fab4a9869a692a1"
expected=json.loads((root/"FILES.json").read_text())
with tarfile.open(archive) as tar:
    actual={}
    for m in tar.getmembers():
        assert (m.name=="package" or m.name.startswith("package/")) and ".." not in Path(m.name).parts
        assert m.isfile() or m.isdir()
        if m.isfile():
            n=m.name.removeprefix("package/")
            assert n not in actual
            actual[n]=hashlib.sha256(tar.extractfile(m).read()).hexdigest()
    assert actual==expected
assert {str(p.relative_to(root/"package")):hashlib.sha256(p.read_bytes()).hexdigest() for p in (root/"package").rglob("*") if p.is_file()}==expected
print("PASS: exact archive and all 203 source files match")
