import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gallery</Text>
        <Text style={styles.subtitle}>Curate your collection</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresContainer}>
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/gallery")}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="images-outline" size={24} color="#000" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Library</Text>
              <Text style={styles.featureDescription}>
                View and manage images
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/upload")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#f1f5f9" }]}
            >
              <Ionicons name="add-outline" size={24} color="#000" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Upload</Text>
              <Text style={styles.featureDescription}>Add new content</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push("/assistant")}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#f1f5f9" }]}
            >
              <Ionicons name="sparkles-outline" size={24} color="#000" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Assistant</Text>
              <Text style={styles.featureDescription}>
                AI-powered management
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <View style={styles.showcaseContainer}>
          <Text style={styles.showcaseLabel}>Standardized via</Text>
          <View style={styles.showcaseBadge}>
            <Ionicons name="layers-outline" size={14} color="#64748b" />
            <Text style={styles.showcaseText}>Model Context Protocol</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  featuresContainer: {
    gap: 12,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
  },
  featureDescription: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  showcaseContainer: {
    marginTop: 60,
    alignItems: "center",
    paddingBottom: 40,
  },
  showcaseLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  showcaseBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  showcaseText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
});
