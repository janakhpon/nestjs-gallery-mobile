#!/bin/bash

# Script to update API types in the mobile app from the backend
# This ensures the mobile app always has the latest API types

set -e

echo "🔄 Updating API types from backend..."

# Check if backend is running
if ! curl -s http://localhost:3001/api/v1/health > /dev/null; then
    echo "❌ Backend server is not running at http://localhost:3001"
    echo "Please start the backend server first:"
    echo "  cd ../nestjs-gallery-api"
    echo "  npm run start:dev"
    exit 1
fi

# Generate types from running backend
echo "📋 Generating types from running backend..."
npx openapi-typescript http://localhost:3001/api-json -o src/types/api.ts

echo "✅ API types updated successfully!"
echo "📁 Updated file: src/types/api.ts"
echo ""
echo "💡 The mobile app now has the latest API types for offline-first functionality"
echo ""
echo "🔍 Key features:"
echo "   - Offline storage with SQLite"
echo "   - Automatic sync when connectivity returns"
echo "   - Full type safety with generated types"
