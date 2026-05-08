# Lux AI Studio User Guide

Welcome to your private AI operating system.

## Quick Promise

- Unlimited tokens. Forever.
- Your machine. Your agent.
- Local-first, private by default.
- USB-portable, mobile-friendly, and backup-ready.

---

## Agent Lineup (Who does what?)

| Agent | Compared To | What It Does | Why It Is Better Here |
|---|---|---|---|
| ⚡ **Lux AI (Native)** | Cursor + GitHub Copilot | Core coding, app building, debugging, code review | Built into your own stack with local control and approvals |
| 🤖 **Super Agent** | ChatGPT + Manus | Research + automation + deployment + swarm tasks | Combines Hermes + OpenClaw in one easy agent with no context switching |
| 🔮 **Hermes** | Perplexity + Google AI | Deep research, planning, strategy | Can run privately with your project context, not generic web-only context |
| 🦀 **OpenClaw** | Raycast + Zapier | Automation, scripts, CI/CD, deployment workflows | Uses your infra and your rules, not a shared cloud sandbox |
| 💻 **Lux Agent** | Replit + VS Code | Advanced coding, refactoring, tests | Dedicated coding specialist with local runtime and project memory |
| 🛡️ **Security Guard** | Snyk + Dependabot | Risk scans, approvals, compliance checks | Security gates are integrated into execution flow |
| ⚡ **LANA** | Linear + Notion | Executive orchestration and mission planning | Coordinates all agents as one command center |

---

## Why Super Agent?

**Super Agent = Hermes + OpenClaw + workflow intelligence.**

- Picks up research tasks and execution tasks in one flow
- Great for founder operations, go-to-market tasks, and technical ops
- Reduces "which agent do I pick?" by giving you one default power agent

---

## Auto Learning, Memory, and Continuous Improvement

### 🧠 Memory

- Session memory keeps recent context
- Long-term memory stores repeatable project knowledge
- Team playbooks become reusable intelligence

### 🔁 Auto Learning (Practical)

- Learns from previous runs, approvals, and playbook outcomes
- Improves routing and mission planning over time
- Builds better defaults from your real usage patterns

### 🛡️ Safety + Approvals

- High-risk tasks can require explicit review
- Every critical action is auditable
- You stay in control without losing speed

---

## Backup and Restore (Hard Drive + USB)

### 💾 External Drive Backup

1. Connect external drive
2. Open `Tools > Audit & Backup`
3. Create backup snapshot
4. Save to your external backup path

### 📦 USB Portability

- Copy the project folder to USB
- Use launcher scripts:
  - `Start-Lux-AI.command` (Mac)
  - `Start-Lux-AI.bat` (Windows)
- Run anywhere with your full setup and memory

---

## Mobile Use (If you want to run from phone)

### 📱 Recommended path

- Run Lux AI Studio on your machine (home PC, mini PC, or laptop)
- Connect phone to same network (or VPN)
- Open browser to your host URL and use the web UI

### Notes

- For security, keep localhost mode unless you intentionally expose a secure reverse proxy
- Use approvals for remote-triggered high-risk actions

---

## Hardware Paths (llama.cpp built in)

Two hardware paths, one simple decision already made by router mode:

- **GPU path:** Qwen3.6 27B (speed-first)
- **CPU path:** Qwen3.6 35B A3B (efficient and capable)

Fast where you have power, efficient where you do not.

### Performance Landscape

| Hardware | Memory | tok/s |
|---|---:|---:|
| Ryzen 9 7940HS + DDR5 dual-channel | 32 GB | ~20 |
| RTX 3090 (recommended sweet spot) | 24 GB VRAM | ~42-45 |
| RTX 4090 | 24 GB VRAM | ~47-50 |
| RTX 5090 | 32 GB VRAM | ~75-80 |

---

## How It Stacks Up

| Category | Claude Code | OpenCode | Lux Agent Stack |
|---|---|---|---|
| Cost | Per-token | Per-token | **Unlimited tokens - Free** |
| Privacy | Cloud-only | Cloud + Offline | **Fully offline (private)** |
| Ease of Install | Simple | Difficult | **Simple** |
| Local LLM Environment | None | Agent | **Agent + Inference** |
| Tools | 44 | 15 | **20 + 22 via MCP** |
| Written In | npm | npm | **Node.js + Express** |
| Sandboxing | Host install | Host install | **Docker-native** |
| License | Commercial | Open source | **Open source** |

---

## Two-Command Quickstart

```bash
# 01) install - no api keys, no cloud
git clone https://github.com/luxautomaton-ux/lux-agent-bridge.git && cd lux-agent-bridge && bash ./install.sh

# 02) run
luxagent agent
```

---

## Use Your Own GitHub (Easy Install for your setup)

If you want your own installer + your own repo flow:

1. Fork `luxautomaton-ux/lux-agent-bridge`
2. Customize `install.sh` and `install.ps1` in your fork
3. Replace install URL with your fork URL

```bash
# Replace <your-user> and branch if needed
git clone https://github.com/<your-user>/lux-agent-bridge.git && cd lux-agent-bridge && bash ./install.sh
```

### Suggested repo structure

```text
lux-agent-bridge/
  package.json
  install.sh
  install.ps1
  models/
  docs/
  docker/
```

### What your installer should do

- Detect hardware profile (modest/balanced/performance)
- Prepare runtime dependencies
- Configure secure local defaults
- Validate with smoke + e2e checks

---

## Core Product Message (for landing/docs)

- Unlimited tokens. Forever.
- Your machine. Your agent.
- No rate limits. No clock watching. No bills.
- Infrastructure, not subscription.

---

## Best Way to Use Daily

1. Start in **Command Center**
2. Use **Super Agent** as default
3. Use **Lux AI** or **Lux Agent** for deep coding
4. Keep **Security Guard** approvals enabled for risky actions
5. Run scheduled backups to external drive

---

## Quick Links

- Landing: `http://localhost:8787/`
- Command Center: `http://localhost:8787/lux-command-center.html`
- Mission Mode: `http://localhost:8787/lux-mission-mode.html`
- Agent Console: `http://localhost:8787/lux-agent-console.html`
- Chat: `http://localhost:8787/control-chat.html`

---

Built for ownership, speed, and privacy.
