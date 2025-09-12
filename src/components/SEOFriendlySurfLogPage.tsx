import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calendar, TrendingUp, Waves, Users, Trophy } from 'lucide-react';

const SEOFriendlySurfLogPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <div className="container mx-auto px-4 py-8">
        {/* SEO Header */}
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            Surf Session Log & Analytics - Track Your Progress
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Log your surf sessions and track your progress with AI-powered analytics. 
            Get personalized insights and improve your surfing performance with WaveMentor.
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/95 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Session Logging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Record detailed surf sessions including wave conditions, equipment used, 
                and personal performance metrics for comprehensive tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Progress Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                AI-powered analytics provide insights into your surfing progression, 
                identifying patterns and areas for improvement.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get personalized recommendations based on your surfing data to 
                accelerate your skill development and wave reading abilities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-primary" />
                Wave Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track wave height, wind conditions, and tides for each session to 
                understand your preferences and optimal surfing conditions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Community Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with other surfers, share your sessions, and learn from 
                the global surfing community's experiences and insights.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Achievement Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Set goals, track milestones, and celebrate your surfing achievements 
                with our comprehensive progression tracking system.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-foreground">
            Why Track Your Surf Sessions?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Data-Driven Improvement</h3>
              <p className="text-muted-foreground">
                By logging your surf sessions consistently, you'll gain valuable insights into your 
                performance patterns, preferred conditions, and areas that need focus. Our AI 
                analytics help identify trends that might not be obvious during individual sessions.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Personalized Coaching</h3>
              <p className="text-muted-foreground">
                Get customized recommendations based on your unique surfing style and progression. 
                Our system learns from your data to provide targeted advice for skill development 
                and wave selection.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Goal Achievement</h3>
              <p className="text-muted-foreground">
                Set specific surfing goals and track your progress systematically. Whether you're 
                working on technique, endurance, or wave count, our tracking tools keep you motivated 
                and on target.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Memory Preservation</h3>
              <p className="text-muted-foreground">
                Preserve memories of your best sessions with detailed logs including photos, 
                conditions, and personal notes. Build a comprehensive record of your surfing journey 
                over time.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-12">
          <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Start Tracking Your Surf Sessions Today
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of surfers who are improving their skills with data-driven insights. 
                Sign up for WaveMentor and begin your journey to better surfing.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default SEOFriendlySurfLogPage;