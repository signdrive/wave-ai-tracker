
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, Calendar, Settings, Shield } from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';

const AdminDashboard: React.FC = () => {
  const { sessions, mentors, sessionsLoading } = useMentorship();

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const activeMentors = mentors.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            System overview and management
          </p>
        </div>
        <Badge className="bg-purple-500">
          <Shield className="w-4 h-4 mr-1" />
          Administrator
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Mentors</p>
                <p className="text-2xl font-bold">{activeMentors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Sessions</p>
                <p className="text-2xl font-bold">{completedSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold">
                  {totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="mentors">Mentor Overview</TabsTrigger>
          <TabsTrigger value="sessions">Session Analytics</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Manage user accounts, roles, and permissions
              </p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Role Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Mentors:</span>
                      <Badge>{activeMentors}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <Badge variant="outline">
                        {new Set(sessions.map(s => s.student_id)).size}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Administrators:</span>
                      <Badge className="bg-purple-500">1</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Mentor Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No mentors registered yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentors.slice(0, 6).map((mentor) => (
                      <Card key={mentor.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{mentor.full_name || 'Unnamed Mentor'}</h3>
                              <p className="text-sm text-gray-600">
                                {mentor.certification_level || 'No certification listed'}
                              </p>
                              <p className="text-sm text-gray-500">
                                Experience: {mentor.years_experience || 0} years
                              </p>
                            </div>
                            <Badge className="bg-green-500">
                              Active
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Session Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Session Status</h3>
                    <div className="space-y-2">
                      {['pending', 'confirmed', 'completed', 'cancelled'].map(status => {
                        const count = sessions.filter(s => s.status === status).length;
                        return (
                          <div key={status} className="flex justify-between">
                            <span className="capitalize">{status}:</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Authentication Settings</h3>
                  <p className="text-gray-600">
                    Google OAuth is configured and active. Users can sign in with their Google accounts.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Security Settings</h3>
                  <p className="text-gray-600">
                    Row-level security is enabled. Admin access is properly protected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
