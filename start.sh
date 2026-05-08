#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "[Lux Bridge] Starting from: $SCRIPT_DIR"

if [ ! -f ".env" ]; then
  echo "[Lux Bridge] .env not found. Creating from .env.example"
  cp .env.example .env
  echo "[Lux Bridge] Please review .env values (especially OPENMANUS_DIR)."
fi

if [ ! -d "node_modules" ]; then
  echo "[Lux Bridge] Installing dependencies..."
  npm install
fi

echo "[Lux Bridge] Launching server on configured PORT..."
npm start
