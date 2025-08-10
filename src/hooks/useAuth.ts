/**
 * Authentication Hook
 * Custom hook for handling authentication state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { authService, SignInRequest, SignUpRequest } from '../services/authService';
import { ApiError } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'employee';
  avatar?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  // Additional fields from API
  userName?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  whatsAppNumber?: string;
  location?: string;
  profilePictureUrl?: string;
  roleNames?: string[];
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (credentials: SignInRequest) => Promise<void>;
  signUp: (userData: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  hasPermission: (requiredRoles: string[]) => boolean;
  refreshAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if token exists
        const token = authService.getAuthToken();
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Get user data from localStorage
        const storedUser = authService.getCurrentUser(); // Use balance_user
        if (storedUser && authService.isAuthenticated()) {
          setUser(storedUser);
          authService.initializeAuth();
        }
      } catch (err) {
        
        // Clear invalid auth state
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign in function
  const signIn = useCallback(async (credentials: SignInRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.signIn(credentials);
      
      // Check if user already exists in localStorage
      let userData = authService.getCurrentUser();
      
      if (!userData) {
        // Create new user object from API response
        userData = {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`,
          email: response.user.email,
          role: response.user.roleNames[0]?.toLowerCase() as 'superadmin' | 'admin' | 'employee',
          avatar: response.user.profilePictureUrl,
          department: response.user.roleNames[0] === 'Employee' ? 'Staff' : 'Management',
          isActive: response.user.isActive,
          createdAt: new Date().toISOString(),
          lastLoginAt: response.user.lastLoginAt,
          // Additional API fields
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
        
        // Store in localStorage as balance_user
        authService.setCurrentUser(userData);
      } else {
        // Update lastLoginAt for existing user
        userData.lastLoginAt = response.user.lastLoginAt;
        userData.name = `${response.user.firstName} ${response.user.lastName}`;
        userData.avatar = response.user.profilePictureUrl;
        userData.isActive = response.user.isActive;
        authService.setCurrentUser(userData);
      }

      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Sign in failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign up function
  const signUp = useCallback(async (userData: SignUpRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.signUp(userData);
      // Note: You might want to automatically sign in after successful signup
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Sign up failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
    } catch (err) {
      
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check permissions
  const hasPermission = useCallback((requiredRoles: string[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }, [user]);

  // Refresh auth state
  const refreshAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simply refresh from localStorage
      const storedUser = authService.getCurrentUser();
      if (storedUser && authService.isAuthenticated()) {
        setUser(storedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      
      setError('Failed to refresh authentication');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    hasPermission,
    refreshAuth,
  };
};
