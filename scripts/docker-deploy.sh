#!/bin/bash
# Lux Agent Bridge - Docker Deployment Script
# Usage: ./scripts/docker-deploy.sh [up|down|restart|logs|build]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

ACTION="${1:-up}"

echo "🐳 Lux Agent Bridge - Docker Deployment"
echo "=========================================="

cd "$PROJECT_DIR"

case "$ACTION" in
    up)
        echo "🚀 Starting containers..."
        docker-compose up -d

        echo ""
        echo "⏳ Waiting for service..."
        sleep 5

        # Check health
        if curl -s http://localhost:8787/api/health | grep -q "online"; then
            echo "✅ Service is healthy!"
        else
            echo "⚠️ Service may not be ready yet"
        fi

        echo ""
        echo "🌐 Access: http://localhost:8787"
        echo ""
        echo "Useful commands:"
        echo "   ./scripts/docker-deploy.sh logs    # View logs"
        echo "   ./scripts/docker-deploy.sh restart # Restart"
        echo "   ./scripts/docker-deploy.sh down   # Stop"
        ;;

    down)
        echo "🛑 Stopping containers..."
        docker-compose down
        echo "✅ Stopped"
        ;;

    restart)
        echo "🔄 Restarting..."
        docker-compose restart
        echo "✅ Restarted"
        ;;

    logs)
        echo "📜 Following logs (Ctrl+C to exit)..."
        docker-compose logs -f
        ;;

    build)
        echo "🔨 Building image..."
        docker-compose build --no-cache
        echo "✅ Built"
        ;;

    ps)
        echo "📋 Container status:"
        docker-compose ps
        ;;

    clean)
        echo "🧹 Cleaning up..."
        docker-compose down -v --rmi local
        echo "✅ Cleaned"
        ;;

    *)
        echo "Usage: $0 [up|down|restart|logs|build|ps|clean]"
        exit 1
        ;;
esac