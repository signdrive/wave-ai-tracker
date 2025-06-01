
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, BookOpen, TrendingUp, User } from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';
import MentorFinder from './MentorFinder';
import SessionBooking from './SessionBooking';
import SkillProgressTracker from './SkillProgressTracker';

const StudentPortal: React.FC = () => {
  const { sessions, profile, sessionsLoading } = useMentorship();
  
  const upcomingSessions = sessions.filter(s => 
    s.status === 'confirmed' && new Date(s.scheduled_at) > new Date()
  );
  
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const skillLevel = profile?.skill_level || 1;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {profile?.full_name || 'Student'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-500">
            Student
          </Badge>
          <Badge variant="outline">
            Level {skillLevel}
          </Badge>
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
              <BookOpen className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</p>
                <p className="text-2xl font-bold">{completedSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Skill Level</p>
                <p className="text-2xl font-bold">{skillLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mentors Worked With</p>
                <p className="text-2xl font-bold">
                  {new Set(sessions.map(s => s.mentor_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="find-mentor" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="find-mentor">Find Mentor</TabsTrigger>
          <TabsTrigger value="book-session">Book Session</TabsTrigger>
          <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="find-mentor">
          <MentorFinder />
        </TabsContent>

        <TabsContent value="book-session">
          <SessionBooking />
        </TabsContent>

        <TabsContent value="my-sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                My Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No sessions booked yet. Find a mentor to get started!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {sessions.slice(0, 10).map((session) => (
                      <Card key={session.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                Session at {session.spot_id}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(session.scheduled_at).toLocaleDateString()} at{' '}
                                {new Date(session.scheduled_at).toLocaleTimeString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Duration: {session.duration_minutes} minutes
                              </p>
                            </div>
                            <Badge
                              variant={
                                session.status === 'confirmed'
                                  ? 'default'
                                  : session.status === 'completed'
                                  ? 'secondary'
                                  : session.status === 'cancelled'
                                  ? 'destructive'
                                  : 'outline'
                              }
                            >
                              {session.status}
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

        <TabsContent value="progress">
          <SkillProgressTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentPortal;
