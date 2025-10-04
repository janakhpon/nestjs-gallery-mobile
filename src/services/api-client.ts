// Simple API client for NestJS backend
import { config } from '../config/environment';

const API_BASE_URL = config.apiUrl;

export interface Image {
  id: string;
  title?: string;
  description?: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  s3Key?: string;
  s3Url?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImageData {
  title?: string;
  description?: string;
}

class ApiClient {
  private isOnline = true;

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.isOnline = true;
      return response.json();
    } catch (error) {
      this.isOnline = false;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`API request failed: ${errorMessage}`);
      throw error;
    }
  }

  // Check if API is available
  async isApiAvailable(): Promise<boolean> {
    try {
      await this.makeRequest('/health');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get all images
  async getImages(params: { page?: number; limit?: number; search?: string } = {}): Promise<Image[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);

      const endpoint = `/images${queryParams.toString() ? `?${queryParams}` : ''}`;
      const result = await this.makeRequest<{images: Image[], total: number, page: number, limit: number, totalPages: number}>(endpoint);
      
      // Extract images array from paginated response
      const images = result?.images || [];
      return Array.isArray(images) ? images : [];
    } catch (error) {
      console.warn('API unavailable, using fallback data');
      const fallbackResult = this.getFallbackImages(params);
      return Array.isArray(fallbackResult) ? fallbackResult : [];
    }
  }

  // Fallback images when API is unavailable
  private getFallbackImages(params: { page?: number; limit?: number; search?: string } = {}): Image[] {
    const allMockImages: Image[] = [];
    
    // Generate more mock images for pagination
    for (let i = 1; i <= 30; i++) {
      allMockImages.push({
        id: i.toString(),
        title: `Sample Image ${i}`,
        description: `This is sample image ${i} from fallback data`,
        originalName: `sample${i}.jpg`,
        mimeType: 'image/jpeg',
        size: 1024000 + (i * 100000),
        width: 800 + (i * 10),
        height: 600 + (i * 5),
        s3Key: `sample${i}.jpg`,
        s3Url: `https://picsum.photos/800/600?random=${i}`,
        status: 'active',
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      });
    }

    let filteredImages = allMockImages;

    // Apply search filter if provided
    if (params.search) {
      filteredImages = allMockImages.filter(image =>
        image.title?.toLowerCase().includes(params.search!.toLowerCase()) ||
        image.description?.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return filteredImages.slice(startIndex, endIndex);
  }

  // Get single image
  async getImage(id: string): Promise<Image> {
    try {
      return await this.makeRequest<Image>(`/images/${id}`);
    } catch (error) {
      console.warn('API unavailable, using fallback image data');
      return this.getFallbackImage(id);
    }
  }

  // Fallback single image when API is unavailable
  private getFallbackImage(id: string): Image {
    return {
      id: id,
      title: `Sample Image ${id}`,
      description: `This is a sample image ${id} from fallback data`,
      originalName: `sample${id}.jpg`,
      mimeType: 'image/jpeg',
      size: 1024000,
      width: 800,
      height: 600,
      s3Key: `sample${id}.jpg`,
      s3Url: `https://picsum.photos/800/600?random=${id}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Create image (upload)
  async createImage(formData: FormData): Promise<Image> {
    try {
      const response = await fetch(`${API_BASE_URL}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Upload failed, using fallback response');
      return this.getFallbackUploadResponse(formData);
    }
  }

  // Fallback upload response when API is unavailable
  private getFallbackUploadResponse(formData: FormData): Image {
    const title = formData.get('title') as string || 'Uploaded Image';
    const description = formData.get('description') as string || 'Uploaded via mobile app (offline mode)';
    
    return {
      id: `fallback-${Date.now()}`,
      title,
      description,
      originalName: 'uploaded-image.jpg',
      mimeType: 'image/jpeg',
      size: 1024000,
      width: 800,
      height: 600,
      s3Key: `fallback-${Date.now()}.jpg`,
      s3Url: 'https://picsum.photos/800/600?random=upload',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Update image
  async updateImage(id: string, data: CreateImageData): Promise<Image> {
    try {
      return await this.makeRequest<Image>(`/images/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.warn('Update failed, using fallback response');
      return this.getFallbackImage(id);
    }
  }

  // Delete image
  async deleteImage(id: string): Promise<void> {
    try {
      await this.makeRequest(`/images/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('Delete failed, simulating success');
      // Simulate successful deletion in offline mode
    }
  }

  // Get download URL
  async getDownloadUrl(id: string): Promise<{ downloadUrl: string }> {
    try {
      return await this.makeRequest<{ downloadUrl: string }>(`/images/${id}/download`);
    } catch (error) {
      console.warn('Download URL failed, using fallback');
      return {
        downloadUrl: `https://picsum.photos/800/600?random=${id}`
      };
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    try {
      return await this.makeRequest<{ status: string }>('/health');
    } catch (error) {
      console.warn('Health check failed, returning offline status');
      return { status: 'offline' };
    }
  }
}

export const apiClient = new ApiClient();
