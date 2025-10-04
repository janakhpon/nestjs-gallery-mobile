// Environment configuration
export const config = {
  // API Configuration
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://collaterally-ungrumpy-torrie.ngrok-free.dev/api/v1',
  mcpUrl: process.env.EXPO_PUBLIC_MCP_URL || 'https://collaterally-ungrumpy-torrie.ngrok-free.dev/api/v1/mcp',
  
  // App Configuration
  appVersion: '1.0.0',
  debug: __DEV__,
  
  // Network Configuration
  networkTimeout: 30000,
  retryAttempts: 3,
};

export const getApiUrl = () => config.apiUrl;
export const getMcpUrl = () => config.mcpUrl;
export const isDevelopment = () => __DEV__;
