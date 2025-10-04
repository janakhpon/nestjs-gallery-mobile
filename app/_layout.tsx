import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8fafc',
          },
          headerTintColor: '#1e293b',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Home',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="gallery" 
          options={{ 
            title: 'Gallery',
            headerBackTitle: 'Back'
          }} 
        />
        <Stack.Screen 
          name="upload" 
          options={{ 
            title: 'Upload Image',
            headerBackTitle: 'Back'
          }} 
        />
        <Stack.Screen 
          name="assistant" 
          options={{ 
            title: 'AI Assistant',
            headerBackTitle: 'Back'
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});