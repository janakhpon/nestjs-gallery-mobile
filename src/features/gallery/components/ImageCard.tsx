import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image as ApiImage } from "../../../services/api-client";

interface ImageCardProps {
  item: ApiImage;
}

export const ImageCard: React.FC<ImageCardProps> = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/image/${item.id}`)}
      activeOpacity={0.9}
    >
      <Image
        source={{
          uri: item.s3Url || `https://picsum.photos/300/200?random=${item.id}`,
          headers: item.s3Url?.includes("ngrok")
            ? { "ngrok-skip-browser-warning": "true" }
            : {},
        }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || "Untitled"}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {item.description || "No description provided"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#f1f5f9",
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#64748b",
  },
});
