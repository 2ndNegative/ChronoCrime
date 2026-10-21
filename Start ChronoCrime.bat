@echo off
rem One-click launcher for ChronoCrime. Starts the local dev server and opens the game in your browser.
rem Close this window to stop the game.
cd /d "%~dp0"

where node >/dev/null 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the LTS version from https://nodejs.org and run this file again.
  pause
  exit /b 1
)
node -e "process.exit(+process.versions.node.split(\".\")[0] >= 20 ? 0 : 1)"
if errorlevel 1 (
  echo Node.js 20 or newer is needed. Install the current LTS version from https://nodejs.org.
  pause
  exit /b 1
)

if not exist node_modules (
  echo First launch: installing dependencies. This takes a minute.
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)

call npm run dev -- --open
pause
