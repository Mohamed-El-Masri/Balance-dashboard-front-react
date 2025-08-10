/**
 * Performance Warning Component
 * Shows warnings when data sets are large
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PerformanceWarningProps {
  warning?: string;
  itemCount?: number;
  onOptimize?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const PerformanceWarning: React.FC<PerformanceWarningProps> = ({
  warning,
  itemCount,
  onOptimize,
  onDismiss,
  className = ''
}) => {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  if (!warning || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleOptimize = () => {
    onOptimize?.();
    setDismissed(true);
  };

  return (
    <div className={`performance-warning ${className}`}>
      <div className="warning-content">
        <div className="warning-icon">⚡</div>
        <div className="warning-details">
          <h4>{t('performance.warning')}</h4>
          <p>{warning}</p>
          {itemCount && (
            <p className="item-count">
              {t('performance.itemCount', { count: itemCount })}
            </p>
          )}
        </div>
        <div className="warning-actions">
          {onOptimize && (
            <button 
              className="optimize-button"
              onClick={handleOptimize}
              type="button"
            >
              {t('performance.optimize')}
            </button>
          )}
          <button 
            className="dismiss-button"
            onClick={handleDismiss}
            type="button"
          >
            {t('common.dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
};

// CSS styles for performance warning
export const performanceWarningStyles = `
.performance-warning {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #856404;
}

.warning-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.warning-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  color: #f39c12;
}

.warning-details {
  flex: 1;
}

.warning-details h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.warning-details p {
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.item-count {
  font-size: 0.9rem;
  font-weight: 500;
}

.warning-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.optimize-button, .dismiss-button {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  min-width: 80px;
}

.optimize-button {
  background-color: #007bff;
  color: white;
}

.optimize-button:hover {
  background-color: #0056b3;
}

.dismiss-button {
  background-color: transparent;
  color: #856404;
  border: 1px solid #856404;
}

.dismiss-button:hover {
  background-color: #856404;
  color: white;
}

/* RTL Support */
[dir="rtl"] .warning-content {
  direction: rtl;
}

[dir="rtl"] .warning-details h4,
[dir="rtl"] .warning-details p {
  text-align: right;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .warning-content {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .warning-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
`;
