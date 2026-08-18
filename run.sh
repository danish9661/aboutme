#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Change directory to the script's root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "  Starting Portfolio Development Setup"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js (v18+) to run this project."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm to run this project."
    exit 1
fi

echo "Node version: $(node -v)"
echo "npm version:  $(npm -v)"
echo "------------------------------------------"

# Install dependencies if node_modules does not exist or package.json is newer
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules not found. Installing dependencies..."
    npm install
else
    echo "📦 Checking and updating dependencies if needed..."
    npm install
fi

echo "------------------------------------------"
echo "🚀 Starting Next.js development server..."
echo "=========================================="

# Run the development server
npm run dev
