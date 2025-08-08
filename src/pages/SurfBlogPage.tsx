import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, Waves, Search, Filter } from 'lucide-react';
import surfSpotsData from '@/data/surfSpotsBlog.json';
import CanonicalUrl from '@/components/CanonicalUrl';

const SurfBlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const filteredSpots = surfSpotsData.featured_spots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || spot.difficulty === selectedDifficulty;
    const matchesCountry = !selectedCountry || spot.country === selectedCountry;
    
    return matchesSearch && matchesDifficulty && matchesCountry;
  });

  const difficulties = [...new Set(surfSpotsData.featured_spots.map(spot => spot.difficulty))];
  const countries = [...new Set(surfSpotsData.featured_spots.map(spot => spot.country))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'intermediate to advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'advanced to expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'expert': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <>
      <CanonicalUrl />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              World's Best Surf Spots
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
              Discover the most epic waves on the planet. From perfect barrels to massive swells, 
              explore the legendary breaks that define surfing culture.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <Waves className="mr-2 h-5 w-5" />
                10 Epic Spots
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <MapPin className="mr-2 h-5 w-5" />
                Global Coverage
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <Star className="mr-2 h-5 w-5" />
                Expert Reviews
              </Badge>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search spots, locations, or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background"
              >
                <option value="">All Difficulties</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Featured Spots Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Surf Spots</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From the legendary barrels of Pipeline to the perfect points of J-Bay, 
                explore the waves that have shaped surfing history and continue to challenge the world's best.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSpots.map((spot) => (
                <Card key={spot.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-cyan-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={getDifficultyColor(spot.difficulty)}>
                        {spot.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h3 className="text-2xl font-bold text-white mb-1">{spot.name}</h3>
                      <p className="text-white/90 flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {spot.location}
                      </p>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[...Array(Math.floor(spot.rating))].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {spot.rating}/5
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {spot.wave_type}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="mb-4 text-base leading-relaxed">
                      {spot.excerpt}
                    </CardDescription>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Best Season:</span>
                        <span className="font-medium">{spot.best_season}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Break Type:</span>
                        <span className="font-medium">{spot.break_type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Crowd Level:</span>
                        <span className="font-medium flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {spot.crowd_level}
                        </span>
                      </div>
                    </div>

                    <Link to={`/surf-spots/${spot.id}`}>
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Read Full Guide
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSpots.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No surf spots found matching your criteria. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-8">Global Surf Coverage</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10</div>
                <div className="text-muted-foreground">Epic Spots</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">8</div>
                <div className="text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">5</div>
                <div className="text-muted-foreground">Continents</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">∞</div>
                <div className="text-muted-foreground">Epic Sessions</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SurfBlogPage;