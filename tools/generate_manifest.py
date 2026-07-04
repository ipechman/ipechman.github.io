#!/usr/bin/env python3
"""Regenerate images/carousel/manifest.json from the images in images/carousel/.

Usage:  python tools/generate_manifest.py

- Drop images (.webp/.jpg/.jpeg/.png/.avif/.gif) into images/carousel/
- Run this script; the carousel picks them up automatically.
- Images are ordered by file name (natural sort: trail-2 < trail-10).
- Alt text already present in the manifest is preserved; new images get
  alt text derived from the file name (edit manifest.json to refine it).
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CAROUSEL = ROOT / "images" / "carousel"
MANIFEST = CAROUSEL / "manifest.json"
EXTENSIONS = {".webp", ".jpg", ".jpeg", ".png", ".avif", ".gif"}


def natural_key(name: str):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", name)]


def default_alt(name: str) -> str:
    stem = Path(name).stem.replace("-", " ").replace("_", " ").strip()
    return f"Astrophotography: {stem}"


def main():
    old_alts = {}
    if MANIFEST.exists():
        try:
            for entry in json.loads(MANIFEST.read_text(encoding="utf-8")).get("images", []):
                old_alts[entry["src"]] = entry.get("alt", "")
        except (json.JSONDecodeError, KeyError):
            pass

    files = sorted(
        (p.name for p in CAROUSEL.iterdir() if p.suffix.lower() in EXTENSIONS),
        key=natural_key,
    )
    images = [{"src": f, "alt": old_alts.get(f) or default_alt(f)} for f in files]

    MANIFEST.write_text(
        json.dumps({"images": images}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {MANIFEST.relative_to(ROOT)} with {len(images)} image(s):")
    for img in images:
        print(f"  - {img['src']}")


if __name__ == "__main__":
    main()
