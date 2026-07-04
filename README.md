# { ipechman } — personal portfolio

Minimal, terminal-flavoured portfolio built from scratch with vanilla HTML, CSS, and JavaScript. Live at [ipechman.github.io](https://ipechman.github.io).

## Run locally

The photo gallery loads `images/carousel/manifest.json` via `fetch`, so serve the folder over HTTP (opening `index.html` directly still works — it falls back to a built-in image list):

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Adding photos to the gallery

1. Drop images (`.webp`, `.jpg`, `.png`, …) into `images/carousel/`.
2. Run `python tools/generate_manifest.py`.
3. Done — the carousel orders them by file name (natural sort) and uses alt text derived from the file name. Edit `images/carousel/manifest.json` to refine alt text; it is preserved on regeneration.

Tip: keep images ≤ ~1600px wide / ~400KB for fast loads.

## Themes

The paint-roller button in the nav cycles themes: **night** (gold), **matrix** (green), **nebula** (violet), **paper** (light). The choice persists in `localStorage`.

## Resume

`resume.tex` is the LaTeX source; `Ilan_Pechman_Resume.pdf` is the compiled output:

```bash
pdflatex resume.tex
```

## Deploying

Double-click `deploy.bat` (or run it from a terminal). Every run it regenerates the carousel manifest, rebuilds the resume PDF, commits, and pushes to GitHub Pages. On first run it also creates the `ipechman.github.io` repo and enables Pages — it needs git and the GitHub CLI (`winget install Git.Git GitHub.cli`).

## Structure

```
index.html            main page
deploy.bat            one-click build + push to GitHub Pages
404.html              GitHub Pages not-found page
favicon.svg
css/style.css         styles + all theme variables
js/                   intro, age counter, slider, lightbox, nav, themes, extras
images/carousel/      gallery photos + manifest.json
tools/                generate_manifest.py
```

P.S. — try the Konami code.
