
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Shield, Award, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoleGateway: React.FC = () => {
  const { user } = useAuth();
  const { userRole, isAdmin, isMentor, isStudent, isLoading } = useUserRole();

  if (!user) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Join SurfMentor Pro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Connect with certified surf mentors and accelerate your surfing journey with personalized coaching.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-blue-500" />
              <span>Expert mentorship</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Progress tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span>Personalized lessons</span>
            </div>
          </div>
          <Button className="w-full mt-4 bg-ocean hover:bg-ocean-dark">
            Get Started
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Dashboard</span>
          <Badge variant={
            isAdmin() ? 'destructive' : 
            isMentor() ? 'default' : 
            'secondary'
          }>
            {userRole}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdmin() && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="font-medium">Admin Controls</span>
            </div>
            <p className="text-sm text-gray-600">
              Manage platform features, users, and monitor system health.
            </p>
            <Button asChild className="w-full">
              <Link to="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        )}

        {isMentor() && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Mentor Hub</span>
            </div>
            <p className="text-sm text-gray-600">
              Manage your students, set availability, and track your teaching impact.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/mentor/students">Students</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/mentor/availability">Schedule</Link>
              </Button>
            </div>
          </div>
        )}

        {isStudent() && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              <span className="font-medium">Student Portal</span>
            </div>
            <p className="text-sm text-gray-600">
              Find mentors, book sessions, and track your surfing progress.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/student/mentors">Find Mentors</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/student/progress">Progress</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="pt-3 border-t">
          <p className="text-xs text-gray-500">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleGateway;
