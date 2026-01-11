import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../src/services/api-client";

export default function UploadScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Access needed to upload content.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !title.trim()) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);
      formData.append("title", title);
      if (description.trim()) {
        formData.append("description", description);
      }

      await apiClient.createImage(formData);
      console.log("Upload successful");

      Alert.alert("Success", "Added to collection", [
        { text: "Done", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", "Upload failed. Please retry.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Image</Text>
      </View>

      <View style={styles.content}>
        {/* Image Selection */}
        <View style={styles.section}>
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
              >
                <Ionicons name="refresh" size={16} color="#000" />
                <Text style={styles.changeImageText}>Replace</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imageSelectionButton}
              onPress={pickImage}
            >
              <Ionicons name="cloud-upload-outline" size={40} color="#cbd5e1" />
              <Text style={styles.imageSelectionButtonText}>
                Select from Library
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Image Details */}
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Description (optional)"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedImage || !title.trim() || isUploading) &&
              styles.disabledButton,
          ]}
          onPress={handleUpload}
          disabled={!selectedImage || !title.trim() || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.uploadButtonText}>Create Entry</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: -0.5,
  },
  content: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  imageSelectionButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    height: 200,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderStyle: "dashed",
  },
  imageSelectionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 12,
  },
  selectedImageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#f8fafc",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
  },
  changeImageText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000000",
    marginLeft: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.3,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
