/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

import { apiClient, ApiResponse } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface DashboardOverview {
  totalProjects: number;
  totalUnits: number;
  totalUsers: number;
  totalEmployees: number;
  activeProjects: number;
  completedProjects: number;
  availableUnits: number;
  soldUnits: number;
  recentActivities: ActivityItem[];
}

export interface DashboardStatistics {
  projectsByStatus: {
    active: number;
    planning: number;
    inProgress: number;
    completed: number;
  };
  projectsByType: {
    apartment: number;
    villa: number;
    office: number;
    retail: number;
    mixed: number;
  };
  unitsByStatus: {
    available: number;
    reserved: number;
    sold: number;
  };
  salesTrends: MonthlyData[];
  userGrowth: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  value: number;
  label?: string;
}

export interface EmployeeDashboardData {
  employee: {
    name: string;
    role: string;
    department: string;
  };
  tasks: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
  assignments: {
    projects: number;
    units: number;
    activeLeads: number;
  };
  performance: {
    monthlyTarget: number;
    achieved: number;
    completion: number;
  };
  recentActivities: ActivityItem[];
}

export interface EmployeeTasksData {
  tasks: Task[];
  summary: {
    total: number;
    byStatus: {
      new: number;
      inProgress: number;
      completed: number;
      overdue: number;
    };
    byPriority: {
      low: number;
      medium: number;
      high: number;
      urgent: number;
    };
  };
}

export interface EmployeePerformanceData {
  currentMonth: {
    target: number;
    achieved: number;
    completion: number;
  };
  previousMonth: {
    target: number;
    achieved: number;
    completion: number;
  };
  yearToDate: {
    target: number;
    achieved: number;
    completion: number;
  };
  performanceHistory: PerformancePoint[];
}

export interface ActivityItem {
  id: number;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: string;
  link?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'new' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: {
    id: string;
    name: string;
  };
  project?: {
    id: number;
    title: string;
  };
  unit?: {
    id: number;
    title: string;
  };
}

export interface PerformancePoint {
  month: string;
  target: number;
  achieved: number;
  completion: number;
}

class DashboardService {
  /**
   * Get dashboard overview data
   */
  async getDashboardOverview(): Promise<DashboardOverview> {
    return apiClient.get<DashboardOverview>(API_ENDPOINTS.DASHBOARD.OVERVIEW);
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStatistics(): Promise<DashboardStatistics> {
    return apiClient.get<DashboardStatistics>(API_ENDPOINTS.DASHBOARD.STATISTICS);
  }

  /**
   * Get employee dashboard data
   */
  async getEmployeeDashboard(): Promise<EmployeeDashboardData> {
    return apiClient.get<EmployeeDashboardData>(API_ENDPOINTS.DASHBOARD.EMPLOYEE);
  }

  /**
   * Get employee tasks summary
   */
  async getEmployeeTasks(): Promise<EmployeeTasksData> {
    return apiClient.get<EmployeeTasksData>(API_ENDPOINTS.DASHBOARD.EMPLOYEE_TASKS);
  }

  /**
   * Get employee performance metrics
   */
  async getEmployeePerformance(): Promise<EmployeePerformanceData> {
    return apiClient.get<EmployeePerformanceData>(API_ENDPOINTS.DASHBOARD.EMPLOYEE_PERFORMANCE);
  }
}

// Create and export singleton instance
export const dashboardService = new DashboardService();
