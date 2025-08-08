/**
 * Projects Hook
 * Custom hook for handling project-related operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  projectService, 
  Project, 
  ProjectFilters, 
  CreateProjectRequest,
  LocationData 
} from '../services/projectService';
import { ApiError, PaginatedResponse } from '../services/api';

interface UseProjectsReturn {
  projects: Project[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  filters: ProjectFilters;
  setFilters: (filters: ProjectFilters) => void;
  refreshProjects: () => Promise<void>;
  createProject: (data: CreateProjectRequest) => Promise<number | null>;
  updateProject: (id: number, data: Partial<CreateProjectRequest>) => Promise<boolean>;
  deleteProject: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useProjects = (initialFilters?: ProjectFilters): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || {});

  // Fetch projects function
  const fetchProjects = useCallback(async (projectFilters?: ProjectFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const response: PaginatedResponse<Project> = await projectService.getProjects(
        projectFilters || filters
      );

      setProjects(response.items);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Failed to fetch projects. Please try again.';
      setError(errorMessage);
      console.error('Fetch projects error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Update filters and fetch projects
  const updateFilters = useCallback((newFilters: ProjectFilters) => {
    setFilters(newFilters);
    fetchProjects(newFilters);
  }, [fetchProjects]);

  // Refresh projects
  const refreshProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  // Create project
  const createProject = useCallback(async (data: CreateProjectRequest): Promise<number | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await projectService.createProject(data);
      
      // Refresh projects list after creation
      await fetchProjects();
      
      return response.data?.id || null;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Failed to create project. Please try again.';
      setError(errorMessage);
      console.error('Create project error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProjects]);

  // Update project
  const updateProject = useCallback(async (
    id: number, 
    data: Partial<CreateProjectRequest>
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await projectService.updateProject(id, data);
      
      // Refresh projects list after update
      await fetchProjects();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Failed to update project. Please try again.';
      setError(errorMessage);
      console.error('Update project error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProjects]);

  // Delete project
  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await projectService.deleteProject(id);
      
      // Refresh projects list after deletion
      await fetchProjects();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Failed to delete project. Please try again.';
      setError(errorMessage);
      console.error('Delete project error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProjects]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    totalItems,
    totalPages,
    currentPage,
    isLoading,
    error,
    filters,
    setFilters: updateFilters,
    refreshProjects,
    createProject,
    updateProject,
    deleteProject,
    clearError,
  };
};

// Hook for single project
interface UseProjectReturn {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  refreshProject: () => Promise<void>;
  clearError: () => void;
}

export const useProject = (id: number): UseProjectReturn => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const projectData = await projectService.getProject(id);
      setProject(projectData);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Failed to fetch project details. Please try again.';
      setError(errorMessage);
      console.error('Fetch project error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const refreshProject = useCallback(async () => {
    await fetchProject();
  }, [fetchProject]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id, fetchProject]);

  return {
    project,
    isLoading,
    error,
    refreshProject,
    clearError,
  };
};

// Hook for location data
interface UseLocationDataReturn {
  cities: LocationData[];
  regions: LocationData[];
  districts: LocationData[];
  isLoading: boolean;
  error: string | null;
  getDistricts: (cityId: number) => Promise<void>;
  clearError: () => void;
}

export const useLocationData = (): UseLocationDataReturn => {
  const [cities, setCities] = useState<LocationData[]>([]);
  const [regions, setRegions] = useState<LocationData[]>([]);
  const [districts, setDistricts] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [citiesData, regionsData] = await Promise.all([
        projectService.getCities(),
        projectService.getRegions(),
      ]);

      setCities(citiesData);
      setRegions(regionsData);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Failed to fetch location data. Please try again.';
      setError(errorMessage);
      console.error('Fetch location data error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDistricts = useCallback(async (cityId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const districtsData = await projectService.getDistricts(cityId);
      setDistricts(districtsData);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.detail 
        : 'Failed to fetch districts. Please try again.';
      setError(errorMessage);
      console.error('Fetch districts error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchLocationData();
  }, [fetchLocationData]);

  return {
    cities,
    regions,
    districts,
    isLoading,
    error,
    getDistricts,
    clearError,
  };
};
