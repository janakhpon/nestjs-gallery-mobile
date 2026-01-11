import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { mcpClient, MCPResponse } from "../src/services/mcp-client";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isOffline?: boolean;
  imageUri?: string;
}

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      text: "Assistant ready. How can I help?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Test MCP connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const testConnection = async () => {
    try {
      const connected = await mcpClient.testConnection();
      setIsConnected(connected);

      if (connected) {
        setMessages((prev) => {
          const hasSuccess = prev.some((msg) => msg.id.startsWith("success-"));
          if (!hasSuccess) {
            const successMessage: Message = {
              id: `success-${Date.now()}`,
              text: "System online. Connected to gallery.",
              isUser: false,
              timestamp: new Date(),
            };
            return [...prev, successMessage];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setIsConnected(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim() || (selectedImage ? "Image attachment" : ""),
      isUser: true,
      timestamp: new Date(),
      imageUri: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const response: MCPResponse = await mcpClient.sendMessage({
        message: userMessage.text,
        context: {
          timestamp: userMessage.timestamp.toISOString(),
          isConnected,
          hasImage: !!selectedImage,
        },
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: response.content,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Message send failed:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Connection error. Please try again.",
        isUser: false,
        timestamp: new Date(),
        isOffline: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser
          ? styles.userMessageContainer
          : styles.assistantMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
        )}
        {item.text && (
          <Text
            style={[
              styles.messageText,
              item.isUser ? styles.userText : styles.assistantText,
            ]}
          >
            {item.text}
          </Text>
        )}
      </View>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Assistant</Text>
          <View style={styles.statusRow}>
            <View
              style={[styles.statusDot, isConnected && styles.statusDotActive]}
            />
            <Text style={styles.statusText}>
              {isConnected ? "Active" : "Connecting"}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#94a3b8" />
        </View>
      )}

      <View style={styles.inputArea}>
        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <Ionicons name="close-circle" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
            <Ionicons name="add" size={26} color="#000" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#94a3b8"
            multiline
            editable={!isTyping}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && !selectedImage && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={(!inputText.trim() && !selectedImage) || isTyping}
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#cbd5e1",
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: "#22c55e",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 24,
    gap: 20,
  },
  messageContainer: {
    maxWidth: "85%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  assistantMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#000000",
  },
  assistantBubble: {
    backgroundColor: "#f1f5f9",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#ffffff",
  },
  assistantText: {
    color: "#000000",
  },
  timestamp: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 6,
    marginHorizontal: 4,
  },
  typingContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  removeImageButton: {
    marginLeft: -12,
    marginTop: -12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
});
