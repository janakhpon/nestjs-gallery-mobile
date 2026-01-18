// Simple API client for NestJS backend
import { config } from "../config/environment";

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

export interface ImagesResponse {
  images: Image[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ApiClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          ...options.headers,
        },
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        console.warn(`API Error response for ${url}:`, text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  // Helper to rewrite local S3 URLs to proxy URLs
  private mapImageUrls(images: Image[]): Image[] {
    return images.map((img) => {
      if (
        img.s3Url?.includes("127.0.0.1") ||
        img.s3Url?.includes("localhost")
      ) {
        return {
          ...img,
          s3Url: `${API_BASE_URL}/images/${img.id}/proxy`,
        };
      }
      return img;
    });
  }

  // Get all images
  async getImages(
    params: { page?: number; limit?: number; search?: string } = {},
  ): Promise<ImagesResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);

    const endpoint = `/images${queryParams.toString() ? `?${queryParams}` : ""}`;
    const result = await this.makeRequest<ImagesResponse>(endpoint);

    return {
      ...result,
      images: this.mapImageUrls(
        Array.isArray(result?.images) ? result.images : [],
      ),
    };
  }

  // Get single image
  async getImage(id: string): Promise<Image> {
    const result = await this.makeRequest<Image>(`/images/${id}`);
    return this.mapImageUrls([result])[0];
  }

  // Create image (upload)
  async createImage(formData: FormData): Promise<Image> {
    const response = await fetch(`${API_BASE_URL}/images`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Update image
  async updateImage(id: string, data: CreateImageData): Promise<Image> {
    const result = await this.makeRequest<Image>(`/images/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return this.mapImageUrls([result])[0];
  }

  // Delete image
  async deleteImage(id: string): Promise<void> {
    await this.makeRequest(`/images/${id}`, {
      method: "DELETE",
    });
  }

  // Get download URL
  async getDownloadUrl(id: string): Promise<{ downloadUrl: string }> {
    return await this.makeRequest<{ downloadUrl: string }>(
      `/images/${id}/download`,
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return await this.makeRequest<{ status: string }>("/health");
  }

  // Get base URL for proxy needs
  getBaseUrl(): string {
    return API_BASE_URL;
  }
}

export const apiClient = new ApiClient();
