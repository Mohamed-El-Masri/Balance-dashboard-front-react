/**
 * Safe Loading Component
 * Provides feedback for different loading states
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

interface SafeLoadingProps {
  isLoading: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children?: React.ReactNode;
  retry?: () => void;
  className?: string;
}

export const SafeLoading: React.FC<SafeLoadingProps> = ({
  isLoading,
  error,
  isEmpty = false,
  emptyMessage,
  children,
  retry,
  className = ''
}) => {
  const { t } = useTranslation();

  // Loading state
  if (isLoading) {
    return (
      <div className={`safe-loading ${className}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`safe-error ${className}`}>
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>{t('common.error')}</h3>
          <p className="error-message">{error}</p>
          {retry && (
            <button 
              className="retry-button"
              onClick={retry}
              type="button"
            >
              {t('common.retry')}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className={`safe-empty ${className}`}>
        <div className="empty-content">
          <div className="empty-icon">📋</div>
          <p>{emptyMessage || t('common.noData')}</p>
          {retry && (
            <button 
              className="refresh-button"
              onClick={retry}
              type="button"
            >
              {t('common.refresh')}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Success state - render children
  return <>{children}</>;
};

// CSS styles (to be added to main CSS)
export const safeLoadingStyles = `
.safe-loading, .safe-error, .safe-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-content, .empty-content {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon, .empty-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #dc3545;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.retry-button, .refresh-button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.retry-button:hover, .refresh-button:hover {
  background-color: #0056b3;
}

.retry-button:disabled, .refresh-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* RTL Support */
[dir="rtl"] .error-content, 
[dir="rtl"] .empty-content {
  text-align: right;
}
`;
