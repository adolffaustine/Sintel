#!/bin/bash
# =============================================================================
# deploy-docker.sh — Sintel Technologies: Docker Compose deploy script
# Usage: bash deploy-docker.sh
# Requires: docker, docker compose plugin
# =============================================================================
set -e

echo "========================================="
echo "  Sintel Docker Deploy — $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# ---------------------------------------------------------------------------
# 1. Pull latest base images
# ---------------------------------------------------------------------------
echo ""
echo "[1/3] Pulling latest base images..."
docker compose pull

# ---------------------------------------------------------------------------
# 2. Build app image (no cache to ensure a clean build)
# ---------------------------------------------------------------------------
echo ""
echo "[2/3] Building app image (--no-cache)..."
docker compose build --no-cache

# ---------------------------------------------------------------------------
# 3. Start / restart services in detached mode
# ---------------------------------------------------------------------------
echo ""
echo "[3/3] Starting services..."
docker compose up -d

# ---------------------------------------------------------------------------
# Status check
# ---------------------------------------------------------------------------
echo ""
echo "Current service status:"
docker compose ps

echo ""
echo "========================================="
echo "  Docker deploy complete!"
echo "========================================="
