$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootDir

Write-Host "[Lux] Installing dependencies..."
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js 18+ is required."
}

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "[Lux] Created .env from template."
}

npm install

$BinDir = Join-Path $HOME "bin"
if (-not (Test-Path $BinDir)) {
  New-Item -ItemType Directory -Path $BinDir | Out-Null
}

$ShimPath = Join-Path $BinDir "luxagent.cmd"
@"
@echo off
setlocal
cd /d "$RootDir"
call npm start %*
endlocal
"@ | Set-Content -Path $ShimPath -Encoding ASCII

Write-Host "[Lux] Installed."
Write-Host "[Lux] Start app: npm start"
Write-Host "[Lux] Optional command: luxagent"
Write-Host "[Lux] Add $BinDir to PATH if needed."
