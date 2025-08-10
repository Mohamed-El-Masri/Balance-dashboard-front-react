import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  dashboardService, 
  EmployeeDashboardData 
} from '../../services/dashboardService';
import { ApiError } from '../../services/api';

const Tasks: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState<EmployeeDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEmployee = user?.role === 'employee' || user?.roleNames?.includes('Employee');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user || !isEmployee) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const data = await dashboardService.getEmployeeDashboard();
        setEmployeeData(data);
      } catch (err) {
        const errorMessage = err instanceof ApiError 
          ? err.detail 
          : 'Failed to load employee data';
        setError(errorMessage);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [user, isEmployee]);

  if (isLoading) {
    return (
      <div className="tasks-page">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-balance-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-page">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-red-600 mb-2">{t('common.error')}</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary mt-4"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="page-title">
          {isEmployee ? t('dashboard.employeeDashboard') : t('common.tasks')}
        </h1>
        <p className="page-subtitle">
          {isEmployee 
            ? `${t('auth.welcome')} ${user?.name || user?.firstName}` 
            : t('tasks.subtitle')
          }
        </p>
      </div>
      
      <div className="tasks-content">
        {isEmployee && employeeData ? (
          // Employee Dashboard
          <>
            {/* Employee Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-semibold mb-2">{t('tasks.total')}</h3>
                  <p className="text-3xl font-bold text-balance-primary">{employeeData.tasks.total}</p>
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="text-orange-500">{employeeData.tasks.pending} {t('tasks.pending')}</span>
                    {' | '}
                    <span className="text-blue-500">{employeeData.tasks.inProgress} {t('tasks.inProgress')}</span>
                    {' | '}
                    <span className="text-green-500">{employeeData.tasks.completed} {t('tasks.completed')}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-semibold mb-2">{t('projects.assignments')}</h3>
                  <p className="text-3xl font-bold text-balance-primary">{employeeData.assignments.projects}</p>
                  <div className="text-sm text-gray-600 mt-2">
                    {employeeData.assignments.units} {t('common.units')} | {employeeData.assignments.activeLeads} {t('dashboard.activeLeads')}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-semibold mb-2">{t('dashboard.performance')}</h3>
                  <p className="text-3xl font-bold text-balance-primary">{employeeData.performance.completion}%</p>
                  <div className="text-sm text-gray-600 mt-2">
                    {employeeData.performance.achieved}/{employeeData.performance.monthlyTarget} {t('dashboard.monthly')}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-semibold mb-2">{t('dashboard.department')}</h3>
                  <p className="text-lg font-semibold text-balance-secondary">{employeeData.employee.department}</p>
                  <div className="text-sm text-gray-600 mt-2">
                    {employeeData.employee.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold">{t('dashboard.recentActivity')}</h2>
              </div>
              <div className="card-body">
                {employeeData.recentActivities && employeeData.recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {employeeData.recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border-l-4 border-balance-primary bg-gray-50 rounded">
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.title}</h4>
                          {activity.description && (
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t('dashboard.noRecentActivity')}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Regular Tasks Page for Admins
          <div className="card">
            <div className="card-body">
              <h2>{t('tasks.title')}</h2>
              <p>Task management system will be implemented here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
