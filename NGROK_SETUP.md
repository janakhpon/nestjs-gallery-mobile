# 🚀 ngrok Setup Guide - Perfect for Mobile Development!

## 🎯 **Why ngrok is Better for Mobile Development**

ngrok is the **best solution** for mobile app development because:
- ✅ **Works everywhere**: No network configuration needed
- ✅ **HTTPS by default**: Secure connections
- ✅ **Public URLs**: Works on any device, anywhere
- ✅ **No firewall issues**: Bypasses network restrictions
- ✅ **Easy to use**: Simple setup and management

## 🛠️ **Quick Setup (Already Done!)**

I've already installed ngrok and created helper scripts for you!

### **1. Start ngrok tunnel:**
```bash
./scripts/start-ngrok.sh
```

This will:
- Start ngrok tunnel on port 3001
- Show you the public URL
- Give you instructions to update your app

### **2. Update your app configuration:**
```bash
# Replace with your actual ngrok URL
./scripts/update-config.sh https://abc123.ngrok.io
```

### **3. Start your development:**
```bash
# Terminal 1: Start your NestJS API
npm run start:dev

# Terminal 2: Start ngrok (already running from step 1)
# Keep this terminal open!

# Terminal 3: Start your mobile app
npm start
```

## 📱 **How It Works:**

1. **ngrok creates a public tunnel** to your local NestJS API
2. **Your mobile app connects** to the public ngrok URL
3. **ngrok forwards requests** to your local development server
4. **Everything works seamlessly** across any network!

## 🔧 **Manual Setup (Alternative)**

If you prefer to set it up manually:

### **1. Start ngrok:**
```bash
ngrok http 3001
```

### **2. Copy the HTTPS URL:**
You'll see something like:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3001
```

### **3. Update your configuration:**
```typescript
// In src/services/api-client.ts
const API_BASE_URL = 'https://abc123.ngrok.io/api/v1';

// In src/services/mcp-client.ts
const MCP_BASE_URL = 'https://abc123.ngrok.io/api/v1/mcp';
```

## 🎉 **Benefits of ngrok:**

### **vs Local IP Address:**
- ✅ **No network configuration**: Works on any WiFi
- ✅ **No firewall issues**: Bypasses all network restrictions
- ✅ **HTTPS security**: Encrypted connections
- ✅ **Public access**: Share with team members easily

### **vs localhost:**
- ✅ **Works on real devices**: Not just emulators
- ✅ **Works on different networks**: Home, office, mobile hotspot
- ✅ **No IP address changes**: URL stays the same

## 📊 **ngrok Dashboard:**

Visit `http://localhost:4040` to see:
- **Request logs**: See all API calls
- **Response times**: Monitor performance
- **Error tracking**: Debug connection issues
- **Traffic inspection**: See request/response details

## 🚀 **Development Workflow:**

### **Daily Development:**
1. **Start NestJS API**: `npm run start:dev`
2. **Start ngrok**: `./scripts/start-ngrok.sh`
3. **Update config**: `./scripts/update-config.sh <ngrok-url>`
4. **Start mobile app**: `npm start`
5. **Develop and test**: Everything works seamlessly!

### **Sharing with Team:**
- **Share the ngrok URL**: Team members can test on their devices
- **No setup required**: They just need the URL
- **Real device testing**: Test on actual phones/tablets

## 🔍 **Troubleshooting:**

### **ngrok not starting:**
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill any process using port 3001
kill -9 <PID>
```

### **URL not working:**
- **Check ngrok dashboard**: `http://localhost:4040`
- **Verify tunnel is active**: Should show "Online"
- **Check NestJS API**: Make sure it's running on port 3001

### **Mobile app not connecting:**
- **Check ngrok URL**: Make sure it's HTTPS
- **Verify configuration**: Check the updated files
- **Test in browser**: Visit `https://your-ngrok-url.ngrok.io/api/v1/health`

## 🎯 **Expected Results:**

After setting up ngrok, you should see:
- ✅ **No more "Network request failed" errors**
- ✅ **Real images loading from your NestJS API**
- ✅ **MCP assistant connecting successfully**
- ✅ **Upload functionality working**
- ✅ **Search working with real data**
- ✅ **Works on any device, anywhere**

## 🚀 **Ready to Go!**

ngrok is the **professional solution** for mobile development. It's what most developers use because it's reliable, secure, and works everywhere.

**Your mobile app will now have perfect connectivity to your NestJS API!** 🎉
