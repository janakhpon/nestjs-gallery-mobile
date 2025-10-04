import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { apiClient, Image as ApiImage } from '../src/services/api-client';

export default function GalleryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<ApiImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure images is always an array
  const safeImages = Array.isArray(images) ? images : [];

  // Load images from API
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async (page: number = 1, append: boolean = false) => {
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
        search: searchQuery || undefined 
      });
      
      // Ensure data is always an array
      const safeData = Array.isArray(data) ? data : [];
      
      if (append) {
        setImages(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          return [...prevArray, ...safeData];
        });
      } else {
        setImages(safeData);
      }
      
      // For fallback data, we'll simulate pagination
      setHasMore(safeData.length === 10);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load images:', error);
      setIsError(false);
      
      try {
        // The API client will return fallback data automatically
        const fallbackData = await apiClient.getImages({ 
          page, 
          limit: 10,
          search: searchQuery || undefined 
        });
        
        // Ensure fallback data is always an array
        const safeFallbackData = Array.isArray(fallbackData) ? fallbackData : [];
        
        if (append) {
          setImages(prev => {
            const prevArray = Array.isArray(prev) ? prev : [];
            return [...prevArray, ...safeFallbackData];
          });
        } else {
          setImages(safeFallbackData);
        }
        
        setHasMore(safeFallbackData.length === 10);
        setCurrentPage(page);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        // If even fallback fails, ensure we have an empty array
        if (append) {
          setImages(prev => Array.isArray(prev) ? prev : []);
        } else {
          setImages([]);
        }
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

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
  const filteredImages = safeImages.filter(image =>
    (image.title?.toLowerCase().includes((searchQuery || '').toLowerCase()) || false) ||
    (image.description?.toLowerCase().includes((searchQuery || '').toLowerCase()) || false)
  );

  const renderImage = ({ item }: { item: ApiImage }) => (
    <TouchableOpacity 
      style={styles.imageCard}
      onPress={() => router.push(`/image/${item.id}`)}
    >
      <Image
        source={{ 
          uri: item.s3Url || `https://picsum.photos/300/200?random=${item.id}` 
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.imageInfo}>
        <Text style={styles.imageTitle} numberOfLines={1}>
          {item.title || 'Untitled'}
        </Text>
        <Text style={styles.imageDescription} numberOfLines={2}>
          {item.description || 'No description'}
        </Text>
        <Text style={styles.imageDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="add" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search images..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Images Grid */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading images...</Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={styles.errorTitle}>Failed to load images</Text>
          <Text style={styles.errorSubtitle}>
            Please check your connection and try again
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadImages()}>
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
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={64} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No images found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try adjusting your search terms' : 'Upload your first image to get started'}
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  uploadButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  imageCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageInfo: {
    padding: 12,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  imageDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  imageDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
});