import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Waves } from 'lucide-react';

// This component provides SEO-friendly content for search engines
// while actual functionality remains behind the premium gate
const SEOFriendlyMapPage = () => {
  return (
    <div className="bg-gradient-to-br from-ocean/5 to-sand/20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* SEO-optimized header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Globe className="h-10 w-10 text-primary" />
            Interactive Surf Spot Map
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore thousands of surf spots worldwide with detailed forecasts, real-time conditions, 
            and crowd levels. Discover your next perfect wave with our comprehensive surf spot database.
          </p>
        </header>

        {/* Featured surf spots for SEO */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Featured Surf Spots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: "Pipeline", 
                location: "Hawaii, USA", 
                difficulty: "Expert", 
                description: "World-famous barrel wave on Oahu's North Shore"
              },
              { 
                name: "Jeffreys Bay", 
                location: "South Africa", 
                difficulty: "Intermediate", 
                description: "Legendary right-hand point break with perfect waves"
              },
              { 
                name: "Hossegor", 
                location: "France", 
                difficulty: "Advanced", 
                description: "Powerful beach breaks on the French Atlantic coast"
              },
              { 
                name: "Uluwatu", 
                location: "Bali, Indonesia", 
                difficulty: "Advanced", 
                description: "Stunning cliff-top location with consistent waves"
              },
              { 
                name: "Malibu", 
                location: "California, USA", 
                difficulty: "Beginner", 
                description: "Classic longboard waves in iconic Southern California"
              },
              { 
                name: "Gold Coast", 
                location: "Australia", 
                difficulty: "All Levels", 
                description: "World-class breaks along Queensland's famous coastline"
              }
            ].map((spot, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {spot.name}
                  </CardTitle>
                  <CardDescription>{spot.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{spot.description}</p>
                  <Badge variant="secondary">{spot.difficulty}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Map features for SEO */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Map Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-primary" />
                  Real-Time Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get live wave heights, wind speeds, and weather conditions for thousands of surf spots 
                  around the world. Updated every hour for the most accurate forecasting.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Filtering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Filter spots by difficulty level, wave type, break direction, and local conditions. 
                  Find the perfect wave for your skill level and preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Crowd Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Avoid crowded breaks with our real-time crowd reporting system. 
                  Find hidden gems and less crowded alternatives to popular spots.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Local Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access insider knowledge from local surfers including best conditions, 
                  hazards to avoid, and optimal tide times for each location.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA section */}
        <section className="text-center bg-card p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Access the Full Interactive Map</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Unlock the complete surf spot database with real-time conditions, detailed forecasts, 
            and exclusive features designed for serious surfers.
          </p>
          <Button size="lg" className="mr-4">
            Start Premium Trial
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </section>
      </div>
    </div>
  );
};

export default SEOFriendlyMapPage;