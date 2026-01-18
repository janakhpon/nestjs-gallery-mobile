// Simple MCP client for chat assistant
import { config } from "../config/environment";

const MCP_BASE_URL = config.mcpUrl;

export interface MCPRequest {
  message: string;
  context?: Record<string, any>;
  provider?: "openai" | "gemini";
}

export interface MCPResponse {
  content: string;
  metadata?: {
    offline?: boolean;
    timestamp?: string;
  };
}

class MCPClient {
  private isOnline = false;

  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${MCP_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`MCP error! status: ${response.status}`);
      }

      this.isOnline = true;
      return response.json();
    } catch (error) {
      this.isOnline = false;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn(`MCP request failed: ${errorMessage}`);
      throw error;
    }
  }

  // Send message to MCP server
  async sendMessage(request: MCPRequest): Promise<MCPResponse> {
    try {
      console.log("Sending MCP message to:", `${MCP_BASE_URL}/chat`);
      console.log("Request:", request);

      const response = await this.makeRequest<MCPResponse>("/chat", request);

      console.log("MCP response received:", response);
      return response;
    } catch (error) {
      console.error("MCP request failed:", error);
      console.error("Error details:", error);
      // Return intelligent fallback response
      return this.getFallbackResponse(request.message);
    }
  }

  // Get intelligent fallback response when MCP is unavailable
  private getFallbackResponse(message: string): MCPResponse {
    const lowerMessage = message.toLowerCase();

    // Gallery-related responses
    if (
      lowerMessage.includes("gallery") ||
      lowerMessage.includes("image") ||
      lowerMessage.includes("photo")
    ) {
      return {
        content:
          "I can help you with your gallery! You can view images, upload new ones, and search through your collection. The gallery is currently in offline mode, but you can still browse the sample images.",
        metadata: {
          offline: true,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // Upload-related responses
    if (
      lowerMessage.includes("upload") ||
      lowerMessage.includes("add") ||
      lowerMessage.includes("new")
    ) {
      return {
        content:
          "To upload images, go to the Upload tab and select an image from your device. You can add a title and description. Note: Uploads are currently in offline mode.",
        metadata: {
          offline: true,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // Search-related responses
    if (
      lowerMessage.includes("search") ||
      lowerMessage.includes("find") ||
      lowerMessage.includes("look")
    ) {
      return {
        content:
          "You can search through your images using the search box in the Gallery tab. Try searching by title or description. The search works on the sample images in offline mode.",
        metadata: {
          offline: true,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // Help-related responses
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("how") ||
      lowerMessage.includes("what")
    ) {
      return {
        content:
          "I'm your gallery assistant! I can help you with:\n• Viewing and managing your images\n• Uploading new photos\n• Searching through your collection\n• General gallery questions\n\nI'm currently in offline mode, but I can still provide basic assistance.",
        metadata: {
          offline: true,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // Default fallback response
    return {
      content:
        "I'm currently offline, but I can still help you with basic gallery questions. Try asking about viewing images, uploading photos, or searching your collection. When I'm back online, I'll have access to more advanced features!",
      metadata: {
        offline: true,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Get chat history
  async getChatHistory(): Promise<MCPResponse[]> {
    try {
      return await this.makeRequest<MCPResponse[]>("/history", {});
    } catch (error) {
      console.error("Failed to get chat history:", error);
      return [];
    }
  }

  // Test MCP connection
  async testConnection(): Promise<boolean> {
    try {
      console.log("Testing MCP connection to:", `${MCP_BASE_URL}/chat`);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Test with a simple message instead of health endpoint
      const response = await fetch(`${MCP_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "test",
          context: {},
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("MCP response status:", response.status);
      console.log("MCP response ok:", response.ok);

      const isConnected = response.ok;
      this.isOnline = isConnected;
      return isConnected;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn("MCP connection test failed:", errorMessage);
      console.warn("Error details:", error);
      this.isOnline = false;
      return false;
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isOnline;
  }
}

export const mcpClient = new MCPClient();
