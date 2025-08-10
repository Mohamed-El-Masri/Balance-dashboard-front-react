/**
 * API Configuration for Balance Real Estate Dashboard
 * Base URL and common API settings
 */

export const API_CONFIG = {
  BASE_URL: 'https://balancerealestate.runasp.net',
  API_PREFIX: '/api',
  TIMEOUT: 30000, // 30 seconds
  DEFAULT_PAGE_SIZE: 20,
} as const;

/**
 * Get full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}/${cleanEndpoint}`;
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNIN: 'auth/signin',
    SIGNUP: 'auth/signup',
    REFRESH: 'auth/refresh',
    LOGOUT: 'auth/logout',
    FORGOT_PASSWORD: 'auth/forgot-password',
    RESET_PASSWORD: 'auth/reset-password',
    VERIFY_EMAIL: 'auth/verify-email',
    CHANGE_PASSWORD: 'auth/change-password',
  },
  
  // User endpoints
  USER: {
    PROFILE: (id: string) => `user/${id}`,
    UPDATE_PROFILE: (id: string) => `user/${id}`,
    LIST: 'user',
    DEACTIVATE: (id: string) => `user/${id}/deactivate`,
  },
  
    // Analytics endpoints (only available endpoints from docs)
  ANALYTICS: {
    SYSTEM: 'admin/analytics',
    USERS_COUNT: 'admin/analytics/users-count',
  },

  // Employee Dashboard endpoints
  DASHBOARD: {
    OVERVIEW: 'dashboard/overview',
    STATISTICS: 'dashboard/statistics',
    EMPLOYEE: 'employeedashboard',
    EMPLOYEE_TASKS: 'employeedashboard/tasks',
    EMPLOYEE_PERFORMANCE: 'employeedashboard/performance',
  },
  
  // Project endpoints (matches API documentation)
  PROJECT: {
    LIST: 'project',
    DETAIL: (id: number) => `project/${id}`,
    PROJECT_DETAILS: (id: number) => `project/projectdetails/${id}`,
    LOCATIONS: 'project/locations',
    CITIES: 'project/cities',
    REGIONS: 'project/regions',
    DISTRICTS: 'project/districts',
    CONTACT_METHODS: 'project/contactmethods',
  },
  
  // Admin Project endpoints
  ADMIN_PROJECT: {
    CREATE: 'admin/project',
    UPDATE: (id: number) => `admin/project/${id}`,
    DELETE: (id: number) => `admin/project/${id}`,
    ADD_IMAGES: (id: number) => `admin/project/${id}/images`,
    ASSIGN_EMPLOYEES: (id: number) => `admin/project/${id}/assign-employees`,
    BULK_DELETE: 'admin/project/bulk-delete',
    SET_FEATURED: (id: number, isFeatured: boolean) => `admin/project/${id}/set-featured?isFeatured=${isFeatured}`,
    TOGGLE_ACTIVE: (id: number, isActive: boolean) => `admin/project/${id}/toggle-active?isActive=${isActive}`,
    EXPORT: 'admin/project/export',
  },
  
  // Unit endpoints
  UNIT: {
    LIST: 'unit',
    DETAIL: (id: number) => `unit/${id}`,
    IMAGES: (id: number) => `unit/${id}/images`,
    FEATURES: (id: number) => `unit/${id}/features`,
    EMPLOYEES: (id: number) => `unit/${id}/employees`,
  },
  
  // Task endpoints
  TASK: {
    LIST: 'task',
    DETAIL: (id: number) => `task/${id}`,
    CREATE: 'task',
    UPDATE: (id: number) => `task/${id}`,
    DELETE: (id: number) => `task/${id}`,
    ASSIGN: (id: number) => `task/${id}/assign`,
    COMPLETE: (id: number) => `task/${id}/complete`,
    ADD_COMMENT: (id: number) => `task/${id}/comments`,
    ATTACHMENTS: (id: number) => `task/${id}/attachments`,
  },
  
  // Favorites endpoints
  FAVORITES: {
    ADD_UNIT: 'favorites/unit',
    ADD_PROJECT: 'favorites/project',
    REMOVE_UNIT: (id: number) => `favorites/unit/${id}`,
    REMOVE_PROJECT: (id: number) => `favorites/project/${id}`,
    LIST: 'favorites',
    UNITS: 'favorites/units',
    PROJECTS: 'favorites/projects',
  },
  
  // Admin Favorites endpoints
  ADMIN_FAVORITES: {
    LIST: 'admin/favorites',
    ANALYTICS: 'admin/favorites/analytics',
    EXPORT: 'admin/favorites/export',
  },
  
  // Interests endpoints
  INTERESTS: {
    SUBMIT_UNIT: 'interests/unit',
    SUBMIT_PROJECT: 'interests/project',
    LIST: 'interests',
    DETAIL: (id: number) => `interests/${id}`,
  },
  
  // Admin Interests endpoints
  ADMIN_INTERESTS: {
    LIST: 'admin/interests',
    UPDATE_STATUS: (id: number) => `admin/interests/${id}/status`,
    ASSIGN: (id: number) => `admin/interests/${id}/assign`,
    ADD_NOTE: (id: number) => `admin/interests/${id}/notes`,
    EXPORT: 'admin/interests/export',
    ANALYTICS: 'admin/interests/analytics',
  },
  
  // Notification endpoints
  NOTIFICATION: {
    LIST: 'notification',
    DETAIL: (id: number) => `notification/${id}`,
    CREATE: 'notification',
    MARK_READ: (id: number) => `notification/${id}/read`,
    MARK_ALL_READ: 'notification/mark-all-read',
    DELETE: (id: number) => `notification/${id}`,
  },
  
  // Content Component endpoints
  CONTENT: {
    LIST: 'contentcomponent',
    DETAIL: (id: number) => `contentcomponent/${id}`,
    CREATE: 'contentcomponent',
    UPDATE: (id: number) => `contentcomponent/${id}`,
    DELETE: (id: number) => `contentcomponent/${id}`,
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Request Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;
