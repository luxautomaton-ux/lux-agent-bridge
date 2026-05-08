# Windows service options

## Option A: Task Scheduler (built-in)

1. Open Task Scheduler -> Create Task.
2. Trigger: At startup.
3. Action: Start a program:
   - Program: `cmd.exe`
   - Args: `/c cd /d C:\path\to\lux-agent-bridge && npm start`
4. Enable "Run whether user is logged on or not".

## Option B: NSSM

```powershell
nssm install LuxAgentBridge "C:\Program Files\nodejs\npm.cmd" "start"
nssm set LuxAgentBridge AppDirectory "C:\path\to\lux-agent-bridge"
nssm start LuxAgentBridge
```
