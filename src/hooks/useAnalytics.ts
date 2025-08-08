/**
 * Analytics Hook
 * Custom hook for handling analytics data and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  analyticsService, 
  SystemAnalytics, 
  ProjectAnalytics, 
  UnitAnalytics,
  FavoritesAnalytics,
  InterestsAnalytics
} from '../services/analyticsService';
import { ApiError } from '../services/api';

interface UseAnalyticsReturn {
  systemAnalytics: SystemAnalytics | null;
  projectAnalytics: ProjectAnalytics | null;
  unitAnalytics: UnitAnalytics | null;
  favoritesAnalytics: FavoritesAnalytics | null;
  interestsAnalytics: InterestsAnalytics | null;
  isLoading: boolean;
  error: string | null;
  refreshAnalytics: () => Promise<void>;
  clearError: () => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [systemAnalytics, setSystemAnalytics] = useState<SystemAnalytics | null>(null);
  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalytics | null>(null);
  const [unitAnalytics, setUnitAnalytics] = useState<UnitAnalytics | null>(null);
  const [favoritesAnalytics, setFavoritesAnalytics] = useState<FavoritesAnalytics | null>(null);
  const [interestsAnalytics, setInterestsAnalytics] = useState<InterestsAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all analytics data from single endpoint to avoid multiple API calls
  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use single admin analytics endpoint instead of multiple calls
      const adminData = await analyticsService.getAdminAnalytics();
      
      // Fetch favorites and interests in parallel
      const [favoritesData, interestsData] = await Promise.all([
        analyticsService.getFavoritesAnalytics(),
        analyticsService.getInterestsAnalytics()
      ]);
      
      // Derive system analytics
      const systemData: SystemAnalytics = {
        projects: adminData.projects.totalProjects,
        units: adminData.units.totalUnits,
        users: adminData.users.Total,
        employees: adminData.users.Employee,
        admins: adminData.users.Admin,
        superAdmins: adminData.users.SuperAdmin,
        regularUsers: adminData.users.User,
        activeProjects: adminData.projects.activeProjects, // Use direct API value
        completedProjects: adminData.projects.statusCounts.Completed,
        pendingTasks: 0, // Not available in current API
        totalInterests: interestsData.totalInterests // Use real data from interests API
      };

      // Derive project analytics
      const projectsData: ProjectAnalytics = {
        totalProjects: adminData.projects.totalProjects,
        activeProjects: adminData.projects.activeProjects, // Use direct API value
        completedProjects: adminData.projects.statusCounts.Completed,
        inProgressProjects: adminData.projects.statusCounts.InProgress,
        planningProjects: adminData.projects.statusCounts.Planning,
        projectsByType: {
          commercial: adminData.projects.typesCounts.Commercial,
          residential: adminData.projects.typesCounts.Residential,
          educational: adminData.projects.typesCounts.Educational,
          healthcare: adminData.projects.typesCounts.Healthcare,
          recreational: adminData.projects.typesCounts.Recreational,
          industrial: adminData.projects.typesCounts.Industrial,
          governmental: adminData.projects.typesCounts["Governmental "], // Note the space
          service: adminData.projects.typesCounts.Service,
          infrastructure: adminData.projects.typesCounts.Infrastructure,
        }
      };

      // Derive unit analytics
      const unitsData: UnitAnalytics = {
        totalUnits: adminData.units.totalUnits,
        availableUnits: adminData.units.statusCounts.Available,
        soldUnits: adminData.units.statusCounts.Sold,
        reservedUnits: adminData.units.statusCounts.Reserved,
        underConstructionUnits: adminData.units.statusCounts.UnderConstruction,
        unitsByType: {
          apartment: adminData.units.typesCounts.Apartment,
          duplex: adminData.units.typesCounts.Duplex,
          penthouse: adminData.units.typesCounts.Penthouse,
          studio: adminData.units.typesCounts.Studio,
          villa: adminData.units.typesCounts.Villa,
        }
      };

      setSystemAnalytics(systemData);
      setProjectAnalytics(projectsData);
      setUnitAnalytics(unitsData);
      setFavoritesAnalytics(favoritesData);
      setInterestsAnalytics(interestsData);

    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Failed to load analytics data';
      setError(errorMessage);
      console.error('Analytics fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Refresh analytics data
  const refreshAnalytics = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    systemAnalytics,
    projectAnalytics,
    unitAnalytics,
    favoritesAnalytics,
    interestsAnalytics,
    isLoading,
    error,
    refreshAnalytics,
    clearError
  };
};

// Hook for system analytics only (lighter version)
interface UseSystemAnalyticsReturn {
  systemAnalytics: SystemAnalytics | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useSystemAnalytics = (): UseSystemAnalyticsReturn => {
  const [systemAnalytics, setSystemAnalytics] = useState<SystemAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await analyticsService.getSystemAnalytics();
      setSystemAnalytics(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Failed to load system analytics';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemAnalytics();
  }, [fetchSystemAnalytics]);

  return {
    systemAnalytics,
    isLoading,
    error,
    refresh: fetchSystemAnalytics
  };
};
