/**
 * Notifications Hook
 * Custom hook for handling notifications with safe API calls
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService, Notification, NotificationFilters } from '../services/notificationService';
import { useAuth } from './useAuth';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  backendStatus: 'ready' | 'not_ready' | 'checking';
  loadNotifications: (filters?: NotificationFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  retryBackendConnection: () => Promise<void>;
  clearError: () => void;
}

export const useNotifications = (initialFilters?: NotificationFilters): UseNotificationsReturn => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<NotificationFilters>(initialFilters || {});
  const [backendStatus, setBackendStatus] = useState<'ready' | 'not_ready' | 'checking'>('checking');
  const [pollingEnabled, setPollingEnabled] = useState(true);
  
  // Ref to prevent multiple simultaneous calls
  const loadingRef = useRef(false);
  const lastCallRef = useRef<number>(0);

  const loadNotifications = useCallback(async (newFilters?: NotificationFilters) => {
    if (!user) return;

    // Prevent multiple simultaneous calls
    const now = Date.now();
    if (loadingRef.current || (now - lastCallRef.current < 1000)) {
      
      return;
    }

    try {
      loadingRef.current = true;
      lastCallRef.current = now;
      setIsLoading(true);
      setError(null);

      const filterParams = { ...filters, ...newFilters, page: 1, pageSize: 20 };
      setFilters(filterParams);

      
      const result = await notificationService.getNotifications(filterParams);
      
      if (result.success && result.data) {
        setNotifications(result.data.items);
        setHasMore(result.data.hasNextPage ?? false);
        setCurrentPage(result.data.currentPage ?? 1);
        setBackendStatus('ready');
        
        // Re-enable polling if it was disabled
        if (!pollingEnabled) {
          setPollingEnabled(true);
        }
        
      } else {
        if (result.error?.includes('404') || result.error?.includes('not available')) {
          
          setBackendStatus('not_ready');
          setPollingEnabled(false); // Disable polling when backend is not ready
          setNotifications([]); // Clear notifications
          setHasMore(false);
        } else {
          throw new Error(result.error || 'Failed to load notifications');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notifications';
      
      setError(errorMessage);
      
      // If error contains 404, assume backend is not ready
      if (errorMessage.includes('404')) {
        setBackendStatus('not_ready');
        setPollingEnabled(false);
      }
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [user, filters, pollingEnabled]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || backendStatus !== 'ready') return;

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      
      const result = await notificationService.getNotifications({
        ...filters,
        page: nextPage
      });

      if (result.success && result.data) {
        setNotifications(prev => [...prev, ...(result.data?.items || [])]);
        setHasMore(result.data.hasNextPage ?? false);
        setCurrentPage(result.data.currentPage ?? 1);
      } else {
        throw new Error(result.error || 'Failed to load more notifications');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more notifications');
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, currentPage, filters, backendStatus]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      const result = await notificationService.markAsRead(id);
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, isRead: true, readAt: new Date().toISOString() }
              : notification
          )
        );
        
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setError(result.error || 'Failed to mark notification as read');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const result = await notificationService.markAllAsRead();
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(notification => ({ 
            ...notification, 
            isRead: true, 
            readAt: new Date().toISOString() 
          }))
        );
        
        setUnreadCount(0);
      } else {
        setError(result.error || 'Failed to mark all notifications as read');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
    }
  }, []);

  const deleteNotification = useCallback(async (id: number) => {
    try {
      const result = await notificationService.deleteNotification(id);
      
      if (result.success) {
        const deletedNotification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } else {
        setError(result.error || 'Failed to delete notification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  }, [notifications]);

  const refreshNotifications = useCallback(async () => {
    
    
    // Use current filters instead of calling loadNotifications to prevent dependency loops
    if (!user || backendStatus !== 'ready') return;
    
    try {
      const result = await notificationService.getNotifications({ ...filters, page: 1, pageSize: 20 });
      if (result.success && result.data) {
        setNotifications(result.data.items);
        setHasMore(result.data.hasNextPage ?? false);
        setCurrentPage(result.data.currentPage ?? 1);
      }
      
      // Refresh unread count
      const countResult = await notificationService.getUnreadCount();
      if (countResult.success && countResult.data !== null) {
        setUnreadCount(countResult.data);
      }
    } catch (err) {
      
    }
  }, [user, filters, backendStatus]);

  const retryBackendConnection = useCallback(async () => {
    
    setBackendStatus('checking');
    notificationService.resetBackendStatus();
    
    // Reset debounce refs
    loadingRef.current = false;
    lastCallRef.current = 0;
    
    // Direct call without using loadNotifications to prevent dependency issues
    try {
      const result = await notificationService.getNotifications({ ...filters, page: 1, pageSize: 20 });
      if (result.success && result.data) {
        setNotifications(result.data.items);
        setHasMore(result.data.hasNextPage ?? false);
        setCurrentPage(result.data.currentPage ?? 1);
        setBackendStatus('ready');
        setPollingEnabled(true);
        
      } else {
        setBackendStatus('not_ready');
        setPollingEnabled(false);
      }
    } catch (err) {
      
      setBackendStatus('not_ready');
      setPollingEnabled(false);
    }
  }, [filters]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial notifications and unread count
  useEffect(() => {
    if (user) {
      
      loadNotifications();
      
      // Load unread count only if polling is enabled
      if (pollingEnabled) {
        notificationService.getUnreadCount()
          .then(result => {
            if (result.success && result.data !== null) {
              setUnreadCount(result.data);
              
            }
          })
          .catch(err => {
            
          });
      }
    }
  }, [user]); // Removed loadNotifications and pollingEnabled to prevent infinite loops

  // Set up polling for real-time updates (every 2 minutes, and only when backend is ready)
  useEffect(() => {
    if (!user || !pollingEnabled || backendStatus !== 'ready') return;

    
    
    const interval = setInterval(async () => {
      try {
        
        const result = await notificationService.getUnreadCount();
        if (result.success && result.data !== null) {
          const newCount = result.data;
          setUnreadCount(prevCount => {
            if (newCount !== prevCount) {
              
              // If there are new notifications, refresh the list
              if (newCount > prevCount) {
                refreshNotifications();
              }
              return newCount;
            }
            return prevCount;
          });
        } else {
          
          // If failed, disable polling
          setPollingEnabled(false);
          setBackendStatus('not_ready');
        }
      } catch (err) {
        
        setPollingEnabled(false);
        setBackendStatus('not_ready');
      }
    }, 120000); // Poll every 2 minutes to reduce load

    return () => {
      
      clearInterval(interval);
    };
  }, [user, pollingEnabled, backendStatus]); // Removed unreadCount and refreshNotifications to prevent excessive re-renders

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    hasMore,
    currentPage,
    backendStatus,
    loadNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    retryBackendConnection,
    clearError
  };
};

// Hook for real-time notification updates
export const useNotificationUpdates = () => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const triggerUpdate = useCallback(() => {
    setLastUpdate(new Date());
  }, []);

  return {
    lastUpdate,
    triggerUpdate
  };
};
