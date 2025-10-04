#!/bin/bash

# Update mobile app configuration with ngrok URL
if [ -z "$1" ]; then
    echo "❌ Please provide the ngrok URL as an argument"
    echo "   Usage: ./scripts/update-config.sh https://abc123.ngrok.io"
    exit 1
fi

NGROK_URL="$1"
API_URL="$NGROK_URL/api/v1"
MCP_URL="$NGROK_URL/api/v1/mcp"

echo "🔧 Updating mobile app configuration with ngrok URL..."
echo "   API URL: $API_URL"
echo "   MCP URL: $MCP_URL"
echo ""

# Update api-client.ts
if [ -f "src/services/api-client.ts" ]; then
    sed -i "s|const API_BASE_URL = 'http://[^']*'|const API_BASE_URL = '$API_URL'|g" src/services/api-client.ts
    echo "✅ Updated src/services/api-client.ts"
else
    echo "❌ src/services/api-client.ts not found"
fi

# Update mcp-client.ts
if [ -f "src/services/mcp-client.ts" ]; then
    sed -i "s|const MCP_BASE_URL = 'http://[^']*'|const MCP_BASE_URL = '$MCP_URL'|g" src/services/mcp-client.ts
    echo "✅ Updated src/services/mcp-client.ts"
else
    echo "❌ src/services/mcp-client.ts not found"
fi

# Update environment.ts
if [ -f "src/config/environment.ts" ]; then
    sed -i "s|apiUrl: process.env.EXPO_PUBLIC_API_URL || '[^']*'|apiUrl: process.env.EXPO_PUBLIC_API_URL || '$API_URL'|g" src/config/environment.ts
    sed -i "s|mcpUrl: process.env.EXPO_PUBLIC_MCP_URL || '[^']*'|mcpUrl: process.env.EXPO_PUBLIC_MCP_URL || '$MCP_URL'|g" src/config/environment.ts
    echo "✅ Updated src/config/environment.ts"
else
    echo "❌ src/config/environment.ts not found"
fi

echo ""
echo "🎉 Configuration updated successfully!"
echo "📱 Your mobile app will now connect to: $NGROK_URL"
echo ""
echo "🚀 Next steps:"
echo "   1. Make sure your NestJS API is running on port 3001"
echo "   2. Start your mobile app: npm start"
echo "   3. The app should now connect to your API through ngrok!"
