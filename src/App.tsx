import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { MessagesPage } from './components/pages/MessagesPage';
import { SettingsPage } from './components/pages/SettingsPage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-app-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'projects':
        return 'Projects';
      case 'units':
        return 'Units';
      case 'content':
        return 'Content';
      case 'requests':
        return 'Interest Requests';
      case 'messages':
        return 'Messages';
      case 'users':
        return 'Users';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return `Welcome back, ${user.name}! Here's what's happening with your properties today.`;
      case 'projects':
        return 'Manage all your real estate projects';
      case 'messages':
        return 'Manage customer inquiries and communications';
      case 'settings':
        return 'Manage your account settings and preferences';
      default:
        return '';
    }
  };

  const renderPageContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'projects':
        return <ProjectsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'units':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-app-primary mb-2">Units Management</h2>
            <p className="text-gray-600">This page is under development.</p>
          </div>
        );
      case 'content':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-app-primary mb-2">Content Management</h2>
            <p className="text-gray-600">This page is under development.</p>
          </div>
        );
      case 'requests':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-app-primary mb-2">Interest Requests</h2>
            <p className="text-gray-600">This page is under development.</p>
          </div>
        );
      case 'users':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-app-primary mb-2">User Management</h2>
            <p className="text-gray-600">This page is under development.</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-app-secondary">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} />
        <main className="flex-1 overflow-auto p-6">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;