import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { apiClient } from '../src/services/api-client';
import { mcpClient } from '../src/services/mcp-client';

export default function DebugScreen() {
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [mcpStatus, setMcpStatus] = useState<string>('Testing...');
  const [images, setImages] = useState<any[]>([]);
  const [mcpResponse, setMcpResponse] = useState<string>('');

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    // Test API
    try {
      const apiImages = await apiClient.getImages({ limit: 3 });
      setApiStatus(`✅ API Working - Got ${apiImages.length} images`);
      setImages(apiImages);
    } catch (error) {
      setApiStatus(`❌ API Failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test MCP
    try {
      const mcpTest = await mcpClient.testConnection();
      setMcpStatus(`✅ MCP Working - ${mcpTest ? 'Connected' : 'Not Connected'}`);
      
      if (mcpTest) {
        const response = await mcpClient.sendMessage('Hello, test message');
        setMcpResponse(response.content);
      }
    } catch (error) {
      setMcpStatus(`❌ MCP Failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug Information</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Status</Text>
        <Text style={styles.status}>{apiStatus}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MCP Status</Text>
        <Text style={styles.status}>{mcpStatus}</Text>
        {mcpResponse && (
          <Text style={styles.response}>Response: {mcpResponse}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sample Images</Text>
        {images.map((image, index) => (
          <View key={image.id || index} style={styles.imageItem}>
            <Text style={styles.imageTitle}>{image.title || 'No title'}</Text>
            <Text style={styles.imageUrl}>URL: {image.s3Url || 'No URL'}</Text>
            <Text style={styles.imageId}>ID: {image.id}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={testConnections}>
        <Text style={styles.buttonText}>Test Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1e293b',
  },
  status: {
    fontSize: 14,
    color: '#64748b',
  },
  response: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 8,
    fontStyle: 'italic',
  },
  imageItem: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  imageUrl: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  imageId: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
