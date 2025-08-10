/**
 * Notification Status Component
 * Shows the current status of notifications backend
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

interface NotificationStatusProps {
  status: 'ready' | 'not_ready' | 'checking';
  onRetry?: () => void;
  className?: string;
}

export const NotificationStatus: React.FC<NotificationStatusProps> = ({
  status,
  onRetry,
  className = ''
}) => {
  const { t } = useTranslation();

  if (status === 'ready') {
    return null; // Don't show anything when ready
  }

  const getStatusContent = () => {
    switch (status) {
      case 'checking':
        return {
          icon: '🔄',
          message: t('notifications.status.checking', 'جاري فحص خدمة الإشعارات...'),
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          showRetry: false
        };
      
      case 'not_ready':
        return {
          icon: '📢',
          message: t('notifications.status.notReady', 'خدمة الإشعارات غير متاحة حالياً'),
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          showRetry: true
        };
      
      default:
        return null;
    }
  };

  const statusContent = getStatusContent();
  if (!statusContent) return null;

  return (
    <div className={`
      ${statusContent.bgColor} 
      ${statusContent.textColor} 
      border rounded-lg p-3 mb-4 
      flex items-center justify-between
      ${className}
    `}>
      <div className="flex items-center gap-2">
        <span className="text-lg" role="img" aria-label="status">
          {statusContent.icon}
        </span>
        <span className="text-sm font-medium">
          {statusContent.message}
        </span>
      </div>
      
      {statusContent.showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="
            text-xs px-3 py-1 
            bg-yellow-200 hover:bg-yellow-300 
            text-yellow-900 
            rounded-md 
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-yellow-500
          "
        >
          {t('notifications.retry', 'إعادة المحاولة')}
        </button>
      )}
    </div>
  );
};

/**
 * Notification Empty State Component
 * Shows when no notifications are available
 */
interface NotificationEmptyStateProps {
  backendStatus: 'ready' | 'not_ready' | 'checking';
  onRetry?: () => void;
  className?: string;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  backendStatus,
  onRetry,
  className = ''
}) => {
  const { t } = useTranslation();

  const getEmptyContent = () => {
    switch (backendStatus) {
      case 'not_ready':
        return {
          icon: '🔧',
          title: t('notifications.empty.backendNotReady', 'خدمة الإشعارات قيد التطوير'),
          message: t('notifications.empty.backendNotReadyDesc', 'سيتم تفعيل الإشعارات قريباً'),
          showRetry: true
        };
      
      case 'checking':
        return {
          icon: '⏳',
          title: t('notifications.empty.checking', 'جاري فحص الإشعارات...'),
          message: t('notifications.empty.checkingDesc', 'يرجى الانتظار'),
          showRetry: false
        };
      
      case 'ready':
      default:
        return {
          icon: '📭',
          title: t('notifications.empty.noNotifications', 'لا توجد إشعارات'),
          message: t('notifications.empty.noNotificationsDesc', 'ستظهر الإشعارات الجديدة هنا'),
          showRetry: false
        };
    }
  };

  const content = getEmptyContent();

  return (
    <div className={`
      text-center py-12 px-6
      ${className}
    `}>
      <div className="text-6xl mb-4" role="img" aria-label="empty state">
        {content.icon}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {content.title}
      </h3>
      
      <p className="text-sm text-gray-500 mb-6">
        {content.message}
      </p>
      
      {content.showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="
            inline-flex items-center px-4 py-2
            bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium
            rounded-md
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          "
        >
          <span className="mr-2">🔄</span>
          {t('notifications.retry', 'إعادة المحاولة')}
        </button>
      )}
    </div>
  );
};

/**
 * Notification Error Component
 * Shows notification-related errors with retry option
 */
interface NotificationErrorProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const NotificationError: React.FC<NotificationErrorProps> = ({
  error,
  onRetry,
  onDismiss,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`
      bg-red-50 border border-red-200 rounded-lg p-4 mb-4
      ${className}
    `}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-xl" role="img" aria-label="error">❌</span>
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {t('notifications.error.title', 'خطأ في الإشعارات')}
          </h3>
          <div className="text-sm text-red-700 mt-1">
            {error}
          </div>
        </div>
        
        <div className="ml-3 flex-shrink-0 flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="
                text-xs px-2 py-1
                bg-red-200 hover:bg-red-300
                text-red-900
                rounded
                transition-colors
              "
            >
              {t('notifications.retry', 'إعادة المحاولة')}
            </button>
          )}
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="
                text-xs px-2 py-1
                bg-red-200 hover:bg-red-300
                text-red-900
                rounded
                transition-colors
              "
            >
              {t('common.dismiss', 'إغلاق')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
