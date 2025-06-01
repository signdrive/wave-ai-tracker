
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Clock, Star, TrendingUp, Video } from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';
import AvailabilityScheduler from './AvailabilityScheduler';
import SessionHistory from './SessionHistory';
import StudentProgressTracker from './StudentProgressTracker';

const MentorDashboard: React.FC = () => {
  const { sessions, profile, sessionsLoading } = useMentorship();
  
  const upcomingSessions = sessions.filter(s => 
    s.status === 'confirmed' && new Date(s.scheduled_at) > new Date()
  );
  
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const averageRating = completedSessions.reduce((acc, s) => acc + (s.rating || 0), 0) / completedSessions.length || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mentor Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {profile?.full_name || 'Mentor'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500">
            Mentor
          </Badge>
          {profile?.certification_level && (
            <Badge variant="outline">
              {profile.certification_level}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Sessions</p>
                <p className="text-2xl font-bold">{upcomingSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold">
                  {new Set(sessions.map(s => s.student_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hours Taught</p>
                <p className="text-2xl font-bold">
                  {Math.round(completedSessions.reduce((acc, s) => acc + s.duration_minutes, 0) / 60)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <AvailabilityScheduler />
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Your Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No students yet. Your sessions will appear here once booked.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from(new Set(sessions.map(s => s.student_id))).map(studentId => {
                      const studentSessions = sessions.filter(s => s.student_id === studentId);
                      const completedCount = studentSessions.filter(s => s.status === 'completed').length;
                      
                      return (
                        <Card key={studentId}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">Student #{studentId.slice(-6)}</h3>
                                <p className="text-sm text-gray-600">
                                  {completedCount} sessions completed
                                </p>
                              </div>
                              <Badge variant="outline">
                                {studentSessions.length} total
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <SessionHistory />
        </TabsContent>

        <TabsContent value="progress">
          <StudentProgressTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorDashboard;
