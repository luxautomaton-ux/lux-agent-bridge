# Lux Agent Bridge

`lux-agent-bridge` is a local Node.js + Express backend for **Lux Agent Studio**.

It gives your UI safe control over local agent tooling (Lux Agent + OpenManus) without exposing arbitrary shell execution.

This project also includes a built-in starter UI (Mission Control dashboard) at:

- `http://localhost:8787/`

UI routes:

- `http://localhost:8787/` -> Lux marketing landing (reworded Lux positioning)
- `http://localhost:8787/lux-manus.html` -> Lux Manus product page
- `http://localhost:8787/console.html` -> Mission control console

Responsive behavior:

- Desktop: multi-column operational console
- Mobile: bottom-tab navigation (Control, Approvals, Runs, Tools) + swipe left/right to switch tabs

## What this backend does

- Exposes REST APIs for:
  - Health checks
  - Starting Lux Agent / OpenManus
  - Running tasks
  - Reading run logs (JSON + SSE streaming)
  - Approval queue
  - Project registry
  - Playbook registry
  - Emergency stop (approval-protected)
- Uses a strict command whitelist.
- Validates project paths against allowed roots.
- Writes an audit log (`logs/audit.jsonl`) for every sensitive action.
- Stores run logs as JSONL (`runs/<runId>.jsonl`).
- Includes local-private mission control UI with:
  - approval queue
  - run history
  - live terminal logs
  - skills manager
  - media intake (photo/pdf/video/text metadata)
  - snapshot + rollback requests
  - file diff viewer

## Folder structure

```
lux-agent-bridge/
  package.json
  server.js
  .env.example
  README.md
  runs/
  logs/
  projects/
  playbooks/
```

## Install

1. Open terminal in this folder.
2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Edit `.env` values:
   - `OPENMANUS_DIR` (required for OpenManus endpoints)
   - `CORS_ORIGINS` (localhost frontend URLS)
   - `ALLOWED_PROJECT_ROOTS`
   - `LUX_API_TOKEN` (optional but recommended)
   - `ALLOW_LOCALHOST_ONLY=true` (recommended)

5. Start server:

```bash
npm start
```

Optional relay server (for connecting through a single protected endpoint):

```bash
npm run relay:start
```

Server runs at `http://localhost:8787` by default.

Primary UI routes:

- `http://localhost:8787/` (Lux landing)
- `http://localhost:8787/lux-manus.html` (Lux Manus page)
- `http://localhost:8787/console.html` (full desktop/mobile console)
- `http://localhost:8787/setup.html` (first-run setup wizard)

## API endpoints

### 1) Health
- `GET /api/health`

### 2) Start Lux Agent
- `POST /api/agents/luxagent/start`
- Runs only: `luxagent agent`

### 3) Start OpenManus
- `POST /api/agents/openmanus/start`
- Runs only: `python main.py` in `OPENMANUS_DIR`

### 4) Start OpenManus Flow
- `POST /api/agents/openmanus/flow`
- Runs only: `python run_flow.py` in `OPENMANUS_DIR`

### 5) Run task
- `POST /api/tasks/run`
- Body:

```json
{
  "agent": "luxagent",
  "projectPath": "/absolute/path/to/project",
  "instruction": "Fix dashboard route guards",
  "mode": "assisted"
}
```

### 6) Logs
- `GET /api/runs/:runId/logs` (JSON)
- `GET /api/runs/:runId/logs?stream=true` (SSE)

### 7) Approvals
- `GET /api/approvals`
- `POST /api/approvals/:id/approve`
- `POST /api/approvals/:id/reject`
- `POST /api/approvals/:id/execute` (executes approved operational actions like emergency stop)

### 8) Projects
- `GET /api/projects`
- `POST /api/projects`
- `DELETE /api/projects/:id` (creates approval request)

### 9) Playbooks
- `GET /api/playbooks`
- `POST /api/playbooks/:id/run` (approval required)

### 10) Emergency stop
- `POST /api/emergency-stop` (approval required)

