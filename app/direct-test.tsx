import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DirectTestScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testDirectConnection = async () => {
    setIsLoading(true);
    addResult('Testing direct fetch to MCP endpoint...');
    
    try {
      const url = 'https://collaterally-ungrumpy-torrie.ngrok-free.dev/api/v1/mcp/chat';
      addResult(`URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, this is a direct test',
          context: {}
        }),
      });

      addResult(`Response status: ${response.status}`);
      addResult(`Response ok: ${response.ok}`);
      
      if (response.ok) {
        const data = await response.json();
        addResult(`Response data: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorText = await response.text();
        addResult(`Error response: ${errorText}`);
      }
    } catch (error) {
      addResult(`Fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      addResult(`Error details: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testEnvironmentConfig = () => {
    addResult('Testing environment configuration...');
    try {
      const { config } = require('../src/config/environment');
      addResult(`API URL: ${config.apiUrl}`);
      addResult(`MCP URL: ${config.mcpUrl}`);
    } catch (error) {
      addResult(`Config error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Direct Connection Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]} 
          onPress={testDirectConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : 'Test Direct Fetch'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={testEnvironmentConfig}
        >
          <Text style={styles.buttonText}>Test Config</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
          <Text style={styles.clearButtonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </ScrollView>
    </View>
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
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  resultText: {
    fontSize: 12,
    color: '#1e293b',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});
