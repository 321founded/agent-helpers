#!/bin/bash

# Agent Helpers - Start Script

APP_DIR="/data/dev/agent-helpers/app"

echo "🚀 Starting Agent Helpers..."
echo ""

# Check if node_modules exists
if [ ! -d "$APP_DIR/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd "$APP_DIR" && npm install
    echo ""
fi

# Start the dev server
echo "▶️  Starting Next.js dev server..."
echo "📍 Open: http://localhost:3001"
echo ""

cd "$APP_DIR" && npm run dev
