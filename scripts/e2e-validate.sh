#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8787}"
PROJECT_PATH="${PROJECT_PATH:-/Users/asaspade/Desktop/lux-agent-bridge/projects}"

require_code() {
  local method="$1"
  local path="$2"
  local expected="$3"
  local body="${4:-}"
  local code
  if [ -n "$body" ]; then
    code=$(curl -s -o /tmp/lux-e2e-response.json -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$body" "${BASE_URL}${path}")
  else
    code=$(curl -s -o /tmp/lux-e2e-response.json -w "%{http_code}" -X "$method" "${BASE_URL}${path}")
  fi
  echo "$code $method $path"
  if [ "$code" -ne "$expected" ]; then
    echo "Unexpected HTTP $code for $method $path (expected $expected)" >&2
    cat /tmp/lux-e2e-response.json >&2 || true
    exit 1
  fi
}

echo "[e2e] health"
require_code GET /api/health 200

echo "[e2e] load agents"
require_code GET /api/agents 200

echo "[e2e] ensure luxagent enabled"
require_code POST /api/agents/configure 200 '{"agentId":"luxagent","enabled":true}'

echo "[e2e] run luxagent mission"
require_code POST /api/agents/run 200 '{"agentId":"luxagent","task":"Run e2e mission validation","autoFix":true,"maxRetries":2}'

echo "[e2e] run assisted task flow"
require_code POST /api/tasks/run 202 "{\"agent\":\"luxagent\",\"projectPath\":\"${PROJECT_PATH}\",\"instruction\":\"Validate assisted flow\",\"mode\":\"assisted\"}"

echo "[e2e] skills and swarms endpoints"
require_code GET /api/skills 200
require_code GET /api/swarms 200

echo "[e2e] approvals endpoint"
require_code GET /api/approvals 200

echo "[e2e] success"
