import React from 'react';
import { StatsCards } from './StatsCards';
import { ProjectsTable } from './ProjectsTable';
import { InterestRequestsCard } from './InterestRequestsCard';
import { MessagesCard } from './MessagesCard';
import { useDashboardData } from '../../hooks/useDashboardData';

export const DashboardOverview: React.FC = () => {
  const {
    projects,
    interestRequests,
    messages,
    stats,
    isLoading,
    updateRequestStatus,
    markMessageAsRead,
  } = useDashboardData();

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Projects Table */}
      <ProjectsTable projects={projects} />

      {/* Interest Requests and Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InterestRequestsCard 
          requests={interestRequests} 
          onUpdateStatus={updateRequestStatus}
        />
        <MessagesCard 
          messages={messages} 
          onMarkAsRead={markMessageAsRead}
        />
      </div>
    </div>
  );
};