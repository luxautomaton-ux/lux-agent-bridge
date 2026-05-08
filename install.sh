#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "[Lux] Installing dependencies..."
if ! command -v node >/dev/null 2>&1; then
  echo "[Lux] ERROR: Node.js 18+ is required."
  exit 1
fi

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "[Lux] Created .env from template."
fi

npm install

if [ ! -d "$HOME/.local/bin" ]; then
  mkdir -p "$HOME/.local/bin"
fi

cat > "$HOME/.local/bin/luxagent" <<EOF
#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -gt 0 ] && [ "$1" = "agent" ]; then
  shift
fi

APP_DIR="$ROOT_DIR"
cd "$APP_DIR"
npm start "$@"
EOF

chmod +x "$HOME/.local/bin/luxagent"

echo "[Lux] Installed."
echo "[Lux] Start app: npm start"
echo "[Lux] Optional command: luxagent agent"
echo "[Lux] If luxagent is not found, add ~/.local/bin to PATH"
