#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8787}"

echo "[smoke] checking core pages"
pages=(
  "/"
  "/control-chat.html"
  "/lux-command-center.html"
  "/lux-agent-console.html"
  "/lux-ai-native.html"
  "/super-agent.html"
  "/security-guard.html"
  "/lux-agent.html"
  "/tools-skills.html"
)

for p in "${pages[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${p}")
  echo "${code} ${p}"
  if [ "$code" -ne 200 ]; then
    echo "[smoke] failed page check: ${p}" >&2
    exit 1
  fi
done

echo "[smoke] checking core APIs"
apis=(
  "/api/health"
  "/api/agents"
  "/api/skills"
  "/api/runs"
  "/api/lux-agent/status"
)

for a in "${apis[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${a}")
  echo "${code} ${a}"
  if [ "$code" -ne 200 ]; then
    echo "[smoke] failed api check: ${a}" >&2
    exit 1
  fi
done

echo "[smoke] done"
