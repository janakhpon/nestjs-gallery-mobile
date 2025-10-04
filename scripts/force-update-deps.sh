#!/bin/bash

# Force update all dependencies to latest stable versions

echo "🔄 Force updating all dependencies to latest stable versions..."

# Navigate to mobile app directory
cd /home/janakh/Documents/NEST/nestjs-gallery-mobile

# Remove existing node_modules and lock file
echo "🗑️  Removing existing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Install dependencies fresh
echo "📦 Installing dependencies fresh..."
npm install

# Force install Expo packages to correct versions
echo "🔧 Force installing Expo packages to correct versions..."
npx expo install expo-file-system@~19.0.16 expo-image-picker@~17.0.8 expo-network@~8.0.7 expo-sqlite@~16.0.8 --force

# Verify installation
echo "✅ Verifying package versions..."
npm list expo-file-system expo-image-picker expo-network expo-sqlite

echo ""
echo "🎉 Dependencies updated successfully!"
echo "You can now run:"
echo "  npm start"
echo "  npm run android"
echo "  npm run ios"
echo "  npm run web"
