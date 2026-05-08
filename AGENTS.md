# AGENTS.md — Lux AI Studio Agent Instructions

## Product

Lux AI Studio is a private, local-first AI agent command center by Lux Automaton.

It runs through the Lux Agent Bridge backend and provides a no-terminal interface for managing agents, missions, approvals, memory, playbooks, logs, backups, deployment workflows, and local/private AI automation.

Current release:
- Version: v1.0.0-rc1
- Release type: Production Release Candidate
- Release Gate: PASS
- Stable target: v1.0.0

## Critical Rule

Do not add new features before v1.0.0 stable.

Only fix fresh-machine install issues, test failures, broken links, runtime errors, branding mismatches, missing docs, or release blockers.

## Brand Rules

User-facing product name:
- Lux AI Studio

Backend/runtime name:
- Lux Agent Bridge

CLI command:
- luxagent

Approved user-facing agent names:
- Lux Agent
- LANA
- Andre
- Hermes
- Builder Agent
- Automation Agent
- Security Guard
- Memory Core

Avoid user-facing old naming unless clearly labeled as internal engine/provider compatibility:
- OpenMono
- OpenClaw
- OpenClaude
- Manus
- StartupHakk

Do not remove compatibility endpoints unless tests confirm replacement routes work.

## Release Discipline

This repo is currently in release-candidate mode.

Before making changes:
1. Identify the failing test, broken flow, or release blocker.
2. Make the smallest safe fix.
3. Do not refactor large areas unless required.
4. Do not change version numbers unless explicitly asked.
5. Do not add fake/demo data.
6. Do not make production claims unless release-gate passes.

## Definition of Done

A change is complete only when:
- Relevant page loads successfully.
- Relevant API returns expected response.
- No console-breaking JavaScript errors are introduced.
- No fake/simulated production behavior is added.
- Branding remains Lux-first.
- Release gate still passes.

Run:
```bash
bash ./scripts/release-gate.sh
```

On Windows, run:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\release-gate.ps1
```

If the PowerShell release gate file does not exist, create it before marking Windows support complete.

## Fresh Machine Test Scope

Before tagging v1.0.0 stable, validate on fresh macOS and Windows machines.

Required checks:
- Fresh clone works
- install.sh / install.ps1 completes
- luxagent command available
- luxagent doctor passes
- luxagent agent starts server
- localhost:8787 opens
- release-gate passes
- Command Center loads
- Chat runs real backend action
- Skills load
- Approvals page loads
- Backup works
- Emergency Stop responds
- Docs open
- No old version mismatch
- No demo/fake production data

## Local Commands

Install on macOS/Linux:
```bash
bash ./install.sh
```

Install on Windows:
```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

Run:
```bash
luxagent agent
```

Alternative run:
```bash
npm start
```

Doctor check:
```bash
luxagent doctor
```

Release gate:
```bash
bash ./scripts/release-gate.sh
```

Open app:
```
http://localhost:8787
```

## Stable Tag Rule

Do not create the stable tag until both fresh Mac and fresh Windows tests pass.

Stable tag command:
```bash
git tag -a v1.0.0 -m "Lux AI Studio v1.0.0 — Stable Local Production Release"
git push origin v1.0.0
```

Stable release title:
Lux AI Studio v1.0.0 — Stable Local Production Release

## Security Rules

Default security posture:
- Localhost-only by default
- Private network deployment allowed
- Internet exposure requires hardening

For internet exposure, require:
- TLS
- Authentication
- Rate limiting
- Hardened reverse proxy
- Monitoring
- Secure secrets
- Restricted CORS
- Audit logs
- Backup strategy

Do not expose arbitrary shell execution.
Do not allow unsafe file path traversal.
Do not allow destructive actions without approval.
Emergency Stop must remain functional.

## Data Rules

No fake production data.

Do not seed:
- Fake swarms
- Fake runs
- Fake approvals
- Fake backups
- Fake logs
- Fake deployments
- Fake users
- Fake production metrics

Use honest empty states:
- "No missions have been run yet."
- "No approvals are pending."
- "No swarms have been created yet."
- "No backups have been created yet."
- "No logs found for this run."

## UI Rules

Core pages must stay working:
- /
- /lux-command-center.html
- /control-chat.html
- /tools-skills.html
- /control-approvals.html
- /control-runs.html
- /docs/GUIDE.html
- /docs/WHITEPAPER.html
- /status.html

Landing pages should not show the full internal app sidebar unless intentionally designed.
Core app pages should use shared navigation.

Buttons must do real work or clearly show an honest disabled state.
Do not use alert-only behavior as the final action for production controls.
Do not use setTimeout to fake successful work.

## API Rules

Protect compatibility while moving Lux-first.

Important routes:
- GET /api/health
- GET /api/agents
- GET /api/skills
- GET /api/runs
- GET /api/lux-agent/status
- GET /api/openmanus/status
- POST /api/agents/luxagent/start
- POST /api/tasks/run
- POST /api/agents/run
- POST /api/emergency-stop
- GET /api/performance/profiles
- POST /api/performance/profiles/apply

If adding or changing endpoints, update:
- docs/API.md
- smoke test
- e2e validation
- release gate

## Documentation Rules

Docs must be honest.

Preferred wording:
Production Release Candidate

Use this until stable tests pass on fresh machines.

Allowed production claim:
Production-ready for local use, client demos, private network deployment, and USB portable workflows.

Internet exposure wording:
Internet-exposed production requires TLS, authentication, rate limiting, hardened reverse proxy configuration, and monitoring.

## Agent Behavior

When working in this repo, act like a release engineer.

Priorities:
- Keep release gate green.
- Preserve version consistency.
- Fix blockers only.
- Avoid new features before v1.0.0.
- Keep Lux branding clean.
- Keep installer and CLI flows simple.
- Keep docs aligned with actual behavior.
- Report uncertainty honestly.

## Final Output Format For Agent Work

When finished, report:
- Files changed
- What was fixed
- Commands run
- Test results
- Remaining issues
- Whether release gate passed
- Whether this affects v1.0.0 stable readiness

Then run:
```bash
git add AGENTS.md
git commit -m "Add AGENTS.md release instructions for Lux AI Studio"
```