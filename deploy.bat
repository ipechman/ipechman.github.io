@echo off
:: ============================================================
::  { ipechman } portfolio — one-click deploy to GitHub Pages
::
::  Every run:
::    1. regenerates the carousel manifest from images/carousel/
::    2. rebuilds the resume PDF from resume.tex (if pdflatex exists)
::    3. commits and pushes to github.com/<you>/ipechman.github.io
::  First run only:
::    - initializes git, logs into GitHub CLI, creates the repo,
::      and enables GitHub Pages.
::
::  Requirements: git + GitHub CLI (winget install Git.Git GitHub.cli)
::  Optional:     Python (manifest), MiKTeX/pdflatex (resume)
:: ============================================================
setlocal
cd /d "%~dp0"
set REPO=ipechman.github.io

echo.
echo === deploying { ipechman } portfolio ===
echo.

:: ---------- prerequisites ----------
where git >nul 2>nul
if errorlevel 1 (
    echo [ERROR] git not found. Install it with:  winget install Git.Git
    goto :fail
)
where gh >nul 2>nul
if errorlevel 1 (
    echo [ERROR] GitHub CLI not found. Install it with:  winget install GitHub.cli
    goto :fail
)

:: ---------- 1. regenerate carousel manifest ----------
set "PYCMD="
where py >nul 2>nul && set "PYCMD=py -3"
if not defined PYCMD where python >nul 2>nul && set "PYCMD=python"
if defined PYCMD (
    %PYCMD% tools\generate_manifest.py
    if errorlevel 1 (echo [WARN] manifest generation failed - continuing) else (echo [OK] carousel manifest updated)
) else (
    echo [WARN] Python not found - skipping carousel manifest update.
)

:: ---------- 2. rebuild resume PDF ----------
where pdflatex >nul 2>nul
if errorlevel 1 (
    echo [WARN] pdflatex not found - keeping existing resume PDF.
    goto :git
)
echo [..] compiling resume.tex ...
pdflatex -interaction=nonstopmode -halt-on-error resume.tex >nul 2>nul
if exist resume.pdf (
    copy /y resume.pdf Ilan_Pechman_Resume.pdf >nul
    del /q resume.pdf resume.aux resume.log resume.out 2>nul
    echo [OK] resume rebuilt from resume.tex
) else (
    echo [WARN] pdflatex failed - keeping existing resume PDF. Check resume.log.
)

:git
:: ---------- 3. git repo / auth / remote ----------
if not exist ".git" (
    echo [..] initializing git repository ...
    git init -b main >nul || goto :fail
)

gh auth status >nul 2>nul
if errorlevel 1 (
    echo [..] not logged into GitHub - opening login flow ...
    gh auth login || goto :fail
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
    echo [..] creating GitHub repository %REPO% ...
    gh repo create %REPO% --public --source=. --remote=origin
    if errorlevel 1 (
        echo [ERROR] could not create repo. If it already exists, run:
        echo         git remote add origin https://github.com/YOUR_USER/%REPO%.git
        goto :fail
    )
)

:: ---------- 4. commit and push ----------
git add -A
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "deploy: %date% %time%" >nul || goto :fail
    echo [OK] changes committed
) else (
    echo [OK] no changes to commit
)
echo [..] pushing to GitHub ...
git push -u origin main || goto :fail

:: ---------- 5. make sure GitHub Pages is on (no-op if already enabled) ----------
gh api "repos/{owner}/{repo}/pages" --method POST -f "source[branch]=main" -f "source[path]=/" >nul 2>nul

echo.
echo === done! site will be live in ~1 minute at: ===
echo     https://%REPO%
echo.
pause
exit /b 0

:fail
echo.
echo === deploy failed - see message above ===
pause
exit /b 1
