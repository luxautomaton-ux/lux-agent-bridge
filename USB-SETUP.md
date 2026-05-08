# Lux AI - USB Portable Setup Guide

## Quick Start - USB Drive

### Option 1: Auto-Launch (Windows)
1. Copy entire `lux-agent-bridge` folder to USB
2. Double-click `Start-Lux-AI.bat` on the USB

### Option 2: Auto-Launch (Mac)
1. Copy folder to USB
2. Run: `open /Volumes/YOURUSB/lux-agent-bridge/start.sh`

### Option 3: Manual Launch
```bash
cd /Volumes/YOURUSB/lux-agent-bridge
npm start
```

---

## Prerequisites

### Windows
- Node.js (optional - bundled in project for portable use)
- Web browser

### Mac
- Terminal app
- Web browser

---

## Files Included

| File | Purpose |
|------|---------|
| `start.sh` | Mac/Linux launcher |
| `start.bat` | Windows launcher |
| `Stop-Lux-AI.bat` | Windows stop script |
| `Stop-Lux-AI.sh` | Mac/Linux stop script |
| `.env` | Configuration (create from .env.example) |
| `README-APP.md` | Full documentation |

---

## First Run Setup

1. **First launch** will auto-create `.env` from template
2. **Server starts** on `http://localhost:8787`
3. **No internet required** after initial setup

---

## Data Persistence

All data stays on USB in these folders:
- `./playbooks/` - Skills, configurations
- `./logs/` - Audit logs, backups
- `./memory/` - Session memory
- `./tasks/` - Task queue

---

## Stopping the Server

**Windows:**
```
Stop-Lux-AI.bat
```

**Mac/Linux:**
```bash
./Stop-Lux-AI.sh
# OR
lsof -ti:8787 | xargs kill -9
```

---

## Troubleshooting USB

### Windows Defender Blocks
- Click "Allow" when prompted
- Or add folder to exclusions

### Mac Security Blocks
- System Settings → Privacy & Security → Allow "LuxAgentBridge"

### Port Issues
- Edit `.env` and change `PORT=8787` to another port
- Use `Stop-Lux-AI.bat` and restart

---

## Performance Notes

| Hardware | Expected Performance |
|----------|---------------------|
| With Ollama (GPU) | Fast local inference |
| With Ollama (CPU) | Moderate |
| Cloud providers | Requires API keys |
| Mock mode | Instant (demo only) |

---

## Configuration

Edit `.env` to customize:

```env
# Server port
PORT=8787

# Security - restrict to localhost only
ALLOW_LOCALHOST_ONLY=true

# Require approval for autonomous actions
REQUIRE_APPROVAL_AUTONOMOUS=true

# Ollama local model URL
LOCAL_MODEL_HEALTH_URL=http://127.0.0.1:11434/api/tags
```

---

## Access Points (when running)

| URL | Description |
|-----|-------------|
| `http://localhost:8787/` | Landing page |
| `http://localhost:8787/lux-ai-hub.html` | All-in-One Hub |
| `http://localhost:8787/workspace.html` | Main workspace |
| `http://localhost:8787/dashboard.html` | Enterprise dashboard |
| `http://localhost:8787/control-chat.html` | Chat interface |
| `http://localhost:8787/api/health` | Health check |

---

## Portable Mode - No Installation Required

The app is designed to run from USB without installation:
- ✅ No registry entries
- ✅ No system modifications
- ✅ All data on USB
- ✅ Works on any Windows/Mac/Linux machine

---

## Support

For issues, check:
1. `README-APP.md` - Full documentation
2. `logs/audit.jsonl` - System logs
3. `api/health` endpoint - Server status