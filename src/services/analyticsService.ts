/**
 * Analytics Service
 * Handles all analytics-related API calls for administrators
 */

import { apiClient, ApiResponse } from './api';
import { API_ENDPOINTS } from '../config/api';

// API Response interface matching the actual endpoint response
export interface AdminAnalyticsResponse {
  projects: {
    statusCounts: {
      Active: number;
      Completed: number;
      InProgress: number;
      Planning: number;
    };
    typesCounts: {
      Commercial: number;
      Residential: number;
      Educational: number;
      Healthcare: number;
      Recreational: number;
      Industrial: number;
      "Governmental ": number;
      Service: number;
      Infrastructure: number;
    };
    activeProjects: number;
    inactiveProjects: number;
    totalProjects: number;
  };
  users: {
    Admin: number;
    SuperAdmin: number;
    Employee: number;
    User: number;
    Total: number;
  };
  units: {
    statusCounts: {
      Available: number;
      Reserved: number;
      Sold: number;
      UnderConstruction: number;
    };
    typesCounts: {
      Apartment: number;
      Duplex: number;
      Penthouse: number;
      Studio: number;
      Villa: number;
    };
    activeUnits: number;
    inactiveUnits: number;
    totalUnits: number;
  };
}

export interface SystemAnalytics {
  projects: number;
  units: number;
  users: number;
  employees: number;
  admins: number;
  superAdmins: number;
  regularUsers: number;
  totalRevenue?: number;
  activeProjects: number;
  completedProjects: number;
  pendingTasks: number;
  totalInterests: number;
}

export interface ProjectAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  planningProjects: number;
  projectsByType: {
    commercial: number;
    residential: number;
    educational: number;
    healthcare: number;
    recreational: number;
    industrial: number;
    governmental: number;
    service: number;
    infrastructure: number;
  };
}

export interface UnitAnalytics {
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  reservedUnits: number;
  underConstructionUnits: number;
  unitsByType: {
    apartment: number;
    duplex: number;
    penthouse: number;
    studio: number;
    villa: number;
  };
}

export interface FavoritesAnalytics {
  totalFavorites: number;
  projectFavorites: number;
  unitFavorites: number;
  topProjects: Array<{
    projectId: number;
    nameAr: string;
    nameEn: string;
    favoriteCount: number;
  }>;
  topUnits: Array<{
    unitId: number;
    nameAr: string;
    nameEn: string;
    favoriteCount: number;
  }>;
}

export interface InterestsAnalytics {
  totalInterests: number;
  projectInterests: number;
  unitInterests: number;
  activeInterests: number;
  methodBreakdown: {
    phone: number;
    whatsapp: number;
    email: number;
  };
}

class AnalyticsService {
  /**
   * Get the main admin analytics data
   * Uses: /api/admin/analytics
   */
  async getAdminAnalytics(): Promise<AdminAnalyticsResponse> {
    const response = await apiClient.get<AdminAnalyticsResponse>(
      API_ENDPOINTS.ANALYTICS.SYSTEM
    );
    return response;
  }

  /**
   * Get overall system analytics (derived from admin analytics)
   */
  async getSystemAnalytics(): Promise<SystemAnalytics> {
    try {
      const adminData = await this.getAdminAnalytics();
      
      return {
        projects: adminData.projects.totalProjects,
        units: adminData.units.totalUnits,
        users: adminData.users.Total,
        employees: adminData.users.Employee,
        admins: adminData.users.Admin,
        superAdmins: adminData.users.SuperAdmin,
        regularUsers: adminData.users.User,
        activeProjects: adminData.projects.activeProjects, // Use direct API value
        completedProjects: adminData.projects.statusCounts.Completed,
        pendingTasks: 0, // This data might not be available from the current endpoint
        totalInterests: 0 // This data might not be available from the current endpoint
      };
    } catch (error) {
      console.warn('System analytics endpoint not available, returning default data');
      return {
        projects: 0,
        units: 0,
        users: 0,
        employees: 0,
        admins: 0,
        superAdmins: 0,
        regularUsers: 0,
        activeProjects: 0,
        completedProjects: 0,
        pendingTasks: 0,
        totalInterests: 0
      };
    }
  }

