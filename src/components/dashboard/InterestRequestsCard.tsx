import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { InterestRequest } from '../../types';
import { format } from 'date-fns';

interface InterestRequestsCardProps {
  requests: InterestRequest[];
  onUpdateStatus: (requestId: string, status: InterestRequest['status']) => void;
}

export const InterestRequestsCard: React.FC<InterestRequestsCardProps> = ({ 
  requests, 
  onUpdateStatus 
}) => {
  const getStatusColor = (status: InterestRequest['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Contacted':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-app-primary">
          Recent Interest Requests
        </CardTitle>
        <Button variant="link" className="text-app-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.slice(0, 3).map((request) => (
          <div key={request.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarFallback className="bg-buttons text-app-primary">
                {request.userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-app-primary">
                  {request.userName}
                </p>
                <span className="text-xs text-gray-500">
                  {format(request.createdAt, 'MMM dd')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {request.message}
              </p>
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
                {request.status === 'Pending' && (
                  <Button 
                    size="sm" 
                    className="bg-app-primary hover:bg-app-primary/90"
                    onClick={() => onUpdateStatus(request.id, 'Contacted')}
                  >
                    Contact
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