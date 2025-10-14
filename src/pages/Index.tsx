
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

      {/* SEO Navigation - Crawlable Links for Search Engines */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Explore WaveMentor
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Discover all features and surf spots available on our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Main Features */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Main Features</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-blue-600 hover:underline">Home</a></li>
                <li><a href="/map" className="text-blue-600 hover:underline">Interactive Surf Map</a></li>
                <li><a href="/live-spots" className="text-blue-600 hover:underline">Live Surf Spots & Cams</a></li>
                <li><a href="/surf-blog" className="text-blue-600 hover:underline">Surf Blog & Guides</a></li>
                <li><a href="/search" className="text-blue-600 hover:underline">Search Spots</a></li>
                <li><a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a></li>
              </ul>
            </div>

            {/* Learning & Coaching */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Learning & Coaching</h3>
              <ul className="space-y-2">
                <li><a href="/surf-log" className="text-blue-600 hover:underline">Surf Log & Tracking</a></li>
                <li><a href="/mentorship" className="text-blue-600 hover:underline">Surf Mentorship</a></li>
                <li><a href="/lessons" className="text-blue-600 hover:underline">Surf Lessons</a></li>
                <li><a href="/book-sessions" className="text-blue-600 hover:underline">Book Coaching Sessions</a></li>
                <li><a href="/challenges" className="text-blue-600 hover:underline">Surf Challenges</a></li>
                <li><a href="/analytics" className="text-blue-600 hover:underline">Performance Analytics</a></li>
              </ul>
            </div>

            {/* Community & Discovery */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Community</h3>
              <ul className="space-y-2">
                <li><a href="/community" className="text-blue-600 hover:underline">Surf Community Hub</a></li>
                <li><a href="/discovery" className="text-blue-600 hover:underline">Spot Discovery</a></li>
                <li><a href="/gamification" className="text-blue-600 hover:underline">Leaderboards & Achievements</a></li>
                <li><a href="/marketplace" className="text-blue-600 hover:underline">Marketplace</a></li>
                <li><a href="/travel" className="text-blue-600 hover:underline">Surf Travel Packages</a></li>
              </ul>
            </div>

            {/* Premium & Tools */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Premium & Tools</h3>
              <ul className="space-y-2">
                <li><a href="/premium" className="text-blue-600 hover:underline">Premium Features</a></li>
                <li><a href="/premium-weather" className="text-blue-600 hover:underline">Premium Weather</a></li>
                <li><a href="/notifications" className="text-blue-600 hover:underline">Notifications</a></li>
                <li><a href="/safety" className="text-blue-600 hover:underline">Safety Resources</a></li>
                <li><a href="/privacy-settings" className="text-blue-600 hover:underline">Privacy Settings</a></li>
              </ul>
            </div>
          </div>

          {/* Featured Surf Spots - Crawlable Links */}
          <div className="mt-12">
            <h3 className="font-semibold text-xl mb-6 text-center text-gray-900 dark:text-white">
              Featured Surf Spots Around the World
            </h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <ul className="space-y-2 text-sm">
                  <li><a href="/surf-spots/pipeline-oahu" className="text-blue-600 hover:underline">Pipeline, Oahu</a></li>
                  <li><a href="/surf-spots/jeffreys-bay" className="text-blue-600 hover:underline">Jeffreys Bay, SA</a></li>
                  <li><a href="/surf-spots/uluwatu-bali" className="text-blue-600 hover:underline">Uluwatu, Bali</a></li>
                  <li><a href="/surf-spots/teahupoo-tahiti" className="text-blue-600 hover:underline">Teahupo'o, Tahiti</a></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li><a href="/surf-spots/hossegor-france" className="text-blue-600 hover:underline">Hossegor, France</a></li>
                  <li><a href="/surf-spots/superbank-gold-coast" className="text-blue-600 hover:underline">Superbank, AU</a></li>
                  <li><a href="/surf-spots/mavericks-california" className="text-blue-600 hover:underline">Mavericks, CA</a></li>
                  <li><a href="/surf-spots/cloudbreak-fiji" className="text-blue-600 hover:underline">Cloudbreak, Fiji</a></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li><a href="/surf-spots/puerto-escondido-mexico" className="text-blue-600 hover:underline">Puerto Escondido</a></li>
                  <li><a href="/surf-spots/skeleton-bay-namibia" className="text-blue-600 hover:underline">Skeleton Bay</a></li>
                  <li><a href="/surf-spots/raglan-new-zealand" className="text-blue-600 hover:underline">Raglan, NZ</a></li>
                  <li><a href="/surf-spots/trestles-california" className="text-blue-600 hover:underline">Trestles, CA</a></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li><a href="/surf-spots/mundaka-spain" className="text-blue-600 hover:underline">Mundaka, Spain</a></li>
                  <li><a href="/surf-spots/chicama-peru" className="text-blue-600 hover:underline">Chicama, Peru</a></li>
                  <li><a href="/surf-spots/padang-padang-bali" className="text-blue-600 hover:underline">Padang Padang</a></li>
                  <li><a href="/surf-spots/ericeira-portugal" className="text-blue-600 hover:underline">Ericeira, Portugal</a></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  <li><a href="/surf-spots/bells-beach-australia" className="text-blue-600 hover:underline">Bells Beach, AU</a></li>
                  <li><a href="/surf-spots/malibu-california" className="text-blue-600 hover:underline">Malibu, CA</a></li>
                  <li><a href="/surf-spots/taghazout-morocco" className="text-blue-600 hover:underline">Taghazout, Morocco</a></li>
                  <li><a href="/sitemap.html" className="text-blue-600 hover:underline font-semibold">View All Spots →</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-8 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Privacy Policy</a>
              <a href="/gdpr-compliance" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">GDPR Compliance</a>
              <a href="/sitemap.html" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Full Sitemap</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
