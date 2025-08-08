/**
 * User Service
 * Handles all user-related API calls
 */

import { apiClient, PaginatedResponse, ApiResponse } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: File;
}

export interface UserFilters {
  pageNumber?: number;
  pageSize?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
}

class UserService {
  /**
   * Get user profile by ID
   */
  async getUserProfile(id: string): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.USER.PROFILE(id));
  }

  /**
   * Update user profile
   */
  async updateUserProfile(id: string, data: UpdateUserRequest): Promise<ApiResponse> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return apiClient.put<ApiResponse>(
      API_ENDPOINTS.USER.UPDATE_PROFILE(id),
      formData
    );
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>(
      API_ENDPOINTS.USER.LIST,
      { params: filters }
    );
  }

  /**
   * Deactivate user (Admin only)
   */
  async deactivateUser(id: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.USER.DEACTIVATE(id));
  }
}

// Create and export singleton instance
export const userService = new UserService();
