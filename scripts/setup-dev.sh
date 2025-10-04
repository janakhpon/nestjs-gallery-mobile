#!/bin/bash

# Development setup script for Gallery Mobile App

echo "🚀 Setting up Gallery Mobile App for development..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the mobile app root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Update Expo packages to correct versions
echo "🔄 Updating Expo packages..."
npx expo install --fix

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:3001/api/v1/health > /dev/null; then
    echo "✅ Backend is running"
    
    # Generate API types
    echo "📋 Generating API types..."
    npm run update-api-types
else
    echo "⚠️  Backend is not running at http://localhost:3001"
    echo "   Please start the backend first:"
    echo "   cd ../nestjs-gallery-api && npm run start:dev"
fi

# Check Android emulator
echo "📱 Checking Android emulator..."
if adb devices | grep -q "emulator"; then
    echo "✅ Android emulator is running"
    
    # Check Expo Go version
    echo "🔍 Checking Expo Go version..."
    adb shell dumpsys package com.expo.gomodule | grep versionName || echo "Expo Go not found"
else
    echo "⚠️  No Android emulator found"
    echo "   Please start an Android emulator or connect a device"
fi

echo ""
echo "🎉 Setup complete! You can now run:"
echo "   npm run android    # Run on Android"
echo "   npm run ios        # Run on iOS"
echo "   npm start          # Start development server"
echo ""
echo "💡 Tips:"
echo "   - Make sure your backend is running for full functionality"
echo "   - Update Expo Go app on your device/emulator if needed"
echo "   - Use 'npm run update-api-types' to sync API types"