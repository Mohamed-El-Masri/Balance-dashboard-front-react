export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  type: 'Apartment' | 'Office' | 'Villa' | 'Mixed';
  status: 'Active' | 'In Progress' | 'Planning' | 'Completed';
  units: number;
  image?: string;
  createdAt: Date;
}

export interface InterestRequest {
  id: string;
  userName: string;
  userEmail: string;
  message: string;
  projectId: string;
  status: 'Pending' | 'Contacted' | 'In Progress' | 'Closed';
  createdAt: Date;
}

export interface Message {
  id: string;
  userName: string;
  userEmail: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export interface DashboardStats {
  totalProjects: number;
  totalUnits: number;
  interestRequests: number;
  newMessages: number;
  projectsChange: number;
  unitsChange: number;
  requestsChange: number;
  messagesChange: number;
}