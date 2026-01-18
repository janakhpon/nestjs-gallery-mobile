import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { asyncStoragePersister, queryClient } from "../src/lib/query-client";

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerShadowVisible: false,
            headerTintColor: "#0f172a",
            headerTitleStyle: {
              fontWeight: "700",
              fontSize: 18,
            },
            contentStyle: {
              backgroundColor: "#ffffff",
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="upload"
            options={{
              title: "New Entry",
              presentation: "modal", // Optional: nicer for upload too
              headerShown: false, // We have custom header in upload.tsx
            }}
          />
          <Stack.Screen
            name="assistant"
            options={{
              presentation: "modal",
              headerShown: false,
              sheetAllowedDetents: [1.0],
              sheetGrabberVisible: true,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
