import React from 'react';
import { Card, CardContent } from '../ui/card';
import { TrendingUpIcon, TrendingDownIcon, FolderKanbanIcon, HomeIcon, ClipboardListIcon, MessageSquareIcon } from 'lucide-react';
import { DashboardStats } from '../../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects.toString(),
      change: stats.projectsChange,
      icon: <FolderKanbanIcon className="h-6 w-6" />,
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Total Units',
      value: stats.totalUnits.toString(),
      change: stats.unitsChange,
      icon: <HomeIcon className="h-6 w-6" />,
      bgColor: 'bg-green-500',
    },
    {
      title: 'Interest Requests',
      value: stats.interestRequests.toString(),
      change: stats.requestsChange,
      icon: <ClipboardListIcon className="h-6 w-6" />,
      bgColor: 'bg-orange-500',
    },
    {
      title: 'New Messages',
      value: stats.newMessages.toString(),
      change: stats.messagesChange,
      icon: <MessageSquareIcon className="h-6 w-6" />,
      bgColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-app-primary">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  {card.change >= 0 ? (
                    <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Math.abs(card.change)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center text-white`}>
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};