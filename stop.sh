#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

PORT_VALUE="${PORT:-}"
if [ -z "$PORT_VALUE" ] && [ -f ".env" ]; then
  PORT_VALUE="$(grep -E '^PORT=' .env | cut -d'=' -f2- | tr -d '[:space:]' || true)"
fi
if [ -z "$PORT_VALUE" ]; then
  PORT_VALUE="8787"
fi

echo "[Lux Bridge] Attempting graceful stop on port $PORT_VALUE"

PIDS="$(lsof -ti tcp:"$PORT_VALUE" || true)"
if [ -z "$PIDS" ]; then
  echo "[Lux Bridge] No process found on port $PORT_VALUE"
  exit 0
fi

for pid in $PIDS; do
  kill -TERM "$pid" || true
done

sleep 1

REMAINING="$(lsof -ti tcp:"$PORT_VALUE" || true)"
if [ -n "$REMAINING" ]; then
  echo "[Lux Bridge] Some processes still running. Sending SIGKILL..."
  for pid in $REMAINING; do
    kill -KILL "$pid" || true
  done
fi

echo "[Lux Bridge] Stopped"
