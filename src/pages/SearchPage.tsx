import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Waves } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Featured surf spots data for SEO
  const featuredSpots = [
    { name: "Pipeline", location: "Hawaii, USA", difficulty: "Expert" },
    { name: "Jeffreys Bay", location: "South Africa", difficulty: "Intermediate" },
    { name: "Hossegor", location: "France", difficulty: "Advanced" },
    { name: "Uluwatu", location: "Bali, Indonesia", difficulty: "Advanced" },
    { name: "Malibu", location: "California, USA", difficulty: "Beginner" },
    { name: "Gold Coast", location: "Australia", difficulty: "All Levels" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* SEO-optimized Header */}
          <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Search Surf Spots - Find Perfect Waves
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover world-class surf spots by location, wave type, and conditions. Find the perfect waves for your next surf session.
            </p>
          </header>

          {/* Search Form */}
          <Card className="bg-card/95 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search for Surf Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <Input
                  name="search"
                  placeholder="Enter location, spot name, or wave type..."
                  defaultValue={query}
                  className="flex-1"
                />
                <Button type="submit" className="px-6">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search Results or Featured Spots */}
          {query ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Surf Spots Related to "{query}"
              </h2>
              
              {/* Show filtered featured spots based on query */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredSpots
                  .filter(spot => 
                    spot.name.toLowerCase().includes(query.toLowerCase()) ||
                    spot.location.toLowerCase().includes(query.toLowerCase()) ||
                    spot.difficulty.toLowerCase().includes(query.toLowerCase())
                  )
                  .map((spot, index) => (
                    <Card key={index} className="bg-card/95 backdrop-blur border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {spot.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{spot.location}</p>
                        <p className="text-sm font-medium">Difficulty: {spot.difficulty}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              
              {featuredSpots.filter(spot => 
                spot.name.toLowerCase().includes(query.toLowerCase()) ||
                spot.location.toLowerCase().includes(query.toLowerCase()) ||
                spot.difficulty.toLowerCase().includes(query.toLowerCase())
              ).length === 0 && (
                <Card className="bg-card/95 backdrop-blur border-border/50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Waves className="h-12 w-12 text-primary mx-auto" />
                      <p className="text-muted-foreground">
                        No spots found for "{query}". Try searching for locations like Hawaii, California, Australia, or difficulty levels like Beginner, Intermediate, Expert.
                      </p>
                      <Button onClick={() => navigate('/map')} className="mt-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        Explore All Surf Spots
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured Surf Spots Section for SEO */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Featured Surf Spots</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredSpots.map((spot, index) => (
                    <Card key={index} className="bg-card/95 backdrop-blur border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {spot.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{spot.location}</p>
                        <p className="text-sm font-medium">Difficulty: {spot.difficulty}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Search Categories */}
              <section className="grid md:grid-cols-2 gap-6">
                <Card className="bg-card/95 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Explore by Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Discover surf spots around the world with our interactive map feature.
                    </p>
                    <Button onClick={() => navigate('/map')} variant="outline" className="w-full">
                      View Interactive Map
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/95 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Waves className="h-5 w-5 text-primary" />
                      Live Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Check real-time surf conditions and live camera feeds from spots worldwide.
                    </p>
                    <Button onClick={() => navigate('/live-spots')} variant="outline" className="w-full">
                      View Live Spots
                    </Button>
                  </CardContent>
                </Card>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;