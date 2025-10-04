# 🔧 Assistant Debug Tools

## 🎯 **What I've Added:**

### **1. Enhanced Debugging in MCP Client:**
- Added detailed console logs to `testConnection()` method
- Added detailed console logs to `sendMessage()` method
- Increased timeout from 5 to 10 seconds
- Added error details logging

### **2. Created Test Tools:**

#### **Test MCP Screen** (`/test-mcp`):
- Tests MCP client connection
- Tests message sending
- Shows real-time results

#### **Direct Test Screen** (`/direct-test`):
- Tests direct fetch to MCP endpoint
- Bypasses MCP client completely
- Shows environment configuration
- Detailed error reporting

## 🧪 **How to Debug:**

### **Step 1: Test Direct Connection**
1. Go to **"Direct Test"** from home screen
2. Click **"Test Direct Fetch"**
3. Check the results for:
   - Response status
   - Response data
   - Any fetch errors

### **Step 2: Test MCP Client**
1. Go to **"Test MCP"** from home screen
2. Click **"Test MCP Connection"**
3. Check console logs for detailed debugging

### **Step 3: Test Assistant**
1. Go to **"Assistant"** from home screen
2. Check console logs for:
   - Connection test results
   - Message sending details
   - Error information

## 🔍 **What to Look For:**

### **Console Logs:**
```
Testing MCP connection to: https://collaterally-ungrumpy-torrie.ngrok-free.dev/api/v1/mcp/chat
MCP response status: 200
MCP response ok: true
```

### **Common Issues:**
1. **Network Error**: Mobile can't reach ngrok URL
2. **CORS Error**: Cross-origin request blocked
3. **Timeout Error**: Request taking too long
4. **404 Error**: Wrong endpoint URL

## 🎯 **Expected Results:**

### **✅ Working Connection:**
- Status: 200
- Response: `{"content": "...", "metadata": {...}}`
- Green dot in assistant

### **❌ Failed Connection:**
- Status: 404/500/Network Error
- Error message in console
- Red dot in assistant

## 🚀 **Next Steps:**

1. **Run the tests** to see what's happening
2. **Check console logs** for detailed error information
3. **Share the results** so I can help fix the specific issue

**The debug tools will show exactly what's going wrong with the MCP connection!** 🔧
