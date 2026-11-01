from pathlib import Path
import gzip, hashlib, io, json, tarfile
root = Path(__file__).resolve().parent
pkg = root / "CARBON"
manifest = json.loads((root / "FILES.json").read_text())
expected = "5166e1b1def430f4f8cdee9aa5b852741be3753a64236a6e0235ea42b61ddd98"
assert not any(p.is_symlink() for p in pkg.rglob("*"))
assert {str(p.relative_to(pkg)) for p in pkg.rglob("*") if p.is_file()} == {m["path"] for m in manifest}
outdir = root / "dist"
outdir.mkdir(exist_ok=True)
archive = outdir / "carbon-cursor-1.32.23-cursor.5.tgz"
with archive.open("wb") as raw, gzip.GzipFile(filename="", mode="wb", fileobj=raw, mtime=0) as gz, tarfile.open(fileobj=gz, mode="w", format=tarfile.USTAR_FORMAT) as tar:
    for m in manifest:
        name = m["path"]
        assert not Path(name).is_absolute() and ".." not in Path(name).parts
        data = (pkg / name).read_bytes()
        assert hashlib.sha256(data).hexdigest() == m["sha256"], name
        entry = tarfile.TarInfo("CARBON/" + name)
        entry.size, entry.mode = len(data), m["mode"]
        tar.addfile(entry, io.BytesIO(data))
digest = hashlib.sha256(archive.read_bytes()).hexdigest()
assert digest == expected, digest
(outdir / "SHA256SUMS").write_text(digest + "  " + archive.name + "\n")
print(json.dumps({"archive": archive.name, "sha256": digest, "filesVerified": len(manifest)}, indent=2))
