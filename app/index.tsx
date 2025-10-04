import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gallery App</Text>
        <Text style={styles.subtitle}>Simple Mobile Gallery</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresContainer}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/gallery')}
          >
            <Ionicons name="images-outline" size={32} color="#3b82f6" />
            <Text style={styles.featureTitle}>Gallery</Text>
            <Text style={styles.featureDescription}>
              View and manage your images
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/upload')}
          >
            <Ionicons name="cloud-upload-outline" size={32} color="#3b82f6" />
            <Text style={styles.featureTitle}>Upload</Text>
            <Text style={styles.featureDescription}>
              Add new images to your gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/assistant')}
          >
            <Ionicons name="chatbubble-outline" size={32} color="#3b82f6" />
            <Text style={styles.featureTitle}>Assistant</Text>
            <Text style={styles.featureDescription}>
              Get help with your gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/test-mcp')}
          >
            <Ionicons name="bug-outline" size={32} color="#ef4444" />
            <Text style={styles.featureTitle}>Test MCP</Text>
            <Text style={styles.featureDescription}>
              Test MCP connection specifically
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/direct-test')}
          >
            <Ionicons name="flash-outline" size={32} color="#f59e0b" />
            <Text style={styles.featureTitle}>Direct Test</Text>
            <Text style={styles.featureDescription}>
              Test direct fetch to MCP endpoint
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#3b82f6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>About This App</Text>
            <Text style={styles.infoText}>
              This is a simple gallery app that connects to your NestJS backend. 
              You can view, upload, and manage your images.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});