import React from 'react';
import {
  LayoutDashboardIcon,
  FolderKanbanIcon,
  HomeIcon,
  FileTextIcon,
  ClipboardListIcon,
  MessageSquareIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      id: 'dashboard',
      icon: <LayoutDashboardIcon className="h-5 w-5" />,
      label: 'Dashboard',
    },
    {
      id: 'projects',
      icon: <FolderKanbanIcon className="h-5 w-5" />,
      label: 'Projects',
    },
    {
      id: 'units',
      icon: <HomeIcon className="h-5 w-5" />,
      label: 'Units',
    },
    {
      id: 'content',
      icon: <FileTextIcon className="h-5 w-5" />,
      label: 'Content',
    },
    {
      id: 'requests',
      icon: <ClipboardListIcon className="h-5 w-5" />,
      label: 'Requests',
    },
    {
      id: 'messages',
      icon: <MessageSquareIcon className="h-5 w-5" />,
      label: 'Messages',
    },
    {
      id: 'users',
      icon: <UsersIcon className="h-5 w-5" />,
      label: 'Users',
    },
  ];

  return (
    <aside className="flex flex-col w-[280px] h-screen bg-app-primary shadow-xl">
      {/* Logo and Brand */}
      <div className="flex items-center p-6 border-b border-app-secondary/10">
        <div className="w-12 h-12 bg-buttons rounded-xl flex items-center justify-center">
          <HomeIcon className="w-6 h-6 text-app-primary" />
        </div>
        <div className="ml-3">
          <h1 className="font-bold text-app-secondary text-xl">Balance</h1>
          <p className="text-app-secondary/70 text-sm">Real Estate Co</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-auto py-6">
        <div className="px-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-12 px-4 text-left font-medium transition-all duration-200",
                activeTab === item.id
                  ? "bg-buttons text-app-primary shadow-sm"
                  : "text-app-secondary/80 hover:bg-app-secondary/10 hover:text-app-secondary"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <span className="w-5 h-5 mr-3">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* Settings and Logout */}
      <div className="border-t border-app-secondary/10 p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-4 text-app-secondary/80 hover:bg-app-secondary/10 hover:text-app-secondary"
          onClick={() => onTabChange('settings')}
        >
          <SettingsIcon className="w-5 h-5 mr-3" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-4 text-app-secondary/80 hover:bg-red-500/10 hover:text-red-400"
          onClick={logout}
        >
          <LogOutIcon className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>

      {/* User Profile */}
      <div className="border-t border-app-secondary/10 p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-buttons text-app-primary font-medium">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-app-secondary truncate">
              {user?.name}
            </p>
            <p className="text-xs text-app-secondary/60 truncate">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};