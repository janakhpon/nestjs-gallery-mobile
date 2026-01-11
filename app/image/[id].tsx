import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient, Image as ApiImage } from "../../src/services/api-client";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ImageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [image, setImage] = useState<ApiImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (id) {
      loadImage();
    }
  }, [id]);

  const loadImage = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      // Try to get from API first
      try {
        const data = await apiClient.getImage(id!);
        setImage(data);
      } catch (error) {
        // If API fails, create a fallback image
        const fallbackImage: ApiImage = {
          id: id!,
          title: "Sample Image",
          description: "This is a sample image from fallback data",
          originalName: "sample.jpg",
          mimeType: "image/jpeg",
          size: 1024000,
          width: 800,
          height: 600,
          s3Key: "sample.jpg",
          s3Url: `https://picsum.photos/800/600?random=${id}`,
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setImage(fallbackImage);
      }
    } catch (error) {
      console.error("Failed to load image:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!image) return;

    try {
      const { downloadUrl } = await apiClient.getDownloadUrl(image.id);
      Alert.alert("Download", `Download URL: ${downloadUrl}`);
    } catch (error) {
      Alert.alert("Download", "Download feature not available in offline mode");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.deleteImage(image!.id);
            Alert.alert("Success", "Image deleted successfully", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (error) {
            Alert.alert("Error", "Failed to delete image");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading image...</Text>
      </View>
    );
  }

  if (isError || !image) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text style={styles.errorTitle}>Failed to load image</Text>
        <Text style={styles.errorSubtitle}>
          Please check your connection and try again
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadImage}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Image Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              image.s3Url || `https://picsum.photos/800/600?random=${image.id}`,
            headers: image.s3Url?.includes("ngrok")
              ? { "ngrok-skip-browser-warning": "true" }
              : {},
          }}
          style={styles.image}
          contentFit="contain"
          transition={200}
          onLoadStart={() =>
            console.log(
              `[Detail] Loading started for ${image.id}: ${image.s3Url}`
            )
          }
          onLoad={() => console.log(`[Detail] Loading success for ${image.id}`)}
          onError={(error) =>
            console.error(`[Detail] Image load error for ${image.id}:`, error)
          }
        />
      </View>

      {/* Image Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{image.title || "Untitled"}</Text>
        <Text style={styles.description}>
          {image.description || "No description available"}
        </Text>

        {/* Metadata */}
        <View style={styles.metadataContainer}>
          <View style={styles.metadataItem}>
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <Text style={styles.metadataText}>
              {new Date(image.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {image.width && image.height && (
            <View style={styles.metadataItem}>
              <Ionicons name="resize-outline" size={16} color="#64748b" />
              <Text style={styles.metadataText}>
                {image.width} × {image.height}
              </Text>
            </View>
          )}

          <View style={styles.metadataItem}>
            <Ionicons name="document-outline" size={16} color="#64748b" />
            <Text style={styles.metadataText}>
              {(image.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
          <Ionicons name="download-outline" size={20} color="#3b82f6" />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={[styles.actionButtonText, { color: "#ef4444" }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    backgroundColor: "#ffffff",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: screenHeight * 0.4,
    backgroundColor: "#f1f5f9",
  },
  infoContainer: {
    backgroundColor: "#ffffff",
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 24,
    marginBottom: 16,
  },
  metadataContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 16,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 16,
    marginTop: 0,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minWidth: 120,
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3b82f6",
    marginLeft: 8,
  },
});
