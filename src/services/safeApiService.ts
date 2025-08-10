/**
 * Enhanced API Service with Safe Error Handling
 * Provides safe API call wrappers with comprehensive error handling
 */

import { ApiError } from './api';

// Response types for different scenarios
export interface SafeApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  status: 'success' | 'error' | 'empty' | 'loading';
  metadata?: {
    responseTime: number;
    retryCount: number;
    cached: boolean;
  };
}

// Configuration for API safety
export interface SafeApiConfig {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  enableCache?: boolean;
  cacheTime?: number;
  showNotification?: boolean;
}

const defaultConfig: SafeApiConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  enableCache: false,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  showNotification: true
};

// Cache storage
const apiCache = new Map<string, { data: any; timestamp: number }>();

/**
 * Enhanced API Service with comprehensive error handling
 */
export class SafeApiService {
  private config: SafeApiConfig;

  constructor(config: Partial<SafeApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Safe API call wrapper with retry logic and error handling
   */
  async safeCall<T>(
    apiCall: () => Promise<T>,
    errorMessage: string = 'حدث خطأ غير متوقع',
    config?: Partial<SafeApiConfig>
  ): Promise<SafeApiResponse<T>> {
    const mergedConfig = { ...this.config, ...config };
    const startTime = Date.now();
    let retryCount = 0;

    while (retryCount <= (mergedConfig.maxRetries || 0)) {
      try {
        // Check cache if enabled
        if (mergedConfig.enableCache) {
          const cacheKey = this.generateCacheKey(apiCall.toString());
          const cached = this.getCachedData<T>(cacheKey, mergedConfig.cacheTime || 0);
          if (cached) {
            return {
              success: true,
              data: cached,
              error: null,
              status: 'success',
              metadata: {
                responseTime: Date.now() - startTime,
                retryCount,
                cached: true
              }
            };
          }
        }

        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), mergedConfig.timeout);
        });

        // Execute API call with timeout
        const result = await Promise.race([
          apiCall(),
          timeoutPromise
        ]);

        // Cache result if enabled
        if (mergedConfig.enableCache && result) {
          const cacheKey = this.generateCacheKey(apiCall.toString());
          this.setCachedData(cacheKey, result);
        }

        // Check if result is empty
        const isEmpty = this.isEmptyResult(result);

