
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Hero from '@/components/Hero';
import EnhancedSurfInterface from '@/components/EnhancedSurfInterface';
import SearchableWeatherForecast from '@/components/SearchableWeatherForecast';
import MonetizationShowcase from '@/components/MonetizationShowcase';
import { Link } from 'react-router-dom';
import { 
  Waves, 
  MapPin, 
  Camera, 
  Users, 
  Trophy, 
  Plane, 
  BookOpen, 
  BarChart3,
  Shield,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Main Content Section with SEO-friendly text */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              WaveMentor - The Ultimate Surf Intelligence Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              WaveMentor is the world's most comprehensive surf intelligence platform, combining cutting-edge AI technology 
              with real-time ocean data to deliver unparalleled surf forecasting, live cam monitoring, and personalized 
              surfing experiences. Whether you're a beginner learning to catch your first wave or a professional surfer 
              seeking the perfect barrel, our platform provides the tools and insights you need to maximize your time in the water.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of surfers worldwide who trust WaveMentor for accurate wave predictions, expert coaching, 
              equipment recommendations, and surf travel planning. Our platform integrates machine learning algorithms 
              with local surf knowledge to provide forecasts that are up to 95% more accurate than traditional weather services.
            </p>
            
            {/* Quick Navigation Links */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link to="/map">
                <Button className="bg-ocean hover:bg-ocean-dark">
                  <MapPin className="w-4 h-4 mr-2" />
                  Explore Surf Spots
                </Button>
              </Link>
              <Link to="/live-spots">
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Live Surf Cams
                </Button>
              </Link>
              <Link to="/mentorship">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Find a Mentor
                </Button>
              </Link>
              <Link to="/travel">
                <Button variant="outline">
                  <Plane className="w-4 h-4 mr-2" />
                  Surf Travel
                </Button>
              </Link>
            </div>
          </div>

          {/* Core Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Waves className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>AI-Powered Surf Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get hyper-accurate wave predictions powered by machine learning algorithms that analyze real-time 
                  ocean data, weather patterns, and local surf conditions. Our forecasts include wave height, period, 
                  direction, wind conditions, and optimal surfing times.
                </p>
                <Link to="/live-spots" className="text-blue-600 hover:text-blue-700 inline-flex items-center">
                  View Live Conditions <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Live Surf Cam Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Access our global network of high-definition surf cameras providing real-time views of surf breaks 
                  worldwide. See actual wave conditions, crowd levels, and water quality before you paddle out. 
                  Available 24/7 with HD streaming.
                </p>
                <Link to="/live-spots" className="text-green-600 hover:text-green-700 inline-flex items-center">
                  Watch Live Cams <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Expert Surf Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Connect with certified surf instructors and professional surfers for personalized coaching sessions. 
                  Get video analysis, technique improvement tips, and safety guidance tailored to your skill level 
                  and surfing goals.
                </p>
                <Link to="/mentorship" className="text-purple-600 hover:text-purple-700 inline-flex items-center">
                  Find Your Coach <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Global Surf Spot Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Explore thousands of surf spots worldwide with detailed information about wave characteristics, 
                  best conditions, local regulations, and insider tips. Filter by skill level, wave type, and 
                  crowd levels to find your perfect surf session.
                </p>
                <Link to="/map" className="text-orange-600 hover:text-orange-700 inline-flex items-center">
                  Explore Map <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Surf Travel Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Discover and book amazing surf travel packages to the world's best surf destinations. From tropical 
                  paradises to challenging reef breaks, we help you plan the perfect surf trip with expert guides, 
                  premium accommodations, and equipment included.
                </p>
                <Link to="/travel" className="text-red-600 hover:text-red-700 inline-flex items-center">
                  Plan Your Trip <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle>Gamification & Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Join our vibrant surfing community with challenges, leaderboards, and social features. Track your 
                  sessions, compete with friends, earn achievements, and share your surf experiences with like-minded 
                  surfers from around the globe.
                </p>
                <Link to="/community" className="text-yellow-600 hover:text-yellow-700 inline-flex items-center">
                  Join Community <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose WaveMentor Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Surfers Choose WaveMentor
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              WaveMentor combines advanced technology with deep surfing expertise to deliver the most comprehensive 
              surf intelligence platform available. Here's what sets us apart from other surf forecasting services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">95% Accuracy Rate</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our AI-powered forecasts achieve industry-leading accuracy through machine learning and local data integration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-Time Updates</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get instant notifications about changing conditions, optimal surf windows, and safety alerts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Safety First</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Advanced safety features including hazard warnings, crowd monitoring, and emergency contact integration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expert Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Benefit from local surf knowledge, professional coaching, and insights from the world's best surfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Interface - AR Zone, AI Instructor, etc. */}
      <section className="py-16">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ocean-dark dark:text-white mb-4">
              Advanced Surf Intelligence Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Experience the future of surfing with our cutting-edge AR vision technology, AI-powered coaching system, 
              machine learning wave predictions, and comprehensive surf analytics. These premium features give you the 
              competitive edge to improve your surfing and make the most of every session.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <Link to="/premium">
                <Button className="bg-ocean hover:bg-ocean-dark">
                  Upgrade to Premium
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline">
                  View Analytics Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <EnhancedSurfInterface />
      </section>

      {/* Monetization Features Showcase */}
      <MonetizationShowcase />

      {/* Enhanced Weather Forecast Search */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Personalized Surf Forecasting
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Get customized surf forecasts for your favorite spots with our advanced weather analysis system. 
              Our platform considers your skill level, preferred wave conditions, and local factors to provide 
              personalized recommendations for the best surf sessions.
            </p>
          </div>
          <SearchableWeatherForecast />
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-16 bg-ocean dark:bg-ocean-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Surfing Experience?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of surfers who have already discovered the power of WaveMentor's surf intelligence platform. 
            Start your journey to better waves, improved skills, and unforgettable surf adventures today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/premium">
              <Button size="lg" className="bg-white text-ocean hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/surf-log">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Track Your Sessions
              </Button>
            </Link>
            <Link to="/mentorship">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Book a Lesson
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
