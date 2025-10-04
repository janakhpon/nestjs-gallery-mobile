import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { mcpClient, MCPResponse } from '../src/services/mcp-client';

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
      id: 'welcome-message',
      text: 'Hello! I\'m your gallery assistant. I can help you with your images. What would you like to know?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const testConnection = async () => {
    try {
      console.log('Testing MCP connection...');
      const connected = await mcpClient.testConnection();
      console.log('MCP connection result:', connected);
      setIsConnected(connected);
      
      if (connected) {
        // Add success message
        setMessages(prev => {
          const hasSuccessMessage = prev.some(msg => msg.id.startsWith('success-'));
          if (!hasSuccessMessage) {
            const successMessage: Message = {
              id: `success-${Date.now()}`,
              text: '✅ Connected to MCP server! I can now help you with your gallery.',
              isUser: false,
              timestamp: new Date(),
            };
            return [...prev, successMessage];
          }
          return prev;
        });
      } else {
        // Add offline message only if not already present
        setMessages(prev => {
          const hasOfflineMessage = prev.some(msg => msg.id.startsWith('offline-'));
          if (!hasOfflineMessage) {
            const offlineMessage: Message = {
              id: `offline-${Date.now()}`,
              text: 'I\'m currently offline, but I can still help you with basic gallery questions! Try asking about viewing images, uploading photos, or searching your collection.',
              isUser: false,
              timestamp: new Date(),
              isOffline: true,
            };
            return [...prev, offlineMessage];
          }
          return prev;
        });
      }
    } catch (error) {
      console.warn('Connection test failed:', error);
      setIsConnected(false);
      
      // Add offline message only if not already present
      setMessages(prev => {
        const hasOfflineMessage = prev.some(msg => msg.id.startsWith('offline-'));
        if (!hasOfflineMessage) {
          const offlineMessage: Message = {
            id: `offline-${Date.now()}`,
            text: 'I\'m currently offline, but I can still help you with basic gallery questions! Try asking about viewing images, uploading photos, or searching your collection.',
            isUser: false,
            timestamp: new Date(),
            isOffline: true,
          };
          return [...prev, offlineMessage];
        }
        return prev;
      });
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: inputText.trim() || (selectedImage ? 'Image uploaded' : ''),
      isUser: true,
      timestamp: new Date(),
      imageUri: selectedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      console.log('Sending message to MCP:', userMessage.text);
      // Send message to MCP server
      const response: MCPResponse = await mcpClient.sendMessage({
        message: userMessage.text,
        context: {
          timestamp: userMessage.timestamp.toISOString(),
          isConnected,
          hasImage: !!selectedImage,
        },
      });

      console.log('MCP response received:', response);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: response.content,
        isUser: false,
        timestamp: new Date(),
        isOffline: response.metadata?.offline || false,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Fallback response
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date(),
        isOffline: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.assistantMessage,
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.assistantBubble,
        item.isOffline && styles.offlineBubble,
      ]}>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
        )}
        {item.text && (
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.assistantText,
            item.isOffline && styles.offlineText,
          ]}>
            {item.text}
          </Text>
        )}
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery Assistant</Text>
        <View style={styles.connectionStatus}>
          <View style={[
            styles.statusDot,
            isConnected ? styles.connectedDot : styles.disconnectedDot,
          ]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <View style={styles.inputArea}>
        {/* Selected Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
              <Ionicons name="attach" size={24} color="#64748b" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message Gallery Assistant..."
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={500}
              editable={!isTyping}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                ((!inputText.trim() && !selectedImage) || isTyping) && styles.disabledButton,
              ]}
              onPress={handleSendMessage}
              disabled={(!inputText.trim() && !selectedImage) || isTyping}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="send" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectedDot: {
    backgroundColor: '#10b981',
  },
  disconnectedDot: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  offlineBubble: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  assistantText: {
    color: '#1e293b',
  },
  offlineText: {
    color: '#92400e',
  },
  timestamp: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputArea: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Safe area for iOS
  },
  imagePreviewContainer: {
    position: 'relative',
    margin: 16,
    marginBottom: 8,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 48,
  },
  attachButton: {
    padding: 12,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    fontSize: 16,
    color: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
  },
});