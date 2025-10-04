#!/bin/bash

# Fix Expo Go version mismatch on Android emulator

echo "🔧 Fixing Expo Go version mismatch..."

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please install Android SDK tools."
    exit 1
fi

# Check if emulator is running
if ! adb devices | grep -q "emulator"; then
    echo "❌ No Android emulator found. Please start an emulator first."
    exit 1
fi

echo "📱 Android emulator found"

# Check current Expo Go version
echo "🔍 Checking current Expo Go version..."
CURRENT_VERSION=$(adb shell dumpsys package com.expo.gomodule | grep versionName | cut -d'=' -f2 | tr -d ' ')

if [ -z "$CURRENT_VERSION" ]; then
    echo "❌ Expo Go not installed on emulator"
    echo "📥 Installing Expo Go..."
    
    # Download and install Expo Go
    echo "Please install Expo Go manually:"
    echo "1. Open Google Play Store on your emulator"
    echo "2. Search for 'Expo Go'"
    echo "3. Install the latest version"
    echo ""
    echo "Or use the web version: npm run web"
    exit 1
fi

echo "📱 Current Expo Go version: $CURRENT_VERSION"

# Check if version is compatible
if [[ "$CURRENT_VERSION" == "2.31.2" ]]; then
    echo "⚠️  Expo Go version is outdated (2.31.2)"
    echo "📥 Please update Expo Go:"
    echo "1. Open Google Play Store on your emulator"
    echo "2. Search for 'Expo Go'"
    echo "3. Update to the latest version"
    echo ""
    echo "🔄 Alternative solutions:"
    echo "   npm run web              # Use web version"
    echo "   npx expo run:android     # Use development build"
    echo ""
else
    echo "✅ Expo Go version looks compatible: $CURRENT_VERSION"
fi

echo ""
echo "💡 Tips:"
echo "   - Use 'npm run web' for quick testing"
echo "   - Use 'npx expo run:android' for development build"
echo "   - Update Expo Go regularly for best compatibility"
