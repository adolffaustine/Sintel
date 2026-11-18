#!/bin/bash
# =============================================================================
# deploy.sh — Sintel Technologies: PM2-based deploy script for Ubuntu VPS
# Usage: bash deploy.sh
# =============================================================================
set -e

# ---------------------------------------------------------------------------
# Variables
# ---------------------------------------------------------------------------
APP_DIR="/var/www/sintel"

echo "========================================="
echo "  Sintel Deploy — $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# ---------------------------------------------------------------------------
# 1. Navigate to app directory and pull latest code
# ---------------------------------------------------------------------------
echo ""
echo "[1/4] Pulling latest code from git..."
cd "$APP_DIR"
git pull origin main

# ---------------------------------------------------------------------------
# 2. Install / update root (server) dependencies
# ---------------------------------------------------------------------------
echo ""
echo "[2/4] Installing server dependencies..."
npm install --omit=dev

# ---------------------------------------------------------------------------
# 3. Build the client (React / Vite)
# ---------------------------------------------------------------------------
echo ""
echo "[3/4] Building client..."
cd client
npm install
npm run build
cd ..

# ---------------------------------------------------------------------------
# 4. Reload (or start) the app via PM2
# ---------------------------------------------------------------------------
echo ""
echo "[4/4] Reloading app with PM2..."

# Check if the 'sintel' PM2 process is already running
if pm2 describe sintel > /dev/null 2>&1; then
    # Already running — do a graceful reload (zero-downtime in cluster mode)
    pm2 reload ecosystem.config.js --env production
else
    # First-time start
    pm2 start ecosystem.config.js --env production
fi

# Persist PM2 process list across server reboots
pm2 save

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo "========================================="
echo "  Deploy complete!"
echo "========================================="