        return {
          success: true,
          data: result,
          error: null,
          status: isEmpty ? 'empty' : 'success',
          metadata: {
            responseTime: Date.now() - startTime,
            retryCount,
            cached: false
          }
        };

      } catch (error) {
        

        // If this is the last retry, return error
        if (retryCount >= (mergedConfig.maxRetries || 0)) {
          const errorMsg = this.getErrorMessage(error, errorMessage);
          
          // Show notification if enabled
          if (mergedConfig.showNotification) {
            this.showErrorNotification(errorMsg);
          }

          return {
            success: false,
            data: null,
            error: errorMsg,
            status: 'error',
            metadata: {
              responseTime: Date.now() - startTime,
              retryCount,
              cached: false
            }
          };
        }

        // Wait before retry
        if (mergedConfig.retryDelay && retryCount < (mergedConfig.maxRetries || 0)) {
          await this.delay(mergedConfig.retryDelay * (retryCount + 1)); // Exponential backoff
        }

        retryCount++;
      }
    }

    // Should never reach here, but just in case
    return {
      success: false,
      data: null,
      error: errorMessage,
      status: 'error',
      metadata: {
        responseTime: Date.now() - startTime,
        retryCount,
        cached: false
      }
    };
  }

  /**
   * Batch API calls with error isolation
   */
  async safeBatch<T>(
    apiCalls: Array<{ call: () => Promise<T>; name: string; errorMessage?: string }>,
    config?: Partial<SafeApiConfig>
  ): Promise<Array<SafeApiResponse<T>>> {
    const results = await Promise.allSettled(
      apiCalls.map(({ call, errorMessage }) => 
        this.safeCall(call, errorMessage, config)
      )
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          data: null,
          error: apiCalls[index].errorMessage || 'حدث خطأ في العملية',
          status: 'error' as const,
          metadata: {
            responseTime: 0,
            retryCount: 0,
            cached: false
          }
        };
      }
    });
  }

  /**
   * Paginated data handler with performance optimization
   */
  async safePaginatedCall<T>(
    apiCall: (page: number, size: number) => Promise<{ items: T[]; totalItems: number; totalPages: number }>,
    options: {
      maxItemsPerPage?: number;
      maxTotalItems?: number;
      errorMessage?: string;
    } = {}
  ): Promise<SafeApiResponse<{ items: T[]; totalItems: number; totalPages: number; performanceWarning?: string }>> {
    const { maxItemsPerPage = 50, maxTotalItems = 1000, errorMessage = 'فشل في تحميل البيانات' } = options;

    try {
      // First, get the first page to check total items
      const firstPageResult = await this.safeCall(
        () => apiCall(1, Math.min(maxItemsPerPage, 10)), // Start with small page
        errorMessage
      );

      if (!firstPageResult.success || !firstPageResult.data) {
        return firstPageResult as SafeApiResponse<any>;
      }

      const { items, totalItems, totalPages } = firstPageResult.data;

      // Performance check
      let performanceWarning;
      if (totalItems > maxTotalItems) {
        performanceWarning = `تحذير: عدد العناصر كبير جداً (${totalItems}). قد يؤثر على الأداء.`;
        
      }

      // If total items is small, return first page
      if (totalItems <= maxItemsPerPage) {
        return {
          success: true,
          data: {
            items,
            totalItems,
            totalPages,
            performanceWarning
          },
          error: null,
          status: items.length === 0 ? 'empty' : 'success',
          metadata: firstPageResult.metadata
        };
      }

      // For large datasets, suggest pagination
      return {
        success: true,
        data: {
          items,
          totalItems,
          totalPages,
          performanceWarning: performanceWarning || (totalItems > 100 ? 'يُنصح بالتصفح عبر الصفحات لتحسين الأداء' : undefined)
        },
        error: null,
        status: 'success',
        metadata: firstPageResult.metadata
      };

    } catch (error) {
      return {
        success: false,
        data: null,
        error: this.getErrorMessage(error, errorMessage),
        status: 'error',
        metadata: {
          responseTime: 0,
          retryCount: 0,
          cached: false
        }
      };
    }
  }

  /**
   * Generate cache key from function string
   */
  private generateCacheKey(functionString: string): string {
    return btoa(functionString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  /**
   * Get cached data if not expired
   */
  private getCachedData<T>(key: string, cacheTime: number): T | null {
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }
    return null;
  }

  /**
   * Set cached data
   */
  private setCachedData<T>(key: string, data: T): void {
    apiCache.set(key, { data, timestamp: Date.now() });
    
    // Clean old cache entries
    if (apiCache.size > 100) {
      const entries = Array.from(apiCache.entries());
      const sorted = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      // Remove oldest 25%
      for (let i = 0; i < Math.floor(entries.length * 0.25); i++) {
        apiCache.delete(sorted[i][0]);
      }
    }
  }

  /**
   * Check if result is empty
   */
  private isEmptyResult<T>(result: T): boolean {
    if (!result) return true;
    if (Array.isArray(result)) return result.length === 0;
    if (typeof result === 'object') {
      if ('items' in result) return (result as any).items?.length === 0;
      if ('data' in result) return (result as any).data?.length === 0;
    }
    return false;
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: any, defaultMessage: string): string {
    if (error instanceof ApiError) {
      return error.message || defaultMessage;
    }
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return 'فشل في الاتصال بالخادم. تحقق من اتصالك بالإنترنت.';
      }
      if (error.message.includes('timeout')) {
        return 'انتهت مهلة الاتصال. الخادم يستغرق وقتاً أطول من المعتاد.';
      }
      if (error.message.includes('404')) {
        return 'المورد المطلوب غير موجود.';
      }
      if (error.message.includes('401')) {
        return 'غير مخول للوصول. يرجى تسجيل الدخول مرة أخرى.';
      }
      if (error.message.includes('403')) {
        return 'ليس لديك صلاحية للوصول إلى هذا المورد.';
      }
      if (error.message.includes('500')) {
        return 'خطأ في الخادم. يرجى المحاولة لاحقاً.';
      }
      return error.message || defaultMessage;
    }

    return defaultMessage;
  }

  /**
   * Show error notification (to be implemented based on UI framework)
   */
  private showErrorNotification(message: string): void {
    // This can be implemented to show toast/notification
    
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    apiCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: apiCache.size,
      keys: Array.from(apiCache.keys())
    };
  }
}

// Create singleton instance
export const safeApiService = new SafeApiService();

// Export helper functions
export const safeApiCall = <T>(
  apiCall: () => Promise<T>,
  errorMessage?: string,
  config?: Partial<SafeApiConfig>
): Promise<SafeApiResponse<T>> => {
  return safeApiService.safeCall(apiCall, errorMessage, config);
};

export const safeBatchCall = <T>(
  apiCalls: Array<{ call: () => Promise<T>; name: string; errorMessage?: string }>,
  config?: Partial<SafeApiConfig>
): Promise<Array<SafeApiResponse<T>>> => {
  return safeApiService.safeBatch(apiCalls, config);
};

export const safePaginatedCall = <T>(
  apiCall: (page: number, size: number) => Promise<{ items: T[]; totalItems: number; totalPages: number }>,
  options?: {
    maxItemsPerPage?: number;
    maxTotalItems?: number;
    errorMessage?: string;
  }
): Promise<SafeApiResponse<{ items: T[]; totalItems: number; totalPages: number; performanceWarning?: string }>> => {
  return safeApiService.safePaginatedCall(apiCall, options);
};