### Additional helper endpoints
- `GET /api/runs` (run history)
- `GET /api/skills`
- `POST /api/skills`
- `DELETE /api/skills/:id`
- `POST /api/mission/plan` (LANA-style mission planning)
- `POST /api/risk/score`
- `POST /api/media/analyze`
- `GET /api/media`
- `POST /api/snapshots/create`
- `GET /api/snapshots`
- `POST /api/snapshots/:id/rollback`
- `POST /api/diff`
- `GET /api/setup/check`
- `POST /api/setup/apply`
- `POST /api/setup/restart`
- `GET /api/stats`
- `POST /api/stats`

### Skills + MCP endpoints
- `POST /api/skills/bootstrap` (install default skills + MCP catalog)
- `GET /api/mcps`
- `POST /api/mcps`
- `POST /api/mcps/:id/toggle`
- `POST /api/mcps/:id/test`
- `GET /api/mcps/health`
- `GET /api/credentials/check`

### Capability Studio endpoints
- `GET /api/capabilities`
- `POST /api/capabilities`
- `DELETE /api/capabilities/:id`
- `POST /api/capabilities/:id/run`

### Enterprise controls endpoints
- `GET /api/enterprise/settings`
- `POST /api/enterprise/settings`
- `POST /api/enterprise/business-mode`

### Audit + backup endpoints
- `GET /api/audit`
- `GET /api/backups`
- `POST /api/backups/create`
- `POST /api/backups/import`
- `GET /api/backups/:name`
- `POST /api/backups/:name/restore`

## Security model

- No generic shell endpoint exists.
- Only whitelisted command paths are used:
  - `luxagent agent`
  - `python main.py`
  - `python run_flow.py`
- Project paths are validated against `ALLOWED_PROJECT_ROOTS`.
- High-risk actions require approval before execution.
- All command starts/stops and approvals are audit logged.
- Optional API token auth via `x-lux-token` header.
- Optional localhost-only guard for strict local/private mode.

## Media support notes

This bridge is intentionally lightweight and local-first:

- It ingests local file metadata for images, PDFs, videos, and text files.
- Text files get a preview snippet for chat/task context.
- For deep OCR, PDF parsing, or video frame analysis, connect your OpenManus
  and model pipelines to consume the ingested file paths and metadata.

## Snapshot and rollback notes

- Snapshots copy a full project directory into `logs/snapshots/<snapshotId>/`.
- Rollback is approval-protected and executed only after approval + execute.
- Use this with your approval queue for safer autonomous edits.

## USB portability plan

To move this to a USB and run on any machine:

1. Copy this entire folder to USB.
2. On destination machine:
   - Install Node.js 18+
   - Run `npm install`
   - Copy `.env.example` to `.env` and update local paths
3. Start with `npm start`.

For one-click startup, you can add small launch scripts:
- macOS/Linux: `start.sh`
- Windows: `start.bat`

This project already includes both launcher scripts.

### Quick launch

- macOS/Linux:

```bash
./start.sh
```

- Windows:

```bat
start.bat
```

The script will:
- ensure `.env` exists (copies from `.env.example` if missing)
- install dependencies if `node_modules` is missing
- start Lux Agent Bridge

Stop scripts included:

- macOS/Linux: `./stop.sh`
- Windows: `stop.bat`

## USB Deployment Kit

This repository is ready to copy to USB as a portable deployment kit.

Included environment templates:

- `.env.private.example` -> strict localhost-only mode
- `.env.lan.example` -> same-Wi-Fi phone/tablet access mode

Suggested setup on a new machine:

1. Install Node.js 18+
2. Copy folder from USB
3. Choose template:
   - strict local: copy `.env.private.example` to `.env`
   - LAN mobile: copy `.env.lan.example` to `.env` and update LAN IP in `CORS_ORIGINS`
4. Run start script:
   - macOS/Linux: `./start.sh`
   - Windows: `start.bat`

## LAN Access For Mobile

If you want phone access from the same network (still private to your LAN):

