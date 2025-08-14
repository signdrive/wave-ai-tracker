import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, Users, Waves, Search, Filter, Globe, TrendingUp, Leaf, Eye } from 'lucide-react';
import surfSpotsData from '@/data/surfSpotsBlog.json';
import expandedSpotsData from '@/data/expandedSurfSpotsBlog.json';
import CanonicalUrl from '@/components/CanonicalUrl';
import InteractiveSurfMap from '@/components/InteractiveSurfMap';
import SurfSpotComparison from '@/components/SurfSpotComparison';
import CommunityVoices from '@/components/CommunityVoices';

const ExpandedSurfBlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<string>('');

  // Combine original and new spots
  const allSpots = [...surfSpotsData.featured_spots, ...expandedSpotsData.new_surf_spots];

  const filteredSpots = allSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || spot.difficulty === selectedDifficulty;
    const matchesCountry = !selectedCountry || spot.country === selectedCountry;
    
    return matchesSearch && matchesDifficulty && matchesCountry;
  });

  const difficulties = [...new Set(allSpots.map(spot => spot.difficulty))];
  const countries = [...new Set(allSpots.map(spot => spot.country))];

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

  // Prepare data for interactive components
  const mapSpots = expandedSpotsData.new_surf_spots.map(spot => ({
    id: spot.id,
    name: spot.name,
    coordinates: spot.coordinates as [number, number],
    best_season: spot.best_season,
    optimal_swell: spot.optimal_swell,
    difficulty: spot.difficulty,
    wave_type: spot.wave_type,
    climate_outlook: spot.climate_outlook
  }));

  const comparisonSpots = allSpots.map(spot => ({
    id: spot.id,
    name: spot.name,
    location: spot.location,
    difficulty: spot.difficulty,
    wave_type: spot.wave_type,
    best_season: spot.best_season,
    crowd_level: spot.crowd_level,
    break_type: spot.break_type,
    rating: spot.rating,
    comparative_analysis: (spot as any).comparative_analysis || "Detailed comparison available in full guide."
  }));

  return (
    <>
      <CanonicalUrl />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ultimate Surf Spots Guide
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
              Discover 20 epic waves across the globe. From legendary classics to hidden gems, 
              explore comprehensive guides with climate data, community voices, and expert comparisons.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <Waves className="mr-2 h-5 w-5" />
                20 Epic Spots
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <Globe className="mr-2 h-5 w-5" />
                Climate Analysis
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <Users className="mr-2 h-5 w-5" />
                Community Insights
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <TrendingUp className="mr-2 h-5 w-5" />
                Wave Comparison
              </Badge>
            </div>
          </div>
        </section>

        {/* Interactive Tabs Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="spots" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="spots" className="flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  All Spots
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Interactive Map
                </TabsTrigger>
                <TabsTrigger value="compare" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Compare Waves
                </TabsTrigger>
                <TabsTrigger value="community" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Community
                </TabsTrigger>
              </TabsList>

              <TabsContent value="spots" className="space-y-8">
                {/* Search and Filter Section */}
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border rounded-lg p-6">
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

                {/* Featured New Spots Section */}
                <div className="space-y-6">
                  <div className="text-center">
                    <Badge className="mb-4 px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-blue-600 text-white">
                      <Leaf className="mr-2 h-4 w-4" />
                      New Climate-Focused Guides
                    </Badge>
                    <h2 className="text-4xl font-bold mb-4">Latest Surf Spot Features</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                      Explore our newest additions featuring climate impact analysis, emerging spots, 
                      and diverse community perspectives from around the globe.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {expandedSpotsData.new_surf_spots.slice(0, 6).map((spot) => (
                      <Card key={spot.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-cyan-600 overflow-hidden">
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                          <div className="absolute top-4 left-4 z-10">
                            <Badge className="bg-green-600 text-white">NEW</Badge>
                          </div>
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
                              Read Climate Guide
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Classic Spots Section */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Classic Legendary Breaks</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                      The iconic waves that built surfing's foundation and continue to inspire generations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {surfSpotsData.featured_spots.slice(0, 9).map((spot) => (
                      <Card key={spot.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-600 overflow-hidden">
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                          <div className="absolute top-4 left-4 z-10">
                            <Badge className="bg-purple-600 text-white">CLASSIC</Badge>
                          </div>
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
                </div>

                {filteredSpots.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xl text-muted-foreground">
                      No surf spots found matching your criteria. Try adjusting your filters.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="map" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4">Interactive Wave Map</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Explore our newest surf spots with climate data and swell analysis. 
                    Click markers to see detailed environmental impact and conservation efforts.
                  </p>
                </div>
                <InteractiveSurfMap 
                  spots={mapSpots}
                  selectedSpot={selectedSpot}
                  onSpotSelect={setSelectedSpot}
                />
              </TabsContent>

              <TabsContent value="compare" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4">Wave Comparison Tool</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Compare conditions, difficulty, and characteristics between any two surf spots 
                    to plan your next adventure or understand wave differences.
                  </p>
                </div>
                <SurfSpotComparison spots={comparisonSpots} />
              </TabsContent>

              <TabsContent value="community" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4">Community Voices</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Hear from female surfers, board shapers, and environmental activists 
                    who share their unique perspectives on these world-class waves.
                  </p>
                </div>
                
                <div className="grid gap-8">
                  {expandedSpotsData.new_surf_spots.slice(0, 3).map((spot) => (
                    <CommunityVoices 
                      key={spot.id}
                      voices={spot.community_voices as any}
                      spotName={spot.name}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-8">Enhanced Global Coverage</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">20</div>
                <div className="text-muted-foreground">Epic Spots</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">15</div>
                <div className="text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">6</div>
                <div className="text-muted-foreground">Continents</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">30+</div>
                <div className="text-muted-foreground">Expert Voices</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ExpandedSurfBlogPage;