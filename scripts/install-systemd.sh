#!/bin/bash
# Lux Agent Bridge - Systemd Installer for Ubuntu/Debian
# Usage: curl -sL https://raw.githubusercontent.com/luxautomaton-ux/lux-agent-bridge/main/scripts/install-systemd.sh | bash

set -e

echo "🔧 Lux Agent Bridge - Systemd Installer"
echo "========================================"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ] && ! sudo -v 2>/dev/null; then
    echo "❌ Please run as root or with sudo"
    exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "❌ Cannot detect OS"
    exit 1
fi

echo "📦 Detected: $OS"

# Install Node.js 18
echo "Installing Node.js 18..."
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
elif [ "$OS" = "fedora" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo dnf install -y nodejs
elif [ "$OS" = "centos" ] || [ "$OS" = "almlinux" ] || [ "$OS" = "rocky" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
else
    echo "⚠️ Unknown OS, attempting generic install..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - || true
fi

# Verify Node.js
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION installed"

# Get current directory (or use /opt)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}/.."

if [ ! -d "$PROJECT_DIR" ]; then
    echo "📁 Creating project directory..."
    PROJECT_DIR="/opt/lux-agent-bridge"
    sudo mkdir -p "$PROJECT_DIR"
    echo "⚠️ Please clone the repository to $PROJECT_DIR"
    echo "   git clone https://github.com/luxautomaton-ux/lux-agent-bridge.git $PROJECT_DIR"
    echo "   cd $PROJECT_DIR && npm install"
    exit 1
fi

# Set ownership
USER_HOME=$(eval echo ~$(whoami))
USER_NAME=$(whoami)
sudo chown -R "$USER_NAME:$USER_NAME" "$PROJECT_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
cd "$PROJECT_DIR"
npm install --production

# Create systemd service
echo "📝 Creating systemd service..."
sudo cp deploy/lux-agent-bridge.service /etc/systemd/system/lux-agent-bridge.service

# Update service with correct paths
sudo sed -i "s|/opt/lux-agent-bridge|$PROJECT_DIR|g" /etc/systemd/system/lux-agent-bridge.service
sudo sed -i "s|User=lux|User=$USER_NAME|g" /etc/systemd/system/lux-agent-bridge.service

# Reload and enable
echo "🚀 Enabling service..."
sudo systemctl daemon-reload
sudo systemctl enable lux-agent-bridge
sudo systemctl start lux-agent-bridge

# Check status
sleep 2
echo ""
echo "📊 Service Status:"
sudo systemctl status lux-agent-bridge --no-pager || true

echo ""
echo "✅ Installation complete!"
echo "   Access: http://localhost:8787"
echo ""
echo "Useful commands:"
echo "   sudo systemctl status lux-agent-bridge    # Check status"
echo "   sudo journalctl -u lux-agent-bridge -f    # View logs"
echo "   sudo systemctl restart lux-agent-bridge    # Restart"
echo "   sudo systemctl stop lux-agent-bridge      # Stop"