# Lux AI Studio - Complete Deployment Guide

> All deployment methods, all platforms, fully documented.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Local Development](#2-local-development)
3. [Desktop Deployment](#3-desktop-deployment)
4. [Server Deployment](#4-server-deployment)
5. [Container Deployment (Docker)](#5-container-deployment-docker)
6. [Reverse Proxy](#6-reverse-proxy)
7. [System Services](#7-system-services)
8. [Cloud Providers](#8-cloud-providers)
9. [USB Portable](#9-usb-portable)
10. [Mobile & Remote Access](#10-mobile--remote-access)
11. [Production Checklist](#11-production-checklist)

---

## 1. Quick Start

```bash
# Clone
git clone https://github.com/luxautomaton-ux/lux-agent-bridge.git
cd lux-agent-bridge

# Install (macOS/Linux)
bash ./install.sh

# Install (Windows PowerShell)
powershell -ExecutionPolicy Bypass -File .\install.ps1

# Run
npm start
# OR use the shim
luxagent agent
```

Access: **http://localhost:8787**

---

## 2. Local Development

### 2.1 Direct Node.js

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Custom port
PORT=9000 npm start
```

### 2.2 Environment Variables

Create `.env` file:

```bash
# Server
PORT=8787
NODE_ENV=production

# Security (REQUIRED for production)
LUX_API_TOKEN=your-secure-token-here
ALLOW_LOCALHOST_ONLY=false

# Paths
OPENMANUS_DIR=/path/to/openmanus
ALLOWED_PROJECT_ROOTS=/home,/workspace,/projects

# Optional: Provider overrides
# OLLAMA_BASE_URL=http://localhost:11434
# OPENROUTER_API_KEY=sk-or-...
```

### 2.3 Development Tools

```bash
# Check dependencies
npm audit

# Run tests
npm test

# Lint
npm run lint
```

---

## 3. Desktop Deployment

### 3.1 macOS

#### Option A: Launch Agent (Recommended)

```bash
# Copy the plist
cp deploy/com.lux.agent.bridge.plist ~/Library/LaunchAgents/

# Edit path in plist first - change:
# /Users/asaspade/Desktop/lux-agent-bridge -> your actual path

# Load
launchctl load ~/Library/LaunchAgents/com.lux.agent.bridge.plist

# Start
launchctl start com.lux.agent.bridge

# Check status
launchctl list | grep lux

# Unload (to stop)
launchctl unload ~/Library/LaunchAgents/com.lux.agent.bridge.plist
```

#### Option B: Homebrew Service

```bash
# If using homebrew's node
brew services start node@18
```

#### Option C: Run at Login (GUI)

1. Open **System Settings → General → Login Items**
2. Click **+** → Add `npm` with `start` argument
3. Or create an `.app` wrapper:

```bash
#!/bin/bash
cd /path/to/lux-agent-bridge
npm start
```

Save as `LuxAgentBridge.app` in Applications.

### 3.2 Windows

#### Option A: Task Scheduler (Built-in)

1. Open **Task Scheduler** (taskschd.msc)
2. Create Basic Task:
   - Name: `LuxAgentBridge`
   - Trigger: At startup
   - Action: Start a program
   - Program: `cmd.exe`
   - Arguments: `/c cd /d "C:\path\to\lux-agent-bridge" && npm start`
3. Configure: Run whether user is logged in or not

#### Option B: NSSM (Non-Sucking Service Manager)

```powershell
# Download nssm from https://nssm.cc/download

# Install
nssm install LuxAgentBridge "C:\Program Files\nodejs\npm.cmd" "start"
nssm set LuxAgentBridge AppDirectory "C:\path\to\lux-agent-bridge"
nssm set LuxAgentBridge AppEnvironmentExtra "NODE_ENV=production"

# Start
nssm start LuxAgentBridge

# Check
nssm status LuxAgentBridge

# Remove
nssm remove LuxAgentBridge confirm
```

#### Option C: Windows Service (NodeWindows)

```powershell
npm install -g node-windows

# Create service
nwspawn --init

# Edit service.js then:
node service.js --install
```

### 3.3 Linux Desktop

#### Option A: Systemd User Service

```bash
# Create user service
mkdir -p ~/.config/systemd/user
cp deploy/lux-agent-bridge.service ~/.config/systemd/user/lux-agent-bridge.service

# Edit the service file:
# - Change User=lux to your username
# - Change WorkingDirectory to your path

# Enable and start
systemctl --user enable lux-agent-bridge
systemctl --user start lux-agent-bridge

# Check
systemctl --user status lux-agent-bridge
```

#### Option B: Desktop Autostart

```bash
# Create autostart entry
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/lux-agent-bridge.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=Lux Agent Bridge
Exec=/bin/bash -c "cd /path/to/lux-agent-bridge && npm start"
Icon=utilities-terminal
EOF
```

---

## 4. Server Deployment

### 4.1 Ubuntu/Debian (Systemd)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create user (recommended)
sudo useradd -r -s /bin/false lux
sudo mkdir -p /opt/lux-agent-bridge
sudo chown lux:lux /opt/lux-agent-bridge

# Clone
cd /opt/lux-agent-bridge
sudo -u lux git clone https://github.com/luxautomaton-ux/lux-agent-bridge.git .

# Install
sudo -u lux npm install --production

# Copy service file
sudo cp deploy/lux-agent-bridge.service /etc/systemd/system/
sudo chmod 644 /etc/systemd/system/lux-agent-bridge.service

# Edit service: change User=lux, WorkingDirectory=/opt/lux-agent-bridge

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable lux-agent-bridge
sudo systemctl start lux-agent-bridge

# Check
sudo systemctl status lux-agent-bridge
sudo journalctl -u lux-agent-bridge -f
```

### 4.2 CentOS/RHEL/Fedora

```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Same steps as Ubuntu, but use yum instead of apt-get
```

### 4.3 AlmaLinux/Rocky Linux

```bash
# Enable EPEL
sudo dnf install epel-release

# Install Node.js
sudo dnf module reset nodejs
sudo dnf module enable nodejs:18
sudo dnf install nodejs

# Follow Ubuntu steps
```

### 4.4 Raspberry Pi (ARM)

```bash
# Install Node.js 18 for ARM
curl -fsSL https://nodejs.org/dist/v18.20.4/node-v18.20.4-linux-arm64.tar.xz | sudo tar -xJ -C /usr/local --strip-components=1

# Or use ARM64 builds
wget https://nodejs.org/dist/v18.20.4/node-v18.20.4-linux-arm64.tar.xz
tar -xf node-v18.20.4-linux-arm64.tar.xz
sudo cp -r node-v18.20.4-linux-arm64/* /usr/local/

# Test
node --version

# Continue with Ubuntu systemd steps
```

---

## 5. Container Deployment (Docker)

### 5.1 Basic Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy app
COPY . .

# Expose port
EXPOSE 8787

# Run
CMD ["npm", "start"]
```

```bash
# Build
docker build -t lux-agent-bridge .

# Run
docker run -d \
  --name lux-agent-bridge \
  -p 8787:8787 \
  -v $(pwd)/logs:/app/logs \
  -v $(pwd)/memory:/app/memory \
  -v $(pwd)/tasks:/app/tasks \
  -e NODE_ENV=production \
  -e LUX_API_TOKEN=your-token \
  lux-agent-bridge

# Check
docker logs -f lux-agent-bridge
```

### 5.2 Docker Compose (Recommended)

```yaml
# docker-compose.yml
version: '3.8'

services:
  lux-agent:
    build: .
    container_name: lux-agent-bridge
    ports:
      - "8787:8787"
    volumes:
      - ./logs:/app/logs
      - ./memory:/app/memory
      - ./tasks:/app/tasks
      - ./projects:/app/projects
    environment:
      - NODE_ENV=production
      - PORT=8787
      - LUX_API_TOKEN=change-me-in-production
      - ALLOW_LOCALHOST_ONLY=false
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8787/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - lux-network

  # Optional: Ollama for local AI
  ollama:
    image: ollama/ollama:latest
    container_name: lux-ollama
    volumes:
      - ollama-data:/root/.ollama
    ports:
      - "11434:11434"
    networks:
      - lux-network
    environment:
      - OLLAMA_HOST=0.0.0.0

networks:
  lux-network:
    driver: bridge

volumes:
  ollama-data:
```

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Update and rebuild
docker-compose pull
docker-compose up -d --build
```

### 5.3 Docker with GPU Support

```yaml
# docker-compose.gpu.yml
version: '3.8'

services:
  lux-agent:
    # ... base config ...
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

```bash
# Run with GPU
docker-compose -f docker-compose.gpu.yml up -d

# Verify GPU access
docker exec lux-agent-bridge nvidia-smi
```

### 5.4 Podman (RHEL/CentOS Alternative)

```bash
# Same as docker, but use podman
podman run -d \
  --name lux-agent-bridge \
  -p 8787:8787 \
  -v ./logs:/app/logs:Z \
  -e NODE_ENV=production \
  localhost/lux-agent-bridge:latest

# Or use podman-compose
podman-compose up -d
```

---

## 6. Reverse Proxy

### 6.1 Nginx (Recommended for Production)

```bash
# Install
sudo apt install nginx

# Copy config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/lux-agent-bridge
sudo ln -s /etc/nginx/sites-available/lux-agent-bridge /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

**nginx.conf customization:**

```nginx
server {
    listen 80;
    server_name lux.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lux.yourdomain.com;

    # SSL (use certbot to generate)
    ssl_certificate /etc/letsencrypt/live/lux.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lux.yourdomain.com/privkey.pem;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8787/api/;
        limit_req zone=api_limit burst=50 nodelay;
    }
}
```

**SSL with Certbot:**

```bash
# Ubuntu
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d lux.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 6.2 Caddy (Simpler Setup)

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Copy config
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile

# Edit Caddyfile - change lux.example.com to your domain

# Start
sudo systemctl enable --now caddy
```

**Caddyfile:**

```caddy
lux.yourdomain.com {
    encode gzip

    # API proxy with longer timeouts
    @api {
        path /api/*
    }
    reverse_proxy @api 127.0.0.1:8787 {
        transport http {
            read_timeout 300s
            write_timeout 300s
        }
    }

    # Web UI
    reverse_proxy 127.0.0.1:8787

    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
        -X-Powered-By
    }

    # Optional: Basic auth
    # basicauth /admin {
    #     admin JDJhJDEwJEZVVkR1QUJDREVGRURFREIzNDE5MjBhRkRGQTREQkZGRjc4
    # }
}
```

### 6.3 Apache

```apache
# Install
sudo apt install apache2

# Enable modules
sudo a2enmod proxy proxy_http proxy_wstunnel headers rewrite ssl

# Create config
sudo vim /etc/apache2/sites-available/lux-agent-bridge.conf
```

```apache
<VirtualHost *:80>
    ServerName lux.yourdomain.com
    Redirect permanent / https://lux.yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName lux.yourdomain.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/lux.yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/lux.yourdomain.com/privkey.pem

    ProxyPreserveHost On
    ProxyPass /api/ http://127.0.0.1:8787/api/
    ProxyPassReverse /api/ http://127.0.0.1:8787/api/
    ProxyPass / http://127.0.0.1:8787/
    ProxyPassReverse / http://127.0.0.1:8787/

    # WebSocket support
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*) ws://127.0.0.1:8787/$1 [P,L]

    # Security headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
</VirtualHost>
```

```bash
# Enable and restart
sudo a2ensite lux-agent-bridge.conf
sudo systemctl reload apache2
```

### 6.4 Traefik (Docker)

```yaml
# docker-compose.traefik.yml
version: '3.8'

services:
  traefik:
    image: traefik:v3.0
    container_name: lux-traefik
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=you@example.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/acme.json:/letsencrypt/acme.json
    networks:
      - lux-network
    restart: unless-stopped

  lux-agent:
    build: .
    container_name: lux-agent-bridge
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.lux-agent.rule=Host(`lux.yourdomain.com`)"
      - "traefik.http.routers.lux-agent.entrypoints=websecure"
      - "traefik.http.routers.lux-agent.tls.certresolver=letsencrypt"
      - "traefik.http.services.lux-agent.loadbalancer.server.port=8787"
    networks:
      - lux-agent-network

networks:
  lux-agent-network:
    external: true
```

```bash
# Create network
docker network create lux-agent-network

# Start Traefik first
docker-compose -f docker-compose.traefik.yml up -d

# Start app
docker-compose up -d
```

---

## 7. System Services

### 7.1 Systemd (Linux)

**System-wide service** (see Section 4.1):

```bash
# Quick install for Ubuntu/Debian
curl -sL https://raw.githubusercontent.com/luxautomaton-ux/lux-agent-bridge/main/scripts/install-systemd.sh | bash
```

**User service** (per-user, no root needed):

```ini
# ~/.config/systemd/user/lux-agent-bridge.service
[Unit]
Description=Lux Agent Bridge
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/npm start
WorkingDirectory=/path/to/lux-agent-bridge
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=default.target
```

```bash
systemctl --user daemon-reload
systemctl --user enable --now lux-agent-bridge
journalctl --user -u lux-agent-bridge -f
```

### 7.2 Launchd (macOS)

```bash
# Edit the plist first - update paths
vim deploy/com.lux.agent.bridge.plist

# Load (user-level)
launchctl load ~/Library/LaunchAgents/com.lux.agent.bridge.plist

# Load at login (system-level, requires sudo)
sudo cp deploy/com.lux.agent.bridge.plist /Library/LaunchAgents/
sudo launchctl load /Library/LaunchAgents/com.lux.agent.bridge.plist
```

### 7.3 Windows Service

See `deploy/windows-service.md` for detailed options:

1. **Task Scheduler** (simplest)
2. **NSSM** (production-grade)
3. **node-windows** (full service)

---

## 8. Cloud Providers

### 8.1 Railway

```bash
# One-click deploy
https://railway.app/new/template/lux-agent-bridge
```

Or CLI:

```bash
npm install -g railway
railway login
railway init
# Add environment variables in Railway dashboard
railway up
```

### 8.2 Render

```bash
# Connect GitHub repo
# Settings:
# - Build Command: npm install
# - Start Command: npm start
# - Environment: Node 18+
```

### 8.3 Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Init
fly launch --name lux-agent-bridge

# Edit fly.toml, then
fly deploy

# Scale
fly scale show
fly scale set -c 2
```

### 8.4 AWS EC2

```bash
# Launch t3.small or larger
# Install as per Section 4.1

# With CloudWatch logs
sudo yum install -y awslogs
sudo systemctl start awslogs
```

### 8.5 Google Cloud Platform

```bash
# Install gcloud SDK
gcloud init

# Create instance
gcloud compute instances create lux-agent \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --boot-disk-size=20GB \
    --tags=http-server,https-server \
    --metadata=startup-script='#!/bin/bash
    apt update
    apt install -y nodejs npm
    cd /opt
    git clone https://github.com/luxautomaton-ux/lux-agent-bridge.git
    cd lux-agent-bridge
    npm install --production
    npm start &'

# Firewall
gcloud compute firewall-rules create allow-lux --allow tcp:8787 --source-ranges=0.0.0.0/0
```

### 8.6 Azure VM

```bash
# Azure CLI
az login
az vm create \
    --resource-group lux-rg \
    --name lux-agent \
    --image UbuntuLTS \
    --size Standard_B1s \
    --admin-username azureuser \
    --generate-ssh-keys

# SSH in and follow Section 4.1
```

### 8.7 DigitalOcean Droplet

```bash
# Create via API or UI
# $5/mo droplet (1024MB)
# Follow Section 4.1 Ubuntu setup

# With User Data (cloud-init):
cat << 'EOF' | base64
#!/bin/bash
apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
cd /opt
git clone https://github.com/luxautomaton-ux/lux-agent-bridge.git
cd lux-agent-bridge
npm install --production
systemctl enable lux-agent-bridge
EOF
```

### 8.8 Heroku

```bash
# Create Procfile
echo "web: npm start" > Procfile

# Create app
heroku create lux-agent-bridge

# Set port
heroku config:set PORT=$PORT

# Deploy
git push heroku main
```

---

## 9. USB Portable

### 9.1 macOS

```bash
# Copy entire folder to USB (assuming /Volumes/LAXUSB)
cp -R /path/to/lux-agent-bridge /Volumes/LAXUSB/

# Create launcher
cat > /Volumes/LAXUSB/Start-Lux-AI.command << 'EOF'
#!/bin/zsh
cd "$(dirname "$0")/lux-agent-bridge"
npm start
open http://localhost:8787
EOF
chmod +x /Volumes/LAXUSB/Start-Lux-AI.command
```

### 9.2 Windows

```bash
# Copy folder to USB drive (E:)
xcopy /E /I /H /Y "C:\path\to\lux-agent-bridge" "E:\LuxAgentBridge\"

# Create launcher
echo @echo off > "E:\Start-Lux-AI.bat"
echo cd /d "%~dp0LuxAgentBridge" >> "E:\Start-Lux-AI.bat"
echo npm start >> "E:\Start-Lux-AI.bat"
echo start http://localhost:8787 >> "E:\Start-Lux-AI.bat"
```

### 9.3 Auto-Launch from USB

```bash
# Add autorun.inf (Windows)
echo [autorun] > "E:\autorun.inf"
echo icon=logo.ico >> "E:\autorun.inf"
echo open=Start-Lux-AI.bat >> "E:\autorun.inf"
```

---

## 10. Mobile & Remote Access

### 10.1 Local Network Access

```bash
# Find your IP
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# Linux
ip addr show | grep "inet "

# Windows
ipconfig
```

Access via: `http://192.168.x.x:8787`

### 10.2 Tailscale (Recommended for Remote)

```bash
# Install Tailscale on host
curl -fsSL https://tailscale.com/install.sh | sh

# Connect
tailscale up

# Get your Tailscale IP
tailscale ip -4

# Access from any device with Tailscale installed
# https://100.x.x.x:8787
```

### 10.3 ZeroTier

```bash
# Install
curl -s https://install.zerotier.com | sudo bash

# Join network
zerotier-cli join YOUR_NETWORK_ID

# Approve in ZeroTier Central console

# Access via ZeroTier IP
```

### 10.4 Cloudflare Tunnel

```bash
# Install cloudflared
brew install cloudflared  # macOS
# or
sudo apt install cloudflared  # Ubuntu

# Create tunnel
cloudflared tunnel create lux-agent

# Add CNAME
cloudflared tunnel route dns lux-agent lux.yourdomain.com

# Run
cloudflared tunnel run lux-agent
```

### 10.5 ngrok

```bash
# Install
ngrok config add-authtoken YOUR_TOKEN

# Create tunnel
ngrok http 8787

# Or with authentication
ngrok http 8787 --basic-auth "user:pass"
```

---

## 11. Production Checklist

### 11.1 Security

- [ ] Set `LUX_API_TOKEN` in `.env`
- [ ] Enable `ALLOW_LOCALHOST_ONLY=false` only with reverse proxy
- [ ] Use HTTPS via Nginx/Caddy/Apache
- [ ] Configure firewall: `sudo ufw allow 8787/tcp`
- [ ] Enable rate limiting on reverse proxy
- [ ] Set up fail2ban for brute force protection

### 11.2 Backups

- [ ] Regular backup via Dashboard → Backup/Restore
- [ ] Copy `logs/`, `memory/`, `tasks/`, `projects/` periodically
- [ ] Consider cloud backup (S3, GCS, Backblaze)

### 11.3 Monitoring

- [ ] Set up health check: `GET /api/health`
- [ ] Use PM2 for process management: `pm2 start server.js --name lux-agent`
- [ ] Configure log rotation

### 11.4 Performance

- [ ] Choose appropriate performance profile:
  - `modest`: Single task, Raspberry Pi, older hardware
  - `balanced`: 2 concurrent tasks, laptops, mid-range
  - `performance`: 4+ concurrent tasks, desktops, servers

```bash
# Check profile
curl http://localhost:8787/api/performance/profiles

# Apply profile
curl -X POST http://localhost:8787/api/performance/profiles/apply \
  -H "Content-Type: application/json" \
  -d '{"profile":"balanced"}'
```

---

## Support Matrix

| Method | macOS | Windows | Linux | Cloud | Docker |
|--------|-------|---------|-------|-------|--------|
| Direct | ✅ | ✅ | ✅ | ✅ | - |
| Systemd | - | - | ✅ | ✅ | - |
| Launchd | ✅ | - | - | - | - |
| NSSM | - | ✅ | - | - | - |
| Docker | ✅ | ✅ | ✅ | ✅ | ✅ |
| Nginx | ✅ | ✅ | ✅ | ✅ | ✅ |
| Caddy | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cloud (Railway/etc) | - | - | - | ✅ | ✅ |

---

## Quick Reference

```bash
# Development
npm start

# Production with PM2
pm2 start server.js --name lux-agent
pm2 save
pm2 startup

# Check status
curl http://localhost:8787/api/health

# Logs
pm2 logs lux-agent

# Restart
pm2 restart lux-agent
```

---

*© 2026 Lux AI - Deployment Complete Guide*
*For support: https://github.com/luxautomaton-ux/lux-agent-bridge/issues*