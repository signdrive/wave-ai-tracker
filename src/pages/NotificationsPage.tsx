import React from 'react';
import NotificationSetup from '@/components/notifications/NotificationSetup';

const NotificationsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Push Notifications</h1>
          <p className="text-xl text-muted-foreground">
            Get real-time alerts for perfect surf conditions and important updates
          </p>
        </div>
        
        <NotificationSetup />
      </div>
    </div>
  );
};

export default NotificationsPage;