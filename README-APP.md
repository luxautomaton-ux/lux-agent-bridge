# Lux AI - Complete Application Guide

## Table of Contents
1. [Overview](#overview)
2. [Comparison with OpenMonoAgent.ai](#comparison)
3. [Architecture](#architecture)
4. [Setup & Installation](#setup)
5. [USB Portable Setup](#usb-portable)
6. [Feature Index](#feature-index)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)

---

## Overview

**Lux AI** is a unified, private, enterprise-grade AI agent platform that runs entirely locally without external API keys.

### Key Highlights
- ⚡ **4 Built-in Agents**: Lux AI, Hermes, OpenClaw, OpenMono
- 🔌 **5 AI Providers**: Lux AI Core, OpenClaude-Portable, Ollama, NVIDIA NIM, OpenRouter
- 🛠️ **12 Skills**: From code review to security auditing
- 🔄 **8 Workflows**: Full-stack dev, CI/CD, security audit, etc.
- 📊 **Enterprise Dashboard**: Real-time metrics, charts, swarm control
- 🔒 **100% Private**: No cloud, no API keys required

---

## Comparison with OpenMonoAgent.ai

| Feature | OpenMonoAgent.ai | Lux AI | Status |
|---------|-------------------|--------|--------|
| **Architecture** | .NET CLI + llama.cpp | Node.js + Express | ✅ Different |
| **Local Inference** | Built-in llama.cpp | Ollama external | Gap |
| **Docker Sandboxing** | Full container | Conceptual | Gap |
| **Tools** | 20 built-in | 15+ via API | ✅ Similar |
| **Playbooks** | YAML workflows | Capabilities/workflows | ✅ Implemented |
| **Sub-agents** | Explore, Plan, Coder, Verify | Multi-agent system | ✅ Similar |
| **MCP Support** | Yes | Yes (5 servers) | ✅ Implemented |
| **Approval Gates** | Confirm, Review, Approve | Approval workflow | ✅ Implemented |
| **TUI Mode** | Yes | Web UI only | Gap |
| **Context Compaction** | Auto at 65%/80% | Not implemented | Gap |
| **Code Intelligence** | Roslyn, LSP | Basic analysis | Gap |
| **Multi-Agent** | 5 specialist sub-agents | 4 main agents | ✅ Implemented |
| **Web UI** | Basic TUI | Full web dashboard | ✅ Better |
| **Enterprise Features** | Minimal | Full analytics, swarms | ✅ Better |
| **Task Queue** | Via playbooks | Full queue system | ✅ Better |
| **Privacy** | Fully offline | Fully offline | ✅ Same |

### What's Better in Lux AI
- ✅ Better web UI with enterprise dashboard
- ✅ Full task queue with metrics
- ✅ Swarm management (1M+ agents)
- ✅ Cron job scheduling
- ✅ Memory management with export/import
- ✅ Comprehensive audit & backup
- ✅ Multi-provider support including OpenClaude-Portable

### Gaps to Close
- [ ] Local inference (llama.cpp) integration
- [ ] Docker sandboxing for agent isolation
- [ ] Terminal UI (TUI) mode
- [ ] Context auto-compaction
- [ ] Deep Roslyn/LSP code intelligence

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Lux AI Platform                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Web UI     │  │  API Server │  │  CLI Tools  │            │
│  │  (HTML/CSS) │  │  (Express)  │  │  (npm)      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Core Services                         │   │
│  │  • Agent Orchestrator  • Task Runner   • Memory Manager │   │
│  │  • Code Analyzer       • Skill Engine  • MCP Manager    │   │
│  │  • Approval Workflow   • Backup Engine • Storage Manager│   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Lux AI     │  │   Hermes     │  │  OpenClaw   │          │
│  │   Agent      │  │   Agent      │  │   Agent     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Data Layer                           │   │
│  │  • playbooks/      • logs/        • memory/            │   │
│  │  • projects/       • runs/        • tasks/             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Setup & Installation

### Quick Start

```bash
# Clone or download the project
cd lux-agent-bridge

# Install dependencies
npm install

# Start the server
npm start
# OR use cross-platform scripts
./start.sh     # Mac/Linux
start.bat      # Windows
```

### Environment Variables (.env)

```env
PORT=8787
REQUIRE_APPROVAL_AUTONOMOUS=true
ALLOW_LOCALHOST_ONLY=true
LUX_API_TOKEN=
OPENMANUS_DIR=
LOCAL_MODEL_HEALTH_URL=http://127.0.0.1:11434/api/tags
```

### Access Points

| URL | Description |
|-----|-------------|
| `http://localhost:8787/` | Landing page |
| `http://localhost:8787/lux-ai-hub.html` | All-in-One Hub |
| `http://localhost:8787/workspace.html` | Main workspace |
| `http://localhost:8787/dashboard.html` | Enterprise dashboard |

---

## USB Portable Setup

### For Mac/Windows/Linux - Complete USB Drive

#### Step 1: Prepare USB Drive
- Format as exFAT (supports both Mac and Windows)
- Minimum 8GB recommended

#### Step 2: Copy Project
Copy entire `lux-agent-bridge` folder to USB drive.

#### Step 3: Auto-Start Scripts

**For Mac:**
```bash
# Create LaunchAgent
mkdir -p ~/Library/LaunchAgents
cat > ~/Library/LaunchAgents/com.luxai.agent.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.luxai.agent</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/usb/lux-agent-bridge/start.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
EOF
```

**For Windows:**
Create `autorun.inf` in USB root:
```inf
[autorun]
open=start.bat
icon=icon.ico
label=Lux AI
```

#### Step 4: One-Click Launch

Create `Launch-Lux-AI.bat` on USB:
```batch
@echo off
cd /d %~dp0lux-agent-bridge
call npm start
```

### Portable Configuration

To make truly portable (data stays on USB):
```env
# Add to .env
DATA_DIR=./data
LOGS_DIR=./logs
MEMORY_DIR=./memory
```

---

## Feature Index

### 🤖 Agents
| Agent | File | Description |
|-------|------|-------------|
| Lux AI | server.js | Primary orchestrator |
| Hermes | server.js | Research & analysis |
| OpenClaw | server.js | Automation & execution |
| OpenMono | server.js | Code & development |

### ⚡ Skills (12)
- Lux AI Core, Hermes Reasoning, OpenClaw Automation, OpenMono Code
- Frontend Fixer, Security Auditor, Docs + Release Assistant
- Code Review Pro, Swarm Orchestrator, Test Generator
- Migration Assistant, Refactoring Expert

### 🔀 Workflows (8)
- Full-Stack Development, Code Review Pipeline, Swarm Deployment
- Research Task, Security Audit, Data Pipeline
- API Integration, CI/CD Pipeline

### 🛠️ Tools Pages
| Page | Path | Features |
|------|------|----------|
| Dashboard | dashboard.html | Metrics, charts, swarms |
| Chat | control-chat.html | AI chat, file upload |
| Planner | control-planner.html | Mission planning |
| Runner | control-runner.html | Task execution |
| Approvals | control-approvals.html | Workflow approval |
| Runs | control-runs.html | Execution history |
| Logs | control-logs.html | Audit logs |
| Skills | tools-skills.html | Skill management |
| MCP | tools-mcp.html | MCP servers |
| Capabilities | tools-capabilities.html | Workflows |
| Enterprise | tools-enterprise.html | Settings |
| Memory | tools-memory.html | Memory management |
| Audit/Backup | tools-audit-backup.html | Backup/restore |
| Features | tools-features.html | All capabilities |
| Setup | setup.html | Configuration |
| Status | status.html | Health checks |

---

## API Reference

### Core APIs (129 total)

```bash
# Health Check
curl http://localhost:8787/api/health

# Agents
curl http://localhost:8787/api/agents
curl -X POST http://localhost:8787/api/agents/auto-select -d '{"task":"fix bug"}'

# Providers
curl http://localhost:8787/api/providers
curl -X POST http://localhost:8787/api/providers/select -d '{"providerId":"ollama-local"}'

# Skills
curl http://localhost:8787/api/skills

# Capabilities
curl http://localhost:8787/api/capabilities

# MCP
curl http://localhost:8787/api/mcps

# Tasks
curl http://localhost:8787/api/tasks
curl -X POST http://localhost:8787/api/tasks/run -d '{"task":"build project"}'

# Code Analysis
curl -X POST http://localhost:8787/api/code/analyze -d '{"code":"..."}'

# Enterprise
curl http://localhost:8787/api/enterprise/metrics

# Backups
curl http://localhost:8787/api/backups
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -ti:8787 | xargs kill -9
```

### Node Modules Missing
```bash
npm install
```

### Local Model Not Connected
- Install Ollama: https://ollama.ai
- Pull a model: `ollama pull qwen3`
- Ensure running at localhost:11434

### Docker Not Detected
- Install Docker Desktop
- Ensure docker daemon is running

---

## Data Storage

```
lux-agent-bridge/
├── playbooks/          # Configuration
│   ├── skills.json     # Skills
│   ├── capabilities.json
│   ├── mcps.json
│   └── enterprise-settings.json
├── logs/               # System logs
│   ├── audit.jsonl
│   ├── approvals.json
│   └── backups/
├── memory/             # Session memory
├── tasks/              # Task queue
├── runs/               # Execution history
├── projects/          # Project data
└── public/            # Web UI (HTML/CSS/JS)
```

---

## Security Features

- ✅ Local-only mode (localhost only)
- ✅ Approval workflow for destructive ops
- ✅ Audit logging (JSONL)
- ✅ Token-based authentication option
- ✅ Business mode with strict controls
- ✅ MCP server isolation

---

## Next Steps

1. **Install Ollama** for local inference
2. **Configure providers** in enterprise settings
3. **Add MCP servers** for extended capabilities
4. **Create playbooks** for automated workflows
5. **Set up backups** for data protection

---

*Last Updated: 2026-05-08*
*Version: 2.0.0*
*Platform: macOS, Windows, Linux (USB Portable)*