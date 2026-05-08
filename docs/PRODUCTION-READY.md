# Lux AI Studio Production Readiness

## One-command install

### macOS / Linux

```bash
bash ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

## Start

```bash
npm start
```

Optional command shim (created by installer):

```bash
luxagent agent
```

## Production checklist

- [ ] Set `LUX_API_TOKEN` in `.env`
- [ ] Keep `ALLOW_LOCALHOST_ONLY=true` unless using secure proxy/VPN
- [ ] Set `OPENMANUS_DIR` to a valid path when using OpenManus flows
- [ ] Set `ALLOWED_PROJECT_ROOTS` to your project directories
- [ ] Enable regular backups from `Tools -> Backup/Restore`
- [ ] Run smoke test before each release

## Smoke test

```bash
bash ./scripts/smoke-test.sh
```

## End-to-end validation

```bash
bash ./scripts/e2e-validate.sh
```

## Deployment templates

Use these production templates in `deploy/`:

- `deploy/Caddyfile`
- `deploy/nginx.conf`
- `deploy/lux-agent-bridge.service` (systemd)
- `deploy/com.lux.agent.bridge.plist` (launchd)
- `deploy/windows-service.md`

Update hostnames and paths before use.

## Performance profiles

API support:

- `GET /api/performance/profiles`
- `POST /api/performance/profiles/apply`

Profiles:

- `modest` -> single run, assisted default
- `balanced` -> two concurrent runs, assisted default
- `performance` -> up to four concurrent runs, autonomous default

## Mobile access before native app

Recommended order:

1. Use secure private network (Tailscale/ZeroTier)
2. Run Lux on a host machine (Mac mini/laptop/desktop)
3. Open browser from mobile/tablet to host URL
4. Keep approvals enabled for high-risk actions

## Device tuning profile

- Modest hardware: lower task concurrency, assisted mode
- Mid hardware: balanced profile, assisted/autonomous mix
- High hardware: autonomous tasks with approval gates

## Release gate

Do not ship until these pass:

1. All core pages return HTTP 200
2. `GET /api/health` reports `online: true`
3. `POST /api/agents/luxagent/start` returns 202
4. Skills page can read status/configure/start without error
5. Approvals queue can create and approve a task
