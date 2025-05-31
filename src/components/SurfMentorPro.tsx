
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Waves, Users, Award, BookOpen, Settings } from 'lucide-react';
import MentorOnboardingWizard from './mentor/MentorOnboardingWizard';
import MentorDashboard from './mentor/MentorDashboard';
import StudentDashboard from './student/StudentDashboard';
import EnhancedSurfInterface from './EnhancedSurfInterface';

const SurfMentorPro: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<'tracker' | 'mentorship'>('tracker');

  const { data: profile, isLoading: profileLoading, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  // Check if user needs to complete mentor onboarding
  const needsMentorOnboarding = profile?.user_type === 'mentor' && !profile?.bio;

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Surf Mentor Pro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Waves className="w-16 h-16 text-ocean mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Surf Mentor Pro</h2>
            <p className="text-gray-600 mb-6">
              Connect with certified surf mentors and improve your skills with AI-powered wave tracking
            </p>
            <p className="text-sm text-gray-500">Please sign in to continue</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showOnboarding || needsMentorOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 py-8">
        <div className="container mx-auto px-4">
          <MentorOnboardingWizard 
            onComplete={() => {
              setShowOnboarding(false);
              refetch();
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Waves className="w-8 h-8 text-ocean" />
                <h1 className="text-2xl font-bold">Surf Mentor Pro</h1>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={currentView === 'tracker' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('tracker')}
                >
                  Wave Tracker
                </Button>
                <Button
                  variant={currentView === 'mentorship' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('mentorship')}
                >
                  Mentorship
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Welcome, {profile?.full_name || user.email}</span>
                <Badge variant={profile?.user_type === 'mentor' ? 'default' : 'secondary'}>
                  {profile?.user_type === 'mentor' ? (
                    <>
                      <Award className="w-3 h-3 mr-1" />
                      Mentor
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3 h-3 mr-1" />
                      Student
                    </>
                  )}
                </Badge>
              </div>

              {profile?.user_type !== 'mentor' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOnboarding(true)}
                >
                  <Award className="w-4 h-4 mr-1" />
                  Become a Mentor
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === 'tracker' ? (
          <EnhancedSurfInterface />
        ) : (
          <div>
            {profile?.user_type === 'mentor' ? (
              <MentorDashboard />
            ) : (
              <StudentDashboard />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurfMentorPro;
