#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[gate] 1/5 smoke test"
bash ./scripts/smoke-test.sh

echo "[gate] 2/5 e2e validation"
bash ./scripts/e2e-validate.sh

echo "[gate] 3/5 deploy artifacts"
required=(
  "deploy/Caddyfile"
  "deploy/nginx.conf"
  "deploy/lux-agent-bridge.service"
  "deploy/com.lux.agent.bridge.plist"
  "deploy/windows-service.md"
)
for f in "${required[@]}"; do
  test -f "$f" || { echo "Missing $f" >&2; exit 1; }
done

echo "[gate] 4/5 install artifacts"
test -x "install.sh" || { echo "install.sh not executable" >&2; exit 1; }
test -f "install.ps1" || { echo "install.ps1 missing" >&2; exit 1; }

echo "[gate] 5/5 critical API checks"
for e in /api/health /api/agents /api/skills /api/swarms /api/performance/profiles /api/openmanus/status /api/lux-agent/status; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8787$e")
  echo "$code $e"
  test "$code" -eq 200 || { echo "API gate failed on $e" >&2; exit 1; }
done

echo "[gate] PASS"
