# Gallery Mobile

A premium, minimalist mobile companion for the NestJS Gallery API, built with Expo and React Native.

## 🚀 Features

- **Premium Library**: Explore your collection in a sleek, high-performance grid.
- **AI Assistant**: Interact with your gallery using an MCP-standardized chat interface.
- **Seamless Upload**: Add content with optimization and progress tracking.
- **Universal Search**: Find any image instantly across titles and metadata.

## 🛠 Tech Stack

- **Framework**: Expo SDK 54 / React Native
- **Navigation**: Expo Router (File-based)
- **Icons**: Expo Vector Icons (Ionicons)
- **Networking**: Axios with custom API client
- **Design**: Premium Minimalist (Custom StyleSheets)

## 📱 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure API URL
# Update EXPO_PUBLIC_API_URL in constants or env

# 3. Start Expo
npm start
```

## 📁 Project Structure

- `app/`: Screen definitions and routing.
- `src/services/api-client.ts`: Core communication layer.
- `src/services/mcp-client.ts`: Standardized AI communication.
- `assets/`: App-specific media and branding.

## 🔌 API Integration

Connects to the [NestJS Gallery API](../nestjs-gallery-api) for:

- Standardized image management.
- Real-time AI assistant interactions.
- Optimized asset delivery.
