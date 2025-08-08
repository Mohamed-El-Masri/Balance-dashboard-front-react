/**
 * Project Service
 * Handles all project-related API calls
 */

import { apiClient, PaginatedResponse, ApiResponse } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface Project {
  id: number;
  title: string;
  description?: string;
  location?: string;
  city?: string;
  region?: string;
  district?: string;
  status: 'active' | 'planning' | 'in-progress' | 'completed';
  type: 'apartment' | 'villa' | 'office' | 'retail' | 'mixed';
  startDate?: string;
  completionDate?: string;
  totalUnits?: number;
  availableUnits?: number;
  soldUnits?: number;
  images?: ProjectImage[];
  features?: string[];
  amenities?: string[];
  employees?: ProjectEmployee[];
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectImage {
  id: number;
  url: string;
  description?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProjectEmployee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface ProjectFilters {
  pageNumber?: number;
  pageSize?: number;
  regionId?: number;
  cityId?: number;
  districtId?: number;
  status?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  location?: string;
  cityId?: number;
  regionId?: number;
  districtId?: number;
  type: string;
  startDate?: string;
  completionDate: string;
  features?: string[];
  amenities?: string[];
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: number;
}

export interface AssignEmployeesRequest {
  employeeIds: string[];
  roles?: { [employeeId: string]: string };
}

export interface LocationData {
  id: number;
  name: string;
  parentId?: number;
}

class ProjectService {
  /**
   * Get all projects with filtering
   */
  async getProjects(filters?: ProjectFilters): Promise<PaginatedResponse<Project>> {
    return apiClient.get<PaginatedResponse<Project>>(
      API_ENDPOINTS.PROJECT.LIST,
      { params: filters }
    );
  }

  /**
   * Get project by ID
   */
  async getProject(id: number): Promise<Project> {
    return apiClient.get<Project>(API_ENDPOINTS.PROJECT.DETAIL(id));
  }

  /**
   * Get cities
   */
  async getCities(): Promise<LocationData[]> {
    return apiClient.get<LocationData[]>(API_ENDPOINTS.PROJECT.CITIES);
  }

  /**
   * Get regions
   */
  async getRegions(): Promise<LocationData[]> {
    return apiClient.get<LocationData[]>(API_ENDPOINTS.PROJECT.REGIONS);
  }

  /**
   * Get districts
   */
  async getDistricts(cityId?: number): Promise<LocationData[]> {
    const params = cityId ? { cityId } : undefined;
    return apiClient.get<LocationData[]>(API_ENDPOINTS.PROJECT.DISTRICTS, { params });
  }

  // Admin-only methods
  /**
   * Create new project
   */
  async createProject(data: CreateProjectRequest): Promise<ApiResponse<{ id: number }>> {
    return apiClient.post<ApiResponse<{ id: number }>>(
      API_ENDPOINTS.ADMIN_PROJECT.CREATE,
      data
    );
  }

  /**
   * Update project
   */
  async updateProject(id: number, data: Partial<CreateProjectRequest>): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(
      API_ENDPOINTS.ADMIN_PROJECT.UPDATE(id),
      data
    );
  }

  /**
   * Delete project
   */
  async deleteProject(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(API_ENDPOINTS.ADMIN_PROJECT.DELETE(id));
  }

  /**
   * Add images to project
   */
  async addProjectImages(
    id: number,
    files: File[],
    descriptions?: string[]
  ): Promise<ApiResponse> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('files', file);
      if (descriptions && descriptions[index]) {
        formData.append('descriptions', descriptions[index]);
      }
    });

    return apiClient.post<ApiResponse>(
      API_ENDPOINTS.ADMIN_PROJECT.ADD_IMAGES(id),
      formData
    );
  }

  /**
   * Assign employees to project
   */
  async assignEmployees(id: number, data: AssignEmployeesRequest): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(
      API_ENDPOINTS.ADMIN_PROJECT.ASSIGN_EMPLOYEES(id),
      data
    );
  }

  /**
   * Bulk delete projects
   */
  async bulkDeleteProjects(projectIds: number[]): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(
      API_ENDPOINTS.ADMIN_PROJECT.BULK_DELETE,
      { projectIds }
    );
  }

  /**
   * Export projects
   */
  async exportProjects(
    format: 'excel' | 'csv',
    filters?: ProjectFilters
  ): Promise<void> {
    const params = {
      format,
      ...filters,
    };

    return apiClient.download(
      API_ENDPOINTS.ADMIN_PROJECT.EXPORT,
      `projects_export_${new Date().toISOString().split('T')[0]}.${format}`,
      { params }
    );
  }
}

// Create and export singleton instance
export const projectService = new ProjectService();
