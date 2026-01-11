import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient, Image as ApiImage } from "../src/services/api-client";

export default function GalleryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<ApiImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure images is always an array
  const safeImages = Array.isArray(images) ? images : [];

  const loadImages = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setIsError(false);

        const data = await apiClient.getImages({
          page,
          limit: 10,
          search: searchQuery || undefined,
        });

        const safeData = Array.isArray(data) ? data : [];

        if (append) {
          setImages((prev) => {
            const prevArray = Array.isArray(prev) ? prev : [];
            return [...prevArray, ...safeData];
          });
        } else {
          setImages(safeData);
        }

        setHasMore(safeData.length === 10);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery]
  );

  // Load images from API
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHasMore(true);
    loadImages(1, false);
  };

  // Load more images for infinite scroll
  const loadMoreImages = () => {
    if (!isLoadingMore && hasMore) {
      loadImages(currentPage + 1, true);
    }
  };

  // Filter images (for client-side filtering if needed)
  const filteredImages = safeImages.filter(
    (image) =>
      image.title?.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      false ||
      image.description
        ?.toLowerCase()
        .includes((searchQuery || "").toLowerCase()) ||
      false
  );

  const renderImage = ({ item }: { item: ApiImage }) => (
    <TouchableOpacity
      style={styles.imageCard}
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
        transition={200}
        onLoadStart={() =>
          console.log(`[Gallery] Loading started for ${item.id}: ${item.s3Url}`)
        }
        onLoad={() => console.log(`[Gallery] Loading success for ${item.id}`)}
        onError={(error) =>
          console.error(`[Gallery] Image load error for ${item.id}:`, error)
        }
      />
      <View style={styles.imageInfo}>
        <Text style={styles.imageTitle} numberOfLines={1}>
          {item.title || "Untitled"}
        </Text>
        <Text style={styles.imageDescription} numberOfLines={1}>
          {item.description || "No description"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => router.push("/upload")}
        >
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#94a3b8"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search collections..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      </View>

      {/* Images Grid */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error loading library</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadImages()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredImages}
          renderItem={renderImage}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreImages}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No items</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: -0.5,
  },
  uploadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    marginHorizontal: 24,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    paddingVertical: 0,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    gap: 12,
  },
  imageCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#f8fafc",
  },
  imageInfo: {
    padding: 12,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  imageDescription: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#000000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },
  loadingMoreContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
});
