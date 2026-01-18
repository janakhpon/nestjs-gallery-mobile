import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageCard } from "../src/features/gallery/components/ImageCard";
import { useImages } from "../src/features/gallery/hooks/useImages";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function GalleryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const scale = useSharedValue(1);

  // Use the React Query hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useImages(searchQuery);

  // Flatten the pages into a single array of images
  const images = data?.pages.flatMap((page) => page.images) || [];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onPressInFab = () => {
    scale.value = withSpring(0.9);
  };

  const onPressOutFab = () => {
    scale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Compact Header */}
        <Animated.View
          entering={FadeInUp.duration(600).springify()}
          style={styles.header}
        >
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#64748b"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search gallery..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons name="close-circle" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => router.push("/upload")}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={28} color="#0f172a" />
          </TouchableOpacity>
        </Animated.View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0f172a" />
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Ionicons name="cloud-offline-outline" size={48} color="#cbd5e1" />
            <Text style={styles.errorText}>Unable to load gallery</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.FlatList
            entering={FadeInDown.duration(600).springify()}
            data={images}
            renderItem={({ item }: { item: any }) => <ImageCard item={item} />}
            keyExtractor={(item: any) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="small" color="#64748b" />
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Ionicons name="images-outline" size={48} color="#cbd5e1" />
                <Text style={styles.emptyText}>No images found</Text>
              </View>
            }
          />
        )}

        {/* Floating Assistant Button */}
        <AnimatedTouchableOpacity
          style={[styles.fab, fabAnimatedStyle]}
          onPress={() => router.push("/assistant")}
          onPressIn={onPressInFab}
          onPressOut={onPressOutFab}
          activeOpacity={0.9}
        >
          <Ionicons
            name="sparkles"
            size={28}
            color="#ffffff"
            style={styles.fabIcon}
          />
        </AnimatedTouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "#ffffff",
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    height: "100%",
  },
  uploadButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  row: {
    justifyContent: "space-between",
    gap: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loaderContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#0f172a",
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 100,
  },
  fabIcon: {
    marginLeft: 2,
  },
});
