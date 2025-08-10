/**
 * Project Service
 * Handles all project-related API calls with enhanced security and error handling
 */

import { apiClient, PaginatedResponse, ApiResponse } from './api';
import { safeApiCall, safePaginatedCall, SafeApiResponse } from './safeApiService';
import { API_ENDPOINTS } from '../config/api';

/**
 * Helper function to ensure auth is properly configured
 */
const ensureAuthConfiguration = (): void => {
  const token = localStorage.getItem('authToken');
  if (token) {
    apiClient.setAuthToken(token);
  }
};

/**
 * Helper function to get auth headers for admin operations
 * Note: ApiClient automatically handles auth, but we add extra headers here
 */
const getAuthHeaders = (): Record<string, string> => {
  ensureAuthConfiguration();
  
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export interface Project {
  id: number;
  // Names (API uses nameAr/nameEn)
  nameAr: string;
  nameEn: string;
  title?: string; // Legacy support
  titleAr?: string; // Legacy support
  titleEn?: string; // Legacy support
  
  // Descriptions
  descriptionAr?: string;
  descriptionEn?: string;
  description?: string; // Legacy support
  
  // Location details (from API)
  locationAr?: string;
  locationEn?: string;
  location?: string; // Legacy support
  regionId?: number;
  regionName?: string;
  regionNameEn?: string;
  cityId?: number;
  cityName?: string;
  cityNameEn?: string;
  districtId?: number;
  districtName?: string;
  districtNameEn?: string;
  latitude?: number;
  longitude?: number;
  
  // Status and Type (API uses IDs and names)
  statusId?: number;
  statusName?: string;
  statusNameEn?: string;
  status?: 'active' | 'planning' | 'in-progress' | 'completed'; // Legacy
  typeId?: number;
  typeName?: string;
  typeNameEn?: string;
  type?: 'apartment' | 'villa' | 'office' | 'retail' | 'mixed' | 'commercial'; // Legacy
  
  // Financial and specifications
  cost?: number;
  area?: number;
  areaUnitAr?: string;
  areaUnitEn?: string;
  parkingSpots?: number;
  elevatorsCount?: number;
  
  // Dates
  estimatedCompletionDate?: string;
  completionDate?: string; // Legacy support
  startDate?: string; // Legacy support
  
  // Units
  countOfUnits?: number;
  totalUnits?: number; // Legacy support
  availableUnits?: number;
  soldUnits?: number;
  
  // Media and links
  mainImageUrl?: string;
  youtubeVideoUrl?: string;
  directLink?: string;
  imageUrls?: string[];
  images?: ProjectImage[]; // Legacy support
  
  // Features
  isFeatured?: boolean;
  projectsFeaturesIds?: number[];
  features?: Array<{id: number; nameAr: string; nameEn: string}>;
  amenities?: string[]; // Legacy support
  
  // Employee assignments
  assignedEmployeeNames?: string[];
  employees?: ProjectEmployee[]; // Legacy support
  assignedEmployees?: ProjectEmployee[]; // Legacy support
  
  // User interactions (legacy support)
  interestedUsersCount?: number;
  favoritedUsersCount?: number;
  interestedUsers?: InterestedUser[];
  favoritedUsers?: FavoritedUser[];
  notes?: ProjectNote[];
  
  // System fields
  publicIp?: string | null;
  isActive?: boolean;
  createdAt?: string;
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

export interface InterestedUser {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface FavoritedUser {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface ProjectNote {
  id: number;
  projectId: number;
  content: string;
  contentAr?: string;
  contentEn?: string;
  authorId: string;
  authorName: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectFilters {
  // Pagination (matches API: page, pageSize)
  page?: number;
  pageNumber?: number; // Legacy support
  pageSize?: number;
  
  // Location filters (matches API: regionId, cityId, districtId)
  regionId?: number;
  cityId?: number;
  districtId?: number;
  
  // Status and Type filters (matches API: statusId, typeId)
  statusId?: number;
  typeId?: number;
  status?: string; // Legacy support
  type?: string; // Legacy support
  
  // Additional filters (not in basic API but useful)
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isActive?: boolean;
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
   * Get all projects with filtering and safe error handling
   * Uses correct API parameters: page, pageSize (not pageNumber)
   */
  async getProjects(filters?: ProjectFilters): Promise<SafeApiResponse<PaginatedResponse<Project>>> {
    // Transform filters to match API expectations - استخدام أحرف كبيرة حسب الدوكيمنتيشن
    const apiFilters = {
      ...filters,
      Page: (filters as any)?.Page || filters?.page || filters?.pageNumber || 1,
      PageSize: (filters as any)?.PageSize || filters?.pageSize || 9
    };

    // Remove legacy parameters
    delete apiFilters.pageNumber;
    delete apiFilters.page;
    delete apiFilters.pageSize;

    const result = await safeApiCall(
      () => apiClient.get<any>(
        API_ENDPOINTS.PROJECT.LIST,
        { params: apiFilters }
      ),
      'فشل في تحميل المشاريع'
    );

    // Transform API response to match expected format
    if (result.success && result.data) {
      const apiData = result.data;
      const pageSize = apiFilters.PageSize || 9; // بدون قيمة افتراضية

      // استخدام الأسماء الصحيحة من الـ API Documentation
      const totalCount = apiData.totalCountOfProjects || 0;
      const totalPages = pageSize ? Math.ceil(totalCount / pageSize) : 1;
      const currentPage = apiFilters.Page || 1;
      
      const transformedData: PaginatedResponse<Project> = {
        items: apiData.items || [],
        totalCount,
        totalItems: totalCount, // For backward compatibility
        totalPages,
        currentPage,
        pageSize,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        // إضافة الإحصائيات من الـ API
        totalCountOfProjects: apiData.totalCountOfProjects || 0,
        totalCountOfFeateredProjects: apiData.totalCountOfFeateredProjects || 0,
        totalCountAssignedProjectToEmployee: apiData.totalCountAssignedProjectToEmployee || 0,
        totalCountOfActivedProjects: apiData.totalCountOfActivedProjects || 0,
        totalCountOfUnits: apiData.totalCountOfUnits || 0
      };

      return {
        ...result,
        data: transformedData
      };
    }

    return result;
  }

  /**
   * Get project by ID with safe error handling
   */
  async getProject(id: number): Promise<SafeApiResponse<Project>> {
    return safeApiCall(
      () => apiClient.get<Project>(API_ENDPOINTS.PROJECT.DETAIL(id)),
      `فشل في تحميل بيانات المشروع رقم ${id}`
    );
  }

  /**
   * Get project detailed information (additional endpoint)
   */
  async getProjectDetails(id: number): Promise<SafeApiResponse<any>> {
    return safeApiCall(
      () => apiClient.get<any>(API_ENDPOINTS.PROJECT.PROJECT_DETAILS(id)),
      `فشل في تحميل التفاصيل المتقدمة للمشروع رقم ${id}`
    );
  }

  /**
   * Get project locations for map display
   */
  async getProjectLocations(): Promise<SafeApiResponse<any[]>> {
    return safeApiCall(
      () => apiClient.get<any[]>(API_ENDPOINTS.PROJECT.LOCATIONS),
      'فشل في تحميل مواقع المشاريع'
    );
  }

  /**
   * Get projects with pagination optimization
   */
  async getProjectsPaginated(
    page: number = 1, 
    size: number = 20,
    filters?: Omit<ProjectFilters, 'pageNumber' | 'pageSize'>
  ): Promise<SafeApiResponse<{ items: Project[]; totalItems: number; totalPages: number; performanceWarning?: string }>> {
    return safePaginatedCall(
      (pageNum, pageSize) => this.fetchProjectsPage(pageNum, pageSize, filters),
      {
        maxItemsPerPage: 50,
        maxTotalItems: 1000,
        errorMessage: 'فشل في تحميل المشاريع'
      }
    );
  }

  /**
   * Internal method to fetch a page of projects
   */
  private async fetchProjectsPage(
    page: number, 
    size: number, 
    filters?: Omit<ProjectFilters, 'pageNumber' | 'pageSize'>
  ): Promise<{ items: Project[]; totalItems: number; totalPages: number }> {
    const response = await apiClient.get<PaginatedResponse<Project>>(
      API_ENDPOINTS.PROJECT.LIST,
      { 
        params: { 
          ...filters, 
          pageNumber: page, 
          pageSize: size 
        }
      }
    );

    return {
      items: response.items || [],
      totalItems: response.totalItems || 0,
      totalPages: response.totalPages || Math.ceil((response.totalItems || 0) / size)
    };
  }

  /**
   * Get cities with safe error handling
   */
  async getCities(): Promise<SafeApiResponse<LocationData[]>> {
    return safeApiCall(
      () => apiClient.get<LocationData[]>(API_ENDPOINTS.PROJECT.CITIES),
      'فشل في تحميل قائمة المدن',
      { enableCache: true, cacheTime: 10 * 60 * 1000 } // Cache for 10 minutes
    );
  }

  /**
   * Get regions with safe error handling
   */
  async getRegions(): Promise<SafeApiResponse<LocationData[]>> {
    return safeApiCall(
      () => apiClient.get<LocationData[]>(API_ENDPOINTS.PROJECT.REGIONS),
      'فشل في تحميل قائمة المناطق',
      { enableCache: true, cacheTime: 10 * 60 * 1000 } // Cache for 10 minutes
    );
  }

  /**
   * Get districts with safe error handling
   */
  async getDistricts(cityId?: number): Promise<SafeApiResponse<LocationData[]>> {
    return safeApiCall(
      () => {
        const params = cityId ? { cityId } : undefined;
        return apiClient.get<LocationData[]>(API_ENDPOINTS.PROJECT.DISTRICTS, { params });
      },
      'فشل في تحميل قائمة الأحياء',
      { enableCache: true, cacheTime: 5 * 60 * 1000 } // Cache for 5 minutes
    );
  }

  // Admin-only methods with enhanced error handling
  /**
   * Create new project with safe error handling
   */
  async createProject(data: CreateProjectRequest): Promise<SafeApiResponse<ApiResponse<{ id: number }>>> {
    return safeApiCall(
      () => apiClient.post<ApiResponse<{ id: number }>>(
        API_ENDPOINTS.ADMIN_PROJECT.CREATE,
        data,
        { headers: getAuthHeaders() }
      ),
      'فشل في إنشاء المشروع الجديد'
    );
  }

  /**
   * Update project with safe error handling
   */
  async updateProject(id: number, data: Partial<CreateProjectRequest>): Promise<SafeApiResponse<ApiResponse>> {
    return safeApiCall(
      () => apiClient.put<ApiResponse>(
        API_ENDPOINTS.ADMIN_PROJECT.UPDATE(id),
        data,
        { headers: getAuthHeaders() }
      ),
      `فشل في تحديث المشروع رقم ${id}`
    );
  }

  /**
   * Delete project with safe error handling
   */
  async deleteProject(id: number): Promise<SafeApiResponse<ApiResponse>> {
    ensureAuthConfiguration();
    
    return safeApiCall(
      () => apiClient.delete<ApiResponse>(
        API_ENDPOINTS.ADMIN_PROJECT.DELETE(id)
      ),
      `فشل في حذف المشروع رقم ${id}`
    );
  }

  /**
   * Add images to project with safe error handling
   */
  async addProjectImages(
    id: number,
    files: File[],
    descriptions?: string[]
  ): Promise<SafeApiResponse<ApiResponse>> {
    return safeApiCall(
      () => {
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
      },
      `فشل في إضافة الصور للمشروع رقم ${id}`,
      { timeout: 60000 } // Longer timeout for file uploads
    );
  }

  /**
   * Assign employees to project with safe error handling
   */
  async assignEmployees(id: number, data: AssignEmployeesRequest): Promise<SafeApiResponse<ApiResponse>> {
    return safeApiCall(
      () => apiClient.post<ApiResponse>(
        API_ENDPOINTS.ADMIN_PROJECT.ASSIGN_EMPLOYEES(id),
        data,
        { headers: getAuthHeaders() }
      ),
      `فشل في تعيين الموظفين للمشروع رقم ${id}`
    );
  }

  /**
   * Bulk delete projects with safe error handling
   */
  async bulkDeleteProjects(projectIds: number[]): Promise<SafeApiResponse<ApiResponse>> {
    return safeApiCall(
      () => apiClient.post<ApiResponse>(
        API_ENDPOINTS.ADMIN_PROJECT.BULK_DELETE,
        { projectIds },
        { headers: getAuthHeaders() }
      ),
      `فشل في حذف المشاريع المحددة (${projectIds.length} مشروع)`
    );
  }

  /**
   * Export projects with safe error handling
   */
  async exportProjects(
    format: 'excel' | 'csv',
    filters?: ProjectFilters
  ): Promise<SafeApiResponse<void>> {
    return safeApiCall(
      () => {
        const params = {
          format,
          ...filters,
        };

        return apiClient.download(
          API_ENDPOINTS.ADMIN_PROJECT.EXPORT,
          `projects_export_${new Date().toISOString().split('T')[0]}.${format}`,
          { params }
        );
      },
      'فشل في تصدير المشاريع',
      { timeout: 120000 } // 2 minutes timeout for exports
    );
  }

  /**
   * Get project interests and favorites details
   */
  async getProjectInteractions(id: number): Promise<{
    interests: InterestedUser[];
    favorites: FavoritedUser[];
  }> {
    const [interests, favorites] = await Promise.all([
      apiClient.get<InterestedUser[]>(`/api/admin/interests/project/${id}`),
      apiClient.get<FavoritedUser[]>(`/api/admin/favorites/project/${id}`)
    ]);

    return { interests, favorites };
  }

  /**
   * Get assigned projects for employee with safe error handling
   */
  async getAssignedProjects(): Promise<SafeApiResponse<Project[]>> {
    return safeApiCall(
      async () => {
        // Try the employee dashboard endpoint first
        try {
          const response = await apiClient.get<{ projects: Project[] }>('/api/employee/dashboard/assigned-items');
          return response.projects || [];
        } catch (error) {
          // Fallback to alternative endpoint if the first one fails
          const response = await apiClient.get<{ items: Project[] }>('/api/employee/projects');
          return response.items || [];
        }
      },
      'فشل في تحميل المشاريع المعينة'
    );
  }

  /**
   * Unassign employees from project with safe error handling
   */
  async unassignEmployees(id: number, userIds: string[]): Promise<SafeApiResponse<ApiResponse>> {
    return safeApiCall(
      () => apiClient.post<ApiResponse>(
        `/api/admin/project/${id}/unassign-employees`,
        userIds,
        { headers: getAuthHeaders() }
      ),
      `فشل في إلغاء تعيين الموظفين من المشروع رقم ${id}`
    );
  }

  /**
   * Set project as featured with safe error handling
   */
  async setProjectFeatured(id: number, isFeatured: boolean): Promise<SafeApiResponse<ApiResponse>> {
    ensureAuthConfiguration();
    
    return safeApiCall(
      () => apiClient.post<ApiResponse>(
        API_ENDPOINTS.ADMIN_PROJECT.SET_FEATURED(id, isFeatured),
        undefined
      ),
      `فشل في ${isFeatured ? 'إضافة' : 'إزالة'} المشروع ${id} ${isFeatured ? 'إلى' : 'من'} المميزة`
    );
  }

  /**
   * Toggle project active status with safe error handling
   */
  async toggleProjectActive(id: number, isActive: boolean): Promise<SafeApiResponse<ApiResponse>> {
    ensureAuthConfiguration();
    
    return safeApiCall(
      () => apiClient.put<ApiResponse>(
        API_ENDPOINTS.ADMIN_PROJECT.TOGGLE_ACTIVE(id, isActive),
        undefined
      ),
      `فشل في ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} المشروع ${id}`
    );
  }

  /**
   * Add project note with safe error handling
   */
  async addProjectNote(id: number, content: string, isPublic: boolean = false): Promise<SafeApiResponse<ApiResponse>> {
    return safeApiCall(
      () => apiClient.post<ApiResponse>(
        `/api/admin/project/${id}/notes`,
        { content, isPublic }
      ),
      `فشل في إضافة ملاحظة للمشروع رقم ${id}`
    );
  }

  /**
   * Get project notes with safe error handling
   */
  async getProjectNotes(id: number): Promise<SafeApiResponse<ProjectNote[]>> {
    return safeApiCall(
      () => apiClient.get<ProjectNote[]>(`/api/admin/project/${id}/notes`),
      `فشل في تحميل ملاحظات المشروع رقم ${id}`
    );
  }

  /**
   * Update project note with safe error handling
   */
  async updateProjectNote(projectId: number, noteId: number, content: string): Promise<SafeApiResponse<ApiResponse>> {
    return safeApiCall(
      () => apiClient.put<ApiResponse>(
        `/api/admin/project/${projectId}/notes/${noteId}`,
        { content }
      ),
      `فشل في تحديث الملاحظة رقم ${noteId} للمشروع ${projectId}`
    );
  }

  /**
   * Delete project note
   */
  async deleteProjectNote(projectId: number, noteId: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/admin/project/${projectId}/notes/${noteId}`);
  }

  /**
   * Get project status options for dropdowns
   */
  async getProjectStatuses(): Promise<SafeApiResponse<any[]>> {
    return safeApiCall(
      () => apiClient.get<any[]>('/api/admin/project/statuses'),
      'Failed to fetch project statuses'
    );
  }

  /**
   * Get project type options for dropdowns
   */
  async getProjectTypes(): Promise<SafeApiResponse<any[]>> {
    return safeApiCall(
      () => apiClient.get<any[]>('/api/admin/project/types'),
      'Failed to fetch project types'
    );
  }
}

// Create and export singleton instance
export const projectService = new ProjectService();
