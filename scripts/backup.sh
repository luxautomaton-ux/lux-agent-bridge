#!/bin/bash
# Lux Agent Bridge - Backup Script
# Usage: ./scripts/backup.sh [restore]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

echo "💾 Lux Agent Bridge - Backup Utility"
echo "====================================="

ACTION="${1:-backup}"

if [ "$ACTION" = "backup" ]; then
    BACKUP_FILE="$BACKUP_DIR/lux_backup_$TIMESTAMP.tar.gz"

    echo "📦 Creating backup: $BACKUP_FILE"

    # Backup critical directories
    tar -czf "$BACKUP_FILE" \
        -C "$PROJECT_DIR" \
        --exclude='node_modules' \
        --exclude='.git' \
        logs/ \
        memory/ \
        tasks/ \
        projects/ \
        runs/ \
        playbooks/ \
        .env 2>/dev/null || true

    # Also include skills and capabilities
    tar -czf "$BACKUP_FILE" \
        -C "$PROJECT_DIR" \
        --append \
        --exclude='node_modules' \
        playbooks/ 2>/dev/null || true

    echo "✅ Backup created: $BACKUP_FILE"
    echo ""

    # List recent backups
    echo "📋 Recent backups:"
    ls -lh "$BACKUP_DIR" | tail -5

elif [ "$ACTION" = "restore" ]; then
    LATEST=$(ls -t "$BACKUP_DIR"/lux_backup_*.tar.gz 2>/dev/null | head -1)

    if [ -z "$LATEST" ]; then
        echo "❌ No backups found in $BACKUP_DIR"
        exit 1
    fi

    echo "⚠️  This will restore from: $LATEST"
    echo "   Current project data will be preserved in /tmp/lux-pre-restore-$TIMESTAMP"
    read -p "Continue? (y/n) " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        exit 1
    fi

    # Backup current state first
    TEMP_DIR="/tmp/lux-pre-restore-$TIMESTAMP"
    mkdir -p "$TEMP_DIR"
    cp -r "$PROJECT_DIR/logs" "$PROJECT_DIR/memory" "$PROJECT_DIR/tasks" "$PROJECT_DIR/projects" "$PROJECT_DIR/runs" "$TEMP_DIR/" 2>/dev/null || true

    # Restore
    echo "📥 Restoring..."
    tar -xzf "$LATEST" -C "$PROJECT_DIR"

    echo "✅ Restored from: $LATEST"
    echo "   Previous state backed up to: $TEMP_DIR"

elif [ "$ACTION" = "list" ]; then
    echo "📋 Available backups:"
    ls -lh "$BACKUP_DIR"/lux_backup_*.tar.gz 2>/dev/null || echo "No backups found"

else
    echo "Usage: $0 [backup|restore|list]"
    echo ""
    echo "Environment variables:"
    echo "   BACKUP_DIR=<path>  # Custom backup location (default: ./backups)"
    exit 1
fi