1. Use `.env.lan.example` as your `.env`
2. Set `ALLOW_LOCALHOST_ONLY=false`
3. Keep `LUX_API_TOKEN` set (required)
4. Add your machine LAN origin in `CORS_ORIGINS`, e.g. `http://192.168.1.40:8787`
5. Open `http://<your-lan-ip>:8787/console.html` on your phone browser

Security note: never expose this directly to public internet without a secure reverse proxy and authentication hardening.

## Relay Server

`relay-server.js` provides a lightweight HTTP relay that forwards requests to Lux Agent Bridge.

- Health: `GET /relay/health`
- Forwarding: `/relay/*` -> `${BRIDGE_BASE_URL}/*`
- Supports JSON, raw bodies, and streamed responses (including SSE log streams).

Recommended relay auth:

1. Set `RELAY_KEY` in `.env`
2. Send `x-relay-key: <your-key>` from client

Example:

```bash
curl -H "x-relay-key: YOUR_KEY" "http://localhost:9797/relay/api/health"
```

Additional relay protections:

- `RELAY_ALLOWLIST`: comma-separated IP allowlist (empty = allow all)
- `RELAY_RATE_LIMIT_WINDOW_MS`: rate-limit window in milliseconds
- `RELAY_RATE_LIMIT_MAX`: max requests per IP per window

Relay audit events are posted into Lux audit logs via:

- `POST /api/audit-relay`

## Next best step (for your Antigravity-style UX)

Connect this backend to your Lux UI screens in this order:

1. Agent Console: bind Start/Stop + live log stream (SSE)
2. Approvals view: queue + approve/reject/execute buttons
3. Projects screen: load/save project registry
4. Playbooks: list + run request flow
5. Mission Control: `/api/tasks/run` with LANA orchestration logic

## Mobile web app support (no app store required)

- Includes `manifest.json` + `service-worker.js` for installable web app behavior.
- On mobile browser, open Lux and choose "Add to Home Screen".
- You get a fast-launch mobile control UI without publishing to Google Play.

---

## Deployment

See [DEPLOY.md](docs/DEPLOY.md) for complete deployment documentation covering:

- **Local Development** - Direct Node.js, PM2, environment config
- **Desktop** - macOS (Launch Agent), Windows (NSSM/Task Scheduler), Linux (systemd/autostart)
- **Server** - Ubuntu, Debian, CentOS, Fedora, Raspberry Pi
- **Docker** - Single container, Docker Compose, GPU support, Podman
- **Reverse Proxy** - Nginx, Caddy, Apache, Traefik
- **System Services** - systemd, launchd, Windows Service
- **Cloud** - Railway, Render, Fly.io, AWS, GCP, Azure, DigitalOcean, Heroku
- **USB Portable** - macOS, Windows auto-launch
- **Remote Access** - Tailscale, ZeroTier, Cloudflare Tunnel, ngrok

### Quick Deploy

```bash
# Two-command install
git clone https://github.com/luxautomaton-ux/lux-agent-bridge.git
cd lux-agent-bridge
bash ./install.sh

# Run
luxagent agent

# Or with PM2 (production)
pm2 start server.js --name lux-agent
pm2 save
```

### Production Checklist

- [ ] Set `LUX_API_TOKEN` in `.env`
- [ ] Use HTTPS via reverse proxy (Nginx/Caddy)
- [ ] Configure firewall: `ufw allow 8787/tcp`
- [ ] Enable regular backups
- [ ] Set up monitoring: `GET /api/health`
- [ ] Choose performance profile (modest/balanced/performance)

### Performance Profiles

| Profile | Use Case | Concurrency |
|---------|-----------|--------------|
| `modest` | RPi, older hardware | 1 task |
| `balanced` | Laptops, mid-range | 2 tasks |
| `performance` | Desktops, servers | 4+ tasks |

```bash
# Apply profile
curl -X POST http://localhost:8787/api/performance/profiles/apply \
  -H "Content-Type: application/json" \
  -d '{"profile":"balanced"}'
```
