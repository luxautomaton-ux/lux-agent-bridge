@echo off
echo [Lux AI] Stopping server...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8787 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [Lux AI] Server stopped.
pause