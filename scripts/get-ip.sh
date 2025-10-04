#!/bin/bash

# Get the local IP address for mobile app development
echo "🌐 Getting your machine's IP address for mobile app development..."
echo ""

# Get the IP address
IP=$(ip route get 1.1.1.1 | awk '{print $7}' | head -1)

echo "📍 Your machine's IP address: $IP"
echo ""
echo "🔧 Update these files with your IP address:"
echo "   - src/services/api-client.ts"
echo "   - src/services/mcp-client.ts"
echo "   - src/config/environment.ts"
echo ""
echo "📝 Replace 'localhost' with '$IP' in the URLs:"
echo "   - http://localhost:3001/api/v1 → http://$IP:3001/api/v1"
echo "   - http://localhost:3001/api/v1/mcp → http://$IP:3001/api/v1/mcp"
echo ""
echo "🚀 After updating, your mobile app will be able to connect to your NestJS API!"
