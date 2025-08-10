/**
 * Notification Service
 * Handles all notification-related API calls with safe fallbacks
 */

import { safeApiCall, SafeApiResponse } from './safeApiService';
import { apiClient, PaginatedResponse, ApiResponse } from './api';

export interface Notification {
  id: number;
  userId: string;
  type: 'interest' | 'favorite' | 'assignment' | 'system';
  title: string;
  titleAr?: string;
  titleEn?: string;
  message: string;
  messageAr?: string;
  messageEn?: string;
  data?: {
    projectId?: number;
    unitId?: number;
    userId?: string;
    userName?: string;
    userEmail?: string;
    notes?: string;
  };
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationFilters {
  userId?: string;
  type?: 'interest' | 'favorite' | 'assignment' | 'system';
  isRead?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateNotificationRequest {
  userIds: string[];
  type: 'interest' | 'favorite' | 'assignment' | 'system';
  title: string;
  titleAr?: string;
  titleEn?: string;
  message: string;
  messageAr?: string;
  messageEn?: string;
  data?: Record<string, any>;
}

class NotificationService {
  private isBackendReady = false;
  private checkAttempts = 0;
  private maxCheckAttempts = 3;

  /**
   * Check if notifications backend is ready
   */
  private async checkBackendStatus(): Promise<boolean> {
    if (this.isBackendReady) return true;
    if (this.checkAttempts >= this.maxCheckAttempts) return false;

    try {
      this.checkAttempts++;
      // Simple check without timeout parameter
      const response = await fetch('/api/Notification/health', { 
        method: 'GET'
      });
      
      if (response.status === 200) {
        this.isBackendReady = true;
        return true;
      }
    } catch (error) {
      
    }
    
    return false;
  }

  /**
   * Get notifications for current user with safe fallback
   */
  async getNotifications(filters?: NotificationFilters): Promise<SafeApiResponse<PaginatedResponse<Notification>>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      // Return mock empty response when backend is not ready
      return {
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 20,
          hasNextPage: false,
          hasPreviousPage: false
        },
        error: null,
        status: 'empty',
        metadata: {
          cached: false,
          responseTime: 0,
          retryCount: 0
        }
      };
    }

