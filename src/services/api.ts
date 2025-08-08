/**
 * API Client for Balance Real Estate Dashboard
 * Handles all HTTP requests with authentication, error handling, and response formatting
 */

import { API_CONFIG, getApiUrl, HTTP_STATUS } from '../config/api';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiErrorData {
  type: string;
  detail: string;
  status: number;
  timestamp: string;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  signal?: AbortSignal;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL + API_CONFIG.API_PREFIX;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Get stored auth token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Build request headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const token = this.getAuthToken();
    const headers = { ...this.defaultHeaders };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }
    
    return headers;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = getApiUrl(endpoint);
    
    if (!params) return url;
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    // Handle file downloads
    if (contentType && contentType.includes('application/octet-stream')) {
      return response.blob() as any;
    }
    
    // Handle JSON responses
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new ApiError({
          type: data.type || 'api-error',
          detail: data.detail || data.message || 'An error occurred',
          status: response.status,
          timestamp: new Date().toISOString(),
        });
      }
      
      return data;
    }
    
    // Handle text responses
    const text = await response.text();
    if (!response.ok) {
      throw new ApiError({
        type: 'api-error',
        detail: text || 'An error occurred',
        status: response.status,
        timestamp: new Date().toISOString(),
      });
    }
    
    return text as any;
  }

  /**
   * Handle network and other errors
   */
  private handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error.name === 'AbortError') {
      throw new ApiError({
        type: 'request-cancelled',
        detail: 'Request was cancelled',
        status: 0,
        timestamp: new Date().toISOString(),
      });
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new ApiError({
        type: 'network-error',
        detail: 'Network error. Please check your connection.',
        status: 0,
        timestamp: new Date().toISOString(),
      });
    }
    
    throw new ApiError({
      type: 'unknown-error',
      detail: error.message || 'An unexpected error occurred',
      status: 0,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const headers = this.buildHeaders(options?.headers);
      
      const config: RequestInit = {
        method,
        headers,
        signal: options?.signal,
      };
      
      // Add body for POST, PUT, PATCH requests
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        if (data instanceof FormData) {
          // Remove Content-Type header for FormData (browser sets it automatically)
          delete headers['Content-Type'];
          config.body = data;
        } else {
          config.body = JSON.stringify(data);
        }
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, options?.timeout || API_CONFIG.TIMEOUT);
      
      config.signal = controller.signal;
      
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    
    return this.post<T>(endpoint, formData);
  }

  /**
   * Download file
   */
  async download(endpoint: string, filename?: string, options?: RequestOptions): Promise<void> {
    try {
      const blob = await this.get<Blob>(endpoint, options);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Custom error class for API errors
export class ApiError extends Error {
  public type: string;
  public detail: string;
  public status: number;
  public timestamp: string;

  constructor(error: { type: string; detail: string; status: number; timestamp: string }) {
    super(error.detail);
    this.name = 'ApiError';
    this.type = error.type;
    this.detail = error.detail;
    this.status = error.status;
    this.timestamp = error.timestamp;
  }
}
