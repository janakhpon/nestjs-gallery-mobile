# 🌐 Network Setup Guide - Mobile App API Connection

## 🎯 **Problem Solved!**

The mobile app was trying to connect to `localhost:3001`, but when running on a device or emulator, `localhost` refers to the device itself, not your development machine.

## ✅ **Solution 1: Network IP Address (Recommended)**

I've updated the configuration to use your machine's IP address: `192.168.1.228`

### **Updated Configuration:**
- **API URL**: `http://192.168.1.228:3001/api/v1`
- **MCP URL**: `http://192.168.1.228:3001/api/v1/mcp`

### **How to Use:**
1. **Start your NestJS API**: `npm run start:dev` (make sure it's running on port 3001)
2. **Start your MCP server** (on port 3001)
3. **Start the mobile app**: `npm start`
4. **The app will now connect to your actual development machine!**

## 🔧 **Solution 2: Using ngrok (Alternative)**

If you prefer to use ngrok for external access or if the IP address doesn't work:

### **Install ngrok:**
```bash
# Install ngrok
npm install -g ngrok

# Or download from https://ngrok.com/
```

### **Start ngrok tunnel:**
```bash
# In a separate terminal, expose your NestJS API
ngrok http 3001
```

### **Update Configuration:**
After starting ngrok, you'll get a URL like `https://abc123.ngrok.io`. Update the configuration:

```typescript
// In src/services/api-client.ts
const API_BASE_URL = 'https://abc123.ngrok.io/api/v1';

// In src/services/mcp-client.ts  
const MCP_BASE_URL = 'https://abc123.ngrok.io/api/v1/mcp';
```

## 🔍 **Troubleshooting:**

### **If IP Address Doesn't Work:**
1. **Check your NestJS API is running**: `curl http://192.168.1.228:3001/api/v1/health`
2. **Check firewall**: Make sure port 3001 is not blocked
3. **Check network**: Ensure your device and computer are on the same network

### **If ngrok Doesn't Work:**
1. **Check ngrok status**: Visit `http://localhost:4040` to see ngrok dashboard
2. **Check HTTPS**: Make sure to use `https://` in the URLs
3. **Check tunnel**: Ensure the tunnel is active and not expired

## 🎉 **Expected Results:**

After fixing the network configuration, you should see:
- ✅ **No more "Network request failed" errors**
- ✅ **Real images loading from your NestJS API**
- ✅ **MCP assistant connecting successfully**
- ✅ **Upload functionality working**
- ✅ **Search working with real data**

## 📱 **Testing:**

1. **Gallery**: Should load real images from your API
2. **Search**: Should search through your actual data
3. **Upload**: Should upload to your S3 storage
4. **Assistant**: Should connect to your MCP server
5. **Image Details**: Should show real image metadata

## 🚀 **Ready to Go!**

Your mobile app should now connect properly to your NestJS API and MCP server. The fallback system will still work if there are any connection issues, but now you'll get real data when everything is running!

**The app is now properly configured for network access!** 🎉
