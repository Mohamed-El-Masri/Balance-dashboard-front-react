import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  dashboardService, 
  DashboardOverview, 
  DashboardStatistics,
  EmployeeDashboardData 
} from '../../services/dashboardService';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ApiError } from '../../services/api';
import AnalyticsOverview from '../../components/Analytics/AnalyticsOverview';
import AnalyticsCharts from '../../components/Analytics/AnalyticsCharts';
import './Dashboard.css';
import '../../components/Analytics/Analytics.css';
import '../../components/Professional/Professional.css';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Analytics hook for Admin/SuperAdmin
  const {
    systemAnalytics,
    projectAnalytics,
    unitAnalytics,
    favoritesAnalytics,
    interestsAnalytics,
    isLoading: analyticsLoading,
    error: analyticsError
  } = useAnalytics();

  // Check if user is employee and redirect to tasks
  const isEmployee = user?.role === 'employee' || user?.roleNames?.includes('Employee');
  
  if (isEmployee) {
    return <Navigate to="/tasks" replace />;
  }

  if (analyticsLoading) {
    return (
      <div className="dashboard-page">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="dashboard-page">
        <div className="analytics-error">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">{t('common.error')}</h2>
          <p className="error-message">{analyticsError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary mt-4"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <div className="analytics-header">
        <h1 className="analytics-title">{t('dashboard.analytics')}</h1>
        <p className="analytics-subtitle">
          {t('auth.welcome')} {user?.name || user?.firstName} - {t('dashboard.overview')}
        </p>
      </div>
      
      <div className="dashboard-content">
        {/* Analytics Overview Cards */}
        {systemAnalytics && (
          <AnalyticsOverview 
            analytics={systemAnalytics} 
            unitAnalytics={unitAnalytics || undefined} 
            favoritesAnalytics={favoritesAnalytics || undefined}
            interestsAnalytics={interestsAnalytics || undefined}
          />
        )}

        {/* Analytics Charts - Project Status and Unit Status only */}
        {projectAnalytics && unitAnalytics && (
          <AnalyticsCharts 
            projectAnalytics={projectAnalytics}
            unitAnalytics={unitAnalytics}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
