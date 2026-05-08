# Lux Agent Bridge - Release Gate (PowerShell)
# Run this after install.ps1 to validate the installation

$ErrorActionPreference = "Stop"

function Write-Gate($message) {
    Write-Host "[gate] $message" -ForegroundColor Cyan
}

function Write-Pass($message) {
    Write-Host "[pass] $message" -ForegroundColor Green
}

function Write-Fail($message) {
    Write-Host "[fail] $message" -ForegroundColor Red
}

$baseUrl = "http://localhost:8787"
$passed = 0
$failed = 0

Write-Gate "Starting release gate validation..."

# Test 1: Health check
Write-Gate "1/5 Checking health endpoint..."
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET -TimeoutSec 5
    if ($health.online -eq $true) {
        Write-Pass "Health: online"
        $passed++
    } else {
        Write-Fail "Health: not online"
        $failed++
    }
} catch {
    Write-Fail "Health: $($_.Exception.Message)"
    $failed++
}

# Test 2: Agents endpoint
Write-Gate "2/5 Checking agents endpoint..."
try {
    $agents = Invoke-RestMethod -Uri "$baseUrl/api/agents" -Method GET -TimeoutSec 5
    Write-Pass "Agents: $(($agents.agents).Count) loaded"
    $passed++
} catch {
    Write-Fail "Agents: $($_.Exception.Message)"
    $failed++
}

# Test 3: Skills endpoint
Write-Gate "3/5 Checking skills endpoint..."
try {
    $skills = Invoke-RestMethod -Uri "$baseUrl/api/skills" -Method GET -TimeoutSec 5
    Write-Pass "Skills: $(($skills.skills).Count) loaded"
    $passed++
} catch {
    Write-Fail "Skills: $($_.Exception.Message)"
    $failed++
}

# Test 4: Runs endpoint
Write-Gate "4/5 Checking runs endpoint..."
try {
    $runs = Invoke-RestMethod -Uri "$baseUrl/api/runs" -Method GET -TimeoutSec 5
    Write-Pass "Runs: accessible"
    $passed++
} catch {
    Write-Fail "Runs: $($_.Exception.Message)"
    $failed++
}

# Test 5: Lux agent status
Write-Gate "5/5 Checking lux-agent status..."
try {
    $status = Invoke-RestMethod -Uri "$baseUrl/api/lux-agent/status" -Method GET -TimeoutSec 5
    Write-Pass "Lux Agent: status received"
    $passed++
} catch {
    Write-Fail "Lux Agent: $($_.Exception.Message)"
    $failed++
}

# Summary
Write-Host ""
if ($failed -eq 0) {
    Write-Host "======================================" -ForegroundColor Green
    Write-Host "RELEASE GATE: PASS" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Pass "$passed/5 checks passed"
    exit 0
} else {
    Write-Host "======================================" -ForegroundColor Red
    Write-Host "RELEASE GATE: FAIL" -ForegroundColor Red
    Write-Host "======================================" -ForegroundColor Red
    Write-Fail "$failed checks failed"
    exit 1
}