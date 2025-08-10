/**
 * Services Index
 * Central export point for all API services with enhanced security
 */

// Core API client
export { apiClient, ApiError } from './api';
export type { ApiResponse, PaginatedResponse, RequestOptions } from './api';

// Safe API Service - Enhanced Security
export { 
  SafeApiService, 
  safeApiService, 
  safeApiCall, 
  safeBatchCall, 
  safePaginatedCall 
} from './safeApiService';
export type { 
  SafeApiResponse, 
  SafeApiConfig 
} from './safeApiService';

// Authentication service
export { authService } from './authService';
export type { 
  SignInRequest, 
  SignInResponse, 
  SignUpRequest, 
  SignUpResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyEmailRequest
} from './authService';

// Dashboard service
export { dashboardService } from './dashboardService';
export type {
  DashboardOverview,
  DashboardStatistics,
  MonthlyData,
  EmployeeDashboardData,
  EmployeeTasksData,
  EmployeePerformanceData,
  ActivityItem,
  PerformancePoint
} from './dashboardService';

// Project service
export { projectService } from './projectService';
export type {
  Project,
  ProjectImage,
  ProjectEmployee,
  ProjectFilters,
  CreateProjectRequest,
  UpdateProjectRequest,
  AssignEmployeesRequest,
  LocationData
} from './projectService';

// User service
export { userService } from './userService';
export type {
  User,
  UpdateUserRequest,
  UserFilters
} from './userService';

// Task service
export { taskService } from './taskService';
export type {
  Task,
  TaskComment,
  TaskAttachment,
  CreateTaskRequest,
  UpdateTaskRequest,
  AssignTaskRequest,
  TaskFilters,
  AddCommentRequest
} from './taskService';
