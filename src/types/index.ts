// User Types
export type UserRole = 'superadmin' | 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// Project Types
export type ProjectStatus = 'active' | 'planning' | 'in-progress' | 'completed';
export type ProjectType = 'apartment' | 'villa' | 'office' | 'retail' | 'mixed';

export interface Project {
  id: string;
  name: string;
  description?: string;
  location: string;
  type: ProjectType;
  status: ProjectStatus;
  units: number;
  assignedTo?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  budget?: number;
  progress: number;
  images?: string[];
}

// Task Types
export type TaskStatus = 'new' | 'in-progress' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  attachments?: TaskAttachment[];
}

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  progress: number;
  estimatedHours?: number;
  actualHours?: number;
  relatedProject?: string;
  relatedProperty?: string;
  comments: TaskComment[];
  attachments: TaskAttachment[];
}

// Property Types
export interface Property {
  id: string;
  name: string;
  projectId: string;
  type: string;
  size: number;
  price?: number;
  status: 'available' | 'reserved' | 'sold';
  floor?: number;
  room?: string;
  features?: string[];
  images?: string[];
}

// Dashboard Statistics
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  totalUsers: number;
  totalProperties: number;
}

// Chart Data
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter and Search Types
export interface ProjectFilters {
  status?: ProjectStatus[];
  type?: ProjectType[];
  assignedTo?: string[];
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string[];
  assignedBy?: string[];
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Language Types
export type Language = 'en' | 'ar';

export interface TranslationResource {
  [key: string]: string | TranslationResource;
}
