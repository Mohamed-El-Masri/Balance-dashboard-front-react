/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient, ApiResponse } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  expiresAt: string;
  user: {
    id: string;
    userName: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    bio?: string;
    whatsAppNumber?: string;
    location?: string;
    profilePictureUrl?: string;
    isActive: boolean;
    lastLoginAt: string;
    roleNames: string[];
  };
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmPassword?: string;
}

export interface SignUpResponse {
  userId: string;
  expiresAt: string;
  message?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

class AuthService {
  /**
   * Sign in user
   */
  async signIn(credentials: SignInRequest): Promise<SignInResponse> {
    const response = await apiClient.post<SignInResponse>(
      API_ENDPOINTS.AUTH.SIGNIN,
      credentials
    );
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      apiClient.setAuthToken(response.token);
    }
    
    // Create user object for localStorage
    if (response.user) {
      const userData = {
        id: response.user.id,
        name: `${response.user.firstName} ${response.user.lastName}`,
        email: response.user.email,
        role: response.user.roleNames[0]?.toLowerCase() || 'employee',
        avatar: response.user.profilePictureUrl,
        department: response.user.roleNames[0] === 'Employee' ? 'Staff' : 'Management',
        isActive: response.user.isActive,
        createdAt: new Date().toISOString(),
        lastLoginAt: response.user.lastLoginAt,
        // Additional data
        userName: response.user.userName,
        phoneNumber: response.user.phoneNumber,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        bio: response.user.bio,
        whatsAppNumber: response.user.whatsAppNumber,
        location: response.user.location,
        profilePictureUrl: response.user.profilePictureUrl,
        roleNames: response.user.roleNames
      };
      
      // Store user in localStorage
      localStorage.setItem('balance_user', JSON.stringify(userData));
      localStorage.setItem('user', JSON.stringify(userData)); // Keep both for compatibility
    }
    
    return response;
  }

  /**
   * Sign up new user
   */
  async signUp(userData: SignUpRequest): Promise<SignUpResponse> {
    const response = await apiClient.post<SignUpResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      userData
    );
    
    return response;
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage and auth token
      localStorage.removeItem('authToken');
      localStorage.removeItem('balance_user');
      localStorage.removeItem('user');
      apiClient.removeAuthToken();
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      request
    );
  }

  /**
   * Reset password
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      request
    );
  }

  /**
   * Change password
   */
  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      request
    );
  }

  /**
   * Verify email
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      request
    );
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<SignInResponse> {
    const response = await apiClient.post<SignInResponse>(
      API_ENDPOINTS.AUTH.REFRESH
    );
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      apiClient.setAuthToken(response.token);
    }
    
    return response;
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): any | null {
    try {
      const userStr = localStorage.getItem('balance_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set current user in localStorage
   */
  setCurrentUser(user: any): void {
    localStorage.setItem('balance_user', JSON.stringify(user));
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const user = this.getCurrentUser();
    
    if (!token || !user) return false;
    
    try {
      // Check if user is active and has valid data
      return token.length > 0 && user.isActive === true;
    } catch {
      return false;
    }
  }

  /**
   * Initialize auth state from storage
   */
  initializeAuth(): void {
    const token = this.getAuthToken();
    if (token) {
      apiClient.setAuthToken(token);
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();