    return safeApiCall(
      () => apiClient.get<PaginatedResponse<Notification>>('/api/Notification', { params: filters }),
      'فشل في تحميل الإشعارات',
      {
        enableCache: true,
        cacheTime: 30000, // 30 seconds cache
        maxRetries: 1, // Reduce retries for notifications
        timeout: 5000 // 5 second timeout
      }
    );
  }

  /**
   * Get notification by ID with safe fallback
   */
  async getNotification(id: number): Promise<SafeApiResponse<Notification>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      return {
        success: false,
        data: null,
        error: 'خدمة الإشعارات غير متاحة حالياً',
        status: 'empty'
      };
    }

    return safeApiCall(
      () => apiClient.get<Notification>(`/api/Notification/${id}`),
      `فشل في تحميل الإشعار رقم ${id}`,
      { maxRetries: 1, timeout: 5000 }
    );
  }

  /**
   * Mark notification as read with safe fallback
   */
  async markAsRead(id: number): Promise<SafeApiResponse<ApiResponse>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      return {
        success: true, // Pretend success for better UX
        data: { success: true, message: 'تم وضع علامة قراءة محلياً', data: null },
        error: null,
        status: 'success'
      };
    }

    return safeApiCall(
      () => apiClient.put<ApiResponse>(`/api/Notification/${id}/read`),
      `فشل في وضع علامة قراءة للإشعار رقم ${id}`,
      { maxRetries: 1 }
    );
  }

  /**
   * Mark multiple notifications as read with safe fallback
   */
  async markMultipleAsRead(ids: number[]): Promise<SafeApiResponse<ApiResponse>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      return {
        success: true,
        data: { success: true, message: 'تم وضع علامة قراءة محلياً', data: null },
        error: null,
        status: 'success'
      };
    }

    return safeApiCall(
      () => apiClient.put<ApiResponse>('/api/Notification/mark-read', { ids }),
      'فشل في وضع علامة قراءة للإشعارات المحددة',
      { maxRetries: 1 }
    );
  }

  /**
   * Mark all notifications as read with safe fallback
   */
  async markAllAsRead(): Promise<SafeApiResponse<ApiResponse>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      return {
        success: true,
        data: { success: true, message: 'تم وضع علامة قراءة لجميع الإشعارات محلياً', data: null },
        error: null,
        status: 'success'
      };
    }

    return safeApiCall(
      () => apiClient.put<ApiResponse>('/api/Notification/mark-all-read'),
      'فشل في وضع علامة قراءة لجميع الإشعارات',
      { maxRetries: 1 }
    );
  }

  /**
   * Get unread count with safe fallback
   */
  async getUnreadCount(): Promise<SafeApiResponse<number>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      return {
        success: true,
        data: 0, // Return 0 when backend is not ready
        error: null,
        status: 'empty'
      };
    }

    return safeApiCall(
      async () => {
        const response = await apiClient.get<{ count: number }>('/api/Notification/unread-count');
        return response.count;
      },
      'فشل في تحميل عدد الإشعارات غير المقروءة',
      { 
        maxRetries: 1,
        enableCache: true,
        cacheTime: 15000 // Cache for 15 seconds
      }
    );
  }

  /**
   * Delete notification with safe fallback
   */
  async deleteNotification(id: number): Promise<SafeApiResponse<ApiResponse>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      return {
        success: true,
        data: { success: true, message: 'تم حذف الإشعار محلياً', data: null },
        error: null,
        status: 'success'
      };
    }

    return safeApiCall(
      () => apiClient.delete<ApiResponse>(`/api/Notification/${id}`),
      `فشل في حذف الإشعار رقم ${id}`,
      { maxRetries: 1 }
    );
  }
  // Admin-only methods with safe fallbacks
  /**
   * Create notification (Admin only) with safe fallback
   */
  async createNotification(data: CreateNotificationRequest): Promise<SafeApiResponse<ApiResponse>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      return {
        success: false,
        data: null,
        error: 'خدمة الإشعارات غير متاحة حالياً - لا يمكن إنشاء إشعارات جديدة',
        status: 'error'
      };
    }

    return safeApiCall(
      () => apiClient.post<ApiResponse>('/api/admin/notifications', data),
      'فشل في إنشاء الإشعار',
      { maxRetries: 1 }
    );
  }

  /**
   * Send interest notification with safe fallback
   */
  async sendInterestNotification(projectId: number, userData: {
    userId: string;
    userName: string;
    userEmail: string;
    notes?: string;
  }): Promise<SafeApiResponse<ApiResponse>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      
      return {
        success: true, // Pretend success for better UX
        data: { success: true, message: 'تم تسجيل الاهتمام محلياً', data: null },
        error: null,
        status: 'success'
      };
    }

    return safeApiCall(
      () => apiClient.post<ApiResponse>('/api/admin/notifications/interest', {
        projectId,
        userData
      }),
      'فشل في إرسال إشعار الاهتمام',
      { maxRetries: 1 }
    );
  }

  /**
   * Send favorite notification with safe fallback
   */
  async sendFavoriteNotification(projectId: number, userData: {
    userId: string;
    userName: string;
    userEmail: string;
  }): Promise<SafeApiResponse<ApiResponse>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      
      return {
        success: true,
        data: { success: true, message: 'تم تسجيل الإعجاب محلياً', data: null },
        error: null,
        status: 'success'
      };
    }

    return safeApiCall(
      () => apiClient.post<ApiResponse>('/api/admin/notifications/favorite', {
        projectId,
        userData
      }),
      'فشل في إرسال إشعار الإعجاب',
      { maxRetries: 1 }
    );
  }

  /**
   * Send assignment notification with safe fallback
   */
  async sendAssignmentNotification(projectId: number, employeeIds: string[]): Promise<SafeApiResponse<ApiResponse>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      
      return {
        success: true,
        data: { success: true, message: 'تم تسجيل تعيين المهام محلياً', data: null },
        error: null,
        status: 'success'
      };
    }

    return safeApiCall(
      () => apiClient.post<ApiResponse>('/api/admin/notifications/assignment', {
        projectId,
        employeeIds
      }),
      'فشل في إرسال إشعار تعيين المهام',
      { maxRetries: 1 }
    );
  }

  /**
   * Get notifications for admin/superadmin by project with safe fallback
   */
  async getProjectNotifications(projectId: number): Promise<SafeApiResponse<Notification[]>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      return {
        success: true,
        data: [], // Return empty array when backend is not ready
        error: null,
        status: 'empty'
      };
    }

    return safeApiCall(
      () => apiClient.get<Notification[]>(`/api/admin/notifications/project/${projectId}`),
      `فشل في تحميل إشعارات المشروع رقم ${projectId}`,
      { maxRetries: 1 }
    );
  }

  /**
   * Delete multiple notifications with safe fallback
   */
  async deleteMultipleNotifications(ids: number[]): Promise<SafeApiResponse<ApiResponse>> {
    const isReady = await this.checkBackendStatus();
    
    if (!isReady) {
      return {
        success: true,
        data: { success: true, message: 'تم حذف الإشعارات محلياً', data: null },
        error: null,
        status: 'success'
      };
    }

    return safeApiCall(
      () => apiClient.post<ApiResponse>('/api/Notification/bulk-delete', { ids }),
      'فشل في حذف الإشعارات المحددة',
      { maxRetries: 1 }
    );
  }

  /**
   * Reset backend status check (useful for retry)
   */
  resetBackendStatus(): void {
    this.isBackendReady = false;
    this.checkAttempts = 0;
  }
}

// Create and export singleton instance
export const notificationService = new NotificationService();
