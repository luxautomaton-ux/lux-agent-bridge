@echo off
setlocal

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%lux-agent-bridge"

echo ========================================
echo   Lux AI - Unified Agent Platform
echo ========================================
echo.

if not exist ".env" (
    echo [Lux AI] Creating configuration...
    copy ".env.example" ".env" > nul
)

if not exist "node_modules" (
    echo [Lux AI] Installing dependencies...
    call npm install
)

echo.
echo [Lux AI] Starting server on http://localhost:8787
echo [Lux AI] Press Ctrl+C to stop
echo.

start http://localhost:8787
call npm start

endlocal