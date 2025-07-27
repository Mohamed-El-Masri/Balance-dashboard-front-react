import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { SearchIcon, ReplyIcon, ArchiveIcon } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { format } from 'date-fns';

export const MessagesPage: React.FC = () => {
  const { messages, isLoading, markMessageAsRead } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !message.isRead) ||
                         (filter === 'read' && message.isRead);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-app-primary">Messages</h1>
        <p className="text-gray-600">Manage customer inquiries and communications</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-app-primary' : ''}
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
                className={filter === 'unread' ? 'bg-app-primary' : ''}
              >
                Unread ({messages.filter(m => !m.isRead).length})
              </Button>
              <Button
                variant={filter === 'read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('read')}
                className={filter === 'read' ? 'bg-app-primary' : ''}
              >
                Read
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className={`hover:shadow-md transition-shadow duration-200 ${
            !message.isRead ? 'border-l-4 border-l-app-primary bg-blue-50/30' : ''
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-buttons text-app-primary font-medium">
                    {message.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-app-primary">
                        {message.userName}
                      </h3>
                      {!message.isRead && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{format(message.createdAt, 'MMM dd, yyyy')}</span>
                      <span>{format(message.createdAt, 'HH:mm')}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {message.userEmail}
                  </p>
                  <p className="text-gray-800 mb-4 leading-relaxed">
                    {message.message}
                  </p>
                  <div className="flex items-center space-x-3">
                    <Button 
                      size="sm" 
                      className="bg-app-primary hover:bg-app-primary/90"
                    >
                      <ReplyIcon className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    {!message.isRead && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => markMessageAsRead(message.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-gray-500">
                      <ArchiveIcon className="h-3 w-3 mr-1" />
                      Archive
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No messages found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};