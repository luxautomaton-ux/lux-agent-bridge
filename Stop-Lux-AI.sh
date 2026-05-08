#!/usr/bin/env bash

echo "[Lux AI] Stopping server..."

# Kill node processes on port 8787
if lsof -ti:8787 > /dev/null 2>&1; then
    lsof -ti:8787 | xargs kill -9
    echo "[Lux AI] Server stopped."
else
    echo "[Lux AI] No server running on port 8787."
fi