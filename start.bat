@echo off
setlocal

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo [Lux Bridge] Starting from: %SCRIPT_DIR%

if not exist ".env" (
  echo [Lux Bridge] .env not found. Creating from .env.example
  copy ".env.example" ".env" > nul
  echo [Lux Bridge] Please review .env values ^(especially OPENMANUS_DIR^).
)

if not exist "node_modules" (
  echo [Lux Bridge] Installing dependencies...
  call npm install
)

echo [Lux Bridge] Launching server on configured PORT...
call npm start

endlocal
