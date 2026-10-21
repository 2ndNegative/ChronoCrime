@echo off
rem Commits everything in this folder and pushes it to GitHub.
rem Pushing to main also deploys the game to GitHub Pages through GitHub Actions.
setlocal
cd /d "%~dp0"
set "REMOTE=https://github.com/2ndNegative/ChronoCrime.git"

where git >nul 2>nul
if errorlevel 1 (
  echo Git is not installed. Install it from https://git-scm.com/download/win and run this file again.
  pause
  exit /b 1
)

if not exist .git (
  echo Setting up the local repository...
  git init -b main
  git remote add origin "%REMOTE%"
)

set "GITNAME="
for /f "delims=" %%i in ('git config user.name') do set "GITNAME=%%i"
if not defined GITNAME (
  set /p "GITNAME=Your name for commits: "
  set /p "GITEMAIL=Your email for commits: "
)
if defined GITEMAIL (
  git config --global user.name "%GITNAME%"
  git config --global user.email "%GITEMAIL%"
)

git add -A
set "MSG="
set /p "MSG=Commit message (press Enter for a timestamp): "
if not defined MSG set "MSG=Update %DATE% %TIME%"
git commit -m "%MSG%"

git push -u origin main
if errorlevel 1 (
  echo.
  echo Push failed. If GitHub asked you to sign in, finish that and run this file again.
) else (
  echo.
  echo Pushed. GitHub Pages deploys in a minute or two: https://2ndnegative.github.io/ChronoCrime/
)
pause
