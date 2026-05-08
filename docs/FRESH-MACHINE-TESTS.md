# Lux AI Studio v1.0.0-rc1 — Fresh Machine Test Results

## Release
- Version: v1.0.0-rc1
- Release Type: Production Release Candidate
- Release Gate Before Fresh Testing: PASS
- Stable Target: v1.0.0

---

# macOS Fresh Install Test

## Machine Info
- Device: 
- macOS Version: 
- Chip: Apple Silicon / Intel
- Node Version: 
- Git Version: 
- Date Tested: 
- Tester: 

## Commands Run
```bash
git clone https://github.com/luxautomaton-ux/lux-agent-bridge.git
cd lux-agent-bridge
bash ./install.sh
luxagent doctor
luxagent agent
bash ./scripts/release-gate.sh
open http://localhost:8787
```

## Checklist

- [ ] Fresh clone works
- [ ] install.sh completes
- [ ] luxagent command available
- [ ] luxagent doctor passes
- [ ] luxagent agent starts server
- [ ] localhost:8787 opens
- [ ] release-gate passes
- [ ] Command Center loads
- [ ] Chat runs real backend action
- [ ] Skills load
- [ ] Approvals page loads
- [ ] Backup works
- [ ] Emergency Stop responds
- [ ] Docs open
- [ ] No old version mismatch
- [ ] No demo/fake production data

## Result
Status: PASS / FAIL / PARTIAL

Notes:

---

# Windows Fresh Install Test

## Machine Info
- Device: 
- Windows Version: 
- CPU: 
- PowerShell Version: 
- Node Version: 
- Git Version: 
- Date Tested: 
- Tester: 

## Commands Run
```bash
git clone https://github.com/luxautomaton-ux/lux-agent-bridge.git
cd lux-agent-bridge
powershell -ExecutionPolicy Bypass -File .\install.ps1
luxagent doctor
luxagent agent
powershell -ExecutionPolicy Bypass -File .\scripts\release-gate.ps1
start http://localhost:8787
```

## Checklist

- [ ] Fresh clone works
- [ ] install.ps1 completes
- [ ] luxagent command available
- [ ] luxagent doctor passes
- [ ] luxagent agent starts server
- [ ] localhost:8787 opens
- [ ] PowerShell release gate passes
- [ ] Command Center loads
- [ ] Chat runs real backend action
- [ ] Skills load
- [ ] Approvals page loads
- [ ] Backup works
- [ ] Emergency Stop responds
- [ ] Docs open
- [ ] No old version mismatch
- [ ] No demo/fake production data

## Result
Status: PASS / FAIL / PARTIAL

Notes:

---

# Stable Release Decision

Do not tag v1.0.0 unless both macOS and Windows are PASS.

## Final Decision

- [ ] macOS PASS
- [ ] Windows PASS
- [ ] No critical blockers
- [ ] Stable tag approved

## Approved stable tag:
```bash
git tag -a v1.0.0 -m "Lux AI Studio v1.0.0 — Stable Local Production Release"
git push origin v1.0.0
```

Then commit it:
```bash
git add docs/FRESH-MACHINE-TESTS.md
git commit -m "Add fresh machine test checklist for v1.0.0 stable"
git push origin main
```

---

## Important Windows Check

Before the Windows test, make sure this file exists:
`scripts/release-gate.ps1`

If it does not exist, create it before testing Windows.

## Stable Rule

Do not tag stable from your development machine.

Only tag stable after:
1. Fresh Mac PASS
2. Fresh Windows PASS
3. Release gate PASS on both
4. No critical blocker notes

Then you can officially call it:
**Lux AI Studio v1.0.0 — Stable Local Production Release**