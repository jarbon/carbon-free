#!/usr/bin/env python3
"""List and create safe, disposable CARBON demo projects bundled with the plugin.

The fixtures are package-owned, read-only templates.  A demo is always a fresh
copy in a user-selected or workspace-local folder; this command never writes
back into the plugin fixture library or an existing destination.
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


RUNTIME_ROOT = Path(__file__).resolve().parents[1]
FIXTURE_ROOT = RUNTIME_ROOT / "demo-fixtures"
MANIFEST_PATH = FIXTURE_ROOT / "manifest.json"
SCHEMA = "carbon.demo/v1"


def fail(message: str) -> None:
    raise ValueError(message)


def read_manifest() -> dict[str, Any]:
    try:
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValueError(f"CARBON demo fixture manifest is unavailable: {error}") from error
    if manifest.get("schema") != "carbon.demo-fixtures/v1":
        fail("CARBON demo fixture manifest has an unsupported schema.")
    fixtures = manifest.get("fixtures")
    if not isinstance(fixtures, list) or not fixtures:
        fail("CARBON demo fixture manifest contains no fixtures.")
    return manifest


def safe_fixture(manifest: dict[str, Any], fixture_id: str | None) -> dict[str, Any]:
    requested = fixture_id or str(manifest.get("defaultFixture") or "")
    for fixture in manifest["fixtures"]:
        if fixture.get("id") == requested:
            source = (FIXTURE_ROOT / requested).resolve()
            if not source.is_dir() or FIXTURE_ROOT.resolve() not in source.parents:
                fail(f"Bundled CARBON demo fixture is unavailable: {requested}")
            return fixture
    available = ", ".join(str(item.get("id")) for item in manifest["fixtures"])
    fail(f"Unknown CARBON demo fixture '{requested}'. Available: {available}.")


def output_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    start = fixture.get("start") if isinstance(fixture.get("start"), dict) else {}
    return {
        "id": fixture.get("id"),
        "label": fixture.get("label"),
        "description": fixture.get("description"),
        "kind": fixture.get("kind"),
        "complexity": fixture.get("complexity"),
        "default": bool(fixture.get("default")),
        "start": {"command": start.get("command", ""), "url": start.get("url", "")},
        "testSummary": fixture.get("testSummary", ""),
        "profiles": ["without-existing-tests", "with-existing-tests"],
    }


def cmd_list(_: argparse.Namespace) -> dict[str, Any]:
    manifest = read_manifest()
    return {
        "schema": SCHEMA,
        "action": "list",
        "defaultFixture": manifest.get("defaultFixture"),
        "fixtures": [output_fixture(item) for item in manifest["fixtures"]],
        "testProfiles": manifest.get("testProfiles", []),
        "boundary": "Fixtures are bundled templates. Listing does not create a copy or execute a test.",
    }


def default_destination(root: Path, fixture_id: str) -> Path:
    stem = f"carbon-demo-{fixture_id}"
    candidate = root / stem
    if not candidate.exists():
        return candidate
    suffix = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    return root / f"{stem}-{suffix}"


def ensure_destination(root: Path, requested: str | None, fixture_id: str) -> Path:
    if not root.is_dir():
        fail("root must be an existing directory where CARBON can create a disposable demo copy.")
    destination = Path(requested).expanduser() if requested else default_destination(root, fixture_id)
    if not destination.is_absolute():
        destination = root / destination
    destination = destination.resolve()
    if destination == root or root not in destination.parents:
        fail("destination must be a new subdirectory of root; CARBON will not write a demo outside the selected workspace.")
    if destination.exists():
        fail(f"destination already exists: {destination}. Choose a new empty path; CARBON never overwrites a demo or project.")
    return destination


def remove_test_paths(destination: Path, test_paths: Any) -> list[str]:
    removed: list[str] = []
    for raw in test_paths if isinstance(test_paths, list) else []:
        relative = Path(str(raw))
        if relative.is_absolute() or ".." in relative.parts:
            fail("CARBON demo fixture manifest has an unsafe test path.")
        target = (destination / relative).resolve()
        if destination not in target.parents:
            fail("CARBON demo fixture test path escaped its destination.")
        if target.is_dir():
            shutil.rmtree(target)
            removed.append(relative.as_posix())
        elif target.is_file():
            target.unlink()
            removed.append(relative.as_posix())
    return removed


def cmd_create(args: argparse.Namespace) -> dict[str, Any]:
    manifest = read_manifest()
    fixture = safe_fixture(manifest, args.fixture)
    profile = args.test_profile or "without-existing-tests"
    if profile not in {"without-existing-tests", "with-existing-tests"}:
        fail("test_profile must be without-existing-tests or with-existing-tests.")
    root = Path(args.root).expanduser().resolve()
    destination = ensure_destination(root, args.destination, str(fixture["id"]))
    source = (FIXTURE_ROOT / str(fixture["id"])).resolve()
    shutil.copytree(source, destination, symlinks=False)
    removed_paths: list[str] = []
    try:
        if profile == "without-existing-tests":
            removed_paths = remove_test_paths(destination, fixture.get("testPaths"))
        descriptor = {
            "schema": SCHEMA,
            "fixture": output_fixture(fixture),
            "testProfile": profile,
            "createdAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
            "source": "Bundled CARBON demo fixture",
            "boundary": "This is a disposable copy. CARBON did not modify the bundled fixture or an existing project.",
        }
        (destination / ".carbon-demo.json").write_text(json.dumps(descriptor, indent=2) + "\n", encoding="utf-8")
    except Exception:
        shutil.rmtree(destination, ignore_errors=True)
        raise
    start = fixture.get("start") if isinstance(fixture.get("start"), dict) else {}
    return {
        "schema": SCHEMA,
        "action": "create",
        "fixture": output_fixture(fixture),
        "testProfile": profile,
        "root": str(root),
        "destination": str(destination),
        "descriptorPath": str(destination / ".carbon-demo.json"),
        "removedTestPaths": removed_paths,
        "start": {"command": start.get("command", ""), "url": start.get("url", "")},
        "next": {
            "carbon": f"/carbon {destination}",
            "withExistingTests": profile == "with-existing-tests",
            "recommendedScope": "Run CARBON First Look against this disposable demo copy."
        },
        "boundary": "The copy is new and isolated. No fixture source, existing project, credential, cloud service, or browser session was changed.",
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="action", required=True)
    subparsers.add_parser("list", help="List bundled demo fixtures and profiles.")
    create = subparsers.add_parser("create", help="Create one disposable demo project copy.")
    create.add_argument("--root", required=True, help="Existing workspace directory that receives the new demo folder.")
    create.add_argument("--fixture", help="Fixture id. Defaults to web-static.")
    create.add_argument("--test-profile", choices=["without-existing-tests", "with-existing-tests"], default="without-existing-tests")
    create.add_argument("--destination", help="New subdirectory relative to root or absolute under root. Must not exist.")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        result = cmd_list(args) if args.action == "list" else cmd_create(args)
    except ValueError as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