  /**
   * Get project analytics (derived from admin analytics)
   */
  async getProjectAnalytics(): Promise<ProjectAnalytics> {
    try {
      const adminData = await this.getAdminAnalytics();
      
      return {
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
          governmental: adminData.projects.typesCounts["Governmental "], // Note the space in the API response
          service: adminData.projects.typesCounts.Service,
          infrastructure: adminData.projects.typesCounts.Infrastructure,
        }
      };
    } catch (error) {
      console.warn('Project analytics endpoint not available, returning default data');
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        planningProjects: 0,
        projectsByType: {
          commercial: 0,
          residential: 0,
          educational: 0,
          healthcare: 0,
          recreational: 0,
          industrial: 0,
          governmental: 0,
          service: 0,
          infrastructure: 0,
        }
      };
    }
  }

  /**
   * Get unit analytics (derived from admin analytics)
   */
  async getUnitAnalytics(): Promise<UnitAnalytics> {
    try {
      const adminData = await this.getAdminAnalytics();
      
      return {
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
    } catch (error) {
      console.warn('Unit analytics endpoint not available, returning default data');
      return {
        totalUnits: 0,
        availableUnits: 0,
        soldUnits: 0,
        reservedUnits: 0,
        underConstructionUnits: 0,
        unitsByType: {
          apartment: 0,
          duplex: 0,
          penthouse: 0,
          studio: 0,
          villa: 0,
        }
      };
    }
  }

  /**
   * Get favorites analytics from admin favorites endpoints
   */
  async getFavoritesAnalytics(): Promise<FavoritesAnalytics> {
    try {
      const [projectFavs, unitFavs] = await Promise.all([
        apiClient.get('/admin/favorites/all-users-favorites-projects') as Promise<any[]>,
        apiClient.get('/admin/favorites/all-users-favorites-units') as Promise<any[]>
      ]);

      // Count total favorites
      const projectFavoriteCount = projectFavs.reduce((total: number, user: any) => 
        total + (user.favoriteProjects?.length || 0), 0);
      
      const unitFavoriteCount = unitFavs.reduce((total: number, user: any) => 
        total + (user.favoriteUnits?.length || 0), 0);

      // Get top projects by favorite count
      const projectCounts = new Map();
      projectFavs.forEach((user: any) => {
        user.favoriteProjects?.forEach((project: any) => {
          const key = project.projectId;
          const current = projectCounts.get(key) || { ...project, favoriteCount: 0 };
          projectCounts.set(key, { ...current, favoriteCount: current.favoriteCount + 1 });
        });
      });

      // Get top units by favorite count
      const unitCounts = new Map();
      unitFavs.forEach((user: any) => {
        user.favoriteUnits?.forEach((unit: any) => {
          const key = unit.unittId; // Note: API uses 'unittId' (typo in API)
          const current = unitCounts.get(key) || { ...unit, unitId: unit.unittId, favoriteCount: 0 };
          unitCounts.set(key, { ...current, favoriteCount: current.favoriteCount + 1 });
        });
      });

      return {
        totalFavorites: projectFavoriteCount + unitFavoriteCount,
        projectFavorites: projectFavoriteCount,
        unitFavorites: unitFavoriteCount,
        topProjects: Array.from(projectCounts.values()).sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, 5),
        topUnits: Array.from(unitCounts.values()).sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, 5)
      };
    } catch (error) {
      console.warn('Favorites analytics endpoint not available, returning default data');
      return {
        totalFavorites: 0,
        projectFavorites: 0,
        unitFavorites: 0,
        topProjects: [],
        topUnits: []
      };
    }
  }

  /**
   * Get interests analytics from admin interests endpoints
   */
  async getInterestsAnalytics(): Promise<InterestsAnalytics> {
    try {
      const [projectInterests, unitInterests] = await Promise.all([
        apiClient.get('/admin/interests/all-users-interests-projects') as Promise<any[]>,
        apiClient.get('/admin/interests/all-users-interests-units') as Promise<any[]>
      ]);

      // Count project interests
      const projectInterestCount = projectInterests.reduce((total: number, user: any) => 
        total + (user.interstsProjects?.length || 0), 0);

      // Count unit interests
      const unitInterestCount = unitInterests.length;

      // Count active interests (available units)
      const activeInterestCount = unitInterests.filter((interest: any) => interest.isAvailible).length;

      // Count method breakdown (assuming methodId: 1=phone, 2=whatsapp, 3=email)
      const methodBreakdown = {
        phone: unitInterests.filter((i: any) => i.methodId === 1).length,
        whatsapp: unitInterests.filter((i: any) => i.methodId === 2).length,
        email: unitInterests.filter((i: any) => i.methodId === 3).length,
      };

      return {
        totalInterests: projectInterestCount + unitInterestCount,
        projectInterests: projectInterestCount,
        unitInterests: unitInterestCount,
        activeInterests: activeInterestCount,
        methodBreakdown
      };
    } catch (error) {
      console.warn('Interests analytics endpoint not available, returning default data');
      return {
        totalInterests: 0,
        projectInterests: 0,
        unitInterests: 0,
        activeInterests: 0,
        methodBreakdown: {
          phone: 0,
          whatsapp: 0,
          email: 0,
        }
      };
    }
  }
}

// Create and export singleton instance
export const analyticsService = new AnalyticsService();
