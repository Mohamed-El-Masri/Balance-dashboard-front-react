import { useState, useEffect } from 'react';
import { Project, InterestRequest, Message, DashboardStats } from '../types';

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Skyline Residences',
    description: 'Luxury residential complex with modern amenities',
    location: 'Downtown, New York',
    type: 'Apartment',
    status: 'Active',
    units: 42,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Harbor View Plaza',
    description: 'Premium commercial complex with sea view',
    location: 'Marina Bay, San Francisco',
    type: 'Office',
    status: 'In Progress',
    units: 28,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Green Valley Estates',
    description: 'Eco-friendly residential community',
    location: 'Westfield, Chicago',
    type: 'Villa',
    status: 'Planning',
    units: 35,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '4',
    name: 'Metropolitan Tower',
    description: 'Mixed-use development in city center',
    location: 'Central District, London',
    type: 'Mixed',
    status: 'Completed',
    units: 64,
    createdAt: new Date('2023-12-01'),
  },
];

const mockInterestRequests: InterestRequest[] = [
  {
    id: '1',
    userName: 'Emily Richardson',
    userEmail: 'emily@example.com',
    message: 'Interested in a 2-bedroom apartment at Skyline Residences.',
    projectId: '1',
    status: 'Pending',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    userName: 'Michael Thompson',
    userEmail: 'michael@example.com',
    message: 'Looking for office space at Harbor View Plaza, approx. 2000 sq ft.',
    projectId: '2',
    status: 'Contacted',
    createdAt: new Date('2024-01-19'),
  },
  {
    id: '3',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    message: 'Interested in a villa at Green Valley Estates. Budget: $750,000.',
    projectId: '3',
    status: 'In Progress',
    createdAt: new Date('2024-01-18'),
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    userName: 'Jennifer Williams',
    userEmail: 'jennifer@example.com',
    message: "I'd like to schedule a viewing for the penthouse unit at Skyline Residences this weekend. Is Saturday morning available?",
    createdAt: new Date('2024-01-20'),
    isRead: false,
  },
  {
    id: '2',
    userName: 'Robert Anderson',
    userEmail: 'robert@example.com',
    message: 'Can you provide more information about the payment plans available for the Green Valley Estates properties?',
    createdAt: new Date('2024-01-19'),
    isRead: false,
  },
  {
    id: '3',
    userName: 'David Martinez',
    userEmail: 'david@example.com',
    message: "I'm interested in leasing office space at Harbor View Plaza. What are the current rates per square foot?",
    createdAt: new Date('2024-01-18'),
    isRead: true,
  },
];

const mockStats: DashboardStats = {
  totalProjects: 24,
  totalUnits: 187,
  interestRequests: 42,
  newMessages: 18,
  projectsChange: 8.2,
  unitsChange: 12.5,
  requestsChange: -3.8,
  messagesChange: 5.2,
};

export const useDashboardData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [interestRequests, setInterestRequests] = useState<InterestRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjects(mockProjects);
      setInterestRequests(mockInterestRequests);
      setMessages(mockMessages);
      setStats(mockStats);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const updateRequestStatus = (requestId: string, status: InterestRequest['status']) => {
    setInterestRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status } : req)
    );
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg)
    );
  };

  return {
    projects,
    interestRequests,
    messages,
    stats,
    isLoading,
    updateRequestStatus,
    markMessageAsRead,
  };
};