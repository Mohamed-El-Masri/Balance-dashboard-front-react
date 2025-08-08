/**
 * Task Service
 * Handles all task-related API calls
 */

import { apiClient, PaginatedResponse, ApiResponse } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'new' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  assignedBy?: {
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
  comments: TaskComment[];
  attachments: TaskAttachment[];
}

export interface TaskComment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export interface TaskAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string;
  };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedToId: string;
  projectId?: number;
  unitId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'new' | 'in-progress' | 'completed' | 'overdue';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
}

export interface AssignTaskRequest {
  assignedToId: string;
  notes?: string;
}

export interface TaskFilters {
  pageNumber?: number;
  pageSize?: number;
  assignedToId?: string;
  status?: string;
  priority?: string;
  projectId?: number;
  unitId?: number;
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
}

export interface AddCommentRequest {
  content: string;
}

class TaskService {
  /**
   * Get all tasks with filtering
   */
  async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    return apiClient.get<PaginatedResponse<Task>>(
      API_ENDPOINTS.TASK.LIST,
      { params: filters }
    );
  }

  /**
   * Get task by ID
   */
  async getTask(id: number): Promise<Task> {
    return apiClient.get<Task>(API_ENDPOINTS.TASK.DETAIL(id));
  }

  /**
   * Create new task
   */
  async createTask(data: CreateTaskRequest): Promise<ApiResponse<{ id: number }>> {
    return apiClient.post<ApiResponse<{ id: number }>>(
      API_ENDPOINTS.TASK.CREATE,
      data
    );
  }

  /**
   * Update task
   */
  async updateTask(id: number, data: UpdateTaskRequest): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(
      API_ENDPOINTS.TASK.UPDATE(id),
      data
    );
  }

  /**
   * Delete task
   */
  async deleteTask(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(API_ENDPOINTS.TASK.DELETE(id));
  }

  /**
   * Assign task to user
   */
  async assignTask(id: number, data: AssignTaskRequest): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(
      API_ENDPOINTS.TASK.ASSIGN(id),
      data
    );
  }

  /**
   * Mark task as complete
   */
  async completeTask(id: number): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.TASK.COMPLETE(id));
  }

  /**
   * Add comment to task
   */
  async addComment(id: number, data: AddCommentRequest): Promise<ApiResponse<TaskComment>> {
    return apiClient.post<ApiResponse<TaskComment>>(
      API_ENDPOINTS.TASK.ADD_COMMENT(id),
      data
    );
  }

  /**
   * Upload attachment to task
   */
  async uploadAttachment(id: number, file: File, description?: string): Promise<ApiResponse<TaskAttachment>> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    return apiClient.post<ApiResponse<TaskAttachment>>(
      API_ENDPOINTS.TASK.ATTACHMENTS(id),
      formData
    );
  }

  /**
   * Get task statistics
   */
  async getTaskStats(filters?: Omit<TaskFilters, 'pageNumber' | 'pageSize'>): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    overdue: number;
  }> {
    // This would be a custom endpoint for stats
    return apiClient.get('/task/stats', { params: filters });
  }
}

// Create and export singleton instance
export const taskService = new TaskService();
