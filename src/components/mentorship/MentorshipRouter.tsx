
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';
import { useAuth } from '@/hooks/useAuth';
import MentorDashboard from './MentorDashboard';
import StudentPortal from './StudentPortal';

const MentorshipRouter: React.FC = () => {
  const { user } = useAuth();
  const { userRole, roleLoading } = useMentorship();

  // Show loading while determining user role
  if (roleLoading || !user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading your profile...</span>
        </CardContent>
      </Card>
    );
  }

  // Route based on user role
  switch (userRole) {
    case 'mentor':
      return <MentorDashboard />;
    case 'student':
      return <StudentPortal />;
    case 'admin':
      // Admin could see both or a special admin panel
      return <MentorDashboard />;
    default:
      // Default to student portal for new users
      return <StudentPortal />;
  }
};

export default MentorshipRouter;
