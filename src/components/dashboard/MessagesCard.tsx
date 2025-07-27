import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ReplyIcon } from 'lucide-react';
import { Message } from '../../types';
import { format } from 'date-fns';

interface MessagesCardProps {
  messages: Message[];
  onMarkAsRead: (messageId: string) => void;
}

export const MessagesCard: React.FC<MessagesCardProps> = ({ 
  messages, 
  onMarkAsRead 
}) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-app-primary">
          Recent Messages
        </CardTitle>
        <Button variant="link" className="text-app-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.slice(0, 3).map((message) => (
          <div key={message.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarFallback className="bg-buttons text-app-primary">
                {message.userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-app-primary">
                    {message.userName}
                  </p>
                  {!message.isRead && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {format(message.createdAt, 'MMM dd')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {message.message}
              </p>
              <div className="flex items-center justify-between">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-app-primary border-app-primary hover:bg-app-primary hover:text-white"
                >
                  <ReplyIcon className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                {!message.isRead && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onMarkAsRead(message.id)}
                    className="text-gray-500 hover:text-app-primary"
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};