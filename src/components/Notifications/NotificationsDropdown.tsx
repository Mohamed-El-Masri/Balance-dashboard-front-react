/**
 * Notifications Dropdown Component
 * Displays real-time notifications in the header
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, User, Heart, Star, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../hooks/useNotifications';
import { Notification } from '../../services/notificationService';
import './NotificationsDropdown.css';

interface NotificationsDropdownProps {
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  onNotificationClick
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.language === 'ar';

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  } = useNotifications({ pageSize: 10 });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interest':
        return <Heart className="notification-type-icon interest" />;
      case 'favorite':
        return <Star className="notification-type-icon favorite" />;
      case 'assignment':
        return <Users className="notification-type-icon assignment" />;
      default:
        return <Bell className="notification-type-icon system" />;
    }
  };

  const formatNotificationTime = (createdAt: string) => {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t('notifications.justNow');
    if (diffInMinutes < 60) return t('notifications.minutesAgo', { count: diffInMinutes });
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return t('notifications.hoursAgo', { count: diffInHours });
    
    const diffInDays = Math.floor(diffInHours / 24);
    return t('notifications.daysAgo', { count: diffInDays });
  };

  return (
    <div className="notifications-dropdown" ref={dropdownRef}>
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('notifications.title')}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`notification-dropdown ${isRTL ? 'rtl' : 'ltr'}`}>
          <div className="notification-header">
            <h3 className="notification-title">
              {t('notifications.title')} 
              {unreadCount > 0 && (
                <span className="unread-count">({unreadCount})</span>
              )}
            </h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button
                  className="mark-all-read-btn"
                  onClick={handleMarkAllAsRead}
                  title={t('notifications.markAllAsRead')}
                >
                  <CheckCheck size={16} />
                </button>
              )}
              <button
                className="refresh-btn"
                onClick={refreshNotifications}
                title={t('notifications.refresh')}
              >
                <Bell size={16} />
              </button>
            </div>
          </div>

          <div className="notification-body">
            {isLoading && notifications.length === 0 ? (
              <div className="notification-loading">
                <div className="loading-spinner"></div>
                <span>{t('common.loading')}</span>
              </div>
            ) : error ? (
              <div className="notification-error">
                <span>{error}</span>
                <button onClick={refreshNotifications}>{t('common.retry')}</button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={48} />
                <span>{t('notifications.noNotifications')}</span>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="notification-content">
                      <div className="notification-text">
                        <h4 className="notification-subject">
                          {isRTL ? notification.titleAr || notification.title : notification.title}
                        </h4>
                        <p className="notification-message">
                          {isRTL ? notification.messageAr || notification.message : notification.message}
                        </p>
                      </div>
                      
                      <div className="notification-meta">
                        <span className="notification-time">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                        {!notification.isRead && <div className="unread-indicator"></div>}
                      </div>
                    </div>

                    <div className="notification-actions">
                      {!notification.isRead && (
                        <button
                          className="mark-read-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          title={t('notifications.markAsRead')}
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={(e) => handleDeleteNotification(e, notification.id)}
                        title={t('notifications.delete')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button
                className="view-all-btn"
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to notifications page
                }}
              >
                {t('notifications.viewAll')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
