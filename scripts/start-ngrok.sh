#!/bin/bash

# Start ngrok tunnel for NestJS API
echo "🚀 Starting ngrok tunnel for your NestJS API..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed. Please install it first:"
    echo "   npm install -g ngrok"
    echo "   or visit: https://ngrok.com/download"
    exit 1
fi

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel on port 3001..."
echo "📱 This will create a public URL that your mobile app can use"
echo ""

# Start ngrok in background and capture the URL
ngrok http 3001 --log=stdout > ngrok.log 2>&1 &
NGROK_PID=$!

# Wait a moment for ngrok to start
sleep 3

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'https://[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL. Please check if ngrok is running."
    echo "   You can also visit http://localhost:4040 to see the ngrok dashboard"
    exit 1
fi

echo "✅ ngrok tunnel started successfully!"
echo ""
echo "🌍 Your public URL: $NGROK_URL"
echo ""
echo "📝 Update your mobile app configuration:"
echo "   - API URL: $NGROK_URL/api/v1"
echo "   - MCP URL: $NGROK_URL/api/v1/mcp"
echo ""
echo "🔧 To update automatically, run:"
echo "   ./scripts/update-config.sh $NGROK_URL"
echo ""
echo "📊 ngrok dashboard: http://localhost:4040"
echo "🛑 To stop ngrok: kill $NGROK_PID"
echo ""
echo "💡 Keep this terminal open while developing!"
