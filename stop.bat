@echo off
setlocal

set PORT_VALUE=%PORT%
if "%PORT_VALUE%"=="" set PORT_VALUE=8787

echo [Lux Bridge] Attempting stop on port %PORT_VALUE%

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT_VALUE% ^| findstr LISTENING') do (
  echo [Lux Bridge] Stopping PID %%a
  taskkill /PID %%a /F >nul 2>&1
)

echo [Lux Bridge] Stop command finished
endlocal
